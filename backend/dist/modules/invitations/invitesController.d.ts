import type { Request, Response } from "express";
export declare function inviteMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function listInvites(req: Request, res: Response): Promise<void>;
export declare function acceptMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function declineMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=invitesController.d.ts.map