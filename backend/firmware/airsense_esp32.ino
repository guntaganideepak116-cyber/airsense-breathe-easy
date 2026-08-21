/*
 * ======================================================================================
 * AirSense ESP32 Hardware Firmware (v1.4.2)
 * 
 * Hardware Requirements:
 * 1. ESP32 Dev Module
 * 2. MQ-135 Air Quality Sensor (Analog out connected to GPIO 34)
 * 3. DHT22 Temperature & Humidity Sensor (Data pin connected to GPIO 4)
 * 4. Active Buzzer / Piezo Speaker (Positive pin connected to GPIO 18)
 * 5. LED Indicator (GPIO 2 - Built-in LED)
 * 
 * Libraries Required (Install via Arduino Library Manager):
 * - ArduinoJson by Benoit Blanchon (v6.x or v7.x)
 * - DHT sensor library by Adafruit
 * ======================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// --------------------------------------------------------------------------------------
// Configuration — Update your Wi-Fi credentials & AirSense API Key
// --------------------------------------------------------------------------------------
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// AirSense Backend Telemetry URL (e.g., http://192.168.1.100:5000/api/telemetry or Render URL)
const char* BACKEND_URL = "http://192.168.1.100:5000/api/telemetry";

// Your Device ID & API Key (Minted from AirSense Dashboard -> Rooms -> Add Room)
const char* DEVICE_ID = "dev-4b";
const char* API_KEY   = "ask_classroom_4b_key";

// Send telemetry every 10 seconds (10000 ms)
const unsigned long TELEMETRY_INTERVAL = 10000;

// --------------------------------------------------------------------------------------
// Hardware Pin Definitions
// --------------------------------------------------------------------------------------
#define MQ135_PIN 34    // Analog Pin for MQ-135 Air Sensor
#define DHT_PIN   4     // Digital Pin for DHT22 Sensor
#define BUZZER_PIN 18   // Pin for Local Alarm Buzzer
#define LED_PIN    2    // Built-in Status LED

#define DHTTYPE DHT22
DHT dht(DHT_PIN, DHTTYPE);

unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("  AirSense Indoor Air Quality Sensor (ESP32)");
  Serial.println("==================================================");

  pinMode(MQ135_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  dht.begin();

  // Connect to Wi-Fi
  connectWiFi();
}

void loop() {
  // Ensure Wi-Fi connection remains active
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Periodic Telemetry Send
  if (millis() - lastSendTime >= TELEMETRY_INTERVAL) {
    lastSendTime = millis();
    sendTelemetry();
  }
}

void connectWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // Flash LED while connecting
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println("\n❌ Wi-Fi Connection Failed. Retrying in next cycle...");
    digitalWrite(LED_PIN, LOW);
  }
}

void sendTelemetry() {
  // Read MQ135 Raw ADC Value and convert to estimated PPM
  int rawAnalog = analogRead(MQ135_PIN);
  float mq135Ppm = map(rawAnalog, 0, 4095, 200, 1000); // Analog map for demo calibration

  // Read DHT22 Temperature & Humidity
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // Fallback defaults if sensor reading returns NaN
  if (isnan(temp)) temp = 28.5;
  if (isnan(hum)) hum = 50.0;

  int rssi = WiFi.RSSI();
  unsigned long uptimeSec = millis() / 1000;

  Serial.println("\n--------------------------------------------------");
  Serial.printf("📊 Sensor Readings — MQ135: %.0f ppm | Temp: %.1f °C | Humidity: %.0f %%\n", mq135Ppm, temp, hum);

  // Prepare HTTP POST
  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", API_KEY);

  // Build JSON Payload
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["mq135"] = mq135Ppm;
  doc["temperature"] = temp;
  doc["humidity"] = hum;
  doc["rssi"] = rssi;
  doc["uptimeSec"] = uptimeSec;
  doc["firmware"] = "1.4.2";

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("✅ Server Response (%d):\n%s\n", httpCode, response.c_str());

    // Parse Server Response for Alarm/Buzzer Trigger
    StaticJsonDocument<512> respDoc;
    DeserializationError err = deserializeJson(respDoc, response);

    if (!err) {
      bool buzzerActive = respDoc["reading"]["buzzerActive"] | false;
      const char* status = respDoc["reading"]["status"] | "good";

      if (buzzerActive || String(status) == "poor") {
        Serial.println("🚨 ALERT: Air Quality is POOR! Sounding local buzzer...");
        soundAlarm();
      } else {
        digitalWrite(BUZZER_PIN, LOW);
      }
    }
  } else {
    Serial.printf("❌ HTTP POST Failed. Error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

void soundAlarm() {
  // Beep pattern for local notification
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    digitalWrite(LED_PIN, LOW);
    delay(150);
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_PIN, HIGH);
    delay(150);
  }
}
