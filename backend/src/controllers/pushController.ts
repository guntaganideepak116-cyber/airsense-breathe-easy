import type { Request, Response } from "express";
import { config } from "../config/index.js";
import type { PushSubscriptionData } from "../models/types.js";

const subscriptions = new Map<string, PushSubscriptionData>();

export const pushController = {
  subscribe(req: Request, res: Response) {
    const { endpoint, keys, lang, expirationTime } = req.body || {};
    if (!endpoint || typeof endpoint !== "string") {
      res.status(400).json({ error: "Invalid subscription" });
      return;
    }
    subscriptions.set(endpoint, { endpoint, keys, lang, expirationTime });
    res.json({ ok: true, count: subscriptions.size });
  },

  unsubscribe(req: Request, res: Response) {
    const { endpoint } = req.body || {};
    if (endpoint) subscriptions.delete(endpoint);
    res.json({ ok: true });
  },

  getVapidKey(_req: Request, res: Response) {
    res.json({ publicKey: config.vapid.publicKey });
  },
};
