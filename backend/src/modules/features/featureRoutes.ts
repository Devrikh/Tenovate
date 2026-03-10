import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { requireFeature } from "../../middlewares/featureMiddleware.js";
import { attachUsage, checkUsageLimit } from "../../middlewares/usageMiddleware.js";
import { fetchFeatures } from "./featureController.js";

  // /:orgId/features
  //   GET    /
  //   PATCH  /



const router = Router({mergeParams: true});

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Organization feature management
 */

/**
 * @swagger
 * /organizations/{orgId}/features:
 *   get:
 *     tags: [Features]
 *     summary: Fetch all enabled features for an organization
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
 *         description: Features fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orgFeatures:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                         description: Feature key
 *                       limit:
 *                         type: integer
 *                         description: Feature usage limit
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */

router.use(authMiddleware);
router.use(orgMiddleware);

router.get(
  "/",
  requirePermission("org:update"),
  fetchFeatures,
);

export default router;
