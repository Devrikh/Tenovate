import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { deleteOrg, fetchOrg, fetchOrgs, orgCreate } from "./orgController.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";

// /api/v1/organizations
//   POST   /                → create org
//   GET    /my              → all orgs of user
//   GET    /:orgId          → org details
//   DELETE /:orgId          → delete org (admin only)

const router = Router();
router.use(authMiddleware);

router.post("/", orgCreate);
router.get("/my", fetchOrgs);
router.get("/:orgId", orgMiddleware, fetchOrg);
router.delete("/:orgId", orgMiddleware, deleteOrg);


export default router;
