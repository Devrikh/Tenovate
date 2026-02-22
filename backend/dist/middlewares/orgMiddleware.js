export async function orgMiddleware(req, res, next) {
    const orgId = req.headers["x-org-id"];
    if (!orgId)
        return res.status(400).json({ error: "No orgId" });
    //@ts-ignore
    req.orgId = orgId;
    next();
}
//# sourceMappingURL=orgMiddleware.js.map