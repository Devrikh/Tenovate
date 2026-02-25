import type { Request, Response } from "express";
export declare function fetchEmployees(req: Request, res: Response): Promise<void>;
export declare function patchEmployeeRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteEmployee(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=employeeController.d.ts.map