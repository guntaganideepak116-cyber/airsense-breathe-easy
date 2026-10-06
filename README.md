# 🍃 AirSense — Production IoT Air Quality Monitoring System

A full-stack, enterprise-grade IoT Indoor Air Quality (IAQ) monitoring platform featuring real-time MQ-135 telemetry streaming, intelligent AI ventilation advice, WhatsApp & Email alert dispatching, and interactive room diagnostics.

---

## 🏗️ Architecture Overview

The repository is organized into a clean, two-directory production structure:

```
AirSense/
├── frontend/                     # 🌐 Client Application (React 19 + TanStack Router + TailwindCSS)
│   ├── src/
│   │   ├── client/               # UI components, Radix primitives, styling & state
│   │   ├── shared/               # Shared domain calculations (AQI formulas, status mapping)
│   │   ├── routes/               # Page routes & dashboard layouts
│   │   ├── router.tsx            # Client routing configuration
│   │   └── styles.css            # Tailwind CSS design system tokens
│   ├── public/                   # Static assets, icons, service worker & PWA manifest
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.ts            # Vite bundler configuration & dev API proxy
│   └── tsconfig.json             # TypeScript config with @client/* and @shared/* aliases
│
├── backend/                      # ⚡ Production Express API & Telemetry Engine
│   ├── src/
│   │   ├── config/               # Environment configuration & credential validation
│   │   ├── controllers/          # Request handlers (devices, telemetry, weather, user, AI)
│   │   ├── middleware/           # Clerk authentication & error handling middleware
│   │   ├── models/               # TypeScript data models & schemas
│   │   ├── routes/               # Modular Express API routers
│   │   ├── services/             # Core business services (MongoDB, Twilio, Resend, SSE, AI)
│   │   └── server.ts             # Express application entrypoint
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # Backend TypeScript configuration
│
├── package.json                  # Root workspace scripts
├── .gitignore                    # Comprehensive multi-project gitignore
└── README.md                     # Monorepo documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** >= 20.x
- **npm** >= 10.x
- **MongoDB Atlas** database URI
- **Clerk** account (for authentication)
- **Twilio** account (optional, for WhatsApp & SMS alerts)
- **Resend** account (optional, for email alerts)

---

### 2. Installation

Install dependencies for both projects:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

---

### 3. Environment Variables

#### Backend (`backend/.env`)
Create a `backend/.env` file (reference `backend/.env.example`):

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:5173

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/airsense?retryWrites=true&w=majority

# Clerk Authentication (Secret Key)
CLERK_SECRET_KEY=sk_test_...

# Twilio (WhatsApp & SMS Alerts)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ALERT_TO_WHATSAPP=whatsapp:+919876543210

# Resend (Email Alerts)
RESEND_API_KEY=re_...
ALERT_FROM_EMAIL=AirSense Alerts <onboarding@resend.dev>
ALERT_TO_EMAIL=you@example.com

# Web Push
VAPID_PUBLIC_KEY=BC0tP9HcEj-bSuhYwLbgpWisPjznZkaeB2EyCsuYcL1EYpKWNxKdu9woqh6wS50zQmTQ7cazExdySR4Pe9h4aqA
```

#### Frontend (`frontend/.env`)
Create a `frontend/.env` file (reference `frontend/.env.example`):

```env
# Backend API Base URL (leave blank in local dev to use Vite proxy, or set to your Express URL)
VITE_API_URL=http://localhost:5000

# Clerk Authentication (Publishable Key for Client UI)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

### 4. Running Locally

You can run both services independently or from root:

#### Run Backend (Terminal 1)
```bash
npm run dev:backend
# or
cd backend && npm run dev
# Server runs on: http://localhost:5000
```

#### Run Frontend (Terminal 2)
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
# Web app runs on: http://localhost:3000 (or http://localhost:5173)
```

---

## 📡 ESP32 Hardware Integration

ESP32 microcontroller firmware posts readings directly to the backend ingestion endpoint:

- **Endpoint:** `POST http://<BACKEND_HOST>:5000/api/devices/data` (or `/api/device/data`)
- **Headers:**
  - `Content-Type: application/json`
  - `x-device-id: AIR-8F3D12`
  - `x-api-key: ask_live_...`
- **Payload:**
  ```json
  {
    "deviceId": "AIR-8F3D12",
    "apiKey": "ask_live_...",
    "mq135": 482,
    "temperature": 27.4,
    "humidity": 58
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "deviceId": "AIR-8F3D12",
    "receivedAt": "2026-10-06T08:00:00.000Z",
    "status": "moderate",
    "buzzerActive": false
  }
  ```

---

## 🧠 AI Recommendation Engine

The backend includes a dedicated AI analysis engine:
- `GET /api/ai/recommendations?mq135=720&temperature=29&humidity=65`
- `POST /api/ai/analyze` with sensor data payload.
Returns:
- **Overall Health Score** (0–100)
- **Ventilation Strategy** (`open_windows`, `keep_closed_run_purifier`, `run_dehumidifier`, or `normal`)
- **Sensitive Group Guidance** (customized for Children, Asthma patients, Elderly, and Pregnancy)
- **Smart Actions List** based on real-time contamination levels.

---

## 🚢 Production Deployment

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Set the root directory of your project to `frontend`.
2. Build Command: `npm run build`
3. Output Directory: `.output/public` or `dist`
4. Environment Variables:
   - `VITE_API_URL=https://your-backend-service.railway.app`
   - `VITE_CLERK_PUBLISHABLE_KEY=pk_live_...`

### Backend Deployment (Railway / Render / Fly.io / Docker)
1. Set the root directory of your service to `backend`.
2. Build Command: `npm run build`
3. Start Command: `npm run start`
4. Environment Variables:
   - Configure all variables from `backend/.env.example` including `MONGODB_URI`, `CLERK_SECRET_KEY`, `TWILIO_*`, and `RESEND_*`.
