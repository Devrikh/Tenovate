import type { NextFunction, Request, Response } from "express";
export declare function requireFeature(featureKey: String): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=featureMiddleware.d.ts.map