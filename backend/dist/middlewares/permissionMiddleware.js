export function requirePermission(permission) {
    return (req, res, next) => {
        try {
            //@ts-ignore
            const permissions = req.employment?.permissions;
            if (!permissions) {
                return res.status(401).json({ message: "User employment not found" });
            }
            if (!permissions.includes(permission)) {
                return res.status(403).json({ message: "Permission denied" });
            }
            next();
        }
        catch (e) {
            console.error("Permission middleware error:", e);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
//# sourceMappingURL=permissionMiddleware.js.map