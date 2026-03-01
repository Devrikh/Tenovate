import { prismaClient } from "../lib/prisma/prisma.js";
export async function orgMiddleware(req, res, next) {
    try {
        const { orgId } = req.params;
        console.log(orgId);
        if (!orgId) {
            return res.status(400).json({ message: "Missing orgId" });
        }
        if (typeof orgId !== "string") {
            return res.status(400).json({ message: "orgId must be a string" });
        }
        //@ts-ignore
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const org = await prismaClient.organization.findFirst({
            where: {
                id: orgId,
            },
            include: {
                plan: {
                    include: {
                        features: {
                            include: {
                                feature: true,
                            },
                        },
                    },
                },
            },
        });
        if (!org) {
            return res.status(404).json({ message: "Organization not found" });
        }
        const membership = await prismaClient.membership.findFirst({
            where: {
                orgId: org.id,
                //@ts-ignore
                userId: userId,
            },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        });
        if (!membership) {
            return res
                .status(403)
                .json({ message: "User does not belong to this organization" });
        }
        //@ts-ignore
        req.membership = {
            membershipId: membership.id,
            roleId: membership.roleId,
            permissions: membership.role.permissions.map((rp) => rp.permission.key),
        };
        //@ts-ignore
        req.org = {
            orgId: org.id,
            orgFeatures: org.plan.features.map((pf) => ({
                key: pf.feature.key,
                limit: pf.limit,
            })),
        };
        next();
    }
    catch (e) {
        console.error("Org Middleware Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=orgMiddleware.js.map