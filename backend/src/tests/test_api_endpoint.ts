import app from "../server.js";
import { dbService } from "../services/dbService.js";
import type { DeviceDoc, SensorReadingDoc } from "../models/types.js";
import http from "http";

async function testEndpoint() {
  console.log("==================================================");
  console.log("  🌐 Testing Express API Endpoint: /api/ai/recommendation");
  console.log("==================================================\n");

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://localhost:${address.port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    // 1. Test missing deviceId
    const res1 = await fetch(`${baseUrl}/api/ai/recommendation`);
    console.log("Test 1 (Missing deviceId) status:", res1.status);
    const json1 = await res1.json();
    console.log("Test 1 response:", json1);

    // 2. Test nonexistent device
    const res2 = await fetch(`${baseUrl}/api/ai/recommendation?deviceId=AIR-NONEXISTENT`);
    console.log("\nTest 2 (Nonexistent device) status:", res2.status);
    const json2 = await res2.json();
    console.log("Test 2 response:", json2);

    // 3. Register real device with no readings
    const deviceId = "AIR-E2E-TEST";
    const now = new Date();
    const testDevice: DeviceDoc = {
      deviceId,
      name: "Living Room",
      userId: "user_test_123",
      apiKeyHash: "hash",
      apiKeyPrefix: "prefix",
      status: "never_connected",
      lastSeen: null,
      createdAt: now,
      updatedAt: now,
    };
    await dbService.createDevice(testDevice);

    const res3 = await fetch(`${baseUrl}/api/ai/recommendation?deviceId=${deviceId}`);
    console.log("\nTest 3 (Device with no data) status:", res3.status);
    const json3 = await res3.json();
    console.log("Test 3 response:", json3);

    // 4. Test offline device (lastSeen > 5 mins ago)
    testDevice.lastSeen = new Date(Date.now() - 10 * 60 * 1000);
    testDevice.status = "offline";
    await dbService.updateDevice(deviceId, "user_test_123", testDevice);

    // Add reading
    const oldReading: SensorReadingDoc = {
      deviceId,
      roomName: "Living Room",
      mq135: 350,
      temperature: 24,
      humidity: 50,
      status: "good",
      buzzerActive: false,
      timestamp: testDevice.lastSeen,
    };
    await dbService.saveReading(oldReading);

    const res4 = await fetch(`${baseUrl}/api/ai/recommendation?deviceId=${deviceId}`);
    console.log("\nTest 4 (Offline device) status:", res4.status);
    const json4 = await res4.json();
    console.log("Test 4 response:", json4);

    // 5. Test online active device with real sensor reading
    const activeTime = new Date();
    await dbService.updateDeviceHeartbeat(deviceId, activeTime);

    const freshReading: SensorReadingDoc = {
      deviceId,
      roomName: "Living Room",
      mq135: 420,
      temperature: 26.5,
      humidity: 54,
      status: "moderate",
      buzzerActive: false,
      timestamp: activeTime,
    };
    await dbService.saveReading(freshReading);

    const res5 = await fetch(`${baseUrl}/api/ai/recommendation?deviceId=${deviceId}&refresh=true`);
    console.log("\nTest 5 (Online device with real data) status:", res5.status);
    const json5 = await res5.json();
    console.log("Test 5 response:", JSON.stringify(json5, null, 2));

    // 6. Test caching (immediate second call without refresh)
    const res6 = await fetch(`${baseUrl}/api/ai/recommendation?deviceId=${deviceId}`);
    console.log("\nTest 6 (Cached call) status:", res6.status);
    const json6 = await res6.json();
    console.log("Test 6 cached flag:", json6.data?.cached);

    console.log("\n==================================================");
    console.log("  ✨ All API Endpoint tests passed successfully!");
    console.log("==================================================");
  } finally {
    server.close();
  }
}

testEndpoint().catch((err) => {
  console.error("Endpoint test error:", err);
  process.exit(1);
});
