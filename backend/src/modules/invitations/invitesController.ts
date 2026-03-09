import type { Request, Response } from "express";
import { prismaClient } from "../../lib/prisma/prisma.js";
import crypto from "crypto";
import {
  invitationSchema,
  tokenSchema,
} from "../../validators/inviteSchema.js";

export async function inviteMember(req: Request, res: Response) {
  try {
    const parsed = invitationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid token",
        errors: parsed.error.format(),
      });
    }

    const { role, email } = parsed.data;
    //@ts-ignore
    const { orgId } = req.org;

    const validatedRole = await prismaClient.role.findFirst({
      where: {
        name: role,
      },
    });

    if (!validatedRole) {
      return res.status(400).json({ message: "Invalid role" });
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


     await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        //@ts-ignore
        orgId: req.org.orgId,
        action: "member:invited",
      },
    });

    res.status(201).json({
      message: "Invitation sent",
      inviteLink: `http://localhost:3000/api/v1/invitations/accept?token=${rawToken}`,
      invite,
    });
  } catch (e) {
    console.error("Send Invitation Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function listInvites(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { orgId } = req.org;

    const invites = await prismaClient.invitation.findMany({
      where:{
        orgId: orgId
      },include:{
        role: true
      }
    });

    res.status(201).json({
      message: "Invitations Fetched",
      invites
    });
  } catch (e) {
    console.error("Fetching Invitations Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function acceptMember(req: Request, res: Response) {
  try {
    const parsed = tokenSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid token",
        errors: parsed.error.format(),
      });
    }

    const { token } = parsed.data;

    if (!token || typeof token != "string") {
      return res
        .status(400)
        .json({ message: "Token is required and must be a string" });
    }

    //@ts-ignore
    const user = req.user;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

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

    await prismaClient.membership.create({
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

    const feature= await prismaClient.feature.findUnique({
      where: {key: "member:invite"}
    })

    if (!feature || typeof feature.key != "string") {
      return res
        .status(400)
        .json({ message: "Feature is required and its key must be a string" });
    }

    await prismaClient.usageLog.update({
      where: {
        orgId_featureKey: {orgId: invitation.orgId, featureKey: feature?.key },
      },
      data: {
        count: { increment: 1 },
      },
    });

      await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        //@ts-ignore
        orgId: req.org.orgId,
        action: "invite:accepted",
      },
    });
    await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        //@ts-ignore
        orgId: req.org.orgId,
        action: "membership:added",
      },
    });
    

    res.status(200).json({
      message: "You have successfully joined the organization!",
    });
  } catch (e) {
    console.error("Accept Invitation Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function declineMember(req: Request, res: Response) {
  try {
    const parsed = tokenSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid token",
        errors: parsed.error.format(),
      });
    }

    const { token } = parsed.data;

    if (!token || typeof token != "string") {
      return res
        .status(400)
        .json({ message: "Token is required and must be a string" });
    }

    //@ts-ignore
    const user = req.user;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

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

    await prismaClient.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: user.id,
        //@ts-ignore
        orgId: invitation.orgId,
        action: "invite:declined",
      },
    });

    res.status(200).json({
      message: "You have successfully declined the invite!",
    });
  } catch (e) {
    console.error("Decline Invitation Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}