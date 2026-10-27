import { dbService } from "./dbService.js";
import type {
  SensorReadingDoc,
  UserActivityDoc,
  DetectedEventDoc,
  ActivityAssociationDoc,
  RoomInsightDoc,
  DetectedEventType,
  SensorType,
} from "../models/types.js";

// Detection Configuration
export interface DetectionConfig {
  mq135SpikeRelativePct: number; // e.g. 20%
  mq135SpikeAbsoluteMin: number; // e.g. 50 units
  tempChangeDelta: number; // e.g. 2.0 °C
  humidityChangeDelta: number; // e.g. 10 %
  baselineWindowMinutes: number; // 20 minutes
  cooldownWindowMinutes: number; // 15 minutes
  associationWindowMinutes: number; // 30 minutes
  minRepeatedEvidenceCount: number; // 2 observations
}

export const DEFAULT_DETECTION_CONFIG: DetectionConfig = {
  mq135SpikeRelativePct: 20,
  mq135SpikeAbsoluteMin: 50,
  tempChangeDelta: 2.0,
  humidityChangeDelta: 10.0,
  baselineWindowMinutes: 20,
  cooldownWindowMinutes: 15,
  associationWindowMinutes: 30,
  minRepeatedEvidenceCount: 2,
};

// Memory cache of recent event timestamps for cooldown deduplication
const lastEventTimestampByType = new Map<string, number>();

function getCooldownKey(deviceId: string, eventType: string): string {
  return `${deviceId}:${eventType}`;
}

