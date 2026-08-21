import mongoose, { Schema, Document } from "mongoose";

export interface IAlertChannels {
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
}

export interface IUser extends Document {
  userId: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  alertChannels: IAlertChannels;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true, default: "default_user" },
    phoneNumber: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    alertChannels: {
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);

export interface MemoryUser {
  userId: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  alertChannels: IAlertChannels;
}

export const defaultMemoryUser: MemoryUser = {
  userId: "default_user",
  phoneNumber: process.env.DEFAULT_PHONE_NUMBER || "9876543210",
  whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER || "919876543210",
  email: process.env.DEFAULT_EMAIL || "alert@example.com",
  alertChannels: {
    sms: false,
    whatsapp: true,
    email: true,
  },
};
