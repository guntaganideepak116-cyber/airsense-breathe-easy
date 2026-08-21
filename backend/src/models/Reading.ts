import mongoose, { Schema, Document } from "mongoose";
import { AirStatus } from "../services/classifier.js";

export interface IReading extends Document {
  deviceId: string;
  mq135: number;
  temperature: number;
  humidity: number;
  status: AirStatus;
  buzzerActive: boolean;
  lastPoorAt?: Date | null;
  rssi?: number;
  uptimeSec?: number;
  firmware?: string;
  timestamp: Date;
}

const ReadingSchema: Schema = new Schema({
  deviceId: { type: String, required: true, index: true },
  mq135: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  status: { type: String, enum: ["good", "moderate", "poor"], required: true },
  buzzerActive: { type: Boolean, default: false },
  lastPoorAt: { type: Date, default: null },
  rssi: { type: Number },
  uptimeSec: { type: Number },
  firmware: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
});

// Compound index for efficient range history queries per device
ReadingSchema.index({ deviceId: 1, timestamp: -1 });

export const ReadingModel = mongoose.model<IReading>("Reading", ReadingSchema);
