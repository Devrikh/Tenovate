import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { acceptEmployee, fetchOrg, inviteEmployee, orgCreate } from "../controllers/orgController.js";
import { requirePermission } from "../middlewares/permissionMiddleware.js";
import { orgMiddleware } from "../middlewares/orgMiddleware.js";


const orgRouter= Router();
orgRouter.use(authMiddleware);


orgRouter.get("/my-orgs",fetchOrg);
orgRouter.post("/create",orgCreate);

orgRouter.post("/invite",orgMiddleware, requirePermission("member:invite"), inviteEmployee);
orgRouter.get("/invite/accept", acceptEmployee);




export default orgRouter;