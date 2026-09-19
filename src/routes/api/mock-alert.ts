import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/mock-alert")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json({
          success: true,
          whatsapp: { sent: true, reason: "Mock WhatsApp alert dispatched successfully", provider: "Mock" },
          email: { sent: true, reason: "Mock Email alert dispatched successfully" },
          reading: {
            deviceId: "dev-mock",
            status: "poor",
            mq135: 850,
            temperature: 32,
            humidity: 72,
            timestamp: new Date().toISOString(),
            buzzerActive: true,
            lastPoorAt: new Date().toISOString(),
            isTest: true,
            label: "TEST ALERT",
          }
        });
      },
    },
  },
});