export const roomEventService = {
  /**
   * Process a new incoming reading and detect environmental change events.
   */
  async processReadingForEvents(
    reading: SensorReadingDoc,
    config: DetectionConfig = DEFAULT_DETECTION_CONFIG,
  ): Promise<DetectedEventDoc[]> {
    const { deviceId, timestamp, mq135, temperature, humidity } = reading;
    const readingTime = new Date(timestamp).getTime();

    // 1. Validate data ranges
    if (
      isNaN(mq135) ||
      mq135 <= 0 ||
      isNaN(temperature) ||
      temperature < -40 ||
      temperature > 85 ||
      isNaN(humidity) ||
      humidity < 0 ||
      humidity > 100
    ) {
      return [];
    }

    // 2. Fetch recent baseline readings (past 20 minutes)
    const baselineSince = new Date(readingTime - config.baselineWindowMinutes * 60 * 1000);
    const history = await dbService.getHistory(deviceId, baselineSince);

    // Need at least 2 prior samples to establish a baseline
    const priorSamples = history.filter(
      (r) => new Date(r.timestamp).getTime() < readingTime,
    );
    if (priorSamples.length < 2) {
      return [];
    }

    // Calculate baseline medians/averages
    const avgMq135 =
      priorSamples.reduce((sum, r) => sum + r.mq135, 0) / priorSamples.length;
    const avgTemp =
      priorSamples.reduce((sum, r) => sum + r.temperature, 0) / priorSamples.length;
    const avgHumidity =
      priorSamples.reduce((sum, r) => sum + r.humidity, 0) / priorSamples.length;

    const detectedEvents: DetectedEventDoc[] = [];

    // Helper to check cooldown
    const checkCooldown = (eventType: DetectedEventType): boolean => {
      const key = getCooldownKey(deviceId, eventType);
      const lastTime = lastEventTimestampByType.get(key) || 0;
      if (readingTime - lastTime < config.cooldownWindowMinutes * 60 * 1000) {
        return false;
      }
      return true;
    };

    // A. Check MQ-135 Relative Spike
    const mqDiff = mq135 - avgMq135;
    const mqPctChange = avgMq135 > 0 ? (mqDiff / avgMq135) * 100 : 0;

    if (
      mqPctChange >= config.mq135SpikeRelativePct &&
      mqDiff >= config.mq135SpikeAbsoluteMin &&
      checkCooldown("mq135_spike")
    ) {
      const event: DetectedEventDoc = {
        deviceId,
        userId: reading.userId,
        eventType: "mq135_spike",
        sensorType: "mq135",
        title: "MQ-135 Relative Signal Rise",
        description: `MQ-135 sensor signal rose to ${mq135} (+${Math.round(mqPctChange)}% / +${Math.round(mqDiff)} relative units above baseline).`,
        startedAt: new Date(timestamp),
        baselineValue: Math.round(avgMq135),
        observedValue: mq135,
        changeMagnitude: Math.round(mqDiff),
        ruleVersion: "1.0-relative-baseline",
        status: "detected",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const saved = await dbService.saveDetectedEvent(event);
      lastEventTimestampByType.set(getCooldownKey(deviceId, "mq135_spike"), readingTime);
      detectedEvents.push(saved);
    }

    // B. Check Temperature Rapid Rise
    const tempDiff = temperature - avgTemp;
    if (tempDiff >= config.tempChangeDelta && checkCooldown("temp_rise")) {
      const event: DetectedEventDoc = {
        deviceId,
        userId: reading.userId,
        eventType: "temp_rise",
        sensorType: "temperature",
        title: "Temperature Elevation",
        description: `Temperature rose to ${temperature}°C (+${Math.round(tempDiff * 10) / 10}°C above baseline).`,
        startedAt: new Date(timestamp),
        baselineValue: Math.round(avgTemp * 10) / 10,
        observedValue: temperature,
        changeMagnitude: Math.round(tempDiff * 10) / 10,
        ruleVersion: "1.0-threshold-rise",
        status: "detected",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const saved = await dbService.saveDetectedEvent(event);
      lastEventTimestampByType.set(getCooldownKey(deviceId, "temp_rise"), readingTime);
      detectedEvents.push(saved);
    }

    // C. Check Temperature Rapid Drop
    if (tempDiff <= -config.tempChangeDelta && checkCooldown("temp_drop")) {
      const event: DetectedEventDoc = {
        deviceId,
        userId: reading.userId,
        eventType: "temp_drop",
        sensorType: "temperature",
        title: "Temperature Decrease",
        description: `Temperature dropped to ${temperature}°C (${Math.round(tempDiff * 10) / 10}°C below baseline).`,
        startedAt: new Date(timestamp),
        baselineValue: Math.round(avgTemp * 10) / 10,
        observedValue: temperature,
        changeMagnitude: Math.round(Math.abs(tempDiff) * 10) / 10,
        ruleVersion: "1.0-threshold-drop",
        status: "detected",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const saved = await dbService.saveDetectedEvent(event);
      lastEventTimestampByType.set(getCooldownKey(deviceId, "temp_drop"), readingTime);
      detectedEvents.push(saved);
    }

    // D. Check Humidity Rapid Rise
    const humDiff = humidity - avgHumidity;
    if (humDiff >= config.humidityChangeDelta && checkCooldown("humidity_rise")) {
      const event: DetectedEventDoc = {
        deviceId,
        userId: reading.userId,
        eventType: "humidity_rise",
        sensorType: "humidity",
        title: "Humidity Surge",
        description: `Relative humidity rose to ${humidity}% (+${Math.round(humDiff)}% above baseline).`,
        startedAt: new Date(timestamp),
        baselineValue: Math.round(avgHumidity),
        observedValue: humidity,
        changeMagnitude: Math.round(humDiff),
        ruleVersion: "1.0-threshold-rise",
        status: "detected",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const saved = await dbService.saveDetectedEvent(event);
      lastEventTimestampByType.set(getCooldownKey(deviceId, "humidity_rise"), readingTime);
      detectedEvents.push(saved);
    }

    // E. Automatically link new detected events with nearby user activities
    if (detectedEvents.length > 0 && reading.userId) {
      for (const evt of detectedEvents) {
        await this.linkEventWithNearbyActivities(evt, reading.userId, config);
      }
    }

    return detectedEvents;
  },

  /**
   * Links a single detected event with existing activities logged near that time.
   */
  async linkEventWithNearbyActivities(
    event: DetectedEventDoc,
    userId: string,
    config: DetectionConfig = DEFAULT_DETECTION_CONFIG,
  ): Promise<ActivityAssociationDoc[]> {
    if (!event.id) return [];
    const eventTime = new Date(event.startedAt).getTime();
    const windowMs = config.associationWindowMinutes * 60 * 1000;

    const activities = await dbService.getUserActivities(userId, event.deviceId, 100);
    const associations: ActivityAssociationDoc[] = [];

    for (const act of activities) {
      if (!act.id) continue;
      const actStart = new Date(act.startAt).getTime();
      const actEnd = act.endAt ? new Date(act.endAt).getTime() : actStart + 15 * 60 * 1000;

      // Check for overlap or proximity
      const isOverlapping = eventTime >= actStart && eventTime <= actEnd;
      const isNearby =
        Math.abs(eventTime - actStart) <= windowMs || Math.abs(eventTime - actEnd) <= windowMs;

      if (isOverlapping || isNearby) {
        let timeRelationship: "overlap" | "preceding" | "following" = "overlap";
        let timeDifferenceSeconds = 0;

        if (isOverlapping) {
          timeRelationship = "overlap";
        } else if (actStart <= eventTime) {
          timeRelationship = "preceding"; // activity came before the sensor event
          timeDifferenceSeconds = Math.round((eventTime - actStart) / 1000);
        } else {
          timeRelationship = "following"; // activity came after the sensor event
          timeDifferenceSeconds = Math.round((actStart - eventTime) / 1000);
        }

        const assoc: ActivityAssociationDoc = {
          userId,
          deviceId: event.deviceId,
          activityId: act.id,
          detectedEventId: event.id,
          timeRelationship,
          timeDifferenceSeconds,
          associationStatus: "candidate",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const saved = await dbService.saveAssociation(assoc);
        associations.push(saved);
      }
    }

    return associations;
  },

  /**
   * Links a newly saved user activity with existing detected sensor events near that time.
   */
  async linkActivityWithNearbyEvents(
    activity: UserActivityDoc,
    config: DetectionConfig = DEFAULT_DETECTION_CONFIG,
  ): Promise<ActivityAssociationDoc[]> {
    if (!activity.id) return [];
    const actStart = new Date(activity.startAt).getTime();
    const actEnd = activity.endAt ? new Date(activity.endAt).getTime() : actStart + 15 * 60 * 1000;
    const windowMs = config.associationWindowMinutes * 60 * 1000;

    const events = await dbService.getDetectedEvents(activity.deviceId, 100);
    const associations: ActivityAssociationDoc[] = [];

    for (const evt of events) {
      if (!evt.id) continue;
      const eventTime = new Date(evt.startedAt).getTime();

      const isOverlapping = eventTime >= actStart && eventTime <= actEnd;
      const isNearby =
        Math.abs(eventTime - actStart) <= windowMs || Math.abs(eventTime - actEnd) <= windowMs;

      if (isOverlapping || isNearby) {
        let timeRelationship: "overlap" | "preceding" | "following" = "overlap";
        let timeDifferenceSeconds = 0;

        if (isOverlapping) {
          timeRelationship = "overlap";
        } else if (actStart <= eventTime) {
          timeRelationship = "preceding";
          timeDifferenceSeconds = Math.round((eventTime - actStart) / 1000);
        } else {
          timeRelationship = "following";
          timeDifferenceSeconds = Math.round((actStart - eventTime) / 1000);
        }

        const assoc: ActivityAssociationDoc = {
          userId: activity.userId,
          deviceId: activity.deviceId,
          activityId: activity.id,
          detectedEventId: evt.id,
          timeRelationship,
          timeDifferenceSeconds,
          associationStatus: "candidate",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const saved = await dbService.saveAssociation(assoc);
        associations.push(saved);
      }
    }

    return associations;
  },

  /**
   * Run recurring pattern detection analysis across activities and events.
   * Transparent, rules-based, non-causal language.
   */
  async analyzePatterns(
    userId: string,
    deviceId: string,
    daysToAnalyze = 14,
    config: DetectionConfig = DEFAULT_DETECTION_CONFIG,
  ): Promise<RoomInsightDoc[]> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - daysToAnalyze * 24 * 60 * 60 * 1000);

    const [activities, events, associations] = await Promise.all([
      dbService.getUserActivities(userId, deviceId, 200),
      dbService.getDetectedEvents(deviceId, 200),
      dbService.getAssociations(userId, deviceId),
    ]);

    const activeAssocs = associations.filter(
      (a) => a.associationStatus !== "dismissed" && a.associationStatus !== "unlikely",
    );

    // Map by activityId and eventId for quick lookup
    const actMap = new Map(activities.map((a) => [a.id, a]));
    const evtMap = new Map(events.map((e) => [e.id, e]));

    // Group associations by category + eventType
    const patternGroups = new Map<
      string,
      {
        category: string;
        eventType: DetectedEventType;
        sensorType: SensorType;
        activityIds: Set<string>;
        eventIds: Set<string>;
      }
    >();

    for (const assoc of activeAssocs) {
      const act = actMap.get(assoc.activityId);
      const evt = evtMap.get(assoc.detectedEventId);
      if (!act || !evt) continue;

      const groupKey = `${act.category}::${evt.eventType}`;
      let group = patternGroups.get(groupKey);
      if (!group) {
        group = {
          category: act.category,
          eventType: evt.eventType,
          sensorType: evt.sensorType,
          activityIds: new Set(),
          eventIds: new Set(),
        };
        patternGroups.set(groupKey, group);
      }
      if (act.id) group.activityIds.add(act.id);
      if (evt.id) group.eventIds.add(evt.id);
    }

    const insights: RoomInsightDoc[] = [];

    // Format readable category names
    const formatCategory = (cat: string) => {
      const map: Record<string, string> = {
        cooking: "Cooking",
        cleaning: "Cleaning",
        window_opened: "Window Opening",
        window_closed: "Window Closing",
        door_opened: "Door Opening",
        door_closed: "Door Closing",
        ventilation_on: "Ventilation Turned On",
        ventilation_off: "Ventilation Turned Off",
        air_purifier_on: "Air Purifier Turned On",
        air_purifier_off: "Air Purifier Turned Off",
        people_entered: "People Entering",
        people_left: "People Leaving",
        spray_used: "Aerosol / Spray Use",
        candles_incense: "Candles / Incense",
      };
      return map[cat] || cat.replace(/_/g, " ");
    };

    // If no patterns or too few associations, return an Insufficient Evidence insight
    if (patternGroups.size === 0 || activities.length < 2) {
      const insufficientDoc: RoomInsightDoc = {
        userId,
        deviceId,
        insightType: "baseline_status",
        title: "Collecting Environmental Baseline",
        summary:
          "There is not yet enough activity history to identify a recurring pattern. Log room activities (such as cooking, cleaning, or opening windows) whenever environmental shifts occur to discover trends.",
        analysisWindow: { start: windowStart, end: now },
        supportingEventIds: [],
        supportingActivityIds: [],
        evidenceCount: activities.length,
        evidenceLevel: "insufficient",
        algorithmVersion: "1.0-rules-transparent",
        generatedAt: now,
      };
      const saved = await dbService.saveRoomInsight(insufficientDoc);
      insights.push(saved);
      return insights;
    }

    // Process each pattern group
    for (const group of patternGroups.values()) {
      const count = group.activityIds.size;
      const catName = formatCategory(group.category);
      const isRepeated = count >= config.minRepeatedEvidenceCount;
      const evidenceLevel = isRepeated ? "repeated_association" : "single_observation";

      let sensorLabel = "sensor reading";
      if (group.sensorType === "mq135") sensorLabel = "MQ-135 relative sensor signal";
      else if (group.sensorType === "temperature") sensorLabel = "room temperature";
      else if (group.sensorType === "humidity") sensorLabel = "relative humidity";

      let changeVerb = "changed";
      if (group.eventType.includes("spike") || group.eventType.includes("rise")) {
        changeVerb = "increased";
      } else if (group.eventType.includes("drop")) {
        changeVerb = "decreased";
      }

      const summary = isRepeated
        ? `In the last ${daysToAnalyze} days, elevated or altered ${sensorLabel} has repeatedly occurred near times when you recorded ${catName} (${count} observations). This indicates an observed association, not confirmed causation.`
        : `A single observation was recorded where ${sensorLabel} ${changeVerb} near times when you recorded ${catName}. More observations are required to establish whether a pattern exists.`;

      const insightDoc: RoomInsightDoc = {
        userId,
        deviceId,
        insightType: `pattern_${group.category}_${group.eventType}`,
        title: isRepeated
          ? `Recurring Association: ${catName} & ${sensorLabel}`
          : `Observed Association: ${catName}`,
        summary,
        analysisWindow: { start: windowStart, end: now },
        supportingEventIds: Array.from(group.eventIds),
        supportingActivityIds: Array.from(group.activityIds),
        evidenceCount: count,
        evidenceLevel,
        algorithmVersion: "1.0-rules-transparent",
        generatedAt: now,
      };

      const saved = await dbService.saveRoomInsight(insightDoc);
      insights.push(saved);
    }

    return insights;
  },
};
