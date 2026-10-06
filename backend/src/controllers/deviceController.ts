import type { Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbService } from "../services/dbService.js";
import { deviceEvents } from "../services/eventService.js";
import { processReadingForAlerts } from "../services/alertService.js";
import type { DeviceDoc, SensorReadingDoc } from "../models/types.js";

const payloadSchema = z.object({
  deviceId: z.string().trim().min(3).max(64),
  apiKey: z.string().trim().min(6).max(128),
  temperature: z.number().finite().min(-40).max(85),
  humidity: z.number().finite().min(0).max(100),
  mq135: z.number().finite().min(0).max(10000),
  timestamp: z.string().optional(),
});

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function classify(mq135: number): "good" | "moderate" | "poor" {
  if (mq135 < 400) return "good";
  if (mq135 < 700) return "moderate";
  return "poor";
}

export const deviceController = {
  // GET /api/devices
  async getDevices(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const devices = await dbService.getDevices(req.userId);
    const now = Date.now();

    const formatted = devices.map((d) => {
      const isOnline = Boolean(d.lastSeen && now - new Date(d.lastSeen).getTime() < 120_000);
      return {
        id: d.deviceId,
        name: d.name,
        online: isOnline,
        status: d.lastSeen ? (isOnline ? "online" : "offline") : "never_connected",
        lastSeen: d.lastSeen ? new Date(d.lastSeen).toISOString() : null,
        createdAt: new Date(d.createdAt).toISOString(),
      };
    });

    res.json(formatted);
  },

  // POST /api/devices
  async createDevice(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "Invalid room name" });
      return;
    }

    const deviceId = `AIR-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const apiKey = `ask_live_${crypto.randomBytes(16).toString("hex")}`;
    const apiKeyHash = hashKey(apiKey);
    const now = new Date();

    const newDevice: DeviceDoc = {
      deviceId,
      name: name.trim(),
      userId: req.userId,
      apiKeyHash,
      apiKeyPrefix: apiKey.slice(0, 16) + "...",
      status: "never_connected",
      lastSeen: null,
      createdAt: now,
      updatedAt: now,
    };

    await dbService.createDevice(newDevice);

    await dbService.logSystem({
      event: "DEVICE_REGISTERED",
      deviceId,
      userId: req.userId,
      level: "info",
      message: `Device ${deviceId} registered for room "${name}"`,
    });

    res.json({
      id: deviceId,
      name: newDevice.name,
      apiKey,
      online: false,
      status: "never_connected",
      createdAt: now.toISOString(),
    });
  },

  // PATCH /api/devices/:id
  async updateDevice(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const deviceId = req.params["id"];
    const { name } = req.body;
    if (name && (typeof name !== "string" || name.trim().length === 0)) {
      res.status(400).json({ error: "Invalid name" });
      return;
    }

    const updated = await dbService.updateDevice(deviceId!, req.userId, {
      ...(name && { name: name.trim() }),
    });

    if (!updated) {
      res.status(404).json({ error: "Device not found or unauthorized" });
      return;
    }

    res.json({ success: true, deviceId, name });
  },

  // DELETE /api/devices/:id
  async deleteDevice(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const deviceId = req.params["id"];
    const deleted = await dbService.deleteDevice(deviceId!, req.userId);

    if (!deleted) {
      res.status(404).json({ error: "Device not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Device deleted successfully" });
  },

  // POST /api/devices/data & POST /api/device/data (ESP32 Sensor Telemetry Ingestion)
  async ingestData(req: any, res: Response) {
    const body = req.body || {};

    const headerDeviceId = req.headers["x-device-id"];
    const headerApiKey = req.headers["x-api-key"];
    if (headerDeviceId && !body.deviceId) body.deviceId = headerDeviceId;
    if (headerApiKey && !body.apiKey) body.apiKey = headerApiKey;

    const parseResult = payloadSchema.safeParse(body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const data = parseResult.data;
    const device = await dbService.getDeviceById(data.deviceId);

    if (!device) {
      res.status(401).json({ error: "Unauthorized: Device not found or unregistered" });
      return;
    }

    const providedHash = hashKey(data.apiKey);
    if (device.apiKeyHash !== providedHash) {
      res.status(401).json({ error: "Unauthorized: Invalid device API key" });
      return;
    }

    const serverTime = new Date();
    const status = classify(data.mq135);
    const buzzerActive = status === "poor";

    const reading: SensorReadingDoc = {
      deviceId: data.deviceId,
      userId: device.userId,
      roomName: device.name,
      mq135: Math.round(data.mq135),
      temperature: Math.round(data.temperature * 10) / 10,
      humidity: Math.round(data.humidity),
      status,
      buzzerActive,
      timestamp: serverTime,
    };

    await dbService.saveReading(reading);
    await dbService.updateDeviceHeartbeat(data.deviceId, serverTime);

    deviceEvents.emit(`reading:${data.deviceId}`, reading);
    deviceEvents.emit("reading:any", reading);

    processReadingForAlerts(reading).catch((e) =>
      console.warn("[AlertEngine] Alert processing error:", e.message),
    );

    res.json({
      success: true,
      deviceId: data.deviceId,
      receivedAt: serverTime.toISOString(),
      status,
      buzzerActive,
    });
  },

  // GET /api/device/latest?deviceId=...
  async getLatest(req: any, res: Response) {
    const deviceId = (req.query["deviceId"] as string) || "";
    if (!deviceId) {
      res.status(400).json({ error: "Missing deviceId query parameter" });
      return;
    }

    const device = await dbService.getDeviceById(deviceId);
    const reading = await dbService.getLatestReading(deviceId);

    const now = Date.now();
    const isOnline = Boolean(
      device?.lastSeen && now - new Date(device.lastSeen).getTime() < 120_000,
    );

    if (!reading) {
      res.json(null);
      return;
    }

    res.json({
      deviceId: reading.deviceId,
      status: reading.status,
      mq135: reading.mq135,
      temperature: reading.temperature,
      humidity: reading.humidity,
      timestamp: new Date(reading.timestamp).toISOString(),
      buzzerActive: reading.buzzerActive,
      lastPoorAt: null,
      online: isOnline,
    });
  },

  // GET /api/device/history?deviceId=...&range=24h
  async getHistory(req: any, res: Response) {
    const deviceId = (req.query["deviceId"] as string) || "";
    const range = (req.query["range"] as string) || "24h";

    if (!deviceId) {
      res.status(400).json({ error: "Missing deviceId query parameter" });
      return;
    }

    const rangeMs =
      range === "30d"
        ? 30 * 24 * 3600 * 1000
        : range === "7d"
          ? 7 * 24 * 3600 * 1000
          : 24 * 3600 * 1000;

    const since = new Date(Date.now() - rangeMs);
    const readings = await dbService.getHistory(deviceId, since);

    const history = readings.map((r) => ({
      t: new Date(r.timestamp).toISOString(),
      mq135: r.mq135,
      temperature: r.temperature,
      humidity: r.humidity,
      status: r.status,
    }));

    res.json(history);
  },

  // GET /api/device/:id/stream (Server-Sent Events)
  async streamDevice(req: any, res: Response) {
    const deviceId = req.params["id"];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    let closed = false;

    const onReading = (r: SensorReadingDoc) => {
      if (closed) return;
      res.write(`event: reading\ndata: ${JSON.stringify({
        deviceId: r.deviceId,
        status: r.status,
        mq135: r.mq135,
        temperature: r.temperature,
        humidity: r.humidity,
        timestamp: new Date(r.timestamp).toISOString(),
        buzzerActive: r.buzzerActive,
        online: true,
      })}\n\n`);
    };

    deviceEvents.on(`reading:${deviceId}`, onReading);

    // Initial latest reading
    try {
      const latest = await dbService.getLatestReading(deviceId);
      if (latest && !closed) onReading(latest);
    } catch (e) {
      // ignore
    }

    // Keepalive ping
    const keepalive = setInterval(() => {
      if (closed) return;
      res.write(`: keepalive\n\n`);
    }, 15000);

    req.on("close", () => {
      closed = true;
      clearInterval(keepalive);
      deviceEvents.off(`reading:${deviceId}`, onReading);
    });
  },
};
