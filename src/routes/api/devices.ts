import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import crypto from "crypto";
import { dbService, type DeviceDoc } from "@/server/db";
import { getAuthUser } from "@/server/auth";

const bodySchema = z.object({ name: z.string().trim().min(1).max(60) });

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function generateDeviceId(): string {
  const hex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `AIR-${hex}`;
}

function generateApiKey(): string {
  const secret = crypto.randomBytes(16).toString("hex");
  return `ask_live_${secret}`;
}

export const Route = createFileRoute("/api/devices")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getAuthUser(request);
        if (!auth) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const devices = await dbService.getDevices(auth.userId);
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

        return Response.json(formatted);
      },

      POST: async ({ request }) => {
        const auth = await getAuthUser(request);
        if (!auth) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid room name" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const deviceId = generateDeviceId();
        const apiKey = generateApiKey();
        const apiKeyHash = hashKey(apiKey);
        const now = new Date();

        const newDevice: DeviceDoc = {
          deviceId,
          name: parsed.name,
          userId: auth.userId,
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
          userId: auth.userId,
          level: "info",
          message: `Device ${deviceId} registered for room "${parsed.name}"`,
        });

        return Response.json({
          id: deviceId,
          name: parsed.name,
          apiKey, // Returned only once at registration
          online: false,
          status: "never_connected",
          createdAt: now.toISOString(),
        });
      },
    },
  },
});
