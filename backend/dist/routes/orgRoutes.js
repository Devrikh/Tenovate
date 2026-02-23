import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { fetchOrg, orgCreate } from "../controllers/orgController.js";
const orgRouter = Router();
orgRouter.get("/my-orgs", authMiddleware, fetchOrg);
orgRouter.post("/create", authMiddleware, orgCreate);
orgRouter.post("/invite", authMiddleware);
export default orgRouter;
//# sourceMappingURL=orgRoutes.js.map