import { createFileRoute } from "@tanstack/react-router";
import { handleDeviceData } from "./devices.data";

export const Route = createFileRoute("/api/device/data")({
  server: {
    handlers: {
      POST: handleDeviceData,
    },
  },
});
