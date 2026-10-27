import { ObjectId } from "mongodb";

export type AirStatus = "good" | "moderate" | "poor";
export type Range = "24h" | "7d" | "30d";

export interface DeviceDoc {
  _id?: ObjectId;
  deviceId: string;
  name: string;
  userId: string;
  apiKeyHash: string;
  apiKeyPrefix: string;
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
  status: AirStatus;
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
    email: boolean;
  };
  timestamp: Date;
  resolvedAt?: Date | null;
}

export interface UserPreferencesDoc {
  _id?: ObjectId;
  userId: string;
  email?: string;
  alertChannels: {
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

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime?: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
  lang?: "en" | "te";
}

export type AiRecommendationStatus = "good" | "attention" | "warning" | "critical";
export type AiRecommendationPriority = "low" | "medium" | "high";

export interface AiRecommendationResult {
  status: AiRecommendationStatus;
  summary: string;
  recommendations: string[];
  priority: AiRecommendationPriority;
  analyzedAt: string;
  cached?: boolean;
  sensorData: {
    deviceId: string;
    room?: string;
    mq135: number;
    temperature: number;
    humidity: number;
    timestamp: string;
  };
}

export interface AiRecommendationDoc {
  _id?: ObjectId;
  deviceId: string;
  roomName?: string;
  userId?: string;
  sensorReadingId?: string;
  status: AiRecommendationStatus;
  summary: string;
  recommendations: string[];
  priority: AiRecommendationPriority;
  sensorData: {
    mq135: number;
    temperature: number;
    humidity: number;
    timestamp: Date;
  };
  cached?: boolean;
  createdAt: Date;
}
