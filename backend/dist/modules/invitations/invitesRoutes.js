import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { requireFeature } from "../../middlewares/featureMiddleware.js";
import { checkUsageLimit } from "../../middlewares/usageMiddleware.js";
import { acceptMember, inviteMember, listInvites } from "../invitations/invitesController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
//   /:orgId/invitations
//     POST   /invite
//     GET    /               → list invites
//   /invitations
//     POST   /accept
//     POST   /reject
const router = Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   - name: Invitations
 *     description: Manage organization invitations
 */
/**
 * @swagger
 * /organizations/{orgId}/invitations/invite:
 *   post:
 *     tags: [Invitations]
 *     summary: Invite a new member to the organization
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
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 example: MEMBER
 *             required:
 *               - email
 *               - role
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: No permission or feature limit exceeded
 */
/**
 * @swagger
 * /organizations/{orgId}/invitations:
 *   get:
 *     tags: [Invitations]
 *     summary: List all invitations for an organization
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
 *         description: Invitations fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
router.use(authMiddleware);
router.use(orgMiddleware);
router.post("/invite", requirePermission("member:invite"), requireFeature("member:invite"), checkUsageLimit("member:invite"), inviteMember);
router.get("/", requirePermission("member:read"), listInvites);
export default router;
//# sourceMappingURL=invitesRoutes.js.map