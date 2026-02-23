import type { Request, Response } from "express";
import { prismaClient } from "../lib/prisma.js";
import crypto from "crypto";

export async function orgCreate(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user.id;
  const { orgName, planId } = req.body;

  const org = await prismaClient.organization.create({
    data: {
      name: orgName,
      planId,
    },
  });

  const adminRole = await prismaClient.role.findFirst({
    where: { name: "Admin" },
  });

  if (!adminRole) {
    throw new Error("Admin role not found");
  }
  const employment = await prismaClient.employment.create({
    data: {
      userId: userId,
      orgId: org.id,
      roleId: adminRole?.id,
    },
  });

  res.json({ message: "Organization Created!!", org, employment });
}

export async function fetchOrg(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user.id;
  const orgs = await prismaClient.employment.findMany({
    where: { userId },
    include: { org: true },
  });

  res.json(orgs);
}

export async function inviteEmployee(req: Request, res: Response) {
  const { role, email } = req.body;
  //@ts-ignore
  const { orgId } = req.employment;

  const validatedRole = await prismaClient.role.findFirst({
    where: {
      name: role,
    },
  });

  if (!validatedRole) {
    return res.json({ message: "Invalid role" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const invite = await prismaClient.invitation.create({
    data: {
      roleId: validatedRole?.id,
      orgId,
      email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
      token: hashedToken,
    },
  });

  res.json({
    message: "Invitation Sent",
    inviteLink: `http://localhost:3000/org/invite/accept?token=${rawToken}`,
    invite,
  });
}

export async function acceptEmployee(req: Request, res: Response) {
  //@ts-ignore
  const user = req.user;

  const { token } = req.query;

  if (!token ) {
    return res.status(400).json({ message: "Token is required" });
  }

  if(typeof token != "string"){
     return res.status(400).json({ message: "Token is required" });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    const invitation = await prismaClient.invitation.findFirst({
      where: {
        token: hashedToken,
        status: "PENDING",
        expiresAt: { gte: new Date() },
      },
    });

    if (!invitation || invitation?.email != user.email) {
      return res.status(403).json({
        message: "This invite is not valid for your email",
      });
    }

    await prismaClient.employment.create({
      data: {
        orgId: invitation?.orgId,
        roleId: invitation?.roleId,
        userId: user.id,
      },
    });

    await prismaClient.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return res.json({
      message: "You have successfully joined the organization!",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong", e });
  }
}
