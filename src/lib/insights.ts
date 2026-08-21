/**
 * Rule-based summaries computed from history points. No prediction, no model —
 * plain aggregation over what the sensor already recorded.
 */
import type { AirStatus, HistoryPoint, Reading } from "@/lib/airsense";

export type Trend = "rising" | "falling" | "steady";

const RANK: Record<AirStatus, number> = { good: 0, moderate: 1, poor: 2 };

export function statusRank(status: AirStatus) {
  return RANK[status];
}

export type TodaySummary = {
  typical: AirStatus | null;
  poorEpisodes: number;
  poorMinutes: number;
  samples: number;
};

/** Aggregates the points that fall on today's calendar date. */
export function todaySummary(points: HistoryPoint[] | undefined, stepMinutes = 30): TodaySummary {
  const empty: TodaySummary = { typical: null, poorEpisodes: 0, poorMinutes: 0, samples: 0 };
  if (!points?.length) return empty;

  const today = new Date().toDateString();
  const todays = points.filter((p) => new Date(p.t).toDateString() === today);
  if (!todays.length) return empty;

  const counts: Record<AirStatus, number> = { good: 0, moderate: 0, poor: 0 };
  let episodes = 0;
  todays.forEach((p, i) => {
    counts[p.status] += 1;
    const prev = todays[i - 1];
    if (p.status === "poor" && (!prev || prev.status !== "poor")) episodes += 1;
  });

  const typical = (Object.keys(counts) as AirStatus[]).reduce((a, b) =>
    counts[b] > counts[a] ? b : a,
  );

  return {
    typical,
    poorEpisodes: episodes,
    poorMinutes: counts.poor * stepMinutes,
    samples: todays.length,
  };
}

export function stepMinutesFor(range: "24h" | "7d" | "30d") {
  return range === "24h" ? 30 : range === "7d" ? 120 : 480;
}

/** Slope of the last few readings, used to phrase guidance as declining/improving. */
export function trendOf(points: HistoryPoint[] | undefined, window = 6): Trend {
  if (!points || points.length < 3) return "steady";
  const tail = points.slice(-window);
  const first = tail.slice(0, Math.ceil(tail.length / 2));
  const last = tail.slice(Math.ceil(tail.length / 2));
  const avg = (xs: HistoryPoint[]) => xs.reduce((s, p) => s + p.mq135, 0) / xs.length;
  const delta = avg(last) - avg(first);
  if (delta > 25) return "rising";
  if (delta < -25) return "falling";
  return "steady";
}

export type WeeklyPattern =
  | { kind: "clean" }
  | { kind: "window"; startHour: number; endHour: number; poorEpisodes: number }
  | { kind: "none" };

/** Finds the two-hour window of the week with the worst average reading. */
export function weeklyPattern(points: HistoryPoint[] | undefined): WeeklyPattern {
  if (!points?.length) return { kind: "none" };

  const poorEpisodes = points.reduce(
    (n, p, i) => (p.status === "poor" && points[i - 1]?.status !== "poor" ? n + 1 : n),
    0,
  );
  if (poorEpisodes === 0) return { kind: "clean" };

  const buckets = new Map<number, { sum: number; n: number }>();
  points.forEach((p) => {
    const h = new Date(p.t).getHours();
    const b = buckets.get(h) ?? { sum: 0, n: 0 };
    buckets.set(h, { sum: b.sum + p.mq135, n: b.n + 1 });
  });

  let bestHour = -1;
  let bestAvg = -Infinity;
  for (let h = 0; h < 24; h += 1) {
    const a = buckets.get(h);
    const b = buckets.get((h + 1) % 24);
    if (!a || !b) continue;
    const avg = (a.sum + b.sum) / (a.n + b.n);
    if (avg > bestAvg) {
      bestAvg = avg;
      bestHour = h;
    }
  }
  if (bestHour < 0) return { kind: "none" };
  return { kind: "window", startHour: bestHour, endHour: (bestHour + 2) % 24, poorEpisodes };
}

export function formatHour(hour: number, lang: string) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toLocaleTimeString(lang === "te" ? "te-IN" : "en-IN", { hour: "numeric", hour12: true });
}

export type TimelineSegment = { status: AirStatus; start: string; end: string; span: number };

/** Collapses consecutive same-status points into coloured segments for the timeline strip. */
export function timelineSegments(points: HistoryPoint[] | undefined): TimelineSegment[] {
  if (!points?.length) return [];
  const out: TimelineSegment[] = [];
  points.forEach((p) => {
    const last = out[out.length - 1];
    if (last && last.status === p.status) {
      last.end = p.t;
      last.span += 1;
    } else {
      out.push({ status: p.status, start: p.t, end: p.t, span: 1 });
    }
  });
  return out;
}

export type ActionKey =
  | "action.good"
  | "action.goodRising"
  | "action.moderate"
  | "action.moderateRising"
  | "action.moderateFalling"
  | "action.poor"
  | "action.poorFalling";

/** Guidance text key chosen from the live status plus the recent trend. */
export function actionKey(status: AirStatus, trend: Trend): ActionKey {
  if (status === "poor") return trend === "falling" ? "action.poorFalling" : "action.poor";
  if (status === "moderate") {
    if (trend === "rising") return "action.moderateRising";
    if (trend === "falling") return "action.moderateFalling";
    return "action.moderate";
  }
  return trend === "rising" ? "action.goodRising" : "action.good";
}

export type RoomExtreme = { deviceId: string; name: string; status: AirStatus; mq135: number };

/** Best and worst room right now, by status then raw reading. */
export function bestAndWorst(
  rooms: { deviceId: string; name: string; reading: Reading | null | undefined }[],
): { best: RoomExtreme | null; worst: RoomExtreme | null } {
  const live = rooms
    .filter((r) => r.reading)
    .map((r) => ({
      deviceId: r.deviceId,
      name: r.name,
      status: r.reading!.status,
      mq135: r.reading!.mq135,
    }));
  if (live.length < 2) return { best: null, worst: null };
  const sorted = [...live].sort(
    (a, b) => statusRank(a.status) - statusRank(b.status) || a.mq135 - b.mq135,
  );
  return { best: sorted[0] ?? null, worst: sorted[sorted.length - 1] ?? null };
}
