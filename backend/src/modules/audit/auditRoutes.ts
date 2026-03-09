import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { fetchAudit} from "./auditController.js";

  // /:orgId/audit-logs
  //   GET    /





const router = Router({mergeParams: true});

router.use(authMiddleware);
router.use(orgMiddleware);

router.get(
  "/",
  requirePermission("audit:read"),
  fetchAudit,
);

export default router;
