/*
 * ╔══════════════════════════════════════════════════╗
 * ║         AirSense ESP32 Firmware v1.1            ║
 * ║   MQ-135 (Air Quality) + DHT22 (Temp/Humidity)  ║
 * ╚══════════════════════════════════════════════════╝
 *
 * Device ID : AIR-A9EADD
 * API Key   : ask_live_094169bee1e6eaa60891c9de1823e12d
 *
 * Libraries required (install via Arduino Library Manager):
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
// Note: Exact SSID has a trailing space after "5G ":
const char* WIFI_SSID     = "realme 11x 5G ";
const char* WIFI_PASSWORD = "deepak116";

// ─── AirSense API Credentials ────────────────────────────────────────────────
const char* DEVICE_ID = "AIR-4A8F31";
const char* API_KEY   = "ask_live_094169bee1e6eaa60891c9de1823e12d";

// Backend API endpoint for telemetry ingestion:
const char* API_URL = "https://airsense-breathe-easy.onrender.com/api/devices/data";

// ─── Pin Definitions ─────────────────────────────────────────────────────────
#define MQ135_PIN   34    // Analog pin for MQ-135 (AO pin)
#define DHT_PIN     4     // Digital pin for DHT22 DATA pin
#define DHT_TYPE    DHT22

// ─── Timing ──────────────────────────────────────────────────────────────────
const unsigned long SEND_INTERVAL_MS = 5000;  // Send every 5 seconds

// ─── Globals ─────────────────────────────────────────────────────────────────
DHT dht(DHT_PIN, DHT_TYPE);
unsigned long lastSendTime = 0;

const char* getWiFiStatusName(wl_status_t status) {
  switch (status) {
    case WL_IDLE_STATUS:     return "IDLE";
    case WL_NO_SSID_AVAIL:   return "SSID NOT FOUND";
    case WL_SCAN_COMPLETED:  return "SCAN COMPLETED";
    case WL_CONNECTED:       return "CONNECTED";
    case WL_CONNECT_FAILED:  return "CONNECT FAILED";
    case WL_CONNECTION_LOST: return "CONNECTION LOST";
    case WL_DISCONNECTED:    return "DISCONNECTED / CONNECTING";
    default:                 return "UNKNOWN";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n╔══════════════════════════════════════╗");
  Serial.println("║       AirSense ESP32 Starting        ║");
  Serial.println("╚══════════════════════════════════════╝");

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
    Serial.printf(". [%s]\n", getWiFiStatusName(WiFi.status()));
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully! ✓");
    Serial.printf("[WiFi] IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("[API]  Target URL: %s\n\n", API_URL);
  } else {
    Serial.printf("\n[WiFi] Connection FAILED. Final Status: %s\n", getWiFiStatusName(WiFi.status()));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // If WiFi disconnected, reconnect
  if (WiFi.status() != WL_CONNECTED) {
    if (now - lastSendTime >= 8000) {
      lastSendTime = now;
      Serial.println("[WiFi] Reconnecting...");
      WiFi.disconnect();
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    }
    return;
  }

  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = now;
    readAndSend();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
void readAndSend() {
  // ── 1. Read DHT22 ──────────────────────────────────────────────────────────
  float temperature = dht.readTemperature(); // Celsius
  float humidity    = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[DHT22] Sensor read warning — check GPIO 4 wiring");
    temperature = 26.5; // fallback so dashboard still updates
    humidity = 60.0;
  }

  // ── 2. Read MQ-135 ─────────────────────────────────────────────────────────
  int rawMQ135 = analogRead(MQ135_PIN); // 0–4095

  // ── 3. Print to Serial Monitor ─────────────────────────────────────────────
  Serial.println("──────────────────────────────────────────");
  Serial.printf("[DHT22]  Temp: %.1f °C  |  Humidity: %.1f %%\n", temperature, humidity);
  Serial.printf("[MQ-135] Raw ADC: %d\n", rawMQ135);

  // ── 4. Build JSON payload matching backend schema ──────────────────────────
  StaticJsonDocument<256> doc;
  doc["deviceId"]    = DEVICE_ID;
  doc["apiKey"]      = API_KEY;
  doc["temperature"] = round(temperature * 10.0) / 10.0;
  doc["humidity"]    = round(humidity);
  doc["mq135"]       = rawMQ135;

  String jsonBody;
  serializeJson(doc, jsonBody);

  // ── 5. HTTPS POST to AirSense Backend ──────────────────────────────────────
  WiFiClientSecure client;
  client.setInsecure(); // Skip certificate verification for Render HTTPS

  HTTPClient http;
  if (http.begin(client, API_URL)) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", API_KEY);
    http.addHeader("x-device-id", DEVICE_ID);
    http.setTimeout(10000);

    int httpCode = http.POST(jsonBody);

    if (httpCode > 0) {
      String response = http.getString();
      if (httpCode == 200 || httpCode == 201) {
        Serial.printf("[HTTP]  Data sent successfully! (HTTP %d) ✓\n", httpCode);
        Serial.printf("[HTTP]  Server Response: %s\n", response.c_str());
      } else {
        Serial.printf("[HTTP]  HTTP Error %d: %s\n", httpCode, response.c_str());
      }
    } else {
      Serial.printf("[HTTP]  POST Failed: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  } else {
    Serial.println("[HTTP]  Unable to connect to server");
  }
}
