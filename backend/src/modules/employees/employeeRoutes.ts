import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { deleteEmployee, fetchEmployees, patchEmployeeRole } from "./employeeController.js";

  // /:orgId/employees
  //   GET    /              → list employees
  //   PATCH  /:userId/role  → update employees role
  //   DELETE /:userId       → remove employees


const router=Router()

router.get("/", orgMiddleware, fetchEmployees);
router.patch(
  "/:userId/role",
  orgMiddleware,
  patchEmployeeRole,
);
router.delete(":userId", orgMiddleware, deleteEmployee);

// router.post(
//   "/:orgId/invite",
//   orgMiddleware,
//   requirePermission("member:invite"),
//   requireFeature("member:invite"),
//   checkUsageLimit("member:invite"),
//   inviteEmployee,
// );
// router.get("/invite/accept", acceptEmployee);

export default router;