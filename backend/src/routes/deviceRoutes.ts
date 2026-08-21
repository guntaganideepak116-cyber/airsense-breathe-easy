import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { DeviceModel } from "../models/Device.js";
import { ReadingModel } from "../models/Reading.js";
import { UserModel, defaultMemoryUser } from "../models/User.js";
import { classifyAirQuality, AirStatus } from "../services/classifier.js";
import { sseManager } from "../services/sse.js";
import { dispatchAlert, AlertType } from "../services/alertDispatcher.js";

export const router = Router();

// In-Memory Fallback Store when MongoDB is disconnected/unreachable
interface MemoryDevice {
  id: string;
  name: string;
  apiKey: string;
  online: boolean;
  lastSeen?: Date;
}

interface MemoryReading {
  deviceId: string;
  mq135: number;
  temperature: number;
  humidity: number;
  status: AirStatus;
  buzzerActive: boolean;
  lastPoorAt?: Date | null;
  rssi?: number;
  uptimeSec?: number;
  firmware?: string;
  timestamp: Date;
}

const memoryDevices: MemoryDevice[] = [
  { id: "dev-4b", name: "Classroom 4B", apiKey: "ask_classroom_4b_key", online: true, lastSeen: new Date() },
  { id: "dev-deepak", name: "Deepak's Room", apiKey: "ask_deepak_room_key", online: true, lastSeen: new Date() },
  { id: "dev-hostel", name: "Hostel Common Room", apiKey: "ask_hostel_hall_key", online: false },
];

const memoryReadings: MemoryReading[] = [];

// Track previous device status to trigger state change alerts (AIR_POOR, AIR_RECOVERED, DEVICE_ONLINE)
const deviceLastStatusMap = new Map<string, AirStatus>();

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

async function getUserAlertProfile(userId?: string) {
  if (isDbConnected()) {
    let user = await UserModel.findOne(userId ? { userId } : {});
    if (!user) {
      user = await UserModel.create({
        userId: userId || "default_user",
        phoneNumber: process.env.DEFAULT_PHONE_NUMBER || "9876543210",
        whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER || "919876543210",
        email: process.env.DEFAULT_EMAIL || "alert@example.com",
        alertChannels: { sms: true, whatsapp: true, email: true },
      });
    }
    return {
      phoneNumber: user.phoneNumber,
      whatsappNumber: user.whatsappNumber,
      email: user.email,
      alertChannels: user.alertChannels,
    };
  }

  return {
    phoneNumber: defaultMemoryUser.phoneNumber,
    whatsappNumber: defaultMemoryUser.whatsappNumber,
    email: defaultMemoryUser.email,
    alertChannels: defaultMemoryUser.alertChannels,
  };
}

const telemetrySchema = z.object({
  mq135: z.number(),
  temperature: z.number(),
  humidity: z.number(),
  deviceId: z.string().optional(),
  rssi: z.number().optional(),
  uptimeSec: z.number().optional(),
  firmware: z.string().optional(),
});

const deviceCreateSchema = z.object({
  name: z.string().trim().min(1).max(60),
});

const alertPreferencesSchema = z.object({
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  email: z.string().optional(),
  alertChannels: z
    .object({
      sms: z.boolean().optional(),
      whatsapp: z.boolean().optional(),
      email: z.boolean().optional(),
    })
    .optional(),
});

