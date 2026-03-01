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
router.use(authMiddleware);
router.get("/accept", acceptMember);
router.get("/decline", declineMember);
export default router;
//# sourceMappingURL=invitesReponseRouter.js.map