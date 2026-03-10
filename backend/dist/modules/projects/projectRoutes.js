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
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Organization project management
 */
/**
 * @swagger
 * /organizations/{orgId}/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Project
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission or feature usage exceeded
 */
/**
 * @swagger
 * /organizations/{orgId}/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Fetch all projects in the organization
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
/**
 * @swagger
 * /organizations/{orgId}/projects/{projectId}:
 *   get:
 *     tags: [Projects]
 *     summary: Fetch a specific project
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   type: object
 *       400:
 *         description: Invalid projectId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
/**
 * @swagger
 * /organizations/{orgId}/projects/{projectId}:
 *   patch:
 *     tags: [Projects]
 *     summary: Update a project
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *     responses:
 *       201:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
/**
 * @swagger
 * /organizations/{orgId}/projects/{projectId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete a project
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   type: object
 *       400:
 *         description: Invalid projectId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
router.use(authMiddleware);
router.use(orgMiddleware);
router.post("/", requirePermission("project:create"), requireFeature("project:create"), checkUsageLimit("project:create"), createProject);
router.get("/", requirePermission("project:read"), fetchProjects);
router.get("/:projectId", requirePermission("project:read"), fetchProject);
router.patch("/:projectId", requirePermission("project:update"), patchProject);
router.delete("/:projectId", requirePermission("project:delete"), attachUsage("project:create"), deleteProject);
export default router;
//# sourceMappingURL=projectRoutes.js.map