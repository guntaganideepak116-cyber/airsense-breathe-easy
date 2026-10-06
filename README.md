# AirSense — IoT Indoor Air Quality Monitoring System

A production-grade indoor air quality monitoring platform for classrooms, homes, and hostels in Andhra Pradesh & Telangana. Built with real ESP32 hardware, MongoDB, TanStack Start, Clerk Auth, and real-time SSE streaming.


---

## Architecture Overview

```
ESP32 (MQ-135 + DHT22)
    │  POST /api/devices/data  (deviceId + apiKey in body)
    ▼
TanStack Start Server (Node.js / Nitro)
    │  Validates API key hash → saves to MongoDB → emits SSE
    ▼
MongoDB (Atlas or local)
    │  sensorReadings · devices · alerts · userPreferences
    ▼
React Dashboard (SSE stream + React Query polling)
    │  /api/device/:id/stream  →  live readings
    ▼
WhatsApp (Twilio) + Email (Resend) → Alert Notifications
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+ (or Bun)
- MongoDB — local `mongod` **or** free [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Clerk account](https://clerk.com) (free tier)

### 1. Clone & Install

```sh
git clone <this-repository-url>
cd airsense-breathe-easy
npm install
```

### 2. Configure Environment Variables

```sh
cp .env.example .env
```

Edit `.env`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/airsense

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# WhatsApp Alerts — optional
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ALERT_TO_WHATSAPP=whatsapp:+919876543210

# Email Alerts — optional
RESEND_API_KEY=re_xxxx
ALERT_FROM_EMAIL=AirSense Alerts <alerts@yourdomain.com>
ALERT_TO_EMAIL=you@example.com
```

### 3. Start Development Server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ESP32 Firmware

### Hardware Required

| Component | Purpose |
|-----------|---------|
| ESP32 DevKit v1 | Microcontroller with Wi-Fi |
| MQ-135 Gas Sensor | Air quality / contamination detection |
| DHT22 (AM2302) | Temperature & relative humidity |
| Active Buzzer | Local audio alert when air is Poor |
| LED (optional) | Visual alert indicator |

### Wiring Diagram

```
ESP32 Pin    →   Component
─────────────────────────────────────────
GPIO34 (ADC) →   MQ-135  AOUT
GPIO4        →   DHT22   DATA
GPIO2        →   Buzzer  (+)
3.3V         →   MQ-135 VCC, DHT22 VCC
GND          →   GND (common ground)
```

### Arduino Sketch

Install via Library Manager:
- `DHT sensor library` by Adafruit
- `ArduinoJson` by Benoit Blanchon
- `HTTPClient` (built-in with ESP32 Arduino core)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ── Configuration ──────────────────────────────────────────
const char* WIFI_SSID     = "YourWiFiSSID";
const char* WIFI_PASSWORD = "YourWiFiPassword";
const char* SERVER_URL    = "https://your-airsense-app.vercel.app/api/devices/data";
const char* DEVICE_ID     = "AIR-XXXXXX";    // from dashboard
const char* API_KEY       = "ask_live_...";  // from dashboard (saved once)

// ── Pin Definitions ────────────────────────────────────────
#define MQ135_PIN    34
#define DHT_PIN       4
#define BUZZER_PIN    2
#define DHT_TYPE    DHT22

DHT dht(DHT_PIN, DHT_TYPE);

#define MQ135_POOR_THRESHOLD  700   // matches server classification
#define SEND_INTERVAL_MS     5000   // report every 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  // MQ-135 warm-up (recommended 60 seconds for accuracy)
  Serial.println("Warming up MQ-135 (60 seconds)...");
  delay(60000);
}

