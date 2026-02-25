import type { Request, Response } from "express";
export declare function fetchMembers(req: Request, res: Response): Promise<void>;
export declare function patchMemberRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=membershipController.d.ts.map