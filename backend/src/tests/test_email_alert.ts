import { processReadingForAlerts } from "../services/alertService.js";
import { dbService } from "../services/dbService.js";
import type { SensorReadingDoc } from "../models/types.js";

async function runEmailAlertTests() {
  console.log("==================================================");
  console.log("  📧 Testing AirSense Email-Only Alert Integration");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      process.exitCode = 1;
    }
  }

  const testDeviceId = "AIR-EMAIL-TEST-" + Date.now();

  // 1. Register test device and set user preferences to email only
  await dbService.createDevice({
    deviceId: testDeviceId,
    name: "Living Room (Email Test)",
    userId: "test-user-email-only",
    apiKeyHash: "hash",
    apiKeyPrefix: "air_",
    status: "online",
    lastSeen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await dbService.updateUserPreferences("test-user-email-only", {
    email: "alert-recipient@airsense.local",
    alertChannels: { email: true },
    threshold: 700,
  });

  const prefs = await dbService.getUserPreferences("test-user-email-only");
  assert(prefs.email === "alert-recipient@airsense.local", "User email preference saved correctly");
  assert(prefs.alertChannels.email === true, "Email is configured as active alert channel");
  assert(!("whatsapp" in prefs.alertChannels), "WhatsApp channel is completely absent from preferences");
  assert(!("sms" in prefs.alertChannels), "SMS channel is completely absent from preferences");
  assert(!("whatsappNumber" in prefs), "whatsappNumber field is absent from preferences");
  assert(!("phoneNumber" in prefs), "phoneNumber field is absent from preferences");

  // 2. Normal reading should NOT trigger an alert
  const normalReading: SensorReadingDoc = {
    deviceId: testDeviceId,
    userId: "test-user-email-only",
    roomName: "Living Room (Email Test)",
    mq135: 350,
    temperature: 24.5,
    humidity: 48,
    status: "good",
    buzzerActive: false,
    timestamp: new Date(),
  };

  const normalAlert = await processReadingForAlerts(normalReading);
  assert(normalAlert === null, "Normal air reading (MQ-135 < 700) does not trigger any alert");

  // 3. Hazardous reading (MQ-135 >= 700) should trigger alert
  const poorReading: SensorReadingDoc = {
    deviceId: testDeviceId,
    userId: "test-user-email-only",
    roomName: "Living Room (Email Test)",
    mq135: 820,
    temperature: 29.0,
    humidity: 65,
    status: "poor",
    buzzerActive: true,
    timestamp: new Date(),
  };

  const alert = await processReadingForAlerts(poorReading);
  assert(alert !== null, "Elevated air contamination reading triggers an AlertDoc");
  assert(alert?.severity === "warning", "Severity evaluated to warning for MQ-135=820");
  assert(alert?.deviceId === testDeviceId, "Alert is linked to the correct device ID");
  assert("email" in (alert?.channelsSent || {}), "channelsSent includes email channel");
  assert(!("whatsapp" in (alert?.channelsSent || {})), "channelsSent does NOT include WhatsApp");
  assert(!("sms" in (alert?.channelsSent || {})), "channelsSent does NOT include SMS");

  // 4. Verification in database
  const savedAlerts = await dbService.getAlerts(testDeviceId, 1);
  assert(savedAlerts.length > 0, "Alert recorded in database history");
  assert(savedAlerts[0]?.roomName === "Living Room (Email Test)", "Alert stores correct room metadata");

  console.log("\n==================================================");
  console.log(`  🎯 Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log("==================================================");

  if (passed === total) {
    console.log("  ✨ Email-only alert integration fully verified!\n");
  } else {
    process.exit(1);
  }
}

runEmailAlertTests().catch((err) => {
  console.error("Test failed with exception:", err);
  process.exit(1);
});
