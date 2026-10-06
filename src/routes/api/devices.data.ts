import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import crypto from "crypto";
import { dbService, type SensorReadingDoc } from "@/server/db";
import { deviceEvents } from "@/server/events";
import { processReadingForAlerts } from "@/server/alerts";

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

export async function handleDeviceData({ request }: { request: Request }) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Support credentials via headers if omitted in body
  const headerDeviceId = request.headers.get("x-device-id");
  const headerApiKey = request.headers.get("x-api-key");
  if (headerDeviceId && !body["deviceId"]) body["deviceId"] = headerDeviceId;
  if (headerApiKey && !body["apiKey"]) body["apiKey"] = headerApiKey;

  const parseResult = payloadSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const data = parseResult.data;
  const device = await dbService.getDeviceById(data.deviceId);

  if (!device) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Device not found or unregistered" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Verify API key hash
  const providedHash = hashKey(data.apiKey);
  if (device.apiKeyHash !== providedHash) {
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid device API key" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
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

  // 1. Save reading to database
  await dbService.saveReading(reading);

  // 2. Update device heartbeat & online status
  await dbService.updateDeviceHeartbeat(data.deviceId, serverTime);

  // 3. Emit real-time event for connected WebSockets / SSE streams
  deviceEvents.emit(`reading:${data.deviceId}`, reading);
  deviceEvents.emit("reading:any", reading);

  // 4. Trigger alert engine if threshold exceeded
  processReadingForAlerts(reading).catch((e) =>
    console.warn("[AlertEngine] Alert processing error:", e.message),
  );

  return Response.json({
    success: true,
    deviceId: data.deviceId,
    receivedAt: serverTime.toISOString(),
    status,
    buzzerActive,
  });
}

export const Route = createFileRoute("/api/devices/data")({
  server: {
    handlers: {
      POST: handleDeviceData,
    },
  },
});
