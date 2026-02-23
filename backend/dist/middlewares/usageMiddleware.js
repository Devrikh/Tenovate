import { prismaClient } from "../lib/prisma.js";
export function checkUsageLimit(featureKey) {
    return async (req, res, next) => {
        //@ts-ignore
        const orgId = req.org.orgId;
        //@ts-ignore
        let usage = await prismaClient.usageLog.findFirst({
            where: {
                orgId: orgId,
                featureKey: featureKey
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
        const feature = req.org.orgFeatures.find((f) => f.key === featureKey);
        if (feature.limit && usage.count >= feature.limit) {
            return res.status(403).json({ error: "Limit reached" });
        }
        //@ts-ignore
        req.org.usage = usage;
        next();
    };
}
//# sourceMappingURL=usageMiddleware.js.map