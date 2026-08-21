import mongoose, { Schema, Document } from "mongoose";

export interface IDevice extends Document {
  id: string; // e.g. dev-4b
  userId?: string; // Clerk user ID
  name: string;
  apiKey: string;
  online: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    name: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true, index: true },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

export const DeviceModel = mongoose.model<IDevice>("Device", DeviceSchema);
