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

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime?: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
  lang?: "en" | "te";
}
