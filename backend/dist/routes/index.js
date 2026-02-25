import { Router } from "express";
import authRouter from "../modules/auth/authRoutes.js";
import orgRouter from "../modules/organizations/orgRoutes.js";
import employeeRouter from "../modules/employees/employeeRoutes.js";
import invitesRouter from "../modules/invitations/invitesRoutes.js";
import projectsRouter from "../modules/projects/projectRoutes.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/organizations", orgRouter);
router.use("/organizations/:orgId/employees", employeeRouter);
// router.use("/organizations/:orgId/roles", rolesRouter);
router.use("/organizations/:orgId/projects", projectsRouter);
// router.use("/organizations/:orgId/features", featuresRouter);
// router.use("/organizations/:orgId/usage", usageRouter);
// router.use("/organizations/:orgId/audit-logs", auditRouter);
router.use("/organizations/:orgId/invitations", invitesRouter);
router.use("/invitations", invitesRouter);
export default router;
//# sourceMappingURL=index.js.map