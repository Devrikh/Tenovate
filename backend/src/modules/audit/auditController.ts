import type { Request, Response } from "express";
import { prismaClient } from "../../lib/prisma/prisma.js";

export async function fetchAudit(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { orgId } = req.org;

    const auditLogs = await prismaClient.auditLog.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.status(201).json({ message: "Audit Logs Fetched", orgId, auditLogs });
  } catch (e) {
    console.error("Fetching Audit Logs Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
