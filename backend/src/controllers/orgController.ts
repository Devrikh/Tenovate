import type { Request, Response } from "express";
import { prismaClient } from "../lib/prisma.js";

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
  const orgs= await prismaClient.employment.findMany({
    where: {userId},
    include: {org: true}
  })

  res.json(orgs);

}

export async function inviteEmployee(req:Request, res: Response) {
  

}
