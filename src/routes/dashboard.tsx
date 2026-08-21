import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CloudSun,
  Gauge,
  HeartPulse,
  History,
  MapPin,
  Settings,
  WifiOff,
  Wind,
} from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { useSelectedDevice } from "@/lib/queries";
import { cachedReading } from "@/lib/airsense";
import { formatTime } from "@/lib/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const navItems: {
  to:
    | "/dashboard"
    | "/dashboard/history"
    | "/dashboard/recommendations"
    | "/dashboard/weather"
    | "/dashboard/rooms"
    | "/dashboard/settings";
  label: TKey;
  icon: React.ReactNode;
}[] = [
  { to: "/dashboard", label: "dash.overview", icon: <Gauge className="h-4 w-4" /> },
  { to: "/dashboard/history", label: "dash.history", icon: <History className="h-4 w-4" /> },
  {
    to: "/dashboard/recommendations",
    label: "dash.recommendations",
    icon: <HeartPulse className="h-4 w-4" />,
  },
  { to: "/dashboard/weather", label: "dash.weather", icon: <CloudSun className="h-4 w-4" /> },
  { to: "/dashboard/rooms", label: "dash.rooms", icon: <MapPin className="h-4 w-4" /> },
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
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r bg-card/60 p-5 backdrop-blur md:flex">
        <div>
          {/* Sidebar Top Header Logo */}
          <Link to="/" className="flex items-center gap-3 px-2 py-1">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Wind className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl leading-tight">AirSense</p>
              <p className="truncate text-xs text-muted-foreground">{t("brand.tagline")}</p>
            </div>
          </Link>

          {/* Vertical Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navItems.map((n) => {
              const active =
                pathname === n.to || (n.to === "/dashboard" && pathname === "/dashboard/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/dashboard" }}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  )}
                >
                  {n.icon}
                  <span className="truncate">{t(n.label)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Back Home CTA & Lang Toggle */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">Language</span>
            <LangToggle variant="outline" />
          </div>
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-secondary/50 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("nav.backHome")}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wind className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">AirSense</span>
          </Link>
          <LangToggle variant="outline" />
        </header>

        {/* Offline Banner */}
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-moderate-soft px-4 py-2 text-xs text-moderate-foreground">
            <WifiOff className="h-3.5 w-3.5" />
            {t("dash.offlineBanner")} {lastSeen ? formatTime(lastSeen, lang) : "—"}
          </div>
        )}

        <main className="flex-1 space-y-6 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card/95 backdrop-blur md:hidden">
        {navItems.slice(0, 5).map((n) => {
          const active = pathname === n.to || (n.to === "/dashboard" && pathname === "/dashboard/");
          return (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/dashboard" }}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 text-[10px] text-muted-foreground",
                active && "font-semibold text-primary",
              )}
            >
              {n.icon}
              <span className="mt-1 truncate px-0.5">{t(n.label)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
