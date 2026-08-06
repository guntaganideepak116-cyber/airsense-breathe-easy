# AirSense: Breathe Easy

You are building a production-grade web application called "AirSense" — an Indoor Air Quality Monitoring & Alert platform for classrooms, homes, and hostels, targeting families and schools in Andhra Pradesh and Telangana. This is a real product, not a demo template. Avoid generic SaaS dashboard aesthetics (no default blue-gradient hero, no stock "empower your business" copy, no cookie-cutter Bootstrap cards). The visual identity should feel calm, clean, and health-focused — think clinical trustworthiness combined with warmth: soft sky blues, clean whites, sage green for "good" states, amber/coral for warning states — avoiding cold, corporate, or alarmist design.

Tech Requirements

Next.js (App Router), TypeScript, Tailwind CSS

TanStack Query for data fetching/caching

PWA-ready: installable, offline-capable, push notification support (Workbox)

Fully responsive, mobile-first

Auth via Clerk (email/phone login)

Default language: Telugu, with an English toggle (see localization section below)

Pages & Sections Required

1. Landing Page (public, unauthenticated) — Master-level, professional, distinctive

Hero section: headline framed around the real problem — indoor air quality is invisible and unmonitored, directly affecting children's health and focus in AP/Telangana specifically (seasonal crop burning, dust, traffic emissions). Avoid vague "AI-powered platform" language — be concrete and human.

"The Invisible Problem" section: a visually compelling explainer (custom illustration or abstract graphic representing unseen pollutants in a room) — communicate that a room can "feel fine" while air quality is actually poor

"How It Works" section: 3-4 step visual flow — Sensor monitors room air → Instant local alert (buzzer/LED) if air turns poor → Live data streams to dashboard → Parent/teacher can check any room remotely

Live dashboard preview section: a realistic static mockup of the actual dashboard (Good/Moderate/Poor gauge, temperature/humidity, live chart) — builds credibility before signup

Impact/comparison section: a clean visual/table contrasting this solution against existing methods — no monitoring at all (status quo), expensive commercial monitors (₹3,000-15,000+), city-wide government AQI apps that don't reflect indoor reality — positioning this as affordable, hyper-local, and actionable

Features grid: Real-time room monitoring, Instant local alerts, Remote dashboard access, Works via app or website, Historical trend tracking, Telugu-first accessibility

Use-case section: 2-3 realistic scenarios (a classroom during exam season, a child's bedroom, a hostel common room) — clearly framed as illustrative, not real testimonials

Strong footer with clear CTA to sign up

Build a distinctive visual identity — consider a subtle animated "breathing room" motif (e.g., a soft pulsing illustration representing air circulation) rather than generic dashboard screenshots as the hero visual

2. Auth Pages

Clerk-powered sign in/sign up, styled to match the calm, clinical-but-warm brand — not Clerk's default look

3. Main Dashboard (authenticated, /dashboard)

Primary air quality status card: large, prominent Good/Moderate/Poor indicator (color-coded: green/amber/red) with the underlying MQ135 reading shown as supporting detail, not the headline number itself (the classification should be the star, since that's what's actually understandable)

Temperature & Humidity card: live DHT22 readings, each with a comfort-range indicator

Room/Device info: device name (editable, e.g. "Classroom 4B" or "Deepak's Room"), connection status (Online/Offline), last updated timestamp

Alert status: clear indicator if buzzer/alert was recently triggered, with timestamp of last "Poor" air event

Quick action guidance card: contextual advice based on current status — e.g., "Air quality is Moderate — consider opening a window" — dynamic text, not static

4. History/Trends Page (/dashboard/history)

Line/area chart of air quality classification and raw sensor values over time (24h / 7 days / 30 days toggle)

Temperature & humidity trend charts

Event log: timestamped list of every time air crossed into "Poor" status

Simple insight callouts (e.g., "Air quality tends to worsen between 4-6 PM" if the pattern is detectable from data — can be a simple rule-based observation, not require ML)

5. Multi-Room/Multi-Device View (/dashboard/rooms) — if user has more than one device

Card grid showing all monitored rooms/devices at a glance, each with current status color

Click into any room to see its individual dashboard/history

6. Settings Page (/dashboard/settings)

Notification preferences (push alert on/off, threshold customization if desired)

Device management (rename, remove device, add new device)

Language toggle (Telugu/English) — also accessible from main nav

Account settings (via Clerk)

7. PWA Requirements (critical — don't skip)

Full manifest.json: app name "AirSense", theme color matching brand, icons (192/512), display: standalone

Custom install prompt banner (not just relying on browser default)

Push notification permission request flow with clear explanation before asking ("Get notified the moment air quality turns poor in a monitored room")

Offline fallback: dashboard shows last cached reading with a clear "Offline — showing last known data from [time]" banner

Service worker caching: cache-first for static assets, network-first (fallback to cache) for live sensor data

Localization — Telugu Default

Entire app defaults to Telugu (తెలుగు) on first load; English available via toggle in navbar/settings

ALL text must be translated — landing page, dashboard labels, status names ("Good"→"బాగుంది", "Moderate"→"మధ్యస్థం", "Poor"→"పేలవం"), settings, error/confirmation messages

Push notifications always sent in Telugu, regardless of current UI language setting, since these are time-critical alerts (e.g., "గదిలో గాలి నాణ్యత పేలవంగా ఉంది — కిటికీ తెరవండి" = "Air quality in the room is poor — open a window")

Use a font that renders Telugu cleanly (Noto Sans Telugu) alongside your Latin UI font

Keep numeric values (temperature, humidity %, sensor readings) in standard numerals even in Telugu mode — translate labels only, not numerals

API Integration Expectations (backend will expose these — build frontend to consume them)

GET /api/device/latest — current air quality classification, raw sensor values, temp/humidity, status

GET /api/device/stream — SSE endpoint for real-time push updates

GET /api/device/history?range=24h|7d|30d — historical data for charts

GET /api/devices — list of all devices/rooms belonging to the user

POST /api/devices — register a new device/room

PATCH /api/devices/:id — rename/update a device

POST /api/push/subscribe / POST /api/push/unsubscribe

All authenticated routes require Clerk session token in headers

Design System Direction

Typography: clean modern sans-serif (Inter/Geist) for UI; consider a calmer, more humanist display font for the landing page headline

Color palette: sky blue (primary/trust), sage green (good status), amber (moderate status), soft coral/red (poor status — not harsh alarm-red, keep it calm even when warning) — avoid default Tailwind indigo/violet as brand color

Micro-interactions: smooth color transitions when status changes, gentle pulse animation on the primary status card to feel "alive" with real-time data

Iconography: airy, breath/circulation-themed custom icons where possible rather than generic dashboard icon packs

Build this as a complete, cohesive, production-quality application — every page should feel finished, intentional, and trustworthy (this is health-adjacent data, so polish and clarity matter more than flashiness).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6fb39352-bbf3-479d-99ba-d2f3d5151476).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
