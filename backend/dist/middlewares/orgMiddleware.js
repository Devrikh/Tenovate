import { prismaClient } from "../lib/prisma.js";
export async function orgMiddleware(req, res, next) {
    const orgId = req.headers["x-org-id"];
    if (!orgId)
        return res.status(400).json({ error: "No orgId" });
    //@ts-ignore
    if (typeof orgId != "string")
        return res.json({
            message: "orgId not String"
        });
    const org = await prismaClient.organization.findFirst({
        where: {
            id: orgId
        }, include: {
            plan: {
                include: {
                    features: {
                        include: {
                            feature: true
                        }
                    }
                }
            }
        }
    });
    if (!org)
        return res.status(403).json({
            message: "Invalid OrgId"
        });
    const employment = await prismaClient.employment.findFirst({
        where: {
            orgId: orgId,
            //@ts-ignore
            userId: req.user.id
        },
        include: {
            role: {
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            }
        }
    });
    if (!employment)
        return res.status(403).json({
            message: "Invalid Employment"
        });
    //@ts-ignore
    req.employment = {
        roleId: employment.roleId,
        permissions: employment.role.permissions.map(rp => rp.permission.key)
    };
    //@ts-ignore
    req.org = {
        orgId: org.id,
        orgFeatures: org.plan.features.map(pf => ({ key: pf.feature.key, limit: pf.limit }))
    };
    //@ts-ignore
    console.log(req.org);
    next();
}
//# sourceMappingURL=orgMiddleware.js.map