void loop() {
  int mq135Raw        = analogRead(MQ135_PIN);
  float temperature   = dht.readTemperature();
  float humidity      = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT read failed, retrying...");
    delay(2000);
    return;
  }

  // Local buzzer alert
  bool poorAir = mq135Raw >= MQ135_POOR_THRESHOLD;
  digitalWrite(BUZZER_PIN, poorAir ? HIGH : LOW);

  Serial.printf("MQ135: %d | Temp: %.1fC | Hum: %.0f%% | %s\n",
    mq135Raw, temperature, humidity, poorAir ? "POOR" : "OK");

  // POST reading to AirSense server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["deviceId"]    = DEVICE_ID;
    doc["apiKey"]      = API_KEY;
    doc["mq135"]       = mq135Raw;
    doc["temperature"] = temperature;
    doc["humidity"]    = humidity;

    String body;
    serializeJson(doc, body);

    int httpCode = http.POST(body);
    Serial.printf("Server response: HTTP %d\n", httpCode);
    http.end();
  } else {
    Serial.println("Wi-Fi lost, reconnecting...");
    WiFi.reconnect();
  }

  delay(SEND_INTERVAL_MS);
}
```

### Device Registration Steps

1. Sign in to your AirSense dashboard
2. Go to **Rooms & Devices** → click **Add Room**
3. Enter a name (e.g. "Classroom 4B")
4. **Copy and save** the `Device ID` and `API Key` shown — the key is shown **only once**
5. Paste both values into `DEVICE_ID` and `API_KEY` in the sketch above
6. Flash the ESP32 — sensor data appears on the dashboard within seconds

---

## API Reference

### `POST /api/devices/data` — Submit a Sensor Reading (ESP32 → Server)

**Request Body:**
```json
{
  "deviceId": "AIR-8F3D12",
  "apiKey": "ask_live_abc123...",
  "mq135": 523,
  "temperature": 28.4,
  "humidity": 72
}
```

**Response 200:**
```json
{
  "success": true,
  "deviceId": "AIR-8F3D12",
  "receivedAt": "2025-10-06T07:00:00.000Z",
  "status": "moderate",
  "buzzerActive": false
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 200 | Reading accepted and stored |
| 400 | Missing/invalid field |
| 401 | Unknown device ID or wrong API key |
| 500 | Server error |

### Other Server Endpoints (Dashboard → Server)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/devices` | Clerk | List all user's devices |
| POST | `/api/devices` | Clerk | Register new device |
| PATCH | `/api/devices/:id` | Clerk | Rename device |
| DELETE | `/api/devices/:id` | Clerk | Remove device |
| GET | `/api/device/latest?deviceId=` | — | Latest reading from DB |
| GET | `/api/device/:id/stream` | — | SSE live reading stream |
| GET | `/api/device/history?deviceId=&range=` | — | Historical data (24h/7d/30d) |
| GET | `/api/weather?lat=&lon=` | — | Outdoor AQI via Open-Meteo |
| GET | `/api/user/alert-preferences` | Clerk | Get notification prefs |
| PATCH | `/api/user/alert-preferences` | Clerk | Update notification prefs |

---

## Air Quality Classification

| MQ-135 Raw Value | Status | Telugu | Action |
|-----------------|--------|--------|--------|
| 0 – 399 | 🟢 Good | బాగుంది | Normal |
| 400 – 699 | 🟡 Moderate | మధ్యస్థం | Open windows |
| 700+ | 🔴 Poor | పేలవం | Buzzer fires, alerts sent |

---

## Alert System

| Channel | Provider | Cooldown |
|---------|----------|---------|
| WhatsApp | Twilio | 15 min/device |
| Email | Resend | 15 min/device |
| Browser Push | Web Push API | 15 min/device |
| Local Buzzer | ESP32 firmware | Immediate / continuous |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React 19 + Nitro SSR) |
| Styling | Tailwind CSS v4 |
| Auth | Clerk |
| Database | MongoDB (Atlas or local) |
| Real-time | Server-Sent Events (SSE) |
| Alerts | Twilio WhatsApp + Resend Email + Web Push |
| Outdoor AQI | Open-Meteo (free, no API key required) |
| Hosting | Vercel / Node.js server |

---

## Deployment

```sh
npm run build
node .output/server/index.mjs
```

Set all variables from `.env.example` in your hosting platform's environment config. MongoDB Atlas M0 free tier is sufficient for classroom-scale deployments.
