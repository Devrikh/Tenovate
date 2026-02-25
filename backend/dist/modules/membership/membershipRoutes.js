import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { deleteMember, fetchMembers, patchMemberRole } from "./membershipController.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
// /:orgId/employees
//   GET    /              → list employees
//   PATCH  /:userId/role  → update employees role
//   DELETE /:userId       → remove employees
const router = Router();
router.get("/", orgMiddleware, requirePermission("member:read"), fetchMembers);
router.patch("/:userId/role", orgMiddleware, requirePermission("member:update_role"), patchMemberRole);
router.delete(":userId", orgMiddleware, requirePermission("member:remove"), deleteMember);
export default router;
//# sourceMappingURL=membershipRoutes.js.map