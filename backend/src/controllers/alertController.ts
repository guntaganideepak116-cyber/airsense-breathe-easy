import type { Request, Response } from "express";

export const alertController = {
  mockAlert(_req: Request, res: Response) {
    res.status(404).json({ error: "Mock alerts and demo triggers are disabled in production" });
  },
};
