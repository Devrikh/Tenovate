import { prismaClient } from "../../lib/prisma/prisma.js";
export async function fetchUsage(req, res) {
    try {
        //@ts-ignore
        const { orgId, orgFeatures } = req.org;
        const usageLogs = await prismaClient.usageLog.findMany({
            where: { orgId },
        });
        const usageWithLimits = usageLogs.map((u) => {
            const planFeature = orgFeatures.find((f) => f.key === u.featureKey);
            return {
                featureKey: u.featureKey,
                count: u.count,
                limit: planFeature?.limit ?? null,
            };
        });
        res
            .status(201)
            .json({ message: "Usage Fetched", orgId, usage: usageWithLimits });
    }
    catch (e) {
        console.error("Fetching Usage Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function fetchFeatureUsage(req, res) {
    try {
        //@ts-ignore
        const { orgId, orgFeatures } = req.org;
        const { featureKey } = req.params;
        const usageLog = await prismaClient.usageLog.findUnique({
            where: {
                orgId_featureKey: {
                    orgId,
                    featureKey: featureKey,
                },
            },
        });
        const feature = orgFeatures.find((f) => f.key === featureKey);
        res.status(200).json({
            message: "Feature Usage Fetched",
            orgId,
            usage: {
                featureKey,
                count: usageLog?.count ?? 0,
                limit: feature?.limit ?? null,
            },
        });
    }
    catch (e) {
        console.error("Fetching Feature Usage Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=usageController.js.map