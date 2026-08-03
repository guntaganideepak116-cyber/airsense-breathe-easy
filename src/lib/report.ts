/**
 * Downloadable reports for the selected history range: a machine-readable CSV
 * and a printable PDF summary a teacher can hand to an administrator.
 */
import { jsPDF } from "jspdf";
import type { HistoryPoint, Range } from "@/lib/airsense";
import { stepMinutesFor, timelineSegments, todaySummary } from "@/lib/insights";

export type ReportMeta = {
  roomName: string;
  deviceId: string;
  range: Range;
  rangeLabel: string;
  lang: string;
  labels: {
    title: string;
    room: string;
    device: string;
    period: string;
    generated: string;
    time: string;
    mq135: string;
    temp: string;
    humidity: string;
    status: string;
    summary: string;
    episodes: string;
    minutes: string;
    changes: string;
    disclaimer: string;
    statusNames: { good: string; moderate: string; poor: string };
  };
};

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function fileStem(meta: ReportMeta) {
  const safe = meta.roomName.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "room";
  return `airsense-${safe}-${meta.range}-${new Date().toISOString().slice(0, 10)}`;
}

export function exportCsv(points: HistoryPoint[], meta: ReportMeta) {
  const head = ["timestamp", "mq135_ppm", "temperature_c", "humidity_pct", "classification"];
  const rows = points.map((p) => [
    new Date(p.t).toISOString(),
    String(p.mq135),
    String(p.temperature),
    String(p.humidity),
    p.status,
  ]);
  const csv = [
    `# ${meta.labels.title}`,
    `# ${meta.labels.room}: ${meta.roomName}`,
    `# ${meta.labels.device}: ${meta.deviceId}`,
    `# ${meta.labels.period}: ${meta.rangeLabel}`,
    `# ${meta.labels.generated}: ${new Date().toISOString()}`,
    head.join(","),
    ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  download(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }), `${fileStem(meta)}.csv`);
}

/**
 * PDF is written in English regardless of UI language: the built-in PDF fonts
 * carry no Telugu glyphs, and a record shared with an administrator has to be
 * legible rather than a page of empty boxes.
 */
export function exportPdf(points: HistoryPoint[], meta: ReportMeta) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const line = (text: string, size = 10, bold = false, gap = 16) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += gap;
  };

  const newPageIfNeeded = (needed = 24) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  line("AirSense — Indoor Air Quality Report", 18, true, 26);
  doc.setDrawColor(200);
  doc.line(margin, y - 10, pageW - margin, y - 10);

  line(`Room: ${meta.roomName}`, 11, true);
  line(`Device ID: ${meta.deviceId}`);
  line(`Period: ${meta.rangeLabel}`);
  line(`Generated: ${new Date().toLocaleString("en-IN")}`, 10, false, 24);

  const step = stepMinutesFor(meta.range);
  const poorCount = points.filter((p) => p.status === "poor").length;
  const episodes = points.reduce(
    (n, p, i) => (p.status === "poor" && points[i - 1]?.status !== "poor" ? n + 1 : n),
    0,
  );
  const avg = points.length ? Math.round(points.reduce((s, p) => s + p.mq135, 0) / points.length) : 0;
  const peak = points.reduce((m, p) => Math.max(m, p.mq135), 0);
  const today = todaySummary(points, step);

  line("Summary", 13, true, 20);
  line(`Readings in period: ${points.length}`);
  line(`Average MQ135: ${avg} ppm   ·   Peak: ${peak} ppm`);
  line(`Poor episodes: ${episodes}   ·   Time in Poor: ${poorCount * step} min`);
  line(`Today so far: ${today.poorEpisodes} poor episode(s), ${today.poorMinutes} min in Poor`, 10, false, 24);

  line("Classification changes", 13, true, 20);
  const segments = timelineSegments(points).filter((s, i) => i > 0);
  if (!segments.length) {
    line("No classification changes recorded in this period.", 10, false, 24);
  } else {
    segments.slice(0, 18).forEach((s) => {
      newPageIfNeeded();
      line(`${new Date(s.start).toLocaleString("en-IN")}  →  ${s.status.toUpperCase()}`);
    });
    y += 8;
  }

  newPageIfNeeded(60);
  line("Readings", 13, true, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const cols = [margin, margin + 170, margin + 250, margin + 330, margin + 420];
  const header = ["Time", "MQ135 (ppm)", "Temp (C)", "Humidity (%)", "Classification"];
  header.forEach((h, i) => doc.text(h, cols[i]!, y));
  y += 14;
  doc.setFont("helvetica", "normal");

  points.forEach((p) => {
    newPageIfNeeded(18);
    if (y === margin) {
      doc.setFont("helvetica", "bold");
      header.forEach((h, i) => doc.text(h, cols[i]!, y));
      y += 14;
      doc.setFont("helvetica", "normal");
    }
    const row = [
      new Date(p.t).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      String(p.mq135),
      String(p.temperature),
      String(p.humidity),
      p.status,
    ];
    row.forEach((v, i) => doc.text(v, cols[i]!, y));
    y += 13;
  });

  newPageIfNeeded(40);
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(120);
  const disclaimer = doc.splitTextToSize(meta.labels.disclaimer, pageW - margin * 2) as string[];
  doc.text(disclaimer, margin, y);

  doc.save(`${fileStem(meta)}.pdf`);
}
