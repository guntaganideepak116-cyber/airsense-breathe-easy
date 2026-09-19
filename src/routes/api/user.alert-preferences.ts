import { createFileRoute } from "@tanstack/react-router";

// Mock database for user preferences
let preferences = {
  phoneNumber: "9876543210",
  whatsappNumber: "919876543210",
  email: "alerts@example.com",
  alertChannels: { sms: true, whatsapp: true, email: true },
};

export const Route = createFileRoute("/api/user/alert-preferences")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(preferences);
      },
      PATCH: async ({ request }) => {
        try {
          const patch = await request.json();
          preferences = {
            phoneNumber: patch.phoneNumber ?? preferences.phoneNumber,
            whatsappNumber: patch.whatsappNumber ?? preferences.whatsappNumber,
            email: patch.email ?? preferences.email,
            alertChannels: {
              sms: patch.alertChannels?.sms ?? preferences.alertChannels.sms,
              whatsapp: patch.alertChannels?.whatsapp ?? preferences.alertChannels.whatsapp,
              email: patch.alertChannels?.email ?? preferences.alertChannels.email,
            },
          };
          return Response.json(preferences);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid patch data" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
