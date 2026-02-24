import type { NextFunction, Request, Response } from "express";
export declare function checkUsageLimit(featureKey: string): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare function attachUsage(featureKey: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=usageMiddleware.d.ts.map