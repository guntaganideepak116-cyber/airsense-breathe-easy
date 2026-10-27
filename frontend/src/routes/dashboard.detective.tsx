import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback, type SyntheticEvent } from "react";
import {
  Activity,
  Check,
  ChevronRight,
  Clock,
  DoorOpen,
  Droplets,
  Edit3,
  Eye,
  Fan,
  Filter,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Thermometer,
  Trash2,
  Wind,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useI18n } from "@/client/lib/i18n";
import { useSelectedDevice, useDevices, useLatest } from "@/client/lib/queries";
import {
  airsenseApi,
  type UserActivity,
  type DetectedEvent,
  type ActivityAssociation,
  type RoomInsight,
  type Reading,
} from "@/client/lib/airsense";
import { toast } from "sonner";
import { cn } from "@/client/lib/utils";
import { Skeleton } from "@/client/components/ui/skeleton";

export const Route = createFileRoute("/dashboard/detective")({
  head: () => ({
    meta: [
      { title: "Room Event Detective — AirSense" },
      {
        name: "description",
        content:
          "Investigate environmental shifts, log room activities, and explore transparent sensor-activity patterns.",
      },
      { property: "og:title", content: "Room Event Detective — AirSense" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RoomEventDetectivePage,
});

const ACTIVITY_CATEGORIES = [
  {
    id: "cooking",
    label: "Cooking / Kitchen",
    icon: Flame,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "cleaning",
    label: "Cleaning / Mopping",
    icon: Sparkle,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "window_opened",
    label: "Window Opened",
    icon: Wind,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "window_closed",
    label: "Window Closed",
    icon: Wind,
    color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "door_opened",
    label: "Door Opened",
    icon: DoorOpen,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "door_closed",
    label: "Door Closed",
    icon: DoorOpen,
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "ventilation_on",
    label: "Ventilation / Fan On",
    icon: Fan,
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  },
  {
    id: "ventilation_off",
    label: "Ventilation / Fan Off",
    icon: Fan,
    color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
  },
  {
    id: "air_purifier_on",
    label: "Air Purifier On",
    icon: ShieldCheck,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "air_purifier_off",
    label: "Air Purifier Off",
    icon: ShieldCheck,
    color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
  },
  {
    id: "people_entered",
    label: "People Entered Room",
    icon: Layers,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "people_left",
    label: "People Left Room",
    icon: Layers,
    color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  },
  {
    id: "spray_used",
    label: "Aerosol / Spray Used",
    icon: Droplets,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
  {
    id: "candles_incense",
    label: "Candles / Incense",
    icon: Flame,
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "other",
    label: "Other Activity",
    icon: Activity,
    color: "text-muted-foreground bg-muted border-border",
  },
  {
    id: "custom",
    label: "Custom Activity",
    icon: Plus,
    color: "text-primary bg-primary/10 border-primary/20",
  },
];

function formatLocalDatetime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function RoomEventDetectivePage() {
  const { t, lang } = useI18n();
  const { deviceId, device, select: setDeviceId } = useSelectedDevice();
  const { data: devicesList } = useDevices();
  const { data: latestReading, refetch: refetchReading } = useLatest(deviceId);

  // Data states
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [detectedEvents, setDetectedEvents] = useState<DetectedEvent[]>([]);
  const [associations, setAssociations] = useState<ActivityAssociation[]>([]);
  const [insights, setInsights] = useState<RoomInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [searchQuery, setSearchQuery] = useState("");

  // Activity Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<UserActivity | null>(null);
  const [formCategory, setFormCategory] = useState("cooking");
  const [formTitle, setFormTitle] = useState("");
  const [formStartAt, setFormStartAt] = useState(formatLocalDatetime());
  const [formEndAt, setFormEndAt] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evidence Panel State
  const [evidenceTarget, setEvidenceTarget] = useState<{
    event?: DetectedEvent;
    activity?: UserActivity;
    insight?: RoomInsight;
  } | null>(null);
  const [evidenceReadings, setEvidenceReadings] = useState<Reading[]>([]);
  const [isEvidenceLoading, setIsEvidenceLoading] = useState(false);

  // 1. Fetch data
  const loadData = useCallback(async () => {
    if (!deviceId) {
      setIsLoading(false);
      return;
    }
    try {
      const [acts, evts, assocs, ins] = await Promise.all([
        airsenseApi.getActivities(deviceId),
        airsenseApi.getDetectedEvents(deviceId),
        airsenseApi.getAssociations(deviceId),
        airsenseApi.getRoomInsights(deviceId, 14),
      ]);
      setActivities(acts);
      setDetectedEvents(evts);
      setAssociations(assocs);
      setInsights(ins);
    } catch (err) {
      console.warn("Failed to load detective data:", err);
      toast.error("Could not load Room Detective records.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [deviceId]);

  useEffect(() => {
    setIsLoading(true);
    void loadData();
  }, [loadData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadData(), refetchReading()]);
    toast.success("Timeline data updated.");
  };

  // 2. Real Connection Status (Never fake live)
  const connectionState = useMemo(() => {
    if (!device?.lastSeen) {
      return {
        status: "offline",
        label: "Offline",
        color: "bg-red-500",
        text: "No telemetry recorded",
      };
    }
    const diffMs = Date.now() - new Date(device.lastSeen).getTime();
    if (diffMs < 120_000) {
      return {
        status: "live",
        label: "Live Telemetry",
        color: "bg-emerald-500",
        text: "Sensor transmitting live",
      };
    }
    if (diffMs < 900_000) {
      return {
        status: "delayed",
        label: "Delayed",
        color: "bg-amber-500",
        text: `Last received ${Math.round(diffMs / 60000)}m ago`,
      };
    }
    return {
      status: "offline",
      label: "Offline",
      color: "bg-red-500",
      text: `Offline since ${new Date(device.lastSeen).toLocaleTimeString()}`,
    };
  }, [device?.lastSeen]);

  // 3. Open Log Activity Modal
  const openCreateModal = () => {
    setEditingActivity(null);
    setFormCategory("cooking");
    setFormTitle("");
    setFormStartAt(formatLocalDatetime());
    setFormEndAt("");
    setFormNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (act: UserActivity) => {
    setEditingActivity(act);
    setFormCategory(act.category);
    setFormTitle(act.title);
    setFormStartAt(formatLocalDatetime(new Date(act.startAt)));
    setFormEndAt(act.endAt ? formatLocalDatetime(new Date(act.endAt)) : "");
    setFormNotes(act.notes || "");
    setIsModalOpen(true);
  };

  // 4. Save Activity
  const handleSubmitActivity = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deviceId) {
      toast.error("Please select a room/device first.");
      return;
    }
    if (!formTitle.trim()) {
      toast.error("Please provide an activity title.");
      return;
    }
    const startDate = new Date(formStartAt);
    if (isNaN(startDate.getTime())) {
      toast.error("Invalid start time.");
      return;
    }
    let endDate: string | null = null;
    if (formEndAt) {
      const eDate = new Date(formEndAt);
      if (isNaN(eDate.getTime()) || eDate.getTime() < startDate.getTime()) {
        toast.error("End time cannot be earlier than start time.");
        return;
      }
      endDate = eDate.toISOString();
    }

    setIsSubmitting(true);
    try {
      if (editingActivity) {
        const updated = await airsenseApi.updateActivity(editingActivity.id, {
          category: formCategory,
          title: formTitle.trim(),
          notes: formNotes.trim(),
          startAt: startDate.toISOString(),
          endAt: endDate,
        });
        if (updated) {
          toast.success("Activity log updated.");
          setIsModalOpen(false);
          await loadData();
        } else {
          toast.error("Failed to update activity.");
        }
      } else {
        const created = await airsenseApi.createActivity({
          deviceId,
          category: formCategory,
          title: formTitle.trim(),
          notes: formNotes.trim(),
          startAt: startDate.toISOString(),
          endAt: endDate,
        });
        if (created) {
          toast.success("Activity recorded successfully.");
          setIsModalOpen(false);
          await loadData();
        } else {
          toast.error("Failed to save activity record.");
        }
      }
    } catch {
      toast.error("Network error while saving activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete Activity
  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to remove this logged activity?")) return;
    try {
      const ok = await airsenseApi.deleteActivity(id);
      if (ok) {
        toast.success("Activity removed.");
        setActivities((prev) => prev.filter((a) => a.id !== id));
        setAssociations((prev) => prev.filter((a) => a.activityId !== id));
      } else {
        toast.error("Could not delete activity.");
      }
    } catch {
      toast.error("Error communicating with server.");
    }
  };

  // 6. Association Feedback
  const handleAssociationFeedback = async (
    assocId: string,
    status: "confirmed" | "unlikely" | "dismissed",
  ) => {
    try {
      const ok = await airsenseApi.updateAssociationFeedback(assocId, {
        associationStatus: status,
      });
      if (ok) {
        toast.success(
          status === "confirmed" ? "Association noted for pattern tracking." : "Feedback recorded.",
        );
        setAssociations((prev) =>
          prev.map((a) => (a.id === assocId ? { ...a, associationStatus: status } : a)),
        );
      }
    } catch {
      toast.error("Failed to record feedback.");
    }
  };

  // 7. Inspect Evidence
  const inspectEvidence = async (target: {
    event?: DetectedEvent;
    activity?: UserActivity;
    insight?: RoomInsight;
  }) => {
    setEvidenceTarget(target);
    setIsEvidenceLoading(true);

    const timestamp =
      target.event?.startedAt ||
      target.activity?.startAt ||
      target.insight?.analysisWindow.start ||
      new Date().toISOString();

    try {
      if (deviceId) {
        const data = await airsenseApi.getEvidenceData(deviceId, timestamp);
        setEvidenceReadings(data?.readings || []);
      }
    } catch (err) {
      console.warn("Evidence fetch failed:", err);
    } finally {
      setIsEvidenceLoading(false);
    }
  };

  // 8. Filtered Timeline Items
  const timelineItems = useMemo(() => {
    type TimelineItem = {
      id: string;
      kind: "sensor_event" | "user_activity";
      timestamp: Date;
      data: DetectedEvent | UserActivity;
      linkedAssociation?: ActivityAssociation | undefined;
      linkedActivity?: UserActivity | undefined;
      linkedEvent?: DetectedEvent | undefined;
    };

    const items: TimelineItem[] = [];

    // Filter by time range
    const now = Date.now();
    const cutoffMs =
      timeRange === "24h"
        ? now - 24 * 3600 * 1000
        : timeRange === "7d"
          ? now - 7 * 24 * 3600 * 1000
          : timeRange === "30d"
            ? now - 30 * 24 * 3600 * 1000
            : 0;

    // Add detected events
    for (const evt of detectedEvents) {
      const t = new Date(evt.startedAt).getTime();
      if (t >= cutoffMs) {
        const assoc = associations.find((a) => a.detectedEventId === evt.id);
        const linkedAct = assoc ? activities.find((a) => a.id === assoc.activityId) : undefined;
        items.push({
          id: `evt-${evt.id}`,
          kind: "sensor_event",
          timestamp: new Date(evt.startedAt),
          data: evt,
          linkedAssociation: assoc,
          linkedActivity: linkedAct,
        });
      }
    }

    // Add user activities
    for (const act of activities) {
      const t = new Date(act.startAt).getTime();
      if (t >= cutoffMs) {
        const assoc = associations.find((a) => a.activityId === act.id);
        const linkedEvt = assoc
          ? detectedEvents.find((e) => e.id === assoc.detectedEventId)
          : undefined;
        items.push({
          id: `act-${act.id}`,
          kind: "user_activity",
          timestamp: new Date(act.startAt),
          data: act,
          linkedAssociation: assoc,
          linkedEvent: linkedEvt,
        });
      }
    }

    // Sort chronologically descending
    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply category filter
    return items.filter((item) => {
      if (categoryFilter !== "all") {
        if (categoryFilter === "sensor_changes" && item.kind !== "sensor_event") return false;
        if (categoryFilter !== "sensor_changes") {
          if (item.kind === "sensor_event") return false;
          if ((item.data as UserActivity).category !== categoryFilter) return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        let title = "";
        let desc = "";
        let notes = "";
        if (item.kind === "sensor_event") {
          const d = item.data as DetectedEvent;
          title = d.title.toLowerCase();
          desc = d.description.toLowerCase();
        } else {
          const d = item.data as UserActivity;
          title = d.title.toLowerCase();
          notes = d.notes?.toLowerCase() || "";
        }
        if (!title.includes(query) && !desc.includes(query) && !notes.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [detectedEvents, activities, associations, timeRange, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("dash.detective")}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Understand when your indoor environment changes and explore what might be associated
                with it.
              </p>
            </div>
          </div>
        </div>

        {/* Actions: Room Selector + Live Badge + Refresh + Log Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Room Selector */}
          {devicesList && devicesList.length > 0 && (
            <div className="relative">
              <select
                value={deviceId || ""}
                onChange={(e) => setDeviceId(e.target.value)}
                className="appearance-none rounded-xl border bg-card px-3 py-2 pr-8 text-xs font-medium text-foreground shadow-sm hover:bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {devicesList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <ChevronRight className="h-3.5 w-3.5 rotate-90" />
              </div>
            </div>
          )}

          {/* Genuine Connection Status Indicator */}
          <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-xs shadow-sm">
            <span className={cn("h-2 w-2 rounded-full", connectionState.color)} />
            <span className="font-medium text-foreground">{connectionState.label}</span>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-muted-foreground shadow-sm hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>

          {/* Primary CTA: Log Room Activity */}
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Log Room Activity</span>
          </button>
        </div>
      </div>

      {/* 2. Sensor Overview Cards (Actual DHT22 & MQ-135 Telemetry) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* Card 1: MQ-135 Relative Signal */}
        <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              MQ-135 Sensor Signal
            </span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {latestReading ? latestReading.mq135 : "—"}
            </span>
            <span className="text-xs text-muted-foreground">relative signal</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
            Raw analog ADC reading. Reflects relative air shifts; not calibrated ppm or official
            AQI.
          </p>
        </div>

        {/* Card 2: Temperature */}
        <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              DHT22 Temperature
            </span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-orange-500/10 text-orange-500">
              <Thermometer className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {latestReading ? `${latestReading.temperature}°C` : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {latestReading &&
                (latestReading.temperature >= 20 && latestReading.temperature <= 26
                  ? "Optimal Range"
                  : "Outside baseline")}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
            Indoor temperature from hardware probe. Useful for detecting open windows or cooking
            warmth.
          </p>
        </div>

        {/* Card 3: Relative Humidity */}
        <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              DHT22 Humidity
            </span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <Droplets className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {latestReading ? `${latestReading.humidity}%` : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {latestReading &&
                (latestReading.humidity >= 40 && latestReading.humidity <= 60
                  ? "Comfortable"
                  : "Shift detected")}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
            Indoor relative humidity. Often increases during cleaning, showers, or ventilation
            changes.
          </p>
        </div>
      </div>

      {/* 3. Personalized Pattern Detection / Insights */}
      <div className="rounded-3xl border bg-card/40 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Evidence-Based Environmental Insights
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Transparent Rules Engine • Non-Causal Associations
          </span>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : insights.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
            <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium">No pattern reports yet</p>
            <p className="text-xs mt-1">
              Start by logging room activities whenever you cook, clean, or open windows.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {insights.map((ins, idx) => {
              const isRepeated = ins.evidenceLevel === "repeated_association";
              const isSingle = ins.evidenceLevel === "single_observation";
              return (
                <div
                  key={ins.id || idx}
                  className="rounded-2xl border bg-card p-4 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-foreground">{ins.title}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                          isRepeated
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : isSingle
                              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                              : "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {isRepeated
                          ? "Repeated Association"
                          : isSingle
                            ? "Single Observation"
                            : "Collecting Baseline"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ins.summary}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                    <span>
                      {ins.evidenceCount} observation{ins.evidenceCount === 1 ? "" : "s"} tracked
                    </span>
                    <button
                      type="button"
                      onClick={() => inspectEvidence({ insight: ins })}
                      className="flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Inspect Evidence</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Interactive Timeline Section */}
      <div className="space-y-4">
        {/* Timeline Filter Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-bold text-foreground">Room Event Timeline</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {timelineItems.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 rounded-xl border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-40 sm:w-52"
              />
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 rounded-xl border bg-card px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="sensor_changes">Sensor Shifts Only</option>
              <option value="cooking">Cooking</option>
              <option value="cleaning">Cleaning</option>
              <option value="window_opened">Window Opened</option>
              <option value="window_closed">Window Closed</option>
              <option value="ventilation_on">Ventilation</option>
              <option value="spray_used">Aerosols / Sprays</option>
              <option value="other">Other</option>
            </select>

            {/* Range Toggle */}
            <div className="flex rounded-xl border bg-card p-0.5 text-xs">
              {(["24h", "7d", "30d", "all"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                    timeRange === r
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r === "24h" ? "24h" : r === "7d" ? "7d" : r === "30d" ? "30d" : "All"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Items List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : timelineItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
            <Filter className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No events found in this period</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No sensor events or activities match your selected filters. Adjust your time range or
              log a new room activity.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log First Activity</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {timelineItems.map((item) => {
              const isSensorEvent = item.kind === "sensor_event";
              const evt = isSensorEvent ? (item.data as DetectedEvent) : null;
              const act = !isSensorEvent ? (item.data as UserActivity) : null;
              const assoc = item.linkedAssociation;

              // Find category details
              const catDetails =
                ACTIVITY_CATEGORIES.find((c) => c.id === (act?.category || "other")) ??
                ACTIVITY_CATEGORIES[0]!;
              const CategoryIcon = isSensorEvent ? Activity : catDetails.icon;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border p-4 shadow-sm transition-all hover:border-primary/40",
                    isSensorEvent ? "bg-card/90 border-primary/20" : "bg-card/70 border-border/80",
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-xl border mt-0.5",
                          isSensorEvent
                            ? "bg-primary/10 text-primary border-primary/25"
                            : catDetails.color,
                        )}
                      >
                        <CategoryIcon className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">
                            {isSensorEvent ? evt?.title : act?.title}
                          </h3>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                              isSensorEvent
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-secondary text-secondary-foreground border-border",
                            )}
                          >
                            {isSensorEvent ? "Sensor Detection" : "User Logged Activity"}
                          </span>

                          {/* Linked Candidate Association Tag */}
                          {assoc && (
                            <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-medium flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              <span>
                                {isSensorEvent
                                  ? `Overlaps with: ${item.linkedActivity?.title || "Logged Activity"}`
                                  : `Linked to: ${item.linkedEvent?.title || "Sensor Shift"}`}
                              </span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {isSensorEvent
                            ? evt?.description
                            : act?.notes || "No user notes recorded."}
                        </p>

                        {/* Baseline vs Observed Metrics for Sensor Events */}
                        {isSensorEvent && evt?.baselineValue !== undefined && (
                          <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground font-mono">
                            <span>Baseline: {evt.baselineValue}</span>
                            <span>→</span>
                            <span className="text-foreground font-bold">
                              Observed: {evt.observedValue}
                            </span>
                            <span className="text-primary font-semibold">
                              (Δ{" "}
                              {evt.changeMagnitude! > 0
                                ? `+${evt.changeMagnitude}`
                                : evt.changeMagnitude}
                              )
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Timestamp & Controls */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                      <div className="text-[11px] text-muted-foreground font-medium">
                        {item.timestamp.toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {item.timestamp.toLocaleTimeString(lang === "te" ? "te-IN" : "en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            inspectEvidence(isSensorEvent ? { event: evt! } : { activity: act! })
                          }
                          className="flex items-center gap-1 rounded-lg border bg-secondary/60 px-2 py-1 text-[11px] text-foreground hover:bg-secondary font-medium transition-colors"
                        >
                          <Eye className="h-3 w-3 text-primary" />
                          <span>Inspect</span>
                        </button>

                        {!isSensorEvent && act && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(act)}
                              className="rounded-lg border bg-secondary/60 p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit Activity"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(act.id)}
                              className="rounded-lg border bg-secondary/60 p-1 text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Delete Activity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Association Feedback Actions if Candidate */}
                  {assoc && assoc.associationStatus === "candidate" && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-xs bg-muted/30 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl">
                      <span className="text-[11px] text-muted-foreground">
                        Did this activity likely relate to the observed sensor shift?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAssociationFeedback(assoc.id, "confirmed")}
                          className="flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-2 py-1 text-[11px] font-semibold hover:bg-emerald-500/25 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Confirm Observation</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAssociationFeedback(assoc.id, "unlikely")}
                          className="rounded-md border bg-card px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Unlikely
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAssociationFeedback(assoc.id, "dismissed")}
                          className="rounded-md border bg-card px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Modal / Sheet: Log or Edit Activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {editingActivity ? "Edit Room Activity" : "Log Room Activity"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Record what happened in the room to compare with sensor telemetry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitActivity} className="space-y-4">
              {/* Category Picker */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Activity Category *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border rounded-xl bg-background/50">
                  {ACTIVITY_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const selected = formCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormCategory(cat.id);
                          if (
                            !formTitle ||
                            ACTIVITY_CATEGORIES.some((c) => c.label === formTitle)
                          ) {
                            setFormTitle(cat.label);
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-lg p-2 text-left text-xs transition-colors border",
                          selected
                            ? "bg-primary/10 border-primary text-primary font-bold"
                            : "border-transparent hover:bg-secondary text-muted-foreground",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Cooking, Deep Cleaning, Opened Balcony"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartAt}
                    onChange={(e) => setFormStartAt(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    End Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formEndAt}
                    onChange={(e) => setFormEndAt(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  User Notes / Observations (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder="e.g. Fried spices with exhaust fan turned off for 15 mins..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border bg-secondary/60 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting && <RefreshCw className="h-3 w-3 animate-spin" />}
                  <span>{editingActivity ? "Save Changes" : "Record Activity"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Deep Evidence Panel Modal */}
      {evidenceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Evidence Inspection Panel
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Transparent telemetry audit and trigger validation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvidenceTarget(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Description */}
            <div className="rounded-2xl border bg-secondary/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">
                  {evidenceTarget.event?.title ||
                    evidenceTarget.activity?.title ||
                    evidenceTarget.insight?.title}
                </span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  {evidenceTarget.event?.ruleVersion || "evidence-v1.0"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {evidenceTarget.event?.description ||
                  evidenceTarget.activity?.notes ||
                  evidenceTarget.insight?.summary}
              </p>
            </div>

            {/* Time-Series Chart of Event Window (+/- 45 mins) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">
                  Sensor Telemetry Window (DHT22 & MQ-135)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {evidenceReadings.length} data samples recorded
                </span>
              </div>

              {isEvidenceLoading ? (
                <Skeleton className="h-44 w-full rounded-2xl" />
              ) : evidenceReadings.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                  No sensor samples recorded in this specific time window.
                </div>
              ) : (
                <div className="h-48 w-full rounded-2xl border bg-background/50 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={evidenceReadings}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="evidenceMqGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(t) =>
                          new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        }
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const r = payload[0]?.payload as Reading;
                          return (
                            <div className="rounded-xl border bg-card p-2.5 text-xs shadow-lg space-y-1">
                              <p className="font-semibold text-foreground">
                                {new Date(r.timestamp).toLocaleTimeString()}
                              </p>
                              <p className="text-emerald-500 font-bold">MQ-135: {r.mq135}</p>
                              <p className="text-orange-500">Temp: {r.temperature}°C</p>
                              <p className="text-cyan-500">Humidity: {r.humidity}%</p>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="mq135"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#evidenceMqGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Scientific Transparency Disclaimer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                <p className="font-semibold text-foreground">
                  Scientific Uncertainty & Methodology Notice
                </p>
                <p>
                  AirSense identifies timestamp associations between sensor changes and
                  user-recorded activities. Sensors (DHT22, MQ-135) detect physical changes in
                  climate and air composition, but cannot verify causality. An observed association
                  is an invitation to explore your indoor air patterns, not conclusive proof that an
                  activity caused a shift.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setEvidenceTarget(null)}
                className="rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
