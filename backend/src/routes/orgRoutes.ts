import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  acceptEmployee,
  fetchOrg,
  inviteEmployee,
  orgCreate,
} from "../controllers/orgController.js";
import { requirePermission } from "../middlewares/permissionMiddleware.js";
import { orgMiddleware } from "../middlewares/orgMiddleware.js";
import { requireFeature } from "../middlewares/featureMiddleware.js";
import { checkUsageLimit } from "../middlewares/usageMiddleware.js";

const orgRouter = Router();
orgRouter.use(authMiddleware);

orgRouter.get("/my-orgs", fetchOrg);
orgRouter.post("/create", orgCreate);

orgRouter.post(
  "/invite",
  orgMiddleware,
  requirePermission("member:invite"),
  requireFeature("member:invite"),
  checkUsageLimit("member:invite"),
  inviteEmployee,
);
orgRouter.get("/invite/accept", acceptEmployee);

export default orgRouter;
