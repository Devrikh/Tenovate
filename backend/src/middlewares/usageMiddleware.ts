import type { NextFunction, Request, Response } from "express";
import { prismaClient } from "../lib/prisma/prisma.js";

export function checkUsageLimit(featureKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      const orgId = req.org.orgId;
      //@ts-ignore
      const orgFeatures: { key: string; limit: number }[] = req.org.orgFeatures;

      //@ts-ignore
      let usage = await prismaClient.usageLog.findFirst({
        where: {
          orgId: orgId,
          featureKey: featureKey,
        },
      });

      if (!usage) {
        usage = await prismaClient.usageLog.create({
          data: {
            orgId: orgId,
            featureKey: featureKey,
          },
        });
      }

      const feature = orgFeatures.find((f) => f.key === featureKey);
      if (!feature) {
        return res.status(403).json({ message: "Feature not available" });
      }
      if (feature.limit && usage.count >= feature.limit) {
        return res.status(403).json({ message: "Feature usage limit reached" });
      }
      //@ts-ignore
      req.org.usage = usage;
      next();
    } catch (e) {
      console.error("Check Usage Middleware Error:", e);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export function attachUsage(featureKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      const orgId = req.org.orgId;
      //@ts-ignore
      let usage = await prismaClient.usageLog.findFirst({
        where: {
          orgId: orgId,
          featureKey: featureKey,
        },
      });

      if (!usage) {
        usage = await prismaClient.usageLog.create({
          data: {
            orgId: orgId,
            featureKey: featureKey,
          },
        });
      }
      //@ts-ignore
      req.org.usage = usage;
      next();
    } catch (e) {
      console.error("Attach Usage Middleware Error:", e);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
