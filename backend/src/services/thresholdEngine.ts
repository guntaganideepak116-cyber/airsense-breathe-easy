import type { AiRecommendationStatus, AiRecommendationPriority } from "../models/types.js";

export interface SensorInputData {
  deviceId: string;
  roomName?: string;
  mq135: number;
  temperature: number;
  humidity: number;
  timestamp?: string | Date;
}

export interface ThresholdEvaluation {
  status: AiRecommendationStatus;
  priority: AiRecommendationPriority;
  mq135Level: "good" | "attention" | "warning" | "critical";
  tempLevel: "normal" | "warm" | "hot" | "cold";
  humidityLevel: "normal" | "elevated" | "high" | "dry";
  findings: string[];
  deterministicSummary: string;
  deterministicActions: string[];
}

/**
 * Deterministic Threshold Engine.
 * Evaluates indoor environmental sensors and establishes the baseline severity
 * before passing context to the AI Recommendation Engine.
 */
export function evaluateThresholds(data: SensorInputData): ThresholdEvaluation {
  const { mq135, temperature, humidity } = data;
  const findings: string[] = [];
  const deterministicActions: string[] = [];

  // 1. Evaluate MQ-135 reading
  let mq135Level: "good" | "attention" | "warning" | "critical" = "good";
  if (mq135 >= 1000) {
    mq135Level = "critical";
    findings.push("Air-quality sensor reading is at critical level");
    deterministicActions.push("Open all available windows and turn on exhaust fans immediately.");
    deterministicActions.push("Inspect the room for potential smoke, combustion, or VOC sources.");
  } else if (mq135 >= 700) {
    mq135Level = "warning";
    findings.push("Air-quality sensor reading is elevated");
    deterministicActions.push("Improve ventilation by opening windows or running an exhaust fan.");
    deterministicActions.push("Check for possible indoor pollution sources.");
  } else if (mq135 >= 400) {
    mq135Level = "attention";
    findings.push("Air-quality sensor reading is moderately elevated");
    deterministicActions.push("Consider opening a window for fresh outdoor air circulation.");
  } else {
    findings.push("Air-quality sensor reading is normal and clean");
    deterministicActions.push("Maintain current ventilation.");
  }

  // 2. Evaluate Temperature
  let tempLevel: "normal" | "warm" | "hot" | "cold" = "normal";
  if (temperature > 32) {
    tempLevel = "hot";
    findings.push("Temperature is high");
    deterministicActions.push("Improve indoor air circulation with fans or air conditioning to reduce heat.");
  } else if (temperature > 28) {
    tempLevel = "warm";
    findings.push("Temperature is mildly elevated");
    deterministicActions.push("Promote airflow to maintain comfort.");
  } else if (temperature < 18) {
    tempLevel = "cold";
    findings.push("Temperature is low");
    deterministicActions.push("Adjust heating or seal drafts if the room feels uncomfortably cool.");
  }

  // 3. Evaluate Humidity
  let humidityLevel: "normal" | "elevated" | "high" | "dry" = "normal";
  if (humidity > 75) {
    humidityLevel = "high";
    findings.push("Relative humidity is high");
    deterministicActions.push("Reduce indoor moisture sources and use an exhaust fan or dehumidifier.");
  } else if (humidity > 65) {
    humidityLevel = "elevated";
    findings.push("Relative humidity is elevated");
    deterministicActions.push("Ensure continuous air exchange to avoid moisture buildup.");
  } else if (humidity < 35) {
    humidityLevel = "dry";
    findings.push("Relative humidity is low");
    deterministicActions.push("Consider improving indoor humidity if the air feels dry.");
  }

  // 4. Compute overall status and priority
  let status: AiRecommendationStatus = "good";
  let priority: AiRecommendationPriority = "low";

  const isMultiAbnormal =
    (mq135Level !== "good" ? 1 : 0) +
    (tempLevel !== "normal" ? 1 : 0) +
    (humidityLevel !== "normal" ? 1 : 0) >= 2;

  if (mq135Level === "critical" || (mq135Level === "warning" && (tempLevel === "hot" || humidityLevel === "high"))) {
    status = "critical";
    priority = "high";
  } else if (mq135Level === "warning" || tempLevel === "hot" || humidityLevel === "high") {
    status = "warning";
    priority = "high";
  } else if (mq135Level === "attention" || tempLevel === "warm" || tempLevel === "cold" || humidityLevel === "elevated" || humidityLevel === "dry") {
    status = "attention";
    priority = "medium";
  } else {
    status = "good";
    priority = "low";
  }

  // 5. Compose deterministic fallback summary
  let deterministicSummary = "Indoor conditions are currently stable.";
  if (status === "critical") {
    deterministicSummary = isMultiAbnormal
      ? "Critical conditions detected: multiple environmental readings are severely elevated. Take immediate ventilation action."
      : "Critical air-quality sensor reading detected. Open windows and ventilate immediately.";
  } else if (status === "warning") {
    if (isMultiAbnormal) {
      deterministicSummary = "Temperature, humidity, or air-quality readings are elevated. Improve ventilation and investigate indoor sources.";
    } else if (mq135Level === "warning") {
      deterministicSummary = "The air-quality sensor reading is elevated. Improve ventilation and check for possible indoor pollution sources.";
    } else if (tempLevel === "hot") {
      deterministicSummary = "Temperature is elevated. Improve air circulation or cooling if possible.";
    } else if (humidityLevel === "high") {
      deterministicSummary = "Humidity is elevated. Improve ventilation and consider reducing indoor moisture sources.";
    }
  } else if (status === "attention") {
    if (isMultiAbnormal) {
      deterministicSummary = "Mild deviations detected across multiple readings. Refresh the room with fresh air.";
    } else if (mq135Level === "attention") {
      deterministicSummary = "Air-quality sensor reading is slightly higher than usual. Consider refreshing indoor air.";
    } else if (tempLevel === "warm") {
      deterministicSummary = "Temperature is slightly warm. Keep air circulating.";
    } else if (humidityLevel === "elevated") {
      deterministicSummary = "Humidity is slightly elevated. Keep air moving to prevent dampness.";
    } else if (humidityLevel === "dry") {
      deterministicSummary = "Humidity is low. Consider improving indoor humidity if the room feels dry.";
    }
  }

  // Deduplicate and limit actions to 4 items
  const uniqueActions = Array.from(new Set(deterministicActions)).slice(0, 4);
  if (uniqueActions.length === 0) {
    uniqueActions.push("Continue normal ventilation.");
    uniqueActions.push("Keep monitoring the room conditions.");
  }

  return {
    status,
    priority,
    mq135Level,
    tempLevel,
    humidityLevel,
    findings,
    deterministicSummary,
    deterministicActions: uniqueActions,
  };
}
