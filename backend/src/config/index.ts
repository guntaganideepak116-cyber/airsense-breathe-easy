import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load from current working directory
dotenv.config();

// Also attempt loading from backend/.env or workspace root .env
const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../backend/.env"),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

export const config = {
  port: parseInt(process.env["PORT"] || "5000", 10),
  nodeEnv: process.env["NODE_ENV"] || "development",
  corsOrigins: (process.env["FRONTEND_URL"] || "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
  mongodbUri: process.env["MONGODB_URI"] || "",
  clerkSecretKey: process.env["CLERK_SECRET_KEY"] || "",
  resend: {
    apiKey: process.env["RESEND_API_KEY"] || "",
    fromEmail: process.env["ALERT_FROM_EMAIL"] || "AirSense Alerts <onboarding@resend.dev>",
    // Comma-separated list of alert recipient emails
    toEmails: (process.env["ALERT_TO_EMAIL"] || "nagendrababupasam85@gmail.com,fazil6651190@gmail.com,chavalanithin196@gmail.com,guntaganideepak116@gmail.com,naginenikoustubh@gmail.com,laharishkaranam9@gmail.com")
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && !e.includes("example.com")),
  },
  gmail: {
    user: process.env["GMAIL_USER"] || "guntaganideepak116@gmail.com",
    appPassword: process.env["GMAIL_APP_PASSWORD"] || "",
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
  ai: {
    enabled: process.env["AI_ENABLED"] !== "false",
    provider: (process.env["AI_PROVIDER"] || "groq").toLowerCase(),
    model: process.env["AI_MODEL"] || "qwen/qwen3.8-27b",
    apiKey: process.env["AI_API_KEY"] || "",
    cooldownSeconds: parseInt(process.env["AI_RECOMMENDATION_COOLDOWN_SECONDS"] || "300", 10),
  },
};
