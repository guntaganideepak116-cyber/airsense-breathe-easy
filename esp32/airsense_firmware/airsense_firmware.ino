/*
 * ╔══════════════════════════════════════════════════╗
 * ║         AirSense ESP32 Firmware v1.2            ║
 * ║   MQ-135 + DHT22 + RGY LEDs + Buzzer Alarm      ║
 * ╚══════════════════════════════════════════════════╝
 *
 * Device ID : AIR-4A8F31
 * API Key   : ask_live_094169bee1e6eaa60891c9de1823e12d
 *
 * Libraries required:
 *   - DHT sensor library by Adafruit
 *   - Adafruit Unified Sensor
 *   - ArduinoJson by Benoit Blanchon (v6+)
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
const unsigned long SEND_INTERVAL_MS = 5000;  // Send every 5 seconds

// ─── Globals ─────────────────────────────────────────────────────────────────
DHT dht(DHT_PIN, DHT_TYPE);
unsigned long lastSendTime = 0;

void setAirQualityIndicators(int rawMQ135) {
  if (rawMQ135 < THRESHOLD_MODERATE) {
    // 🟢 GOOD AIR
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  } 
  else if (rawMQ135 < THRESHOLD_POOR) {
    // 🟡 MODERATE AIR
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  } 
  else {
    // 🔴 POOR AIR / SMOKE DETECTED
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);
    
    // Buzzer alert tone
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n╔══════════════════════════════════════╗");
  Serial.println("║     AirSense ESP32 + RGY & Buzzer    ║");
  Serial.println("╚══════════════════════════════════════╝");

  // Initialize LED & Buzzer Pins
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Self-test startup sequence: flash each light
  digitalWrite(LED_GREEN, HIGH);
  delay(200);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);
  delay(200);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, HIGH);
  delay(200);
  digitalWrite(LED_RED, LOW);

  dht.begin();

  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true);
  delay(200);

  Serial.printf("[WiFi] Connecting to exact SSID: '%s'...\n", WIFI_SSID);
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
    digitalWrite(LED_GREEN, HIGH); // Green light on when connected
  } else {
    Serial.println("\n[WiFi] Connection FAILED.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // Constantly update indicators in real-time
  int rawMQ135 = analogRead(MQ135_PIN);
  setAirQualityIndicators(rawMQ135);

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
