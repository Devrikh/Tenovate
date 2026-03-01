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
router.use(authMiddleware);
router.post("/invite", orgMiddleware, requirePermission("member:invite"), requireFeature("member:invite"), checkUsageLimit("member:invite"), inviteMember);
router.get("/", orgMiddleware, requirePermission("member:read"), listInvites);
export default router;
//# sourceMappingURL=invitesRoutes.js.map