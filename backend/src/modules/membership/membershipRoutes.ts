import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { deleteMember, fetchMembers, patchMemberRole } from "./membershipController.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

  // /:orgId/employees
  //   GET    /              → list employees
  //   PATCH  /:userId/role  → update employees role
  //   DELETE /:userId       → remove employees


const router=Router({mergeParams: true})
router.use(authMiddleware);

router.get("/", orgMiddleware,requirePermission("member:read"),fetchMembers);
router.patch(
  "/:userId/role",
  orgMiddleware,
  requirePermission("member:update_role"),
  patchMemberRole,
);
router.delete("/:userId", orgMiddleware,requirePermission("member:remove"),deleteMember);

export default router;