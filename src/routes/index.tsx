import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BellRing,
  Check,
  Cloud,
  Gauge,
  Globe,
  History,
  Languages,
  Minus,
  Radio,
  Smartphone,
  Wind,
} from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { BreathingOrb } from "@/components/BreathingOrb";
import { DashboardPreview } from "@/components/DashboardPreview";
import { LangToggle } from "@/components/LangToggle";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Problem />
      <HowItWorks />
      <Preview />
      <Compare />
      <Features />
      <Cases />
      <FinalCta />
      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/dashboard" className="hover:text-foreground">
              {t("nav.dashboard")}
            </Link>
            <Link to="/auth" className="hover:text-foreground">
              {t("nav.signin")}
            </Link>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SiteHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Wind className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-tight">AirSense</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="mr-2 hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
            <a href="#problem" className="hover:text-foreground">
              {t("nav.problem")}
            </a>
            <a href="#how" className="hover:text-foreground">
              {t("nav.how")}
            </a>
            <a href="#compare" className="hover:text-foreground">
              {t("nav.compare")}
            </a>
            <a href="#features" className="hover:text-foreground">
              {t("nav.features")}
            </a>
          </nav>
          <LangToggle />
          <Button asChild size="sm" className="rounded-full">
            <Link to="/auth">{t("nav.signup")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-soft blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-56 h-72 w-72 rounded-full bg-good-soft opacity-60 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-24">
        <div>
          <p className="inline-flex rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.sub")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth">
                {t("hero.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/dashboard">{t("hero.cta2")}</Link>
            </Button>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {(["hero.badge1", "hero.badge2", "hero.badge3"] as TKey[]).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-good" /> {t(k)}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid place-items-center">
          <BreathingOrb status="good">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("hero.orb.label")}
            </p>
            <p className="mt-1 font-display text-4xl text-good sm:text-5xl">{t("status.good")}</p>
            <p className="mt-1 text-sm tabular-nums text-muted-foreground">MQ135 · 318 ppm</p>
          </BreathingOrb>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, id }: { kicker: TKey; title: TKey; id?: string }) {
  const { t } = useI18n();
  return (
    <div id={id} className="max-w-2xl scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t(kicker)}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">{t(title)}</h2>
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
    <section className="border-y bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-24">
        <div>
          <SectionHead id="problem" kicker="problem.kicker" title="problem.title" />
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{t("problem.body")}</p>
          <div className="mt-8 grid gap-4">
            {cards.map((c) => (
              <div
                key={c.t}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary">
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{t(c.t)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(c.d)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative grid place-items-center overflow-hidden rounded-3xl border bg-background p-6 grain-panel">
          <RoomIllustration />
        </div>
      </div>
    </section>
  );
}

/** Abstract "room full of unseen particles" illustration. */
function RoomIllustration() {
  const { t } = useI18n();
  return (
    <div className="relative w-full max-w-md">
      <svg
        viewBox="0 0 400 300"
        className="w-full"
        role="img"
        aria-label="A room with invisible particles in the air"
      >
        <rect x="20" y="30" width="360" height="230" rx="18" fill="var(--sky-soft)" />
        <rect
          x="48"
          y="70"
          width="120"
          height="90"
          rx="8"
          fill="var(--background)"
          stroke="var(--border)"
        />
        <line x1="108" y1="70" x2="108" y2="160" stroke="var(--border)" />
        <line x1="48" y1="115" x2="168" y2="115" stroke="var(--border)" />
        <rect
          x="230"
          y="150"
          width="110"
          height="60"
          rx="10"
          fill="var(--background)"
          stroke="var(--border)"
        />
        <rect
          x="252"
          y="120"
          width="66"
          height="30"
          rx="6"
          fill="var(--card)"
          stroke="var(--border)"
        />
        <rect
          x="20"
          y="240"
          width="360"
          height="20"
          rx="6"
          fill="color-mix(in oklab, var(--primary) 12%, transparent)"
        />
        {Array.from({ length: 34 }).map((_, i) => {
          const x = 40 + ((i * 61) % 330);
          const y = 55 + ((i * 97) % 180);
          const r = 2 + (i % 4);
          const warm = i % 3 === 0;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={warm ? "var(--moderate)" : "var(--primary)"}
              opacity={0.35}
              className="drift"
              style={{ animationDelay: `${(i % 7) * 1.3}s` }}
            />
          );
        })}
      </svg>
      <p className="mt-4 text-center text-sm text-muted-foreground">{t("preview.note")}</p>
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
      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.t} className="relative rounded-3xl border bg-card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-soft text-primary">
              {s.icon}
            </span>
            <p className="mt-4 text-xs font-semibold tabular-nums text-primary">0{i + 1}</p>
            <p className="mt-1 font-semibold">{t(s.t)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(s.d)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Preview() {
  const { t } = useI18n();
  return (
    <section className="border-y bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <SectionHead kicker="preview.kicker" title="preview.title" />
        <div className="mt-8">
          <DashboardPreview status="moderate" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{t("preview.note")}</p>
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
    if (v === true) return <Check className="mx-auto h-5 w-5 text-good" />;
    if (v === false) return <Minus className="mx-auto h-5 w-5 text-muted-foreground/60" />;
    if (v === "partial")
      return <span className="text-xs text-moderate">{t("compare.partial")}</span>;
    return <span className="text-xs">{t(v)}</span>;
  };

  return (
    <section id="compare" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 lg:py-24">
      <SectionHead kicker="compare.kicker" title="compare.title" />
      <div className="mt-8 overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left font-medium text-muted-foreground"> </th>
              {cols.map((c, i) => (
                <th
                  key={c}
                  className={`p-4 text-center font-semibold ${i === 3 ? "bg-sky-soft text-primary" : "text-foreground"}`}
                >
                  {t(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b last:border-0">
                <td className="p-4 text-left font-medium">{t(r.label)}</td>
                {r.cells.map((c, i) => (
                  <td key={i} className={`p-4 text-center ${i === 3 ? "bg-sky-soft/60" : ""}`}>
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
    <section className="border-y bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <SectionHead id="features" kicker="features.kicker" title="features.title" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.t} className="rounded-3xl border bg-background p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-good-soft text-good">
                {f.icon}
              </span>
              <p className="mt-4 font-semibold">{t(f.t)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(f.d)}</p>
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
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <SectionHead kicker="cases.kicker" title="cases.title" />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {items.map((c) => (
          <article key={c.t} className="rounded-3xl border bg-card p-6">
            <BreathingOrb status={c.status} size="sm" className="!h-24 !w-24" />
            <p className="mt-4 font-semibold">{t(c.t)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(c.d)}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{t("cases.note")}</p>
    </section>
  );
}

function FinalCta() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-14 text-center grain-panel">
        <Cloud className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">{t("cta.title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("cta.sub")}</p>
        <Button asChild size="lg" className="mt-7 rounded-full">
          <Link to="/auth">
            {t("nav.signup")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
