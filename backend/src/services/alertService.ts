import nodemailer from "nodemailer";
import { config } from "../config/index.js";
import { dbService } from "./dbService.js";
import { generateAirQualityRecommendation } from "./aiRecommendationService.js";
import type { SensorReadingDoc, AlertDoc, AiRecommendationResult } from "../models/types.js";

// Cooldown per severity so inboxes don't get flooded
const COOLDOWN_MS: Record<string, number> = {
  critical: 5 * 60 * 1000,   // 5 minutes
  warning:  10 * 60 * 1000,  // 10 minutes
  moderate: 15 * 60 * 1000,  // 15 minutes
};

/** Create robust Gmail SMTP transporter */
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: (config.gmail.user || "guntaganideepak116@gmail.com").trim(),
      pass: (config.gmail.appPassword || "jcvwpaobqgcxkjyr").trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/** Determine severity from mq135 value */
function getSeverity(mq135: number): "critical" | "warning" | "moderate" | null {
  if (mq135 >= 1000) return "critical";
  if (mq135 >= 700)  return "warning";
  if (mq135 >= 400)  return "moderate";
  return null;
}

/** Build the HTML email body */
function buildEmailHtml(
  roomName: string,
  reading: SensorReadingDoc,
  severity: string,
  formattedTime: string,
  aiRec: AiRecommendationResult | null,
): string {
  const colorMap: Record<string, string> = {
    critical: "#dc2626",
    warning:  "#f97316",
    moderate: "#eab308",
  };
  const headerColor = colorMap[severity] ?? "#6366f1";

  const severityLabel: Record<string, string> = {
    critical: "🚨 CRITICAL",
    warning:  "⚠️ WARNING",
    moderate: "📊 MODERATE",
  };

  const aiBlock = aiRec
    ? `<div style="margin-top:16px;padding:16px;background-color:#fef9ec;border-left:4px solid ${headerColor};border-radius:6px;">
        <p style="margin:0 0 6px 0;font-size:14px;font-weight:bold;color:#92400e;">
          🤖 AI AirSense Recommendation (${aiRec.priority.toUpperCase()} Priority)
        </p>
        <p style="margin:0 0 10px 0;font-size:13px;color:#1e293b;line-height:1.5;">${aiRec.summary}</p>
        <p style="margin:0 0 6px 0;font-size:12px;font-weight:bold;color:#475569;">Recommended Actions:</p>
        <ul style="margin:0;padding-left:20px;font-size:12px;color:#334155;line-height:1.8;">
          ${aiRec.recommendations.map((r) => `<li>${r}</li>`).join("")}
        </ul>
      </div>`
    : `<div style="margin-top:16px;padding:12px;background:#fef9ec;border-left:4px solid ${headerColor};border-radius:4px;">
        <p style="margin:0;font-size:13px;color:#92400e;">
          <strong>Recommended Action:</strong> Elevated air contaminants detected.
          Open windows, turn on exhaust fans, and check for indoor pollutant sources.
        </p>
      </div>`;

  return `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
    <div style="background:${headerColor};color:white;padding:16px;border-radius:8px;text-align:center;">
      <h2 style="margin:0;font-size:20px;">AirSense Air Quality Alert</h2>
      <p style="margin:4px 0 0 0;font-size:14px;">${severityLabel[severity] ?? severity} detected in ${roomName}</p>
    </div>

    <div style="background:white;padding:20px;border-radius:8px;margin-top:16px;border:1px solid #e2e8f0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#64748b;width:180px;">Room / Location</td><td style="padding:6px 0;font-weight:bold;">${roomName}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Status</td><td style="padding:6px 0;font-weight:bold;color:${headerColor};text-transform:uppercase;">${severity}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">MQ-135 Reading</td><td style="padding:6px 0;font-size:18px;font-weight:bold;color:${headerColor};">${reading.mq135}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Temperature</td><td style="padding:6px 0;">${reading.temperature}°C</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Humidity</td><td style="padding:6px 0;">${reading.humidity}%</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Device ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px;">${reading.deviceId}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Detected At</td><td style="padding:6px 0;">${formattedTime} IST</td></tr>
      </table>
    </div>

    ${aiBlock}

    <p style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;">
      <strong>AirSense System</strong> · IoT Indoor Air Quality Monitoring · Automated Alert<br/>
      This is an automated message sent by AirSense to all registered members.
    </p>
  </div>`;
}

