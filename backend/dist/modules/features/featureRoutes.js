import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { requireFeature } from "../../middlewares/featureMiddleware.js";
import { attachUsage, checkUsageLimit } from "../../middlewares/usageMiddleware.js";
import { fetchFeatures } from "./featureController.js";
// /:orgId/features
//   GET    /
//   PATCH  /
const router = Router({ mergeParams: true });
router.use(authMiddleware);
router.use(orgMiddleware);
router.get("/", requirePermission("org:update"), fetchFeatures);
export default router;
//# sourceMappingURL=featureRoutes.js.map