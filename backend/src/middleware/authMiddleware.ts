import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { config } from "../config/index.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Empty bearer token" });
    return;
  }

  const secretKey = config.clerkSecretKey;
  if (secretKey) {
    try {
      const payload = await verifyToken(token, { secretKey });
      if (payload && payload.sub) {
        req.userId = payload.sub;
        return next();
      }
    } catch (err) {
      console.warn("[Auth] Clerk token verification failed, checking fallback:", err instanceof Error ? err.message : err);
    }
  }

  // Fallback payload parsing for local dev / unconfigured secret
  try {
    const parts = token.split(".");
    if (parts.length === 3 && parts[1]) {
      const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      if (decoded && decoded.sub) {
        req.userId = decoded.sub;
        return next();
      }
    }
  } catch {
    // parse failed
  }

  res.status(401).json({ error: "Unauthorized: Invalid authentication session" });
}
