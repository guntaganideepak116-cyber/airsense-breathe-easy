import { z } from "zod";
import { config } from "../config/index.js";
import { dbService } from "./dbService.js";
import {
  evaluateThresholds,
  type SensorInputData,
  type ThresholdEvaluation,
} from "./thresholdEngine.js";
import type {
  AiRecommendationResult,
  AiRecommendationDoc,
  AiRecommendationStatus,
  AiRecommendationPriority,
} from "../models/types.js";

// ============================================================================
// 1. Zod Validation Schema for Structured AI Output
// ============================================================================

const rawAiResponseSchema = z.object({
  status: z.enum(["good", "attention", "warning", "critical"]),
  summary: z.string().min(5).max(400),
  recommendations: z.array(z.string().min(3).max(250)).min(1).max(5),
  priority: z.enum(["low", "medium", "high"]),
});

export type ValidatedAiOutput = z.infer<typeof rawAiResponseSchema>;

// ============================================================================
// 2. AI Provider Abstraction Interface
// ============================================================================

export interface AIProviderClient {
  name: string;
  generateText(systemPrompt: string, userPrompt: string): Promise<string>;
}

// ----------------------------------------------------------------------------
// Groq Provider (OpenAI-compatible)
// ----------------------------------------------------------------------------
class GroqProviderClient implements AIProviderClient {
  name = "groq";

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!config.ai.apiKey) {
      throw new Error("AI_API_KEY is not configured for Groq provider.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.ai.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.ai.model || "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 350,
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Groq API responded with status ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Groq API returned an empty response choice.");
      }
      return content;
    } finally {
      clearTimeout(timeout);
    }
  }
}

// ----------------------------------------------------------------------------
// Google Gemini Provider
// ----------------------------------------------------------------------------
class GeminiProviderClient implements AIProviderClient {
  name = "gemini";

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!config.ai.apiKey) {
      throw new Error("AI_API_KEY is not configured for Gemini provider.");
    }

    const model = config.ai.model || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.ai.apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 350,
            temperature: 0.2,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API responded with status ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("Gemini API returned an empty candidate.");
      }
      return content;
    } finally {
      clearTimeout(timeout);
    }
  }
}

// ----------------------------------------------------------------------------
// Generic OpenAI Provider
// ----------------------------------------------------------------------------
class OpenAIProviderClient implements AIProviderClient {
  name = "openai";

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!config.ai.apiKey) {
      throw new Error("AI_API_KEY is not configured for OpenAI provider.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.ai.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.ai.model || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 350,
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API responded with status ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI API returned an empty response choice.");
      }
      return content;
    } finally {
      clearTimeout(timeout);
    }
  }
}

/** Factory to resolve AI Provider client */
function getAiProvider(): AIProviderClient {
  const provider = config.ai.provider;
  switch (provider) {
    case "gemini":
      return new GeminiProviderClient();
    case "openai":
      return new OpenAIProviderClient();
    case "groq":
    default:
      return new GroqProviderClient();
  }
}

// ============================================================================
// 3. Controlled Prompts
// ============================================================================

const SYSTEM_PROMPT = `You are the AirSense indoor-environment recommendation assistant.

Analyze the provided indoor environmental measurements and provide concise, practical recommendations.

Measurements may include:
- MQ-135 sensor reading
- temperature
- relative humidity

Do not diagnose diseases.
Do not claim that a sensor reading proves a medical condition.
Do not invent measurements.
Do not invent pollutant concentrations that were not measured.
Do not describe raw MQ-135 readings as exact CO2 ppm or official AQI unless the application explicitly provides calibrated measurements.

Base recommendations only on the supplied data.

If values are normal, reassure the user briefly.
If a value is elevated, explain what environmental action may help.
If data is insufficient, clearly say that more data is needed.

Return structured JSON only matching this exact schema:
{
  "status": "good" | "attention" | "warning" | "critical",
  "summary": "1-2 concise sentences summarizing indoor conditions.",
  "recommendations": [
    "practical action 1",
    "practical action 2"
  ],
  "priority": "low" | "medium" | "high"
}`;

function buildUserPrompt(data: SensorInputData, threshold: ThresholdEvaluation): string {
  return JSON.stringify({
    sensorData: {
      deviceId: data.deviceId,
      room: data.roomName || "Indoor Room",
      mq135: data.mq135,
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: data.timestamp || new Date().toISOString(),
    },
    deterministicBaseline: {
      thresholdSeverity: threshold.status,
      thresholdPriority: threshold.priority,
      findings: threshold.findings,
      preliminarySummary: threshold.deterministicSummary,
    },
    instructions:
      "Explain the environmental conditions and practical ventilation or comfort actions. Do not make medical claims. Return JSON only.",
  });
}

// ============================================================================
// 4. Recommendation Engine Core Service
// ============================================================================

