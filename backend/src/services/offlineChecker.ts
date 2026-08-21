import mongoose from "mongoose";
import { DeviceModel } from "../models/Device.js";
import { UserModel, defaultMemoryUser } from "../models/User.js";
import { dispatchAlert } from "./alertDispatcher.js";

// Offline threshold in milliseconds (e.g., 2 minutes)
const OFFLINE_THRESHOLD_MS = 2 * 60 * 1000;

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function checkOfflineDevices() {
  const cutoff = new Date(Date.now() - OFFLINE_THRESHOLD_MS);

  try {
    if (isDbConnected()) {
      // Find devices that are online but haven't been seen since cutoff
      const offlineDevices = await DeviceModel.find({
        online: true,
        $or: [{ lastSeen: { $lt: cutoff } }, { lastSeen: { $exists: false } }],
      });

      for (const dev of offlineDevices) {
        dev.online = false;
        await dev.save();

        // Get user for alert preferences
        const user = dev.userId
          ? (await UserModel.findOne({ userId: dev.userId })) || (await UserModel.findOne()) || defaultMemoryUser
          : (await UserModel.findOne()) || defaultMemoryUser;

        await dispatchAlert(
          {
            phoneNumber: user.phoneNumber,
            whatsappNumber: user.whatsappNumber,
            email: user.email,
            alertChannels: user.alertChannels,
          },
          "DEVICE_OFFLINE",
          {
            roomName: dev.name,
            deviceId: dev.id,
            timestamp: new Date(),
          }
        );
      }
    }
  } catch (err) {
    console.error("⚠️ Error in offline device checker:", err);
  }
}

export function startOfflineChecker(intervalMs = 30000) {
  console.log("⏱️ Starting Device Offline Monitoring Service (interval: 30s)...");
  // Run once initially after 5 seconds, then repeat on interval
  setTimeout(() => void checkOfflineDevices(), 5000);
  setInterval(() => void checkOfflineDevices(), intervalMs);
}
