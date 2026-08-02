import { createFileRoute } from "@tanstack/react-router";
import { makeReading } from "@/lib/simulate";

/**
 * Server-Sent Events stream of live readings for one device.
 * The client opens one connection per visible room card and closes it on unmount.
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
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
              } catch {
                close();
              }
            };

            send("reading", makeReading(deviceId));

            while (!closed && !request.signal.aborted) {
              await new Promise((r) => setTimeout(r, 5000));
              if (closed || request.signal.aborted) break;
              send("reading", makeReading(deviceId));
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
