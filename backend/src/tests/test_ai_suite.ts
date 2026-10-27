import { evaluateThresholds } from "../services/thresholdEngine.js";
import { generateAirQualityRecommendation } from "../services/aiRecommendationService.js";
import { dbService } from "../services/dbService.js";
import { processReadingForAlerts } from "../services/alertService.js";
import type { SensorReadingDoc } from "../models/types.js";

async function runTestSuite() {
  console.log("==================================================");
  console.log("  🧪 Running AirSense AI Recommendation Test Suite");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ""}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1: Normal Sensor Data
  // ----------------------------------------------------
  console.log("--- Test 1: Normal Sensor Data ---");
  const t1Data = {
    deviceId: "AIR-TEST-01",
    roomName: "Living Room",
    mq135: 350,
    temperature: 24.5,
    humidity: 50,
  };
  const t1Threshold = evaluateThresholds(t1Data);
  assert("Threshold marks normal data as 'good'", t1Threshold.status === "good");
  assert("Threshold marks priority as 'low'", t1Threshold.priority === "low");

  try {
    const t1Ai = await generateAirQualityRecommendation(t1Data, { forceRefresh: true });
    assert("AI returns valid structured response for normal data", Boolean(t1Ai.summary && t1Ai.recommendations?.length > 0));
    assert("AI status is 'good'", t1Ai.status === "good");
    assert("AI priority is 'low'", t1Ai.priority === "low");
    console.log("   AI Summary:", t1Ai.summary);
    console.log("   AI Recommendations:", t1Ai.recommendations);
  } catch (e: any) {
    assert("AI call for normal data succeeded", false, e.message);
  }

  // ----------------------------------------------------
  // TEST 2: High Temperature
  // ----------------------------------------------------
  console.log("\n--- Test 2: High Temperature (> 32°C) ---");
  const t2Data = {
    deviceId: "AIR-TEST-02",
    roomName: "Kitchen",
    mq135: 320,
    temperature: 35.2,
    humidity: 45,
  };
  const t2Threshold = evaluateThresholds(t2Data);
  assert("Threshold flags high temperature as 'warning'", t2Threshold.status === "warning");
  assert("Temp level evaluated as 'hot'", t2Threshold.tempLevel === "hot");

  try {
    const t2Ai = await generateAirQualityRecommendation(t2Data, { forceRefresh: true });
    assert("AI responds to elevated temperature", t2Ai.status === "warning" || t2Ai.status === "attention");
    assert("Recommendations address airflow/cooling", t2Ai.recommendations.some(r => /cool|air|circulat|fan|ventilat/i.test(r) || /temperature/i.test(t2Ai.summary)));
    console.log("   AI Summary:", t2Ai.summary);
    console.log("   AI Recommendations:", t2Ai.recommendations);
  } catch (e: any) {
    assert("AI call for high temperature succeeded", false, e.message);
  }

  // ----------------------------------------------------
  // TEST 3: High Humidity (> 75%)
  // ----------------------------------------------------
  console.log("\n--- Test 3: High Humidity (> 75%) ---");
  const t3Data = {
    deviceId: "AIR-TEST-03",
    roomName: "Basement",
    mq135: 310,
    temperature: 23.0,
    humidity: 82,
  };
  const t3Threshold = evaluateThresholds(t3Data);
  assert("Threshold flags excessive humidity as 'warning'", t3Threshold.status === "warning");
  assert("Humidity level evaluated as 'high'", t3Threshold.humidityLevel === "high");

  try {
    const t3Ai = await generateAirQualityRecommendation(t3Data, { forceRefresh: true });
    assert("AI recommendations address humidity or moisture", /humid|moist|damp|ventilat|exhaust/i.test(t3Ai.summary) || t3Ai.recommendations.some(r => /humid|moist|fan|ventilat|exhaust|dehumid/i.test(r)));
    console.log("   AI Summary:", t3Ai.summary);
  } catch (e: any) {
    assert("AI call for high humidity succeeded", false, e.message);
  }

  // ----------------------------------------------------
  // TEST 4: Elevated MQ-135 Reading (>= 700)
  // ----------------------------------------------------
  console.log("\n--- Test 4: Elevated MQ-135 Sensor Reading ---");
  const t4Data = {
    deviceId: "AIR-TEST-04",
    roomName: "Study Room",
    mq135: 780,
    temperature: 25.0,
    humidity: 52,
  };
  const t4Threshold = evaluateThresholds(t4Data);
  assert("Threshold flags MQ-135 >= 700 as 'warning'", t4Threshold.status === "warning");

  try {
    const t4Ai = await generateAirQualityRecommendation(t4Data, { forceRefresh: true });
    assert("AI output has warning status and high priority", t4Ai.status === "warning" && t4Ai.priority === "high");
    assert("AI advises ventilation/pollution source check", t4Ai.recommendations.some(r => /ventilat|window|exhaust|pollut|source/i.test(r)));
    console.log("   AI Summary:", t4Ai.summary);
  } catch (e: any) {
    assert("AI call for elevated MQ-135 succeeded", false, e.message);
  }

  // ----------------------------------------------------
  // TEST 5: Multiple Abnormal Readings
  // ----------------------------------------------------
  console.log("\n--- Test 5: Multiple Abnormal Readings (Compound Condition) ---");
  const t5Data = {
    deviceId: "AIR-TEST-05",
    roomName: "Workshop",
    mq135: 850,
    temperature: 34.0,
    humidity: 78,
  };
  const t5Threshold = evaluateThresholds(t5Data);
  assert("Threshold marks multiple severe abnormalities as 'critical'", t5Threshold.status === "critical");
  assert("Priority is 'high'", t5Threshold.priority === "high");

  try {
    const t5Ai = await generateAirQualityRecommendation(t5Data, { forceRefresh: true });
    assert("AI status aligns with deterministic critical threshold", t5Ai.status === "critical");
    assert("AI priority is high", t5Ai.priority === "high");
    console.log("   AI Summary:", t5Ai.summary);
    console.log("   AI Recommendations:", t5Ai.recommendations);
  } catch (e: any) {
    assert("AI call for multiple abnormal readings succeeded", false, e.message);
  }

  // ----------------------------------------------------
  // TEST 6: No Sensor Data
  // ----------------------------------------------------
  console.log("\n--- Test 6: No Sensor Data ---");
  const nonexistentDevice = "AIR-NO-DATA-99";
  const reading = await dbService.getLatestReading(nonexistentDevice);
  assert("dbService returns null when no sensor reading exists", reading === null);

  // ----------------------------------------------------
  // TEST 7: AI Cooldown & Caching Prevention
  // ----------------------------------------------------
  console.log("\n--- Test 7: AI Cooldown & Caching ---");
  const t7Data = {
    deviceId: "AIR-CACHE-TEST",
    roomName: "Office",
    mq135: 360,
    temperature: 24.0,
    humidity: 50,
  };
  const firstCall = await generateAirQualityRecommendation(t7Data, { forceRefresh: true });
  assert("First call generates fresh analysis (cached === false)", firstCall.cached === false);

  // Immediate second call with identical data
  const secondCall = await generateAirQualityRecommendation(t7Data, { forceRefresh: false });
  assert("Second call within cooldown returns cached response", secondCall.cached === true);
  assert("Cached response preserves summary and recommendations", secondCall.summary === firstCall.summary);

  // ----------------------------------------------------
  // TEST 8: Significant Change Bypasses Cooldown
  // ----------------------------------------------------
  console.log("\n--- Test 8: Significant Reading Change Bypasses Cooldown ---");
  const t8DrasticData = {
    deviceId: "AIR-CACHE-TEST",
    roomName: "Office",
    mq135: 890, // Jumped from 360 to 890
    temperature: 25.0,
    humidity: 50,
  };
  const bypassCall = await generateAirQualityRecommendation(t8DrasticData, { forceRefresh: false });
  assert("Drastic shift from good to warning generates fresh analysis (cached === false)", bypassCall.cached === false);
  assert("Updated status reflects warning condition", bypassCall.status === "warning" || bypassCall.status === "critical");

  // ----------------------------------------------------
  // TEST 9: Email & WhatsApp Alert Integration
  // ----------------------------------------------------
  console.log("\n--- Test 9: Alert Engine Dispatch with AI Integration ---");
  const alertReading: SensorReadingDoc = {
    deviceId: "AIR-ALERT-DEVICE",
    roomName: "Master Bedroom",
    mq135: 750,
    temperature: 26.5,
    humidity: 55,
    status: "poor",
    buzzerActive: true,
    timestamp: new Date(),
  };

  const alertDoc = await processReadingForAlerts(alertReading);
  assert("Alert engine creates AlertDoc for poor air quality", alertDoc !== null);
  assert("Severity is set to 'warning' (or 'critical')", alertDoc?.severity === "warning" || alertDoc?.severity === "critical");

  console.log("\n==================================================");
  console.log(`  🎯 Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log("==================================================");

  if (passed === total) {
    console.log("  ✨ All AI Recommendation Engine tests PASSED successfully!\n");
    process.exit(0);
  } else {
    console.error("  ❌ Some tests failed.\n");
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
