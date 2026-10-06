import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface DeviceDoc {
  _id?: ObjectId;
  deviceId: string; // e.g. "AIR-8F3D12"
  name: string; // Room name, e.g. "Classroom 4B"
  userId: string; // Clerk userId
  apiKeyHash: string; // SHA-256 hash of API key
  apiKeyPrefix: string; // e.g. "ask_live_8f..."
  status: "online" | "offline" | "never_connected";
  lastSeen: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensorReadingDoc {
  _id?: ObjectId;
  deviceId: string;
  userId?: string;
  roomName?: string;
  mq135: number;
  temperature: number;
  humidity: number;
  status: "good" | "moderate" | "poor";
  buzzerActive: boolean;
  timestamp: Date;
}

export interface AlertDoc {
  _id?: ObjectId;
  deviceId: string;
  userId?: string;
  roomName: string;
  mq135: number;
  temperature: number;
  humidity: number;
  threshold: number;
  severity: "warning" | "critical";
  status: "active" | "resolved";
  channelsSent: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  timestamp: Date;
  resolvedAt?: Date | null;
}

export interface UserPreferencesDoc {
  _id?: ObjectId;
  userId: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  alertChannels: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  threshold: number;
  updatedAt: Date;
}

export interface SystemLogDoc {
  _id?: ObjectId;
  event: string;
  deviceId?: string;
  userId?: string;
  level: "info" | "warn" | "error";
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let isConnected = false;

// In-memory fallback stores (used only if MongoDB is unreachable or MONGODB_URI not provided)
// NEVER filled with mock data: only stores real user interactions when DB is connecting or offline
const memDevices = new Map<string, DeviceDoc>();
const memReadings: SensorReadingDoc[] = [];
const memAlerts: AlertDoc[] = [];
const memPreferences = new Map<string, UserPreferencesDoc>();
const memLogs: SystemLogDoc[] = [];

export async function getDb(): Promise<Db | null> {
  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    return null;
  }

  if (db && isConnected) return db;

  if (isConnecting) {
    // Wait for in-flight connection attempt
    let waitCount = 0;
    while (isConnecting && waitCount < 30) {
      await new Promise((r) => setTimeout(r, 100));
      waitCount++;
    }
    if (db && isConnected) return db;
  }

  try {
    isConnecting = true;
    if (!client) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 5000,
      });
    }
    await client.connect();
    db = client.db();
    isConnected = true;
    isConnecting = false;

    // Initialize indexes in the background
    initIndexes(db).catch((e) => console.warn("Index initialization warning:", e.message));

    return db;
  } catch (err: unknown) {
    isConnecting = false;
    isConnected = false;
    console.warn(
      `[AirSense DB] MongoDB connection failed (${
        err instanceof Error ? err.message : String(err)
      }). Using real-time memory buffer.`,
    );
    return null;
  }
}

async function initIndexes(database: Db) {
  try {
    await database.collection("devices").createIndex({ deviceId: 1 }, { unique: true });
    await database.collection("devices").createIndex({ userId: 1 });
    await database.collection("sensorReadings").createIndex({ deviceId: 1, timestamp: -1 });
    await database.collection("sensorReadings").createIndex({ timestamp: -1 });
    await database.collection("alerts").createIndex({ deviceId: 1, timestamp: -1 });
    await database.collection("userPreferences").createIndex({ userId: 1 }, { unique: true });
    await database.collection("systemLogs").createIndex({ timestamp: -1 });
  } catch (e: unknown) {
    console.warn("Index creation skipped:", e instanceof Error ? e.message : e);
  }
}

