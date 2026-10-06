import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/mock-alert")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(
          JSON.stringify({ error: "Mock alerts and demo triggers are disabled in production" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
