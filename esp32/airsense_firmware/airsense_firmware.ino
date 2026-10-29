/*
 * ╔══════════════════════════════════════════════════╗
 * ║         AirSense ESP32 Firmware v1.3            ║
 * ║   MQ-135 + DHT22 + RGY LEDs + Custom Buzzer     ║
 * ╚══════════════════════════════════════════════════╝
 *
 * Device ID : AIR-4A8F31
 * API Key   : ask_live_094169bee1e6eaa60891c9de1823e12d
 *
 * Sound profile:
 *  - 🟢 Green (< 400): No sound (Silent)
 *  - 🟡 Yellow (400-700): Slow beep every 2 seconds
 *  - 🔴 Red (> 700): Continuous loud alarm (Max volume)
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ─── WiFi Credentials ────────────────────────────────────────────────────────
const char* WIFI_SSID     = "realme 11x 5G ";
const char* WIFI_PASSWORD = "deepak116";

// ─── AirSense API Credentials ────────────────────────────────────────────────
const char* DEVICE_ID = "AIR-4A8F31";
const char* API_KEY   = "ask_live_094169bee1e6eaa60891c9de1823e12d";

// Backend API endpoint for telemetry ingestion:
const char* API_URL = "https://airsense-breathe-easy.onrender.com/api/devices/data";

// ─── Sensor Pin Definitions ──────────────────────────────────────────────────
#define MQ135_PIN   34    // Analog pin for MQ-135 (AO pin)
#define DHT_PIN     4     // Digital pin for DHT22 DATA pin
#define DHT_TYPE    DHT22

// ─── LED & Buzzer Pin Definitions ────────────────────────────────────────────
#define LED_GREEN   18    // Normal / Good Air
#define LED_YELLOW  19    // Moderate Air
#define LED_RED     21    // Poor Air / Smoke Alert
#define BUZZER_PIN  22    // Alarm Buzzer

// ─── Air Quality Thresholds ──────────────────────────────────────────────────
#define THRESHOLD_MODERATE  400
#define THRESHOLD_POOR      700

// ─── Timing ──────────────────────────────────────────────────────────────────
const unsigned long SEND_INTERVAL_MS = 5000;  // Send telemetry every 5 seconds

// ─── Globals ─────────────────────────────────────────────────────────────────
DHT dht(DHT_PIN, DHT_TYPE);
unsigned long lastSendTime = 0;

// Non-blocking buzzer timing variables
unsigned long lastModerateBeep = 0;
unsigned long moderateBeepStart = 0;
bool moderateBeepActive = false;

// ─────────────────────────────────────────────────────────────────────────────
// Real-time Sound & Light Engine
// ─────────────────────────────────────────────────────────────────────────────
void handleIndicatorsAndBuzzer(int rawMQ135, unsigned long currentMillis) {
  if (rawMQ135 < THRESHOLD_MODERATE) {
    // 🟢 GREEN: Good Air
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);

    // SILENT: No sound for green
    digitalWrite(BUZZER_PIN, LOW);
    moderateBeepActive = false;
  } 
  else if (rawMQ135 < THRESHOLD_POOR) {
    // 🟡 YELLOW: Moderate Air
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);

    // SLOW BEEP: 1 short beep every 2 seconds
    if (!moderateBeepActive) {
      if (currentMillis - lastModerateBeep >= 2000) {
        lastModerateBeep = currentMillis;
        moderateBeepStart = currentMillis;
        moderateBeepActive = true;
        digitalWrite(BUZZER_PIN, HIGH); // Beep ON
      } else {
        digitalWrite(BUZZER_PIN, LOW);
      }
    } else {
      // Turn beep OFF after 150 milliseconds
      if (currentMillis - moderateBeepStart >= 150) {
        digitalWrite(BUZZER_PIN, LOW);
        moderateBeepActive = false;
      }
    }
  } 
  else {
    // 🔴 RED: Smoke / Hazardous Air
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);

    // CONTINUOUS LOUD ALARM: Maximum volume alert
    digitalWrite(BUZZER_PIN, HIGH);
    moderateBeepActive = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n╔══════════════════════════════════════╗");
  Serial.println("║   AirSense ESP32 Sound & Vision v1.3 ║");
  Serial.println("╚══════════════════════════════════════╝");

  // Setup Outputs
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Quick boot test: flash green, yellow, red and quick chirp
  digitalWrite(LED_GREEN, HIGH);
  delay(150);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);
  delay(150);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, HIGH);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(150);
  digitalWrite(LED_RED, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  dht.begin();

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
    Serial.printf("[WiFi] IP Address: %s\n", WiFi.localIP().toString().c_str());
    digitalWrite(LED_GREEN, HIGH);
  } else {
    Serial.println("\n[WiFi] Connection FAILED.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // 1. Read air sensor immediately
  int rawMQ135 = analogRead(MQ135_PIN);

  // 2. Drive lights & buzzer in real-time (non-blocking)
  handleIndicatorsAndBuzzer(rawMQ135, now);

  // 3. Send HTTP telemetry every 5 seconds
  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = now;
    readAndSend(rawMQ135);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void readAndSend(int rawMQ135) {
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    temperature = 26.5;
    humidity = 60.0;
  }

  Serial.println("──────────────────────────────────────────");
  Serial.printf("[DHT22]  Temp: %.1f °C  |  Humidity: %.1f %%\n", temperature, humidity);
  Serial.printf("[MQ-135] Raw ADC: %d\n", rawMQ135);

  StaticJsonDocument<256> doc;
  doc["deviceId"]    = DEVICE_ID;
  doc["apiKey"]      = API_KEY;
  doc["temperature"] = round(temperature * 10.0) / 10.0;
  doc["humidity"]    = round(humidity);
  doc["mq135"]       = rawMQ135;

  String jsonBody;
  serializeJson(doc, jsonBody);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  if (http.begin(client, API_URL)) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", API_KEY);
    http.addHeader("x-device-id", DEVICE_ID);
    http.setTimeout(10000);

    int httpCode = http.POST(jsonBody);

    if (httpCode > 0) {
      if (httpCode == 200 || httpCode == 201) {
        Serial.printf("[HTTP]  Data sent successfully! (HTTP %d) ✓\n", httpCode);
      } else {
        Serial.printf("[HTTP]  HTTP Error %d\n", httpCode);
      }
    } else {
      Serial.printf("[HTTP]  POST Failed: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  }
}
