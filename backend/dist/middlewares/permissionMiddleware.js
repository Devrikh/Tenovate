export function requirePermission(permission) {
    return (req, res, next) => {
        //@ts-ignore
        if (!req.employment.permissions.includes(permission)) {
            res.status(403).json({ error: "Permission Denied" });
        }
        next();
    };
}
//# sourceMappingURL=permissionMiddleware.js.map