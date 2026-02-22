import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { fetchOrg, orgCreate } from "../controllers/orgController.js";
const orgRouter = Router();
orgRouter.get("/", authMiddleware, fetchOrg);
orgRouter.post("/create", authMiddleware, orgCreate);
export default orgRouter;
//# sourceMappingURL=orgRoutes.js.map