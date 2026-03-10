import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { createRole, getRoles } from "./roleController.js";
//   /:orgId/roles
//     GET    /
//     POST   /
//     PATCH  /:roleId
//     DELETE /:roleId
const router = Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles and permissions management
 */
/**
 * @swagger
 * /organizations/{orgId}/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Fetch all roles
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
 *       201:
 *         description: Roles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
/**
 * @swagger
 * /organizations/{orgId}/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
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
 *               - roleName
 *               - permissions
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: DESIGNER
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["member:read","member:update_role"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Role:
 *                   type: object
 *       400:
 *         description: Invalid input or permissions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
router.use(authMiddleware);
router.get("/", orgMiddleware, requirePermission("role:read"), getRoles);
router.post("/", orgMiddleware, requirePermission("role:create"), createRole);
export default router;
//# sourceMappingURL=roleRoutes.js.map