function generateKey(prefix = "ask", bytes = 16) {
  const raw = Array.from({ length: bytes }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");
  return `${prefix}_${raw}`;
}

async function processTelemetryAndAlerts(
  devId: string,
  deviceName: string,
  data: { mq135: number; temperature: number; humidity: number },
  currentStatus: AirStatus,
  wasOnline: boolean
) {
  const previousStatus = deviceLastStatusMap.get(devId);
  deviceLastStatusMap.set(devId, currentStatus);

  let alertType: AlertType | null = null;

  if (!wasOnline) {
    alertType = "DEVICE_ONLINE";
  } else if (previousStatus && previousStatus !== "poor" && currentStatus === "poor") {
    alertType = "AIR_POOR";
  } else if (previousStatus === "poor" && (currentStatus === "good" || currentStatus === "moderate")) {
    alertType = "AIR_RECOVERED";
  }

  if (alertType) {
    const userProfile = await getUserAlertProfile();
    void dispatchAlert(userProfile, alertType, {
      roomName: deviceName,
      deviceId: devId,
      mq135: data.mq135,
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: new Date(),
    });
  }
}

/**
 * Common Telemetry Processing Logic
 */
async function handleTelemetryIngestion(req: Request, res: Response): Promise<void> {
  const apiKey = (req.headers["x-api-key"] as string) || (req.body?.apiKey as string) || (req.query?.apiKey as string);

  try {
    const data = telemetrySchema.parse(req.body);
    const status = classifyAirQuality(data.mq135);
    const buzzerActive = status === "poor";

    let devId = data.deviceId || "dev-4b";
    let devName = "Classroom 4B";
    let wasOnline = true;

    if (isDbConnected()) {
      let device = await DeviceModel.findOne({ apiKey });
      if (!device) device = await DeviceModel.findOne({ id: devId });
      if (device) {
        devId = device.id;
        devName = device.name;
        wasOnline = device.online;
      }

      const lastPoor = status === "poor"
        ? new Date()
        : (await ReadingModel.findOne({ deviceId: devId, status: "poor" }).sort({ timestamp: -1 }))?.timestamp || null;

      const reading = await ReadingModel.create({
        deviceId: devId,
        mq135: data.mq135,
        temperature: data.temperature,
        humidity: data.humidity,
        status,
        buzzerActive,
        lastPoorAt: lastPoor,
        rssi: data.rssi,
        uptimeSec: data.uptimeSec,
        firmware: data.firmware,
        timestamp: new Date(),
      });

      if (device) {
        device.online = true;
        device.lastSeen = new Date();
        await device.save();
      }

      await processTelemetryAndAlerts(devId, devName, data, status, wasOnline);

      const readingPayload = {
        deviceId: devId,
        status: reading.status,
        mq135: reading.mq135,
        temperature: reading.temperature,
        humidity: reading.humidity,
        timestamp: reading.timestamp.toISOString(),
        buzzerActive: reading.buzzerActive,
        lastPoorAt: reading.lastPoorAt ? reading.lastPoorAt.toISOString() : null,
        rssi: reading.rssi,
        uptimeSec: reading.uptimeSec,
        firmware: reading.firmware,
      };

      sseManager.broadcastReading(devId, readingPayload);
      res.status(201).json({ success: true, reading: readingPayload });
      return;
    }

    // In-memory fallback
    const memDevice = memoryDevices.find((d) => d.apiKey === apiKey || d.id === devId) || memoryDevices[0]!;
    wasOnline = memDevice.online;
    memDevice.online = true;
    memDevice.lastSeen = new Date();
    devName = memDevice.name;

    const memReading: MemoryReading = {
      deviceId: memDevice.id,
      mq135: data.mq135,
      temperature: data.temperature,
      humidity: data.humidity,
      status,
      buzzerActive,
      lastPoorAt: status === "poor" ? new Date() : null,
      rssi: data.rssi,
      uptimeSec: data.uptimeSec,
      firmware: data.firmware,
      timestamp: new Date(),
    };

    memoryReadings.push(memReading);

    await processTelemetryAndAlerts(memDevice.id, devName, data, status, wasOnline);

    const payload = {
      ...memReading,
      timestamp: memReading.timestamp.toISOString(),
      lastPoorAt: memReading.lastPoorAt ? memReading.lastPoorAt.toISOString() : null,
    };

    sseManager.broadcastReading(memDevice.id, payload);
    res.status(201).json({ success: true, reading: payload });
  } catch (err) {
    res.status(400).json({ error: "Invalid telemetry payload", details: err });
  }
}

/**
 * 1. Telemetry Ingestion Endpoints (supports both /telemetry and /device/data)
 */
router.post("/telemetry", handleTelemetryIngestion);
router.post("/device/data", handleTelemetryIngestion);

/**
 * 2. User Alert Preferences Endpoints
 */
router.get("/user/alert-preferences", async (_req: Request, res: Response): Promise<void> => {
  const profile = await getUserAlertProfile();
  res.json(profile);
});

router.patch("/user/alert-preferences", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = alertPreferencesSchema.parse(req.body);

    if (isDbConnected()) {
      let user = await UserModel.findOne();
      if (!user) {
        user = new UserModel({ userId: "default_user" });
      }
      if (data.phoneNumber !== undefined) user.phoneNumber = data.phoneNumber;
      if (data.whatsappNumber !== undefined) user.whatsappNumber = data.whatsappNumber;
      if (data.email !== undefined) user.email = data.email;
      if (data.alertChannels) {
        user.alertChannels = {
          ...user.alertChannels,
          ...data.alertChannels,
        };
      }
      await user.save();
      res.json({
        phoneNumber: user.phoneNumber,
        whatsappNumber: user.whatsappNumber,
        email: user.email,
        alertChannels: user.alertChannels,
      });
      return;
    }

    // Fallback memory store update
    if (data.phoneNumber !== undefined) defaultMemoryUser.phoneNumber = data.phoneNumber;
    if (data.whatsappNumber !== undefined) defaultMemoryUser.whatsappNumber = data.whatsappNumber;
    if (data.email !== undefined) defaultMemoryUser.email = data.email;
    if (data.alertChannels) {
      defaultMemoryUser.alertChannels = {
        ...defaultMemoryUser.alertChannels,
        ...data.alertChannels,
      };
    }

    res.json({
      phoneNumber: defaultMemoryUser.phoneNumber,
      whatsappNumber: defaultMemoryUser.whatsappNumber,
      email: defaultMemoryUser.email,
      alertChannels: defaultMemoryUser.alertChannels,
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid alert preferences payload", details: err });
  }
});

/**
 * 3. GET /api/devices — List all devices
 */
router.get("/devices", async (_req: Request, res: Response): Promise<void> => {
  if (isDbConnected()) {
    let devices = await DeviceModel.find().sort({ createdAt: 1 });
    if (devices.length === 0) {
      devices = await DeviceModel.insertMany(memoryDevices);
    }
    res.json(
      devices.map((d) => ({
        id: d.id,
        name: d.name,
        online: d.online,
        lastSeen: d.lastSeen ? d.lastSeen.toISOString() : undefined,
      }))
    );
    return;
  }

  res.json(
    memoryDevices.map((d) => ({
      id: d.id,
      name: d.name,
      online: d.online,
      lastSeen: d.lastSeen ? d.lastSeen.toISOString() : undefined,
    }))
  );
});

/**
 * 4. POST /api/devices — Create new device
 */
router.post("/devices", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = deviceCreateSchema.parse(req.body);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 18) || "room";
    const id = `dev-${slug}-${Math.floor(Math.random() * 1000)}`;
    const apiKey = generateKey("ask", 16);

    if (isDbConnected()) {
      const device = await DeviceModel.create({ id, name, apiKey, online: false });
      res.status(201).json({ id: device.id, name: device.name, apiKey, online: false, createdAt: device.createdAt.toISOString() });
      return;
    }

    const newDev: MemoryDevice = { id, name, apiKey, online: false };
    memoryDevices.push(newDev);
    res.status(201).json({ id, name, apiKey, online: false, createdAt: new Date().toISOString() });
  } catch (err) {
    res.status(400).json({ error: "Invalid room name", details: err });
  }
});

