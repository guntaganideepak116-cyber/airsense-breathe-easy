import { EventEmitter } from "events";
import type { SensorReadingDoc } from "./db";

class DeviceEventEmitter extends EventEmitter {}

const globalKey = Symbol.for("airsense.deviceEvents");
const globalObj = globalThis as unknown as { [globalKey]?: DeviceEventEmitter };

if (!globalObj[globalKey]) {
  const emitter = new DeviceEventEmitter();
  emitter.setMaxListeners(200);
  globalObj[globalKey] = emitter;
}

export const deviceEvents = globalObj[globalKey]!;

export type ReadingEventPayload = SensorReadingDoc & {
  deviceId: string;
};
