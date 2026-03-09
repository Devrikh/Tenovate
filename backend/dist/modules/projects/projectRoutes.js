import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { createProject, deleteProject, fetchProject, fetchProjects, patchProject } from "./projController.js";
import { requireFeature } from "../../middlewares/featureMiddleware.js";
import { attachUsage, checkUsageLimit } from "../../middlewares/usageMiddleware.js";
// /:orgId/projects
//   POST   /
//   GET    /
//   GET    /:projectId
//   PATCH  /:projectId
//   DELETE /:projectId
const router = Router({ mergeParams: true });
router.use(authMiddleware);
router.use(orgMiddleware);
router.post("/", requirePermission("project:create"), requireFeature("project:create"), checkUsageLimit("project:create"), createProject);
router.get("/", requirePermission("project:read"), fetchProjects);
router.get("/:projectId", requirePermission("project:read"), fetchProject);
router.patch("/:projectId", requirePermission("project:update"), patchProject);
router.delete("/:projectId", requirePermission("project:delete"), attachUsage("project:create"), deleteProject);
export default router;
//# sourceMappingURL=projectRoutes.js.map