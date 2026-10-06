import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env["PORT"] || "5000", 10),
  nodeEnv: process.env["NODE_ENV"] || "development",
  corsOrigins: (process.env["FRONTEND_URL"] || "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
  mongodbUri: process.env["MONGODB_URI"] || "",
  clerkSecretKey: process.env["CLERK_SECRET_KEY"] || "",
  twilio: {
    sid: process.env["TWILIO_ACCOUNT_SID"] || "",
    authToken: process.env["TWILIO_AUTH_TOKEN"] || "",
    from: process.env["TWILIO_WHATSAPP_FROM"] || "whatsapp:+14155238886",
    to: process.env["ALERT_TO_WHATSAPP"] || "",
  },
  resend: {
    apiKey: process.env["RESEND_API_KEY"] || "",
    fromEmail: process.env["ALERT_FROM_EMAIL"] || "AirSense Alerts <onboarding@resend.dev>",
    toEmail: process.env["ALERT_TO_EMAIL"] || "",
  },
  metaWhatsapp: {
    phoneNumberId: process.env["WHATSAPP_PHONE_NUMBER_ID"] || "",
    accessToken: process.env["WHATSAPP_ACCESS_TOKEN"] || "",
  },
  vapid: {
    publicKey:
      process.env["VAPID_PUBLIC_KEY"] ||
      "BC0tP9HcEj-bSuhYwLbgpWisPjznZkaeB2EyCsuYcL1EYpKWNxKdu9woqh6wS50zQmTQ7cazExdySR4Pe9h4aqA",
  },
  thresholds: {
    moderate: parseInt(process.env["MODERATE_THRESHOLD"] || "400", 10),
    poor: parseInt(process.env["POOR_THRESHOLD"] || "700", 10),
  },
};
