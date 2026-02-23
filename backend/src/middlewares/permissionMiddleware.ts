import type { NextFunction, Request, Response } from "express";

export function requirePermission(permission: String) {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (!req.employment.permissions.includes(permission)) {
      res.status(403).json({ error: "Permission Denied" });
    }
    next();
  };
}
