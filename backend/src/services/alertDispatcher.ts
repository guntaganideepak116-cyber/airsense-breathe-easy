import { Resend } from "resend";

export type AlertType = "AIR_POOR" | "AIR_RECOVERED" | "DEVICE_OFFLINE" | "DEVICE_ONLINE";

export interface AlertDetails {
  roomName: string;
  deviceId: string;
  mq135?: number;
  temperature?: number;
  humidity?: number;
  timestamp?: Date | string;
}

export interface UserAlertProfile {
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  alertChannels?: {
    sms?: boolean;
    whatsapp?: boolean;
    email?: boolean;
  };
}

// 1. Fast2SMS Integration
export async function sendSMS(phoneNumber: string, message: string) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ FAST2SMS_API_KEY missing in environment — skipping SMS dispatch.");
    return { success: false, reason: "FAST2SMS_API_KEY missing" };
  }

  // Ensure 10-digit Indian number without country code
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "").slice(-10);

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message,
      numbers: cleanNumber,
    }),
  });

  return response.json();
}

// 2. WhatsApp Business Cloud API Integration
export async function sendWhatsApp(phoneNumber: string, templateParams: string[]) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.warn("⚠️ WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID missing — skipping WhatsApp dispatch.");
    return { success: false, reason: "WhatsApp credentials missing" };
  }

  // Ensure country code included (defaulting to 91 if 10 digits)
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanNumber,
        type: "template",
        template: {
          name: "air_quality_alert",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: templateParams.map((p) => ({ type: "text", text: String(p) })),
            },
          ],
        },
      }),
    }
  );

  return response.json();
}

// 3. Email via Resend Integration
export async function sendEmail(toEmail: string, subject: string, htmlBody: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY missing in environment — skipping Email dispatch.");
    return { success: false, reason: "RESEND_API_KEY missing" };
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "AirSense Alerts <onboarding@resend.dev>";

  return await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject,
    html: htmlBody,
  });
}

// Helper: Build SMS message (short, <160 chars)
export function buildSMSMessage(alertType: AlertType, details: AlertDetails): string {
  const room = details.roomName || details.deviceId;
  switch (alertType) {
    case "AIR_POOR":
      return `⚠️ AirSense Alert: Air quality in ${room} turned POOR (MQ135: ${details.mq135 ?? "N/A"}). Check dashboard immediately.`;
    case "AIR_RECOVERED":
      return `✅ AirSense Alert: Air quality in ${room} recovered to GOOD (MQ135: ${details.mq135 ?? "N/A"}).`;
    case "DEVICE_OFFLINE":
      return `🚨 AirSense Alert: Device in ${room} (${details.deviceId}) went OFFLINE.`;
    case "DEVICE_ONLINE":
      return `🟢 AirSense Alert: Device in ${room} (${details.deviceId}) is back ONLINE.`;
  }
}

// Helper: Build WhatsApp template parameters
export function buildWhatsAppParams(alertType: AlertType, details: AlertDetails): string[] {
  const room = details.roomName || details.deviceId;
  switch (alertType) {
    case "AIR_POOR":
      return ["Air Quality Hazard", room, `POOR (MQ135: ${details.mq135 ?? "N/A"})`];
    case "AIR_RECOVERED":
      return ["Air Quality Recovery", room, `GOOD (MQ135: ${details.mq135 ?? "N/A"})`];
    case "DEVICE_OFFLINE":
      return ["Device Connection Status", room, "OFFLINE"];
    case "DEVICE_ONLINE":
      return ["Device Connection Status", room, "ONLINE"];
  }
}

// Helper: Build Email Subject
export function buildEmailSubject(alertType: AlertType, details: AlertDetails): string {
  const room = details.roomName || details.deviceId;
  switch (alertType) {
    case "AIR_POOR":
      return `⚠️ [AirSense Alert] Air Quality POOR in ${room}`;
    case "AIR_RECOVERED":
      return `✅ [AirSense Resolved] Air Quality Recovered in ${room}`;
    case "DEVICE_OFFLINE":
      return `🚨 [AirSense Warning] Device OFFLINE in ${room}`;
    case "DEVICE_ONLINE":
      return `🟢 [AirSense Info] Device Back ONLINE in ${room}`;
  }
}

