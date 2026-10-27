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

// Room Event Detective Types
export type ActivityCategory =
  | "cooking"
  | "cleaning"
  | "window_opened"
  | "window_closed"
  | "door_opened"
  | "door_closed"
  | "ventilation_on"
  | "ventilation_off"
  | "air_purifier_on"
  | "air_purifier_off"
  | "people_entered"
  | "people_left"
  | "spray_used"
  | "candles_incense"
  | "other"
  | "custom";

export interface UserActivityDoc {
  _id?: ObjectId;
  id?: string;
  deviceId: string;
  userId: string;
  category: ActivityCategory | string;
  title: string;
  notes?: string;
  startAt: Date;
  endAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type DetectedEventType =
  | "mq135_spike"
  | "mq135_drop"
  | "temp_rise"
  | "temp_drop"
  | "humidity_rise"
  | "humidity_drop"
  | "sensor_interruption";

export type SensorType = "mq135" | "temperature" | "humidity";

export interface DetectedEventDoc {
  _id?: ObjectId;
  id?: string;
  deviceId: string;
  userId?: string;
  eventType: DetectedEventType;
  sensorType: SensorType;
  title: string;
  description: string;
  startedAt: Date;
  endedAt?: Date | null;
  baselineValue?: number;
  observedValue?: number;
  changeMagnitude?: number;
  ruleVersion: string;
  evidenceReadingIds?: string[];
  status: "detected" | "user_confirmed" | "dismissed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityAssociationDoc {
  _id?: ObjectId;
  id?: string;
  userId: string;
  deviceId: string;
  activityId: string;
  detectedEventId: string;
  timeRelationship: "overlap" | "preceding" | "following";
  timeDifferenceSeconds?: number;
  associationStatus: "candidate" | "confirmed" | "dismissed" | "unlikely";
  userFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EvidenceLevel = "insufficient" | "single_observation" | "repeated_association";

export interface RoomInsightDoc {
  _id?: ObjectId;
  id?: string;
  userId: string;
  deviceId: string;
  insightType: string;
  title: string;
  summary: string;
  analysisWindow: { start: Date; end: Date };
  supportingEventIds: string[];
  supportingActivityIds: string[];
  evidenceCount: number;
  evidenceLevel: EvidenceLevel;
  algorithmVersion: string;
  generatedAt: Date;
}