export async function processReadingForAlerts(reading: SensorReadingDoc): Promise<AlertDoc | null> {
  const severity = getSeverity(reading.mq135);
  if (!severity) return null;

  const device = await dbService.getDeviceById(reading.deviceId);
  const roomName = device?.name || reading.roomName || "Indoor Room";
  const userId = device?.userId || reading.userId;

  // Cooldown check
  const cooldownMs = COOLDOWN_MS[severity] ?? COOLDOWN_MS["moderate"]!;
  const since = new Date(Date.now() - cooldownMs);
  const recentAlert = await dbService.getRecentAlert(reading.deviceId, since);
  if (recentAlert) {
    console.log(`[AlertEngine] Cooldown active for ${reading.deviceId} — skipping.`);
    return null;
  }

  // Generate AI recommendation
  let aiRecommendation: AiRecommendationResult | null = null;
  try {
    aiRecommendation = await generateAirQualityRecommendation(
      {
        deviceId: reading.deviceId,
        roomName,
        mq135: reading.mq135,
        temperature: reading.temperature,
        humidity: reading.humidity,
        timestamp: reading.timestamp,
      },
      { forceRefresh: true, userId },
    );
  } catch (aiErr) {
    console.warn("[AlertEngine] AI recommendation failed:", aiErr instanceof Error ? aiErr.message : aiErr);
  }

  const formattedTime = new Date(reading.timestamp).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const channelsSent = { email: false };

  const groupRecipients = [...config.resend.toEmails];
  const prefs = userId ? await dbService.getUserPreferences(userId) : null;
  if (prefs?.email && !groupRecipients.includes(prefs.email)) {
    groupRecipients.push(prefs.email);
  }

  const validRecipients = groupRecipients.filter(
    (e) => e.length > 0 && !e.includes("example.com"),
  );

  const subjectMap: Record<string, string> = {
    critical: `🚨 CRITICAL: Dangerous Air Quality in ${roomName} — Action Required`,
    warning:  `⚠️ WARNING: Poor Air Quality Detected in ${roomName}`,
    moderate: `📊 NOTICE: Moderate Air Quality in ${roomName}`,
  };
  const subject = subjectMap[severity] ?? `AirSense Alert: ${roomName}`;
  const htmlBody = buildEmailHtml(roomName, reading, severity, formattedTime, aiRecommendation);

  // ── Strategy 1: Gmail SMTP Multi-Recipient Dispatch ────────────────────────
  const gmailUser = (config.gmail.user || "guntaganideepak116@gmail.com").trim();
  const gmailPass = (config.gmail.appPassword || "jcvwpaobqgcxkjyr").trim();

  if (gmailUser && gmailPass && validRecipients.length > 0) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"AirSense | Air Quality Monitor" <${gmailUser}>`,
        replyTo: `"AirSense System" <${gmailUser}>`,
        to: validRecipients.join(", "),
        subject,
        html: htmlBody,
      });

      channelsSent.email = true;
      console.log(`[AlertEngine] Gmail alert (${severity}) sent to ${validRecipients.length} recipients: ${validRecipients.join(", ")}`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("[AlertEngine] Gmail dispatch failed:", errMsg);
      await dbService.logSystem({
        event: "ALERT_EMAIL_FAILED",
        deviceId: reading.deviceId,
        ...(userId && { userId }),
        level: "warn",
        message: `Gmail SMTP failed: ${errMsg} — attempting Resend fallback`,
      });
    }
  }

  // ── Strategy 2: Resend API Fallback (HTTPS Port 443 — Cloud Friendly) ──────
  if (!channelsSent.email && config.resend.apiKey) {
    try {
      console.log("[AlertEngine] Attempting Resend API fallback...");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.resend.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AirSense Alerts <onboarding@resend.dev>",
          to: ["guntaganideepak116@gmail.com"], // Primary registered account
          subject,
          html: htmlBody,
        }),
      });

      const resData: any = await res.json();
      if (res.ok && resData?.id) {
        channelsSent.email = true;
        console.log(`[AlertEngine] Resend fallback SUCCESS: ID ${resData.id}`);
      } else {
        console.warn("[AlertEngine] Resend API error:", resData);
      }
    } catch (resendErr) {
      console.warn("[AlertEngine] Resend API fallback failed:", resendErr);
    }
  }

  // Save Alert Record to DB
  const threshold = severity === "moderate" ? config.thresholds.moderate : config.thresholds.poor;
  const alertDoc: AlertDoc = {
    deviceId: reading.deviceId,
    ...(userId && { userId }),
    roomName,
    mq135: reading.mq135,
    temperature: reading.temperature,
    humidity: reading.humidity,
    threshold,
    severity: severity === "moderate" ? "warning" : severity,
    status: "active",
    channelsSent,
    timestamp: new Date(reading.timestamp),
  };

  await dbService.saveAlert(alertDoc);

  await dbService.logSystem({
    event: "ALERT_DISPATCHED",
    deviceId: reading.deviceId,
    ...(userId && { userId }),
    level: channelsSent.email ? "info" : "warn",
    message: `Alert (${severity}) for ${roomName} — MQ-135: ${reading.mq135} | Email Sent: ${channelsSent.email}`,
    metadata: { channelsSent, severity, recipientCount: validRecipients.length },
  });

  return alertDoc;
}
