import type { NextFunction, Request, Response } from "express";
export declare function requirePermission(permission: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=permissionMiddleware.d.ts.map