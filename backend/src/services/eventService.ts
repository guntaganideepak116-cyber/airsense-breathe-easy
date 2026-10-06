import { EventEmitter } from "events";
import type { SensorReadingDoc } from "../models/types.js";

class DeviceEventEmitter extends EventEmitter {}

export const deviceEvents = new DeviceEventEmitter();
deviceEvents.setMaxListeners(300);

export type ReadingEventPayload = SensorReadingDoc & {
  deviceId: string;
};
