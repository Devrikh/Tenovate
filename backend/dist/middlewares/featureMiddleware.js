export function requireFeature(featureKey) {
    return (req, res, next) => {
        try {
            //@ts-ignore
            const orgFeatures = req.org?.orgFeatures;
            if (!orgFeatures) {
                return res.status(401).json({ message: "Organization Features Not found" });
            }
            const feature = orgFeatures.find((f) => f.key === featureKey);
            if (!feature) {
                return res.status(403).json({ message: "Feature not available" });
            }
            //@ts-ignore
            req.org.feature = feature;
            next();
        }
        catch (e) {
            console.error("Require Feature Middleware Error:", e);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
//# sourceMappingURL=featureMiddleware.js.map