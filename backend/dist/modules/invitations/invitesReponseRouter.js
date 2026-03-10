import { Router } from "express";
import { acceptMember, declineMember, inviteMember } from "../invitations/invitesController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
//   /:orgId/invitations
//     POST   /invite
//     GET    /               → list invites
//   /invitations
//     POST   /accept
//     POST   /reject
const router = Router();
/**
 * @swagger
 * /invitations/accept:
 *   get:
 *     tags: [Invitations]
 *     summary: Accept an invitation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Invalid token
 *       403:
 *         description: Invite not valid for this user
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /invitations/decline:
 *   get:
 *     tags: [Invitations]
 *     summary: Decline an invitation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token
 *     responses:
 *       200:
 *         description: Invitation declined successfully
 *       400:
 *         description: Invalid token
 *       403:
 *         description: Invite not valid for this user
 *       401:
 *         description: Unauthorized
 */
router.use(authMiddleware);
router.get("/accept", acceptMember);
router.get("/decline", declineMember);
export default router;
//# sourceMappingURL=invitesReponseRouter.js.map