export async function fetchFeatures(req, res) {
    try {
        //@ts-ignore
        const { orgFeatures } = req.org;
        res.status(201).json({ message: "Features Fetched", orgFeatures });
    }
    catch (e) {
        console.error("Fetching Feature Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=featureController.js.map