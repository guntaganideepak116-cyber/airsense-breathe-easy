import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(1000),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({ p256dh: z.string().max(300), auth: z.string().max(300) }).optional(),
  lang: z.enum(["te", "en"]).optional(),
});

/** In-memory subscription registry (per worker instance). */
const subscriptions = new Map<string, z.infer<typeof subscriptionSchema>>();

export const Route = createFileRoute("/api/push/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = subscriptionSchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid subscription" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        subscriptions.set(parsed.endpoint, parsed);
        return Response.json({ ok: true, count: subscriptions.size });
      },
      DELETE: async ({ request }) => {
        try {
          const { endpoint } = (await request.json()) as { endpoint?: string };
          if (endpoint) subscriptions.delete(endpoint);
        } catch {
          /* nothing to remove */
        }
        return Response.json({ ok: true });
      },
    },
  },
});
