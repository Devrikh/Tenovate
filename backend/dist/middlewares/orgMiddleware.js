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
    const employment = await prismaClient.employment.findFirst({
        where: {
            orgId: orgId,
            //@ts-ignore
            userId: req.user.id
        }
    });
    if (!employment)
        return res.status(403).json({
            message: "Invalid Employment or Org"
        });
    //@ts-ignore
    req.employment = {
        orgId: employment.orgId,
        roleId: employment.roleId
    };
    next();
}
//# sourceMappingURL=orgMiddleware.js.map