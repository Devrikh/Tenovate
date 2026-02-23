import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { orgMiddleware } from "../middlewares/orgMiddleware.js";
import { createProject, fetchProjects } from "../controllers/projController.js";
import { requirePermission } from "../middlewares/permissionMiddleware.js";
import { requireFeature } from "../middlewares/featureMiddleware.js";
import { checkUsageLimit } from "../middlewares/usageMiddleware.js";
const projRouter = Router();
projRouter.use(authMiddleware);
projRouter.use(orgMiddleware);
projRouter.get("/my-projects", requirePermission("project:read"), fetchProjects);
projRouter.post("/create", requirePermission("project:create"), requireFeature("project:create"), checkUsageLimit("project:create"), createProject);
export default projRouter;
//# sourceMappingURL=projectRoutes.js.map