import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BellRing,
  Check,
  Cpu,
  Droplets,
  Gauge,
  Globe,
  History,
  Languages,
  Menu,
  Minus,
  Radio,
  ShieldCheck,
  Smartphone,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import { useI18n, type TKey } from "@/client/lib/i18n";
import { BreathingOrb } from "@/client/components/BreathingOrb";
import { DashboardPreview } from "@/client/components/DashboardPreview";
import { LangToggle } from "@/client/components/LangToggle";
import { Button } from "@/client/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirSense — Indoor air quality monitoring for classrooms & homes" },
      {
        name: "description",
        content:
          "AirSense measures the air inside classrooms, bedrooms and hostels in AP & Telangana, alerts the room instantly, and streams live readings to your phone. Telugu-first.",
      },
      { property: "og:title", content: "AirSense — Indoor air quality monitoring, Telugu-first" },
      {
        property: "og:description",
        content:
          "Live room-level air quality, instant local alerts and remote dashboards for families and schools.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Preview />
        <Compare />
        <Features />
        <Cases />
        <FinalCta />
      </main>
      <footer className="border-t border-border/80 bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-primary/20 text-primary">
              <Wind className="h-3.5 w-3.5" />
            </span>
            <span>{t("footer.rights")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              {t("nav.dashboard")}
            </Link>
            <Link to="/auth" className="transition-colors hover:text-foreground">
              {t("nav.signin")}
            </Link>
            <span className="tabular-nums text-muted-foreground/60">
              © {new Date().getFullYear()} AirSense IoT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SiteHeader() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20">
            <Wind className="h-5 w-5 stroke-[2.2]" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                AirSense
              </span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary uppercase tracking-wider">
                IoT
              </span>
            </div>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {t("brand.tagline")}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
          <a
            href="#problem"
            className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {t("nav.problem")}
          </a>
          <a
            href="#how"
            className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {t("nav.how")}
          </a>
          <a
            href="#compare"
            className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {t("nav.compare")}
          </a>
          <a
            href="#features"
            className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {t("nav.features")}
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <LangToggle />
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Link to="/auth">{t("nav.signup")}</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-secondary/50 text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border/80 bg-card/95 px-5 py-4 backdrop-blur-lg lg:hidden">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <a
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t("nav.problem")}
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t("nav.how")}
            </a>
            <a
              href="#compare"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t("nav.compare")}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t("nav.features")}
            </a>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("nav.dashboard")} →
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t("nav.signin")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-card/30 to-background py-16 lg:py-24">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          {/* Eyebrow chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("hero.eyebrow")}</span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.sub")}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Link to="/auth">
                {t("hero.cta")} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-border/80 bg-secondary/50 font-medium text-foreground hover:bg-secondary hover:border-border transition-all"
            >
              <Link to="/dashboard">{t("hero.cta2")}</Link>
            </Button>
          </div>

          {/* Key verification badges */}
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            {(["hero.badge1", "hero.badge2", "hero.badge3"] as TKey[]).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-good-soft text-good">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Orb Card Hero Visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
            {/* Header chip */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-foreground">Indoor Room Telemetry</span>
              </div>
              <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                ESP32 Online
              </span>
            </div>

            {/* Orb Center */}
            <div className="grid place-items-center py-6">
              <BreathingOrb status="good">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("hero.orb.label")}
                </p>
                <p className="mt-1 font-display text-4xl font-extrabold text-good sm:text-5xl">
                  {t("status.good")}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  MQ-135 Sensor Response:{" "}
                  <span className="font-semibold text-foreground tabular-nums">318</span>
                </p>
              </BreathingOrb>
            </div>

            {/* Micro Telemetry Footer */}
            <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4 text-xs">
              <div className="rounded-lg border border-border/50 bg-secondary/40 p-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Temperature</span>
                </div>
                <p className="mt-1 font-display text-base font-bold text-foreground">28.6 °C</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/40 p-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Humidity</span>
                </div>
                <p className="mt-1 font-display text-base font-bold text-foreground">54 %</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, id }: { kicker: TKey; title: TKey; id?: string }) {
  const { t } = useI18n();
  return (
    <div id={id} className="max-w-2xl scroll-mt-24">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">{t(kicker)}</p>
      <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t(title)}
      </h2>
    </div>
  );
}

