import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbService } from "@/server/db";
import { getAuthUser } from "@/server/auth";

const patchSchema = z.object({
  phoneNumber: z.string().trim().max(20).optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
  email: z.string().trim().email().max(100).optional().or(z.literal("")),
  alertChannels: z
    .object({
      sms: z.boolean().optional(),
      whatsapp: z.boolean().optional(),
      email: z.boolean().optional(),
    })
    .optional(),
  threshold: z.number().min(400).max(1000).optional(),
});

export const Route = createFileRoute("/api/user/alert-preferences")({
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

        const prefs = await dbService.getUserPreferences(auth.userId);
        return Response.json(prefs);
      },

      PATCH: async ({ request }) => {
        const auth = await getAuthUser(request);
        if (!auth) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let parsed;
        try {
          parsed = patchSchema.parse(await request.json());
        } catch (err: unknown) {
          return new Response(
            JSON.stringify({
              error: "Invalid preference data",
              details: err instanceof Error ? err.message : String(err),
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const patch = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => v !== undefined),
        ) as Parameters<typeof dbService.updateUserPreferences>[1];
        const updated = await dbService.updateUserPreferences(auth.userId, patch);
        return Response.json(updated);
      },
    },
  },
});
