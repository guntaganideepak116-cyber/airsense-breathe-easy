import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({ name: z.string().trim().min(1).max(60) });

function randomKey(bytes: number) {
  const raw = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(raw, (b) => b.toString(16).padStart(2, "0")).join("");
}

function slug(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 18) || "room"
  );
}

/**
 * Device registration. The generated apiKey is returned exactly once —
 * it is never returned by any later request.
 */
export const Route = createFileRoute("/api/devices")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid room name" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        return Response.json({
          id: `dev-${slug(parsed.name)}-${randomKey(3)}`,
          name: parsed.name,
          apiKey: `ask_${randomKey(24)}`,
          online: false,
          createdAt: new Date().toISOString(),
        });
      },
    },
  },
});
