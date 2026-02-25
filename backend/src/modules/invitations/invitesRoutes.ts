import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { requireFeature } from "../../middlewares/featureMiddleware.js";
import { checkUsageLimit } from "../../middlewares/usageMiddleware.js";
import { acceptMember, inviteMember } from "../invitations/invitesController.js";

//   /:orgId/invitations
//     POST   /invite
//     GET    /               → list invites
//   /invitations
//     POST   /accept
//     POST   /reject



const router=Router()

router.post(
  "/invite",
  orgMiddleware,
  requirePermission("member:invite"),
  requireFeature("member:invite"),
  checkUsageLimit("member:invite"),
  inviteMember,
);
// router.get("/", listInvites);

router.post(
  "/accept",
  acceptMember,
);

export default router;