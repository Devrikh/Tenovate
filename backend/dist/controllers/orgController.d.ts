import type { Request, Response } from "express";
export declare function orgCreate(req: Request, res: Response): Promise<void>;
export declare function fetchOrg(req: Request, res: Response): Promise<void>;
export declare function inviteEmployee(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function acceptEmployee(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=orgController.d.ts.map