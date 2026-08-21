import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useClerk } from "@clerk/clerk-react";
import {
  ArrowLeft,
  ChevronRight,
  CloudSun,
  Gauge,
  HeartPulse,
  History,
  LogOut,
  MapPin,
  Menu,
  MoreHorizontal,
  Settings,
  WifiOff,
  Wind,
  X,
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

type DashboardRoutePath =
  | "/dashboard"
  | "/dashboard/history"
  | "/dashboard/recommendations"
  | "/dashboard/weather"
  | "/dashboard/rooms"
  | "/dashboard/settings";

const navItems: {
  to: DashboardRoutePath;
  label: TKey;
  icon: ReactNode;
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

const mobilePrimaryNavItems: {
  to: DashboardRoutePath;
  label: TKey;
  icon: ReactNode;
}[] = [
  { to: "/dashboard", label: "nav.mob.overview", icon: <Gauge className="h-5 w-5" /> },
  { to: "/dashboard/history", label: "nav.mob.history", icon: <History className="h-5 w-5" /> },
  { to: "/dashboard/rooms", label: "nav.mob.rooms", icon: <MapPin className="h-5 w-5" /> },
  { to: "/dashboard/weather", label: "nav.mob.weather", icon: <CloudSun className="h-5 w-5" /> },
];

function DashboardLayout() {
  const { t, lang } = useI18n();
  const { deviceId } = useSelectedDevice();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [online, setOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clerk = useClerk();

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

  // Close mobile drawer menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await clerk.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    window.location.href = "/";
  };

  const isMoreActive =
    pathname === "/dashboard/recommendations" || pathname === "/dashboard/settings";

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
        {/* Compact Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-2.5 backdrop-blur md:hidden">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wind className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-bold text-foreground truncate">
              AirSense
            </span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <LangToggle variant="outline" />
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border bg-secondary/60 text-foreground hover:bg-secondary active:scale-95 transition-all"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Offline Banner */}
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-moderate-soft px-4 py-2 text-xs text-moderate-foreground">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {t("dash.offlineBanner")} {lastSeen ? formatTime(lastSeen, lang) : "—"}
            </span>
          </div>
        )}

        {/* Scrolling Main Content — Guaranteeing Bottom Padding Above Navigation Bar */}
        <main className="flex-1 space-y-6 px-4 py-5 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:px-8 md:py-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Native-Feeling Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-card/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur shadow-lg md:hidden">
        {mobilePrimaryNavItems.map((n) => {
          const active = pathname === n.to || (n.to === "/dashboard" && pathname === "/dashboard/");
          return (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/dashboard" }}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center min-h-12 py-1.5 transition-colors",
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {n.icon}
              <span className="mt-0.5 w-full truncate px-0.5 text-center text-[10px] sm:text-xs">
                {t(n.label)}
              </span>
            </Link>
          );
        })}

        {/* 5th Mobile Item: "More" Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className={cn(
            "flex min-w-0 flex-1 flex-col items-center justify-center min-h-12 py-1.5 transition-colors relative",
            isMoreActive || isMenuOpen
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Open More Navigation Options"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="mt-0.5 w-full truncate px-0.5 text-center text-[10px] sm:text-xs">
            {t("nav.mob.more")}
          </span>
          {isMoreActive && (
            <span className="absolute top-1.5 right-1/4 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation & PWA Drawer Sheet */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border-t bg-card p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl animate-in slide-in-from-bottom duration-250 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  {t("nav.mob.menu")}
                </h2>
                <p className="text-xs text-muted-foreground">AirSense PWA Navigation</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Grid / List — All 6 Sections */}
            <div className="mt-4 space-y-1.5">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Dashboard Sections
              </p>
              <div className="grid gap-2">
                {navItems.map((n) => {
                  const active =
                    pathname === n.to || (n.to === "/dashboard" && pathname === "/dashboard/");
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setIsMenuOpen(false)}
                      activeOptions={{ exact: n.to === "/dashboard" }}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                        active
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-secondary/40 text-foreground hover:bg-secondary/80",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-xl",
                            active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-background text-primary",
                          )}
                        >
                          {n.icon}
                        </span>
                        <span>{t(n.label)}</span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4",
                          active ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account & Session Controls */}
            <div className="mt-6 border-t pt-4 space-y-3">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("set.account")}
              </p>

              {/* Language Switcher */}
              <div className="flex items-center justify-between rounded-2xl border bg-background/50 px-4 py-2.5">
                <span className="text-xs font-medium text-foreground">{t("set.lang")}</span>
                <LangToggle variant="outline" />
              </div>

              {/* Back to Home CTA */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-secondary/50 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("nav.backHome")}
              </Link>

              {/* Sign Out / Logout Option */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-destructive/20 text-destructive">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold leading-none">{t("nav.logout")}</p>
                    <p className="mt-1 text-[11px] text-destructive/80 leading-none">
                      {t("nav.logoutDesc")}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-destructive/60" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
