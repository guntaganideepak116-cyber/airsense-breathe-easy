import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/weather")({
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard/weather",
    });
  },
});
