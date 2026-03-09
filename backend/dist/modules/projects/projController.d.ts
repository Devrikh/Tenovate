import type { Request, Response } from "express";
export declare function fetchProjects(req: Request, res: Response): Promise<void>;
export declare function fetchProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function patchProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=projController.d.ts.map