/**
 * 5. PATCH /api/devices/:id — Rename device
 */
router.patch("/devices/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  if (isDbConnected()) {
    const device = await DeviceModel.findOneAndUpdate({ id }, { name: name.trim() }, { new: true });
    if (!device) {
      res.status(404).json({ error: "Device not found" });
      return;
    }
    res.json({ id: device.id, name: device.name, online: device.online });
    return;
  }

  const mem = memoryDevices.find((d) => d.id === id);
  if (!mem) {
    res.status(404).json({ error: "Device not found" });
    return;
  }
  mem.name = name.trim();
  res.json({ id: mem.id, name: mem.name, online: mem.online });
});

/**
 * 6. DELETE /api/devices/:id — Delete device
 */
router.delete("/devices/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isDbConnected()) {
    await DeviceModel.deleteOne({ id });
    await ReadingModel.deleteMany({ deviceId: id });
  } else {
    const idx = memoryDevices.findIndex((d) => d.id === id);
    if (idx >= 0) memoryDevices.splice(idx, 1);
  }

  res.json({ success: true });
});

/**
 * 7. GET /api/device/latest — Latest reading
 */
router.get("/device/latest", async (req: Request, res: Response): Promise<void> => {
  const deviceId = (req.query.deviceId as string) || "dev-4b";

  if (isDbConnected()) {
    const reading = await ReadingModel.findOne({ deviceId }).sort({ timestamp: -1 });
    if (reading) {
      res.json({
        deviceId: reading.deviceId,
        status: reading.status,
        mq135: reading.mq135,
        temperature: reading.temperature,
        humidity: reading.humidity,
        timestamp: reading.timestamp.toISOString(),
        buzzerActive: reading.buzzerActive,
        lastPoorAt: reading.lastPoorAt ? reading.lastPoorAt.toISOString() : null,
        rssi: reading.rssi,
        uptimeSec: reading.uptimeSec,
        firmware: reading.firmware,
      });
      return;
    }
  }

  const memReadings = memoryReadings.filter((r) => r.deviceId === deviceId);
  const latestMem = memReadings[memReadings.length - 1];

  const now = new Date();
  const mq135 = latestMem ? latestMem.mq135 : 320;
  const status = classifyAirQuality(mq135);

  res.json({
    deviceId,
    status,
    mq135,
    temperature: latestMem ? latestMem.temperature : 28.5,
    humidity: latestMem ? latestMem.humidity : 48,
    timestamp: latestMem ? latestMem.timestamp.toISOString() : now.toISOString(),
    buzzerActive: status === "poor",
    lastPoorAt: null,
    rssi: -58,
    uptimeSec: 86400,
    firmware: "1.4.2",
  });
});

