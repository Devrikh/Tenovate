export function requireFeature(featureKey) {
    return (req, res, next) => {
        //@ts-ignore
        const feature = req.org.orgFeatures.find((f) => f.key === featureKey);
        if (!feature) {
            res.status(403).json({ error: "Feature not available" });
        }
        console.log(feature);
        // //@ts-ignore
        // req.org.feature= feature;
        next();
    };
}
//# sourceMappingURL=featureMiddleware.js.map