import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { orgMiddleware } from "../../middlewares/orgMiddleware.js";
import { requirePermission } from "../../middlewares/permissionMiddleware.js";
import { fetchAudit} from "./auditController.js";

  // /:orgId/audit-logs
  //   GET    /





const router = Router({mergeParams: true});

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Organization audit log tracking
 */

/**
 * @swagger
 * /organizations/{orgId}/audit-logs:
 *   get:
 *     tags: [AuditLogs]
 *     summary: Fetch the latest 50 audit logs for an organization
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       201:
 *         description: Audit logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orgId:
 *                   type: string
 *                 auditLogs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       orgId:
 *                         type: string
 *                       action:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission
 */

router.use(authMiddleware);
router.use(orgMiddleware);

router.get(
  "/",
  requirePermission("audit:read"),
  fetchAudit,
);

export default router;
