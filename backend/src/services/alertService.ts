import twilio from "twilio";
import { Resend } from "resend";
import { config } from "../config/index.js";
import { dbService } from "./dbService.js";
import type { SensorReadingDoc, AlertDoc } from "../models/types.js";

const ALERT_COOLDOWN_MS = 15 * 60 * 1000;

export async function processReadingForAlerts(reading: SensorReadingDoc): Promise<AlertDoc | null> {
  if (reading.status !== "poor" && reading.mq135 < 700) {
    return null;
  }

  const device = await dbService.getDeviceById(reading.deviceId);
  const roomName = device?.name || reading.roomName || "Indoor Room";
  const userId = device?.userId || reading.userId;

  const since = new Date(Date.now() - ALERT_COOLDOWN_MS);
  const recentAlert = await dbService.getRecentAlert(reading.deviceId, since);
  if (recentAlert) {
    return null;
  }

  const severity: "warning" | "critical" = reading.mq135 >= 1000 ? "critical" : "warning";
  const threshold = 700;

  const channelsSent = {
    whatsapp: false,
    email: false,
    sms: false,
  };

  const prefs = userId ? await dbService.getUserPreferences(userId) : null;
  const whatsappTarget = prefs?.whatsappNumber || config.twilio.to;
  const emailTarget = prefs?.email || config.resend.toEmail;

  const formattedTime = new Date(reading.timestamp).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // 1. WhatsApp Alert via Twilio
  if (
    prefs?.alertChannels.whatsapp !== false &&
    config.twilio.sid &&
    config.twilio.authToken &&
    whatsappTarget &&
    !whatsappTarget.includes("0000000000")
  ) {
    try {
      const client = twilio(config.twilio.sid, config.twilio.authToken);
      const to = whatsappTarget.startsWith("whatsapp:")
        ? whatsappTarget
        : `whatsapp:${whatsappTarget}`;

      const whatsappBody =
        `🚨 *AIRSENSE AIR QUALITY ALERT*\n\n` +
        `*Severity:* ${severity.toUpperCase()}\n` +
        `*Room:* ${roomName}\n` +
        `*Device:* ${reading.deviceId}\n` +
        `*MQ-135 Sensor Reading:* ${reading.mq135}\n` +
        `*Temperature:* ${reading.temperature}°C\n` +
        `*Humidity:* ${reading.humidity}%\n` +
        `*Time:* ${formattedTime} IST\n\n` +
        `⚠️ Poor air quality detected. Please open windows or ensure proper ventilation immediately.`;

      await client.messages.create({
        body: whatsappBody,
        from: config.twilio.from,
        to,
      });
      channelsSent.whatsapp = true;
      console.log(`[AlertEngine] WhatsApp alert sent to ${to}`);
    } catch (err: unknown) {
      console.warn(
        "[AlertEngine] WhatsApp dispatch failed:",
        err instanceof Error ? err.message : err,
      );
    }
  }

  // 2. Email Alert via Resend
  if (
    prefs?.alertChannels.email !== false &&
    config.resend.apiKey &&
    emailTarget &&
    !emailTarget.includes("example.com")
  ) {
    try {
      const resend = new Resend(config.resend.apiKey);
      await resend.emails.send({
        from: config.resend.fromEmail,
        to: emailTarget,
        subject: `🚨 AirSense Alert: High Air Contamination in ${roomName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <div style="background-color: #ef4444; color: white; padding: 16px; border-radius: 8px; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">🚨 Poor Air Quality Alert</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px;">Elevated pollution detected by AirSense hardware</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 16px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0;"><strong>Room / Location:</strong> ${roomName}</p>
              <p style="margin: 0 0 12px 0;"><strong>Device ID:</strong> <code>${reading.deviceId}</code></p>
              <p style="margin: 0 0 12px 0;"><strong>MQ-135 Sensor Reading:</strong> <span style="font-size: 18px; color: #ef4444; font-weight: bold;">${reading.mq135}</span></p>
              <p style="margin: 0 0 12px 0;"><strong>Temperature:</strong> ${reading.temperature}°C</p>
              <p style="margin: 0 0 12px 0;"><strong>Relative Humidity:</strong> ${reading.humidity}%</p>
              <p style="margin: 0 0 12px 0;"><strong>Time of Detection:</strong> ${formattedTime} IST</p>
            </div>

            <div style="margin-top: 16px; padding: 12px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #991b1b;">
                <strong>Recommended Action:</strong> Stuffy or contaminated air detected. Open windows for air circulation, turn on exhaust fans, or inspect potential indoor pollutant sources.
              </p>
            </div>

            <p style="margin-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
              AirSense IoT Indoor Air Quality Monitoring System · Automated Alert
            </p>
          </div>
        `,
      });
      channelsSent.email = true;
      console.log(`[AlertEngine] Email alert sent to ${emailTarget}`);
    } catch (err: unknown) {
      console.warn(
        "[AlertEngine] Email dispatch failed:",
        err instanceof Error ? err.message : err,
      );
    }
  }

  // 3. Save Alert to DB
  const alertDoc: AlertDoc = {
    deviceId: reading.deviceId,
    ...(userId && { userId }),
    roomName,
    mq135: reading.mq135,
    temperature: reading.temperature,
    humidity: reading.humidity,
    threshold,
    severity,
    status: "active",
    channelsSent,
    timestamp: new Date(reading.timestamp),
  };

  await dbService.saveAlert(alertDoc);

  await dbService.logSystem({
    event: "ALERT_DISPATCHED",
    deviceId: reading.deviceId,
    ...(userId && { userId }),
    level: "warn",
    message: `Alert triggered for ${roomName} (MQ-135: ${reading.mq135})`,
    metadata: { channelsSent, severity },
  });

  return alertDoc;
}
