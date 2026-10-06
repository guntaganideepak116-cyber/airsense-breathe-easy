import { createFileRoute } from "@tanstack/react-router";
import { dbService, type SensorReadingDoc } from "@/server/db";
import { deviceEvents } from "@/server/events";

/**
 * Server-Sent Events stream of REAL live readings for one device.
 * Subscribes to backend event emitter triggered by incoming ESP32 data.
 */
export const Route = createFileRoute("/api/device/$id/stream")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const deviceId = params.id;
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
          async start(controller) {
            let closed = false;

            const close = () => {
              if (closed) return;
              closed = true;
              deviceEvents.off(`reading:${deviceId}`, onReading);
              try {
                controller.close();
              } catch {
                /* already closed */
              }
            };

            request.signal.addEventListener("abort", close);

            const send = (event: string, data: unknown) => {
              if (closed) return;
              try {
                controller.enqueue(
                  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
                );
              } catch {
                close();
              }
            };

            const formatReading = (r: SensorReadingDoc) => ({
              deviceId: r.deviceId,
              status: r.status,
              mq135: r.mq135,
              temperature: r.temperature,
              humidity: r.humidity,
              timestamp: new Date(r.timestamp).toISOString(),
              buzzerActive: r.buzzerActive,
              online: true,
            });

            const onReading = (reading: SensorReadingDoc) => {
              send("reading", formatReading(reading));
            };

            // Register real-time event listener
            deviceEvents.on(`reading:${deviceId}`, onReading);

            // Send current stored latest reading if one exists
            try {
              const latest = await dbService.getLatestReading(deviceId);
              if (latest && !closed) {
                send("reading", formatReading(latest));
              }
            } catch (err) {
              console.warn("Error getting initial reading for SSE stream:", err);
            }

            // Periodic SSE keepalive ping every 15s to maintain active HTTP connection
            while (!closed && !request.signal.aborted) {
              await new Promise((r) => setTimeout(r, 15000));
              if (closed || request.signal.aborted) break;
              try {
                controller.enqueue(encoder.encode(`: keepalive\n\n`));
              } catch {
                close();
                break;
              }
            }

            close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
