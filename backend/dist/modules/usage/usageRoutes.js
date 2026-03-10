import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { fetchFeatureUsage, fetchUsage } from "./usageController.js";
// /:orgId/usage
//   GET    /
//   GET    /:featureKey
const router = Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   name: Usage
 *   description: Organization usage tracking for features
 */
/**
 * @swagger
 * /organizations/{orgId}/usage:
 *   get:
 *     tags: [Usage]
 *     summary: Fetch usage for all features in the organization
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
 *         description: Usage fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orgId:
 *                   type: string
 *                 usage:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       featureKey:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       limit:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
/**
 * @swagger
 * /organizations/{orgId}/usage/{featureKey}:
 *   get:
 *     tags: [Usage]
 *     summary: Fetch usage for a specific feature
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *       - in: path
 *         name: featureKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature key to fetch usage for
 *     responses:
 *       200:
 *         description: Feature usage fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orgId:
 *                   type: string
 *                 usage:
 *                   type: object
 *                   properties:
 *                     featureKey:
 *                       type: string
 *                     count:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       400:
 *         description: Invalid featureKey
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
router.use(authMiddleware);
router.use(orgMiddleware);
router.get("/", requirePermission("usage:read"), fetchUsage);
router.get("/:featureKey", requirePermission("usage:read"), fetchFeatureUsage);
export default router;
//# sourceMappingURL=usageRoutes.js.map