import type { Request, Response } from "express";
import { prismaClient } from "../../lib/prisma/prisma.js";
import { orgCreateSchema} from "../../validators/orgScema.js";

export async function orgCreate(req: Request, res: Response) {
  try {
    const parsed = orgCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.format(),
      });
    }
    const { orgName, planId } = parsed.data;

    //@ts-ignore
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const org = await prismaClient.organization.create({
      data: {
        name: orgName,
        planId,
      },
    });

    const ownerRole = await prismaClient.role.findFirst({
      where: { name: "OWNER" },
    });

    if (!ownerRole) {
      console.error("Owner role not found");
      return res.status(500).json({ message: "Internal server error" });
    }
    const membership = await prismaClient.membership.create({
      data: {
        userId: userId,
        orgId: org.id,
        roleId: ownerRole?.id,
      },
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization: org,
      membership: membership,
    });
  } catch (e) {
    console.error("Create Organization Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function fetchOrgs(req: Request, res: Response) {
  try {
    //@ts-ignore
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const orgs = await prismaClient.membership.findMany({
      where: { userId },
      include: { org: true },
    });

    res.status(200).json({ organizations: orgs });
  } catch (e) {
    console.error("Error fetching user organizations:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function fetchOrg(req: Request, res: Response) {
  try {
    //@ts-ignore
    const orgId = req.org.orgId;

    const org = await prismaClient.organization.findUnique({
      where: { id: orgId },
    });

    res.status(200).json({ organization: org });
  } catch (e) {
    console.error("Error fetching user organization:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteOrg(req: Request, res: Response) {
  try {
    //@ts-ignore
    const {orgId} = req.org;

    if (!orgId) {
      return res.status(401).json({ message: "OrgId Invalid" });
    }
    await prismaClient.membership.deleteMany({
      where: { orgId: orgId },
    });

    const org = await prismaClient.organization.delete({
      where: { id: orgId },
    });

    res.status(201).json({
      message: "Organization deleted successfully",
      organization: org,
    });
  } catch (e) {
    console.error("Error deleting user organization:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
