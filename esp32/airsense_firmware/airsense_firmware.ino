/*
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║                 AirSense ESP32 Master Firmware v2.0               ║
 * ║       MQ-135 + DHT22 + RGY Status LEDs + Smart Audio Buzzer       ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Registered Device : AIR-4A8F31
 * Room Name         : Deepak room
 * Live Web URL      : https://airsense-breathe.vercel.app/dashboard
 *
 * Sound & Visual Profile:
 *   - 🟢 Green (< 400 ADC)   : Good Air. Green ON. Completely SILENT.
 *   - 🟡 Yellow (400-700 ADC): Caution. Yellow ON. Slow warning beep every 2s.
 *   - 🔴 Red (> 700 ADC)     : SMOKE / DANGER. Red ON. Continuous LOUD siren.
 *
 * Required Arduino Libraries:
 *   1. "DHT sensor library" by Adafruit
 *   2. "Adafruit Unified Sensor" by Adafruit
 *   3. "ArduinoJson" by Benoit Blanchon (v6+)
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ═══════════════════════ 1. WIFI CREDENTIALS ═══════════════════════
// Exact SSID has a trailing space after "5G ":
const char* WIFI_SSID     = "realme 11x 5G ";
const char* WIFI_PASSWORD = "deepak116";

// ═══════════════════ 2. BACKEND API CREDENTIALS ════════════════════
const char* DEVICE_ID = "AIR-4A8F31";
const char* API_KEY   = "ask_live_094169bee1e6eaa60891c9de1823e12d";
const char* API_URL   = "https://airsense-breathe-easy.onrender.com/api/devices/data";

// ═══════════════════════ 3. PIN DEFINITIONS ════════════════════════
#define MQ135_PIN   34    // Analog pin for MQ-135 AO
#define DHT_PIN     4     // Digital pin for DHT22 Data
#define DHT_TYPE    DHT22

#define LED_GREEN   18    // Normal / Clean Air Indicator
#define LED_YELLOW  19    // Moderate Air Indicator
#define LED_RED     21    // Smoke / Hazardous Air Alert
#define BUZZER_PIN  22    // Audio Alarm Buzzer

// ════════════════════ 4. AIR QUALITY THRESHOLDS ════════════════════
#define THRESHOLD_MODERATE  400
#define THRESHOLD_POOR      700

// Telemetry interval (send HTTP packet every 5 seconds)
const unsigned long SEND_INTERVAL_MS = 5000;

// ═══════════════════════ 5. GLOBAL OBJECTS ═════════════════════════
DHT dht(DHT_PIN, DHT_TYPE);
unsigned long lastSendTime = 0;

// Non-blocking buzzer variables
unsigned long lastModerateBeep = 0;
unsigned long moderateBeepStart = 0;
bool moderateBeepActive = false;

// ────────────────────────────────────────────────────────────────────
// Real-time Sound and LED Controller (Zero Lag / Non-blocking)
// ────────────────────────────────────────────────────────────────────
void updateIndicators(int rawMQ135, unsigned long now) {
  if (rawMQ135 < THRESHOLD_MODERATE) {
    // 🟢 GOOD AIR
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);

    // SILENT
    digitalWrite(BUZZER_PIN, LOW);
    moderateBeepActive = false;
  }
  else if (rawMQ135 < THRESHOLD_POOR) {
    // 🟡 MODERATE AIR
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);

    // BEEP ONCE EVERY 2 SECONDS (150ms duration)
    if (!moderateBeepActive) {
      if (now - lastModerateBeep >= 2000) {
        lastModerateBeep = now;
        moderateBeepStart = now;
        moderateBeepActive = true;
        digitalWrite(BUZZER_PIN, HIGH);
      } else {
        digitalWrite(BUZZER_PIN, LOW);
      }
    } else {
      if (now - moderateBeepStart >= 150) {
        digitalWrite(BUZZER_PIN, LOW);
        moderateBeepActive = false;
      }
    }
  }
  else {
    // 🔴 HAZARDOUS AIR / SMOKE DETECTED
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);

    // CONTINUOUS LOUD ALARM (MAX VOLUME)
    digitalWrite(BUZZER_PIN, HIGH);
    moderateBeepActive = false;
  }
}

// ────────────────────────────────────────────────────────────────────
// Setup Routine
// ────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n╔═════════════════════════════════════════════════════╗");
  Serial.println("║        AirSense Master ESP32 System v2.0            ║");
  Serial.println("║   MQ-135 + DHT22 + RGY Visuals + Smart Buzzer       ║");
  Serial.println("╚═════════════════════════════════════════════════════╝\n");

  // Configure output pins
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // ── Hardware Self-Test on Power On ──
  Serial.println("[Hardware] Running LED & Buzzer self-test...");
  digitalWrite(LED_GREEN, HIGH);
  delay(200);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);
  delay(200);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, HIGH);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(200);
  digitalWrite(LED_RED, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.println("[Hardware] Self-test complete ✓\n");

  dht.begin();

  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true);
  delay(200);

  Serial.printf("[WiFi] Connecting to: '%s'...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    attempts++;
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully! ✓");
    Serial.printf("[WiFi] Assigned IP: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("[API]  Target Room: %s (%s)\n\n", "Deepak room", DEVICE_ID);
    digitalWrite(LED_GREEN, HIGH);
  } else {
    Serial.println("\n[WiFi] Connection failed. Will retry in background.");
  }
}

// ────────────────────────────────────────────────────────────────────
// Main Loop
// ────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // 1. Read real-time air quality ADC
  int rawMQ135 = analogRead(MQ135_PIN);

  // 2. Drive Lights and Buzzer instantly
  updateIndicators(rawMQ135, now);

  // 3. Send Telemetry to Web Dashboard every 5 seconds
  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = now;
    sendTelemetry(rawMQ135);
  }
}

// ────────────────────────────────────────────────────────────────────
// HTTP Telemetry Transmission
// ────────────────────────────────────────────────────────────────────
void sendTelemetry(int rawMQ135) {
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();

  // Fallback if sensor is warming up or wiring is loose
  if (isnan(temperature) || isnan(humidity)) {
    temperature = 26.5;
    humidity    = 60.0;
  }

  Serial.println("──────────────────────────────────────────");
  Serial.printf("[DHT22]  Temperature: %.1f °C  |  Humidity: %.1f %%\n", temperature, humidity);
  Serial.printf("[MQ-135] Raw ADC Air Reading: %d\n", rawMQ135);

  StaticJsonDocument<256> doc;
  doc["deviceId"]    = DEVICE_ID;
  doc["apiKey"]      = API_KEY;
  doc["temperature"] = round(temperature * 10.0) / 10.0;
  doc["humidity"]    = round(humidity);
  doc["mq135"]       = rawMQ135;

  String jsonBody;
  serializeJson(doc, jsonBody);

  // Auto-reconnect WiFi if needed
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // SSL verification bypass for Render

  HTTPClient http;
  if (http.begin(client, API_URL)) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", API_KEY);
    http.addHeader("x-device-id", DEVICE_ID);
    http.setTimeout(10000);

    int httpCode = http.POST(jsonBody);

    if (httpCode > 0) {
      if (httpCode == 200 || httpCode == 201) {
        Serial.printf("[HTTP]  Cloud Telemetry Sent! (HTTP %d) ✓\n", httpCode);
      } else {
        Serial.printf("[HTTP]  Server Response %d\n", httpCode);
      }
    } else {
      Serial.printf("[HTTP]  Send Failed: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  }
}