export const aiRecommendationService = {
  /**
   * Main abstraction entrypoint: generates or returns a cached AI recommendation
   * for a real sensor reading.
   */
  async generateAirQualityRecommendation(
    sensorData: SensorInputData,
    options: { forceRefresh?: boolean; userId?: string } = {},
  ): Promise<AiRecommendationResult> {
    const { deviceId, mq135, temperature, humidity, roomName = "Indoor Room" } = sensorData;
    const timestampStr =
      sensorData.timestamp instanceof Date
        ? sensorData.timestamp.toISOString()
        : sensorData.timestamp || new Date().toISOString();

    // Step 1: Run Deterministic Threshold Engine FIRST (Requirement 8)
    const thresholdEval = evaluateThresholds(sensorData);

    // Step 2: Check Cooldown & Caching (Requirement 10 & 15)
    if (!options.forceRefresh) {
      const cached = await dbService.getLatestAiRecommendation(deviceId);
      if (cached) {
        const ageSeconds = (Date.now() - new Date(cached.createdAt).getTime()) / 1000;
        const withinCooldown = ageSeconds < config.ai.cooldownSeconds;

        // Check if conditions have changed significantly
        const statusChanged = cached.status !== thresholdEval.status;
        const mq135Delta = Math.abs(mq135 - (cached.sensorData?.mq135 ?? mq135));
        const tempDelta = Math.abs(temperature - (cached.sensorData?.temperature ?? temperature));
        const humidityDelta = Math.abs(humidity - (cached.sensorData?.humidity ?? humidity));

        const significantChange =
          statusChanged || mq135Delta >= 60 || tempDelta >= 2.5 || humidityDelta >= 10;

        if (withinCooldown && !significantChange) {
          return {
            status: cached.status,
            summary: cached.summary,
            recommendations: cached.recommendations,
            priority: cached.priority,
            analyzedAt: new Date(cached.createdAt).toISOString(),
            cached: true,
            sensorData: {
              deviceId,
              room: roomName,
              mq135,
              temperature,
              humidity,
              timestamp: timestampStr,
            },
          };
        }
      }
    }

    // Step 3: Check if AI is enabled and configured
    if (!config.ai.enabled || !config.ai.apiKey) {
      // Return deterministic threshold result if AI is not enabled
      return {
        status: thresholdEval.status,
        summary: thresholdEval.deterministicSummary,
        recommendations: thresholdEval.deterministicActions,
        priority: thresholdEval.priority,
        analyzedAt: new Date().toISOString(),
        cached: false,
        sensorData: {
          deviceId,
          room: roomName,
          mq135,
          temperature,
          humidity,
          timestamp: timestampStr,
        },
      };
    }

    // Step 4: Dispatch Request to AI Provider
    const provider = getAiProvider();
    const userPrompt = buildUserPrompt(sensorData, thresholdEval);

    let parsedResult: ValidatedAiOutput;

    try {
      const rawText = await provider.generateText(SYSTEM_PROMPT, userPrompt);
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        throw new Error("AI output does not contain a JSON object.");
      }

      const jsonStr = rawText.substring(jsonStart, jsonEnd + 1);
      const rawJson = JSON.parse(jsonStr);

      const validation = rawAiResponseSchema.safeParse(rawJson);
      if (!validation.success) {
        console.warn(
          `[AI Recommendation] AI response schema validation failed:`,
          validation.error.flatten(),
        );
        throw new Error("AI response failed schema validation.");
      }

      parsedResult = validation.data;
    } catch (err) {
      console.warn(
        `[AI Recommendation] Provider "${provider.name}" generation error (${
          err instanceof Error ? err.message : String(err)
        }). Falling back to deterministic threshold engine.`,
      );

      // Re-throw if caller explicitly wants to handle failure (e.g. for "AI unavailable" UI state),
      // or return deterministic baseline
      throw err;
    }

    // Step 5: Guardrail Alignment
    // Ensure deterministic critical/warning severity cannot be overridden by AI hallucination
    let finalStatus: AiRecommendationStatus = parsedResult.status;
    let finalPriority: AiRecommendationPriority = parsedResult.priority;

    if (thresholdEval.status === "critical" && finalStatus !== "critical") {
      finalStatus = "critical";
      finalPriority = "high";
    } else if (thresholdEval.status === "warning" && finalStatus === "good") {
      finalStatus = "warning";
      finalPriority = "high";
    }

    const now = new Date();
    const docToSave: AiRecommendationDoc = {
      deviceId,
      roomName,
      ...(options.userId && { userId: options.userId }),
      status: finalStatus,
      summary: parsedResult.summary,
      recommendations: parsedResult.recommendations,
      priority: finalPriority,
      sensorData: {
        mq135,
        temperature,
        humidity,
        timestamp: new Date(timestampStr),
      },
      cached: false,
      createdAt: now,
    };

    // Save to Database asynchronously
    await dbService.saveAiRecommendation(docToSave).catch((e) =>
      console.warn("[AI Recommendation] Failed to persist recommendation in DB:", e.message),
    );

    return {
      status: finalStatus,
      summary: parsedResult.summary,
      recommendations: parsedResult.recommendations,
      priority: finalPriority,
      analyzedAt: now.toISOString(),
      cached: false,
      sensorData: {
        deviceId,
        room: roomName,
        mq135,
        temperature,
        humidity,
        timestamp: timestampStr,
      },
    };
  },
};

// Export helper for application-wide calls
export const generateAirQualityRecommendation =
  aiRecommendationService.generateAirQualityRecommendation.bind(aiRecommendationService);
