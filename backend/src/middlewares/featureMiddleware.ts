import type { NextFunction, Request, Response } from "express";

export function requireFeature(featureKey: String) {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const feature = req.org.orgFeatures.find((f) => f.key === featureKey);

    if (!feature) {
      res.status(403).json({ error: "Feature not available" });
    }
    // //@ts-ignore
    // req.org.feature= feature;
    next();
  };
}
