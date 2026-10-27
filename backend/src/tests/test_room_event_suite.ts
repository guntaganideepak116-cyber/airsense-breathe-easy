import { roomEventService, DEFAULT_DETECTION_CONFIG } from "../services/roomEventService.js";
import { dbService } from "../services/dbService.js";
import type { SensorReadingDoc, UserActivityDoc } from "../models/types.js";

async function runTestSuite() {
  console.log("==================================================");
  console.log("🧪 Running AirSense Room Event Detective Test Suite");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const testDeviceId = "AIR-TEST-DETECTIVE";
  const testUserId = "user_test_detective_123";
  const now = Date.now();

  // Test 1: User Activity creation and validation
  console.log("\n[1] Testing User Activity Storage & Retrieval");
  const activity1: UserActivityDoc = {
    deviceId: testDeviceId,
    userId: testUserId,
    category: "cooking",
    title: "Dinner Cooking (Stir Fry)",
    notes: "High heat on gas stove with spices",
    startAt: new Date(now - 25 * 60 * 1000), // 25 mins ago
    endAt: new Date(now - 5 * 60 * 1000), // 5 mins ago
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const savedAct1 = await dbService.saveUserActivity(activity1);
  assert(Boolean(savedAct1.id), "Activity successfully saved with generated ID");

  const fetchedActs = await dbService.getUserActivities(testUserId, testDeviceId);
  assert(fetchedActs.length >= 1, "Fetched activities list contains saved activity");
  assert(fetchedActs[0]?.title === "Dinner Cooking (Stir Fry)", "Activity title matches");

  // Test 2: Activity update
  console.log("\n[2] Testing User Activity Modification");
  const updatedOk = await dbService.updateUserActivity(savedAct1.id!, testUserId, {
    title: "Dinner Cooking (Modified)",
  });
  assert(updatedOk, "Activity update returned success");
  const reFetched = await dbService.getUserActivityById(savedAct1.id!, testUserId);
  assert(reFetched?.title === "Dinner Cooking (Modified)", "Activity update verified in database");

  // Test 3: Sensor Event Detection from Readings
  console.log("\n[3] Testing Sensor Change Event Detection Engine");
  // Seed baseline readings (steady MQ-135 ~ 350, temp ~ 24, hum ~ 50)
  for (let i = 15; i >= 3; i--) {
    const reading: SensorReadingDoc = {
      deviceId: testDeviceId,
      userId: testUserId,
      mq135: 350 + Math.round(Math.random() * 5),
      temperature: 24.0,
      humidity: 50,
      status: "good",
      buzzerActive: false,
      timestamp: new Date(now - i * 60 * 1000),
    };
    await dbService.saveReading(reading);
  }

  // Incoming spike reading at (now - 2 mins): MQ-135 rises from 350 to 580 (+65%)
  const spikeReading: SensorReadingDoc = {
    deviceId: testDeviceId,
    userId: testUserId,
    mq135: 580,
    temperature: 26.2, // +2.2 deg rise
    humidity: 52,
    status: "moderate",
    buzzerActive: false,
    timestamp: new Date(now - 2 * 60 * 1000),
  };
  await dbService.saveReading(spikeReading);

  const detectedEvents = await roomEventService.processReadingForEvents(spikeReading);
  assert(detectedEvents.length > 0, "Detector identified environmental change events");

  const mqSpike = detectedEvents.find((e) => e.eventType === "mq135_spike");
  assert(Boolean(mqSpike), "MQ-135 Relative Spike event successfully detected");
  assert(
    mqSpike?.baselineValue !== undefined && mqSpike.baselineValue < 400,
    `Baseline correctly established (~${mqSpike?.baselineValue})`,
  );
  assert(
    mqSpike?.observedValue === 580,
    `Observed value accurately recorded (${mqSpike?.observedValue})`,
  );

  // Test 4: Cooldown deduplication
  console.log("\n[4] Testing Cooldown Window Deduplication");
  const immediateNextSpike: SensorReadingDoc = {
    deviceId: testDeviceId,
    userId: testUserId,
    mq135: 600,
    temperature: 26.3,
    humidity: 52,
    status: "moderate",
    buzzerActive: false,
    timestamp: new Date(now - 1 * 60 * 1000),
  };
  const cooldownEvents = await roomEventService.processReadingForEvents(immediateNextSpike);
  const duplicateSpike = cooldownEvents.find((e) => e.eventType === "mq135_spike");
  assert(!duplicateSpike, "Cooldown window successfully prevented duplicate spike event");

  // Test 5: Candidate Association Linking
  console.log("\n[5] Testing Association Linking Between Activity & Event");
  const associations = await dbService.getAssociations(testUserId, testDeviceId);
  assert(associations.length > 0, "Association created between activity and sensor event");
  const targetAssoc = associations[0];
  assert(
    targetAssoc?.associationStatus === "candidate",
    "Association created with status 'candidate'",
  );
  assert(
    targetAssoc?.timeRelationship === "overlap" || targetAssoc?.timeRelationship === "preceding",
    `Time relationship properly identified: ${targetAssoc?.timeRelationship}`,
  );

  // Test 6: Pattern Detection with Insufficient Evidence
  console.log("\n[6] Testing Pattern Analysis (Initial Single/Few Observations)");
  const singleObservationInsights = await roomEventService.analyzePatterns(
    testUserId,
    testDeviceId,
    14,
  );
  assert(singleObservationInsights.length > 0, "Pattern analyzer generated insight report");
  const firstInsight = singleObservationInsights[0];
  assert(
    firstInsight?.evidenceLevel === "single_observation" ||
      firstInsight?.evidenceLevel === "insufficient",
    `Honest evidence level returned: ${firstInsight?.evidenceLevel}`,
  );
  assert(
    firstInsight?.summary.includes("not confirmed causation") ||
      firstInsight?.summary.includes("More observations are required") ||
      firstInsight?.summary.includes("enough activity history"),
    "Disclaimer preserves strict non-causal language",
  );

  // Test 7: Repeated Observations Pattern Detection
  console.log("\n[7] Testing Recurring Pattern Detection (Multiple Observations)");
  // Add 2nd cooking activity and corresponding event yesterday
  const yesterday = now - 24 * 60 * 60 * 1000;
  const activity2: UserActivityDoc = {
    deviceId: testDeviceId,
    userId: testUserId,
    category: "cooking",
    title: "Lunch Cooking",
    startAt: new Date(yesterday),
    endAt: new Date(yesterday + 20 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const savedAct2 = await dbService.saveUserActivity(activity2);

  const event2 = await dbService.saveDetectedEvent({
    deviceId: testDeviceId,
    userId: testUserId,
    eventType: "mq135_spike",
    sensorType: "mq135",
    title: "MQ-135 Relative Signal Rise",
    description: "Signal rose near lunch",
    startedAt: new Date(yesterday + 5 * 60 * 1000),
    baselineValue: 340,
    observedValue: 560,
    changeMagnitude: 220,
    ruleVersion: "1.0-relative-baseline",
    status: "detected",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await dbService.saveAssociation({
    userId: testUserId,
    deviceId: testDeviceId,
    activityId: savedAct2.id!,
    detectedEventId: event2.id!,
    timeRelationship: "overlap",
    timeDifferenceSeconds: 0,
    associationStatus: "candidate",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const repeatedInsights = await roomEventService.analyzePatterns(testUserId, testDeviceId, 14);
  const repeatedInsight = repeatedInsights.find((i) => i.evidenceLevel === "repeated_association");
  assert(Boolean(repeatedInsight), "Recurring pattern detected after multiple qualifying observations");
  assert(
    repeatedInsight?.evidenceCount! >= 2,
    `Evidence count accurately tracked (${repeatedInsight?.evidenceCount})`,
  );
  assert(
    repeatedInsight?.summary.includes("repeatedly occurred") || false,
    "Insight clearly describes recurring association without claiming causation",
  );

  // Test 8: Activity Deletion
  console.log("\n[8] Testing Activity Deletion Cleanup");
  const deleteOk = await dbService.deleteUserActivity(savedAct1.id!, testUserId);
  assert(deleteOk, "Activity deleted successfully");
  const actAfterDelete = await dbService.getUserActivityById(savedAct1.id!, testUserId);
  assert(actAfterDelete === null, "Deleted activity no longer accessible");

  console.log("\n==================================================");
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});
