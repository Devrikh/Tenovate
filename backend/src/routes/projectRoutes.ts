import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { orgMiddleware } from "../middlewares/orgMiddleware.js";
import { createProject, fetchProjects } from "../controllers/projController.js";
import { requirePermission } from "../middlewares/permissionMiddleware.js";


const projRouter= Router();

projRouter.use(authMiddleware);
projRouter.use(orgMiddleware);


projRouter.get("/my-projects",requirePermission("project:read"),fetchProjects);
projRouter.post("/create",requirePermission("project:create"),createProject);



export default projRouter;