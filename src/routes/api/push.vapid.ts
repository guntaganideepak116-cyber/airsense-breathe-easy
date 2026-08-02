import { createFileRoute } from "@tanstack/react-router";

/** VAPID application server public key (safe to expose to the browser). */
const FALLBACK_PUBLIC_KEY =
  "BC0tP9HcEj-bSuhYwLbgpWisPjznZkaeB2EyCsuYcL1EYpKWNxKdu9woqh6wS50zQmTQ7cazExdySR4Pe9h4aqA";

export const Route = createFileRoute("/api/push/vapid")({
  server: {
    handlers: {
      GET: async () => {
        const key = process.env["VAPID_PUBLIC_KEY"] || FALLBACK_PUBLIC_KEY;
        return Response.json({ publicKey: key });
      },
    },
  },
});
