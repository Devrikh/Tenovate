import type { NextFunction, Request, Response } from "express";

export async function orgMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const orgId = req.headers["x-org-id"];
  if (!orgId) return res.status(400).json({ error: "No orgId" });
  //@ts-ignore
  req.orgId = orgId;

  next();
}
