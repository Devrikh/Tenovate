import type { Request, Response } from "express";
import { prismaClient } from "../../lib/prisma/prisma.js";

export async function fetchUsage(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { orgId, orgFeatures } = req.org;

    const usageLogs = await prismaClient.usageLog.findMany({
      where: { orgId },
    });

    const usageWithLimits = usageLogs.map((u) => {
      const planFeature = orgFeatures.find(
        (f : any) => f.feature.key === u.featureKey,
      );
      return {
        featureKey: u.featureKey,
        count: u.count,
        limit: planFeature?.limit ?? null,
      };
    });

    res
      .status(201)
      .json({ message: "Usage Fetched", orgId, usage: usageWithLimits });
  } catch (e) {
    console.error("Fetching Usage Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function fetchFeatureUsage(req: Request, res: Response) {
  try {
    //@ts-ignore
     const { orgId, orgFeatures} = req.org;
    const { featureKey } = req.params; 

    const usageLog = await prismaClient.usageLog.findUnique({
      where: {
        orgId_featureKey: {
          orgId,
          featureKey: featureKey as string,
        },
      },
    });

     const feature = orgFeatures.find((f: any) => f.key === featureKey);

    res.status(200).json({
      message: "Feature Usage Fetched",
      orgId,
      usage: {
        featureKey,
        count: usageLog?.count ?? 0,
        limit: feature?.limit ?? null,
      },
    });
  } catch (e) {
    console.error("Fetching Feature Usage Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
