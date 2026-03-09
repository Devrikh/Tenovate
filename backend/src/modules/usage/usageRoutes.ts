import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { fetchFeatureUsage, fetchUsage } from "./usageController.js";

  // /:orgId/usage
  //   GET    /
  //   GET    /:featureKey




const router = Router({mergeParams: true});

router.use(authMiddleware);
router.use(orgMiddleware);

router.get(
  "/",
  requirePermission("usage:read"),
  fetchUsage,
);

router.get(
  "/:featureKey",
  requirePermission("usage:read"),
  fetchFeatureUsage,
);

export default router;
