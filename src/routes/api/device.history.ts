import { createFileRoute } from "@tanstack/react-router";
import { dbService } from "@/server/db";

export const Route = createFileRoute("/api/device/history")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const deviceId = url.searchParams.get("deviceId");
        const range = url.searchParams.get("range") || "24h";

        if (!deviceId) {
          return new Response(JSON.stringify({ error: "Missing deviceId query parameter" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
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

        return Response.json(history);
      },
    },
  },
});
