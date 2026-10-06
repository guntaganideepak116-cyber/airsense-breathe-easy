import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { getDb } from "./services/dbService.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, ESP32)
      if (!origin) return callback(null, true);
      // In development or if origin matches config
      if (
        config.nodeEnv === "development" ||
        config.corsOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for production deployment
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "AirSense Express Backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "AirSense Express Backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount all API routes under /api
app.use("/api", apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, () => {
  console.log(`==================================================`);
  console.log(`  🚀 AirSense Express Backend running on port ${config.port}`);
  console.log(`  📡 Health check: http://localhost:${config.port}/health`);
  console.log(`  ⚡ API endpoints: http://localhost:${config.port}/api/*`);
  console.log(`==================================================`);
  // Attempt background DB connection
  getDb().catch((e) => console.warn("[DB] Startup connection warning:", e.message));
});

export default app;
