import { Router } from "express";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { createRole, getRoles } from "./roleController.js";

//   /:orgId/roles
//     GET    /
//     POST   /
//     PATCH  /:roleId
//     DELETE /:roleId



const router=Router({mergeParams: true})
router.use(authMiddleware);

router.get("/", orgMiddleware,requirePermission("role:read"),getRoles);
router.post("/", orgMiddleware,requirePermission("role:create"),createRole);

export default router;