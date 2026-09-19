import { createFileRoute } from "@tanstack/react-router";
import twilio from "twilio";
import { Resend } from "resend";

export const Route = createFileRoute("/api/mock-alert")({
  server: {
    handlers: {
      POST: async () => {
        let whatsappStatus = { sent: false, reason: "Not configured", provider: "Twilio" };
        let emailStatus = { sent: false, reason: "Not configured" };

        const twilioSid = process.env["TWILIO_ACCOUNT_SID"];
        const twilioAuth = process.env["TWILIO_AUTH_TOKEN"];
        const resendKey = process.env["RESEND_API_KEY"];
        const toWhatsapp = process.env["ALERT_TO_WHATSAPP"];
        const toEmail = process.env["ALERT_TO_EMAIL"];

        // Dispatch WhatsApp via Twilio Sandbox
        if (twilioSid && twilioAuth && toWhatsapp && toWhatsapp !== "whatsapp:+910000000000") {
          try {
            const client = twilio(twilioSid, twilioAuth);
            await client.messages.create({
              body: "🚨 AIRSENSE ALERT 🚨\n\nAir quality in Test Room has deteriorated (MQ-135: 850).\nPlease take necessary action.",
              from: "whatsapp:+17372508034", // Twilio Trial Number
              to: toWhatsapp,
            });
            whatsappStatus = { sent: true, reason: "Message dispatched via Twilio", provider: "Twilio" };
          } catch (error: any) {
            whatsappStatus = { sent: false, reason: error.message || "Twilio error", provider: "Twilio" };
          }
        } else {
            whatsappStatus.reason = "Missing Twilio credentials or ALERT_TO_WHATSAPP not set in .env";
        }

        // Dispatch Email via Resend
        if (resendKey && toEmail && toEmail !== "your_email@example.com") {
          try {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "AirSense Alerts <onboarding@resend.dev>",
              to: toEmail,
              subject: "🚨 AirSense Alert: Poor Air Quality Detected",
              html: "<p><strong>Air quality in Test Room has deteriorated.</strong></p><p>MQ-135: 850<br/>Temperature: 32°C<br/>Humidity: 72%</p><p>Please take necessary action.</p>",
            });
            emailStatus = { sent: true, reason: "Email dispatched via Resend" };
          } catch (error: any) {
            emailStatus = { sent: false, reason: error.message || "Resend error" };
          }
        } else {
            emailStatus.reason = "Missing Resend credentials or ALERT_TO_EMAIL not set in .env";
        }

        return Response.json({
          success: true,
          whatsapp: whatsappStatus,
          email: emailStatus,
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
