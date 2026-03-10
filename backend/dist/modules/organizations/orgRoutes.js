import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { deleteOrg, fetchOrg, fetchOrgs, orgCreate } from "./orgController.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
// /api/v1/organizations
//   POST   /                → create org
//   GET    /my              → all orgs of user
//   GET    /:orgId          → org details
//   DELETE /:orgId          → delete org (admin only)
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management endpoints
 */
/**
 * @swagger
 * /organizations:
 *   post:
 *     tags: [Organizations]
 *     summary: Create a new organization
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orgName
 *               - planId
 *             properties:
 *               orgName:
 *                 type: string
 *                 example: Acme Corp
 *               planName:
 *                 type: string
 *                 example: FREE
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 organization:
 *                   type: object
 *                 membership:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /organizations/my:
 *   get:
 *     tags: [Organizations]
 *     summary: Get all organizations of the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizations:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /organizations/{orgId}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get details of a specific organization
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
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organization:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not belong to this organization
 *       404:
 *         description: Organization not found
 */
/**
 * @swagger
 * /organizations/{orgId}:
 *   delete:
 *     tags: [Organizations]
 *     summary: Delete an organization
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
 *         description: Organization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 organization:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not belong to this organization
 *       404:
 *         description: Organization not found
 */
router.use(authMiddleware);
router.post("/", orgCreate);
router.get("/my", fetchOrgs);
router.get("/:orgId", orgMiddleware, fetchOrg);
router.delete("/:orgId", orgMiddleware, deleteOrg);
export default router;
//# sourceMappingURL=orgRoutes.js.map