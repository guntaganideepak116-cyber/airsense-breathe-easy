import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/room-event-detective")({
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard/detective",
    });
  },
});
