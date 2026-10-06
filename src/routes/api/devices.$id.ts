import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbService } from "@/server/db";
import { getAuthUser } from "@/server/auth";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
});

export const Route = createFileRoute("/api/devices/$id")({
  server: {
    handlers: {
      PATCH: async ({ params, request }) => {
        const auth = await getAuthUser(request);
        if (!auth) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const deviceId = params.id;
        let parsed;
        try {
          parsed = patchSchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid patch payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const patch = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => v !== undefined),
        ) as Parameters<typeof dbService.updateDevice>[2];
        const updated = await dbService.updateDevice(deviceId, auth.userId, patch);
        if (!updated) {
          return new Response(JSON.stringify({ error: "Device not found or unauthorized" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return Response.json({ success: true, deviceId, ...parsed });
      },

      DELETE: async ({ params, request }) => {
        const auth = await getAuthUser(request);
        if (!auth) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const deviceId = params.id;
        const deleted = await dbService.deleteDevice(deviceId, auth.userId);
        if (!deleted) {
          return new Response(JSON.stringify({ error: "Device not found or unauthorized" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return Response.json({ success: true, message: "Device deleted successfully" });
      },
    },
  },
});
