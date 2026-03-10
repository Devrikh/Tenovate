import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { deleteMember, fetchMembers, patchMemberRole } from "./membershipController.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
// /:orgId/employees
//   GET    /              → list employees
//   PATCH  /:userId/role  → update employees role
//   DELETE /:userId       → remove employees
const router = Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Organization member management
 */
/**
 * @swagger
 * /organizations/{orgId}/members:
 *   get:
 *     tags: [Members]
 *     summary: Fetch all members of an organization
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
 *         description: Members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       username:
 *                         type: string
 *                       roleName:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */
/**
 * @swagger
 * /organizations/{orgId}/members/{userId}/role:
 *   patch:
 *     tags: [Members]
 *     summary: Update a member's role
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Membership role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 membership:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: Membership or role not found
 */
/**
 * @swagger
 * /organizations/{orgId}/members/{userId}:
 *   delete:
 *     tags: [Members]
 *     summary: Remove a member from the organization
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove
 *     responses:
 *       201:
 *         description: Member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 employee:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: Membership not found
 */
router.use(authMiddleware);
router.get("/", orgMiddleware, requirePermission("member:read"), fetchMembers);
router.patch("/:userId/role", orgMiddleware, requirePermission("member:update_role"), patchMemberRole);
router.delete("/:userId", orgMiddleware, requirePermission("member:remove"), deleteMember);
export default router;
//# sourceMappingURL=membershipRoutes.js.map