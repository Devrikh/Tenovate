import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { orgMiddleware } from "../middlewares/orgMiddleware.js";
import { createProject, fetchProjects } from "../controllers/projController.js";
const projRouter = Router();
projRouter.use(authMiddleware);
projRouter.use(orgMiddleware);
projRouter.get("/my-projects", fetchProjects);
projRouter.post("/create", createProject);
export default projRouter;
//# sourceMappingURL=projectRoutes.js.map