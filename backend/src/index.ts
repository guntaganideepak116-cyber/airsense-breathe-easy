import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router as deviceRouter } from "./routes/deviceRoutes.js";
import { startOfflineChecker } from "./services/offlineChecker.js";

dotenv.config();

// Prevent Mongoose from buffering queries indefinitely when database is disconnected
mongoose.set("bufferCommands", false);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/airsense";

// Configure CORS for cross-origin requests from frontend deployment & dev servers
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:8081", "http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, ESP32 hardware, curl)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS fallback for development & deployment
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  })
);

app.use(express.json());

// Initialize Clerk Auth Middleware if credentials are provided in .env
if (process.env.CLERK_SECRET_KEY) {
  try {
    const { clerkMiddleware } = await import("@clerk/express");
    app.use(clerkMiddleware());
    console.log("🔐 Clerk Authentication Middleware initialized!");
  } catch {
    console.warn("⚠️ @clerk/express import failed — running with optional auth.");
  }
}

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "AirSense Node.js Express Backend",
    mongoStatus: mongoose.connection.readyState === 1 ? "connected" : "standby_memory_mode",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", deviceRouter);

// Connect to MongoDB Atlas or local MongoDB
async function startServer() {
  try {
    console.log("Connecting to MongoDB Database...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("✅ Successfully connected to MongoDB Database!");
  } catch (error) {
    console.warn("⚠️ Database Connection Note:", (error as Error).message);
    console.warn("⚡ Running in Standby Memory Mode. Update MONGODB_URI in .env to persist to MongoDB Atlas.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 AirSense Express Server running on http://localhost:${PORT}`);
    console.log(`📡 SSE stream ready at http://localhost:${PORT}/api/device/:id/stream`);
    console.log(`⚡ Hardware Telemetry endpoint ready at POST http://localhost:${PORT}/api/telemetry`);
    startOfflineChecker();
  });
}

startServer();
