import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gauge, History, LayoutGrid, Settings, Wind, WifiOff } from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { useSelectedDevice } from "@/lib/queries";
import { cachedReading } from "@/lib/airsense";
import { formatTime } from "@/lib/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const nav: { to: string; label: TKey; icon: React.ReactNode }[] = [
  { to: "/dashboard", label: "dash.overview", icon: <Gauge className="h-4 w-4" /> },
  { to: "/dashboard/history", label: "dash.history", icon: <History className="h-4 w-4" /> },
  { to: "/dashboard/rooms", label: "dash.rooms", icon: <LayoutGrid className="h-4 w-4" /> },
  { to: "/dashboard/settings", label: "dash.settings", icon: <Settings className="h-4 w-4" /> },
];

function DashboardLayout() {
  const { t, lang } = useI18n();
  const { deviceId } = useSelectedDevice();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [online, setOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setOnline(navigator.onLine);
      const cached = deviceId ? cachedReading(deviceId) : null;
      setLastSeen(cached?.timestamp ?? null);
    };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [deviceId]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wind className="h-5 w-5" />
            </span>
            <span className="truncate font-display text-lg">AirSense</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/dashboard" }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary",
                    pathname === n.to && "bg-secondary text-foreground",
                  )}
                >
                  {n.icon}
                  {t(n.label)}
                </Link>
              ))}
            </nav>
            <LangToggle variant="outline" />
          </div>
        </div>
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-moderate-soft px-4 py-2 text-xs text-moderate-foreground">
            <WifiOff className="h-3.5 w-3.5" />
            {t("dash.offlineBanner")} {lastSeen ? formatTime(lastSeen, lang) : "—"}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card md:hidden">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/dashboard" }}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground",
              pathname === n.to && "text-primary",
            )}
          >
            {n.icon}
            <span className="truncate px-1">{t(n.label)}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
