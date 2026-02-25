import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { deleteMember, fetchMembers, patchMemberRole } from "./membershipController.js";

  // /:orgId/employees
  //   GET    /              → list employees
  //   PATCH  /:userId/role  → update employees role
  //   DELETE /:userId       → remove employees


const router=Router()

router.get("/", orgMiddleware, fetchMembers);
router.patch(
  "/:userId/role",
  orgMiddleware,
  patchMemberRole,
);
router.delete(":userId", orgMiddleware, deleteMember);

export default router;