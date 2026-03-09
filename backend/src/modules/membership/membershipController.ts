import type { Request, Response } from "express";
import { prismaClient } from "../../lib/prisma/prisma.js";
import crypto from "crypto";
import { orgCreateSchema, rolePatchSchema } from "../../validators/orgScema.js";
import {
  invitationSchema,
  tokenSchema,
} from "../../validators/inviteSchema.js";

export async function fetchMembers(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { orgId } = req.org;
    const membership = await prismaClient.membership.findMany({
      where: {
        orgId,
      },
      include: {
        user: true,
        role: true,
      },
    });

    res.status(201).json({
      message: "Members Fetched",
      members: membership.map((emp) => {
        return {
          userId: emp.userId,
          username: emp.user.username,
          roleName: emp.role.name,
        };
      }),
    });
  } catch (e) {
    console.error("Fetching Members Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function patchMemberRole(req: Request, res: Response) {
  try {
    const parsed = rolePatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid token",
        errors: parsed.error.format(),
      });
    }
    const { roleName } = parsed.data;
    //@ts-ignore

    const validatedRole = await prismaClient.role.findUnique({
      where: {
        name: roleName,
      },
    });

    if (!validatedRole) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { userId } = req.params;

    if (!userId || typeof userId != "string") {
      return res.status(400).json({ message: "Invalid userId parameter" });
    }
    //@ts-ignore
    // const { membershipId } = req.membership;
    const membership = await prismaClient.membership.update({
      where: {
        //@ts-ignore
        userId_orgId: { userId: userId, orgId: req.org?.orgId },
      },
      data: {
        roleId: validatedRole?.id,
      },
    });

    await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        //@ts-ignore
        orgId: req.org.orgId,
        action: "member:update_role",
      },
    });

    res.status(201).json({
      message: "Membership Patched",
      membership: membership,
    });
  } catch (e) {
    console.error("Member Patching Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { userId } = req.params;
    //@ts-ignore
    const { orgId } = req.org;
    // //@ts-ignore
    // const empId=req.employment.employmentId;
    if (!orgId) {
      return res.status(401).json({ message: "Organization Id Invalid" });
    }
    if (!userId || typeof userId != "string") {
      return res.status(401).json({ message: "User Param Id Invalid" });
    }
    const emp = await prismaClient.membership.delete({
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
    });
     await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        //@ts-ignore
        orgId: req.org.orgId,
        action: "member:remove",
      },
    });

    res.status(201).json({
      message: "Member deleted successfully",
      employee: emp,
    });
  } catch (e) {
    console.error("Error deleting membership:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