/**
 * 8. GET /api/device/history — Range points
 */
router.get("/device/history", async (req: Request, res: Response): Promise<void> => {
  const deviceId = (req.query.deviceId as string) || "dev-4b";
  const range = (req.query.range as string) || "24h";

  const hoursMap: Record<string, number> = { "24h": 24, "7d": 168, "30d": 720 };
  const hours = hoursMap[range] || 24;
  const since = new Date(Date.now() - hours * 3600_000);

  if (isDbConnected()) {
    const readings = await ReadingModel.find({ deviceId, timestamp: { $gte: since } }).sort({ timestamp: 1 });
    if (readings.length > 0) {
      res.json(
        readings.map((r) => ({
          t: r.timestamp.toISOString(),
          mq135: r.mq135,
          temperature: r.temperature,
          humidity: r.humidity,
          status: r.status,
        }))
      );
      return;
    }
  }

  const pointsCount = range === "24h" ? 48 : range === "7d" ? 84 : 90;
  const stepMs = (hours * 3600_000) / pointsCount;
  const now = Date.now();

  const points = Array.from({ length: pointsCount }, (_, i) => {
    const t = new Date(now - (pointsCount - 1 - i) * stepMs);
    const mq135 = 280 + Math.floor(Math.sin(i / 4) * 160 + (i % 3) * 20);
    return {
      t: t.toISOString(),
      mq135,
      temperature: Math.round((27 + (i % 5) * 0.8) * 10) / 10,
      humidity: Math.round(40 + (i % 7) * 2),
      status: classifyAirQuality(mq135),
    };
  });

  res.json(points);
});

/**
 * 9. GET /api/device/:id/stream — SSE Stream
 */
router.get("/device/:id/stream", (req: Request, res: Response) => {
  const deviceId = req.params.id;
  const clientId = sseManager.addClient(deviceId, res);

  req.on("close", () => {
    sseManager.removeClient(deviceId, clientId);
  });
});