function Problem() {
  const { t } = useI18n();
  const cards: { icon: React.ReactNode; t: TKey; d: TKey }[] = [
    { icon: <Activity className="h-5 w-5" />, t: "problem.p1.t", d: "problem.p1.d" },
    { icon: <Wind className="h-5 w-5" />, t: "problem.p2.t", d: "problem.p2.d" },
    { icon: <Gauge className="h-5 w-5" />, t: "problem.p3.t", d: "problem.p3.d" },
  ];

  return (
    <section className="border-b border-border/60 bg-card/40 py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <SectionHead id="problem" kicker="problem.kicker" title="problem.title" />
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("problem.body")}</p>
          <div className="mt-8 space-y-3.5">
            {cards.map((c) => (
              <div
                key={c.t}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-border hover:bg-secondary/30"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-cyan-400">
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{t(c.t)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(c.d)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blueprint Room Vector */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <RoomIllustration />
        </div>
      </div>
    </section>
  );
}

/** Crisp technical room air flow blueprint illustration */
function RoomIllustration() {
  const { t } = useI18n();
  return (
    <div className="relative w-full max-w-md">
      <svg
        viewBox="0 0 400 300"
        className="w-full"
        role="img"
        aria-label="Classroom air quality monitoring illustration"
      >
        <rect
          x="20"
          y="30"
          width="360"
          height="230"
          rx="14"
          fill="#111C2E"
          stroke="#26364A"
          strokeWidth="1.5"
        />
        {/* Window with ventilation indicator */}
        <rect x="48" y="70" width="110" height="85" rx="6" fill="#17263A" stroke="#26364A" />
        <line x1="103" y1="70" x2="103" y2="155" stroke="#26364A" strokeWidth="1.5" />
        <line x1="48" y1="112" x2="158" y2="112" stroke="#26364A" strokeWidth="1.5" />
        <text x="56" y="90" fill="#A7B5C8" fontSize="10" fontFamily="sans-serif">
          Ventilation
        </text>

        {/* Sensor Node Mount */}
        <rect
          x="240"
          y="70"
          width="100"
          height="50"
          rx="8"
          fill="#17263A"
          stroke="#10B981"
          strokeWidth="1.5"
        />
        <circle cx="258" cy="95" r="4" fill="#10B981" />
        <text x="270" y="99" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          AirSense
        </text>

        {/* Study Table */}
        <rect x="220" y="170" width="130" height="50" rx="6" fill="#17263A" stroke="#26364A" />
        <rect x="250" y="145" width="40" height="25" rx="4" fill="#0B1220" stroke="#26364A" />

        {/* Floor Accent */}
        <rect x="20" y="245" width="360" height="15" rx="4" fill="#17263A" opacity="0.6" />

        {/* Micro air particle markers */}
        {Array.from({ length: 28 }).map((_, i) => {
          const x = 50 + ((i * 59) % 310);
          const y = 60 + ((i * 83) % 170);
          const r = 2 + (i % 3);
          const isWarning = i % 4 === 0;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={isWarning ? "#F59E0B" : "#22D3EE"}
              opacity={0.4}
              className="drift"
              style={{ animationDelay: `${(i % 5) * 1.2}s` }}
            />
          );
        })}
      </svg>
      <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" /> Normal Fresh Air
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Stale Indoor VOCs
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">{t("preview.note")}</p>
    </div>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const steps: { icon: React.ReactNode; t: TKey; d: TKey }[] = [
    { icon: <Gauge className="h-5 w-5" />, t: "how.s1.t", d: "how.s1.d" },
    { icon: <BellRing className="h-5 w-5" />, t: "how.s2.t", d: "how.s2.d" },
    { icon: <Radio className="h-5 w-5" />, t: "how.s3.t", d: "how.s3.d" },
    { icon: <Smartphone className="h-5 w-5" />, t: "how.s4.t", d: "how.s4.d" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <SectionHead id="how" kicker="how.kicker" title="how.title" />
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li
            key={s.t}
            className="group relative rounded-2xl border border-border/80 bg-card p-6 transition-all hover:border-primary/50 hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                {s.icon}
              </span>
              <span className="font-mono text-xs font-bold text-muted-foreground/60">0{i + 1}</span>
            </div>
            <p className="mt-5 font-semibold text-foreground">{t(s.t)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t(s.d)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Preview() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border/60 bg-card/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead kicker="preview.kicker" title="preview.title" />
        <div className="mt-8">
          <DashboardPreview status="moderate" />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{t("preview.note")}</p>
      </div>
    </section>
  );
}

function Compare() {
  const { t } = useI18n();
  const rows: { label: TKey; cells: (TKey | boolean | "partial")[] }[] = [
    {
      label: "compare.r1",
      cells: ["compare.r1c1", "compare.r1c2", "compare.r1c3", "compare.r1c4"],
    },
    { label: "compare.r2", cells: [false, true, false, true] },
    { label: "compare.r3", cells: [false, "partial", false, true] },
    { label: "compare.r4", cells: [false, "partial", true, true] },
    { label: "compare.r5", cells: [false, false, "partial", true] },
  ];
  const cols: TKey[] = ["compare.col1", "compare.col2", "compare.col3", "compare.col4"];

  const cell = (v: TKey | boolean | "partial") => {
    if (v === true) return <Check className="mx-auto h-4 w-4 text-good stroke-[2.5]" />;
    if (v === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />;
    if (v === "partial")
      return <span className="text-xs font-medium text-moderate">{t("compare.partial")}</span>;
    return <span className="text-xs text-muted-foreground">{t(v)}</span>;
  };

  return (
    <section id="compare" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 lg:py-24">
      <SectionHead kicker="compare.kicker" title="compare.title" />
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/80 bg-card">
        <table className="w-full min-w-160 text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-secondary/40">
              <th className="p-4 text-left font-medium text-muted-foreground">
                Evaluation Criteria
              </th>
              {cols.map((c, i) => (
                <th
                  key={c}
                  className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                    i === 3
                      ? "bg-primary/10 text-primary border-x border-primary/20"
                      : "text-foreground"
                  }`}
                >
                  {t(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.label}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
              >
                <td className="p-4 text-left text-xs font-medium text-foreground">{t(r.label)}</td>
                {r.cells.map((c, i) => (
                  <td
                    key={i}
                    className={`p-4 text-center ${i === 3 ? "bg-primary/5 border-x border-primary/10 font-medium" : ""}`}
                  >
                    {cell(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  const items: { icon: React.ReactNode; t: TKey; d: TKey }[] = [
    { icon: <Activity className="h-5 w-5" />, t: "features.f1.t", d: "features.f1.d" },
    { icon: <BellRing className="h-5 w-5" />, t: "features.f2.t", d: "features.f2.d" },
    { icon: <Globe className="h-5 w-5" />, t: "features.f3.t", d: "features.f3.d" },
    { icon: <Smartphone className="h-5 w-5" />, t: "features.f4.t", d: "features.f4.d" },
    { icon: <History className="h-5 w-5" />, t: "features.f5.t", d: "features.f5.d" },
    { icon: <Languages className="h-5 w-5" />, t: "features.f6.t", d: "features.f6.d" },
  ];

  return (
    <section className="border-y border-border/60 bg-card/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead id="features" kicker="features.kicker" title="features.title" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.t}
              className="group rounded-2xl border border-border/80 bg-card p-6 transition-all hover:border-primary/40 hover:bg-secondary/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-good-soft text-good transition-transform group-hover:scale-105">
                {f.icon}
              </span>
              <p className="mt-4 font-semibold text-foreground">{t(f.t)}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t(f.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases() {
  const { t } = useI18n();
  const items: { t: TKey; d: TKey; status: "moderate" | "poor" | "good" }[] = [
    { t: "cases.c1.t", d: "cases.c1.d", status: "poor" },
    { t: "cases.c2.t", d: "cases.c2.d", status: "moderate" },
    { t: "cases.c3.t", d: "cases.c3.d", status: "good" },
  ];

  const statusLabel = {
    poor: "Alert Triggered",
    moderate: "Advisory Level",
    good: "Optimal Status",
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <SectionHead kicker="cases.kicker" title="cases.title" />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {items.map((c) => (
          <article
            key={c.t}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all hover:border-border"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Scenario
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    c.status === "good"
                      ? "bg-good-soft text-good"
                      : c.status === "moderate"
                        ? "bg-moderate-soft text-moderate"
                        : "bg-poor-soft text-poor"
                  }`}
                >
                  {statusLabel[c.status]}
                </span>
              </div>
              <div className="my-4 grid place-items-center">
                <BreathingOrb status={c.status} size="sm" className="h-20! w-20!" />
              </div>
              <p className="font-semibold text-foreground">{t(c.t)}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t(c.d)}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">{t("cases.note")}</p>
    </section>
  );
}

function FinalCta() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-card via-card to-secondary/60 px-6 py-14 text-center shadow-xl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("cta.sub")}
        </p>
        <Button
          asChild
          size="lg"
          className="mt-7 rounded-xl bg-primary px-7 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-[1.01]"
        >
          <Link to="/auth">
            {t("nav.signup")} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
