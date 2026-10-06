import { createFileRoute } from "@tanstack/react-router";
import { dbService } from "@/server/db";

export const Route = createFileRoute("/api/device/latest")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const deviceId = url.searchParams.get("deviceId");

        if (!deviceId) {
          return new Response(JSON.stringify({ error: "Missing deviceId query parameter" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const device = await dbService.getDeviceById(deviceId);
        const reading = await dbService.getLatestReading(deviceId);

        const now = Date.now();
        const isOnline = Boolean(
          device?.lastSeen && now - new Date(device.lastSeen).getTime() < 120_000,
        );

        if (!reading) {
          // Explicit null when no real hardware readings have arrived yet
          return Response.json(null);
        }

        // Return real stored reading with device metadata
        return Response.json({
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
    },
  },
});