// ── Database Access Service ──
export const dbService = {
  async getDevices(userId: string): Promise<DeviceDoc[]> {
    const database = await getDb();
    if (database) {
      try {
        return (await database
          .collection<DeviceDoc>("devices")
          .find({ userId })
          .toArray()) as DeviceDoc[];
      } catch (err) {
        console.warn("Error fetching devices from MongoDB:", err);
      }
    }
    return Array.from(memDevices.values()).filter((d) => d.userId === userId);
  },

  async getDeviceById(deviceId: string): Promise<DeviceDoc | null> {
    const database = await getDb();
    if (database) {
      try {
        return await database.collection<DeviceDoc>("devices").findOne({ deviceId });
      } catch (err) {
        console.warn("Error finding device in MongoDB:", err);
      }
    }
    return memDevices.get(deviceId) ?? null;
  },

  async createDevice(device: DeviceDoc): Promise<DeviceDoc> {
    const database = await getDb();
    if (database) {
      try {
        await database.collection<DeviceDoc>("devices").insertOne(device);
        return device;
      } catch (err) {
        console.warn("Error creating device in MongoDB:", err);
      }
    }
    memDevices.set(device.deviceId, device);
    return device;
  },

  async updateDevice(
    deviceId: string,
    userId: string,
    patch: Partial<DeviceDoc>,
  ): Promise<boolean> {
    const database = await getDb();
    if (database) {
      try {
        const res = await database
          .collection<DeviceDoc>("devices")
          .updateOne({ deviceId, userId }, { $set: { ...patch, updatedAt: new Date() } });
        return res.matchedCount > 0;
      } catch (err) {
        console.warn("Error updating device in MongoDB:", err);
      }
    }
    const existing = memDevices.get(deviceId);
    if (existing && existing.userId === userId) {
      memDevices.set(deviceId, { ...existing, ...patch, updatedAt: new Date() });
      return true;
    }
    return false;
  },

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    const database = await getDb();
    if (database) {
      try {
        const res = await database.collection<DeviceDoc>("devices").deleteOne({ deviceId, userId });
        await database.collection("sensorReadings").deleteMany({ deviceId });
        await database.collection("alerts").deleteMany({ deviceId });
        return res.deletedCount > 0;
      } catch (err) {
        console.warn("Error deleting device from MongoDB:", err);
      }
    }
    const existing = memDevices.get(deviceId);
    if (existing && existing.userId === userId) {
      memDevices.delete(deviceId);
      return true;
    }
    return false;
  },

  async updateDeviceHeartbeat(deviceId: string, timestamp: Date): Promise<void> {
    const database = await getDb();
    if (database) {
      try {
        await database
          .collection<DeviceDoc>("devices")
          .updateOne(
            { deviceId },
            { $set: { lastSeen: timestamp, status: "online", updatedAt: new Date() } },
          );
        return;
      } catch (err) {
        console.warn("Error updating device heartbeat in MongoDB:", err);
      }
    }
    const existing = memDevices.get(deviceId);
    if (existing) {
      existing.lastSeen = timestamp;
      existing.status = "online";
      existing.updatedAt = new Date();
    }
  },

  async saveReading(reading: SensorReadingDoc): Promise<SensorReadingDoc> {
    const database = await getDb();
    if (database) {
      try {
        await database.collection<SensorReadingDoc>("sensorReadings").insertOne(reading);
        return reading;
      } catch (err) {
        console.warn("Error saving reading in MongoDB:", err);
      }
    }
    memReadings.push(reading);
    if (memReadings.length > 5000) {
      memReadings.shift(); // keep memory bounded
    }
    return reading;
  },

  async getLatestReading(deviceId: string): Promise<SensorReadingDoc | null> {
    const database = await getDb();
    if (database) {
      try {
        return await database
          .collection<SensorReadingDoc>("sensorReadings")
          .findOne({ deviceId }, { sort: { timestamp: -1 } });
      } catch (err) {
        console.warn("Error fetching latest reading from MongoDB:", err);
      }
    }
    const matching = memReadings.filter((r) => r.deviceId === deviceId);
    if (matching.length === 0) return null;
    return matching[matching.length - 1] ?? null;
  },

  async getHistory(deviceId: string, since: Date): Promise<SensorReadingDoc[]> {
    const database = await getDb();
    if (database) {
      try {
        return (await database
          .collection<SensorReadingDoc>("sensorReadings")
          .find({ deviceId, timestamp: { $gte: since } })
          .sort({ timestamp: 1 })
          .limit(500)
          .toArray()) as SensorReadingDoc[];
      } catch (err) {
        console.warn("Error fetching history from MongoDB:", err);
      }
    }
    return memReadings
      .filter((r) => r.deviceId === deviceId && new Date(r.timestamp) >= since)
      .slice(-500);
  },

  async saveAlert(alert: AlertDoc): Promise<AlertDoc> {
    const database = await getDb();
    if (database) {
      try {
        await database.collection<AlertDoc>("alerts").insertOne(alert);
        return alert;
      } catch (err) {
        console.warn("Error saving alert to MongoDB:", err);
      }
    }
    memAlerts.push(alert);
    return alert;
  },

  async getRecentAlert(deviceId: string, since: Date): Promise<AlertDoc | null> {
    const database = await getDb();
    if (database) {
      try {
        return await database
          .collection<AlertDoc>("alerts")
          .findOne({ deviceId, timestamp: { $gte: since } }, { sort: { timestamp: -1 } });
      } catch (err) {
        console.warn("Error fetching recent alert from MongoDB:", err);
      }
    }
    const matching = memAlerts.filter(
      (a) => a.deviceId === deviceId && new Date(a.timestamp) >= since,
    );
    if (matching.length === 0) return null;
    return matching[matching.length - 1] ?? null;
  },

  async getAlerts(deviceId: string, limit = 50): Promise<AlertDoc[]> {
    const database = await getDb();
    if (database) {
      try {
        return (await database
          .collection<AlertDoc>("alerts")
          .find({ deviceId })
          .sort({ timestamp: -1 })
          .limit(limit)
          .toArray()) as AlertDoc[];
      } catch (err) {
        console.warn("Error fetching alerts from MongoDB:", err);
      }
    }
    return memAlerts
      .filter((a) => a.deviceId === deviceId)
      .slice(-limit)
      .reverse();
  },

  async getUserPreferences(userId: string): Promise<UserPreferencesDoc> {
    const database = await getDb();
    if (database) {
      try {
        const found = await database
          .collection<UserPreferencesDoc>("userPreferences")
          .findOne({ userId });
        if (found) return found;
      } catch (err) {
        console.warn("Error fetching preferences from MongoDB:", err);
      }
    }
    const mem = memPreferences.get(userId);
    if (mem) return mem;

    const defaultPrefs: UserPreferencesDoc = {
      userId,
      phoneNumber: "",
      whatsappNumber: "",
      email: "",
      alertChannels: { sms: true, whatsapp: true, email: true },
      threshold: 700,
      updatedAt: new Date(),
    };
    return defaultPrefs;
  },

  async updateUserPreferences(
    userId: string,
    patch: Partial<UserPreferencesDoc>,
  ): Promise<UserPreferencesDoc> {
    const current = await this.getUserPreferences(userId);
    const updated: UserPreferencesDoc = {
      ...current,
      ...patch,
      userId,
      updatedAt: new Date(),
    };

    const database = await getDb();
    if (database) {
      try {
        await database
          .collection<UserPreferencesDoc>("userPreferences")
          .updateOne({ userId }, { $set: updated }, { upsert: true });
        return updated;
      } catch (err) {
        console.warn("Error saving preferences to MongoDB:", err);
      }
    }
    memPreferences.set(userId, updated);
    return updated;
  },

  async logSystem(log: Omit<SystemLogDoc, "timestamp">): Promise<void> {
    const fullLog: SystemLogDoc = { ...log, timestamp: new Date() };
    const database = await getDb();
    if (database) {
      try {
        await database.collection<SystemLogDoc>("systemLogs").insertOne(fullLog);
        return;
      } catch (e) {
        // ignore log error
      }
    }
    memLogs.push(fullLog);
    if (memLogs.length > 500) memLogs.shift();
  },
};