// Helper: Build Email HTML Body
export function buildEmailBody(alertType: AlertType, details: AlertDetails): string {
  const room = details.roomName || details.deviceId;
  const timeStr = details.timestamp ? new Date(details.timestamp).toLocaleString() : new Date().toLocaleString();
  
  let headerColor = "#e11d48"; // Poor red
  let title = "Air Quality Hazard Warning";

  if (alertType === "AIR_RECOVERED") {
    headerColor = "#10b981";
    title = "Air Quality Recovery Notice";
  } else if (alertType === "DEVICE_OFFLINE") {
    headerColor = "#f59e0b";
    title = "Device Offline Warning";
  } else if (alertType === "DEVICE_ONLINE") {
    headerColor = "#3b82f6";
    title = "Device Online Notification";
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
          .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: ${headerColor}; color: #ffffff; padding: 24px; text-align: center; }
          .content { padding: 28px; color: #1e293b; }
          .metric-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; }
          .metric-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; }
          .metric-row:last-child { border-bottom: none; }
          .btn { display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
          .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 style="margin:0;">AirSense Multi-Channel Dispatch</h2>
            <p style="margin:4px 0 0 0; opacity:0.9;">${title}</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>An event was detected for your monitored space <strong>${room}</strong> (ID: <code>${details.deviceId}</code>):</p>
            
            <div class="metric-box">
              <div class="metric-row"><strong>Event Type:</strong> <span>${alertType}</span></div>
              <div class="metric-row"><strong>Room / Location:</strong> <span>${room}</span></div>
              ${details.mq135 !== undefined ? `<div class="metric-row"><strong>MQ-135 Reading:</strong> <span>${details.mq135} ppm</span></div>` : ""}
              ${details.temperature !== undefined ? `<div class="metric-row"><strong>Temperature:</strong> <span>${details.temperature} °C</span></div>` : ""}
              ${details.humidity !== undefined ? `<div class="metric-row"><strong>Humidity:</strong> <span>${details.humidity} %</span></div>` : ""}
              <div class="metric-row"><strong>Timestamp:</strong> <span>${timeStr}</span></div>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.APP_URL || "http://localhost:8081/dashboard"}" class="btn">Open AirSense Dashboard</a>
            </p>
          </div>
          <div class="footer">
            Sent automatically by AirSense Real-Time Air Quality Monitoring System.
          </div>
        </div>
      </body>
    </html>
  `;
}

// 4. Unified Dispatcher (Parallel & Independent via Promise.allSettled)
export async function dispatchAlert(
  user: UserAlertProfile,
  alertType: AlertType,
  details: AlertDetails
) {
  console.log(`📡 Dispatching ${alertType} alert for ${details.roomName || details.deviceId}...`);

  const smsMessage = buildSMSMessage(alertType, details);
  const whatsappParams = buildWhatsAppParams(alertType, details);
  const emailSubject = buildEmailSubject(alertType, details);
  const emailBody = buildEmailBody(alertType, details);

  const smsPromise =
    user.alertChannels?.sms && user.phoneNumber
      ? sendSMS(user.phoneNumber, smsMessage)
      : Promise.resolve({ skipped: true, reason: "SMS channel disabled or phone number unconfigured" });

  const whatsappPromise =
    user.alertChannels?.whatsapp && user.whatsappNumber
      ? sendWhatsApp(user.whatsappNumber, whatsappParams)
      : Promise.resolve({ skipped: true, reason: "WhatsApp channel disabled or number unconfigured" });

  const emailPromise =
    user.alertChannels?.email && user.email
      ? sendEmail(user.email, emailSubject, emailBody)
      : Promise.resolve({ skipped: true, reason: "Email channel disabled or email unconfigured" });

  const [smsResult, whatsappResult, emailResult] = await Promise.allSettled([
    smsPromise,
    whatsappPromise,
    emailPromise,
  ]);

  console.log("🔔 Multi-channel Alert Dispatch results:", {
    alertType,
    room: details.roomName,
    sms: smsResult,
    whatsapp: whatsappResult,
    email: emailResult,
  });

  return {
    sms: smsResult,
    whatsapp: whatsappResult,
    email: emailResult,
  };
}
