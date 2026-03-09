import type { Request, Response } from "express";
import { prismaClient } from "../../lib/prisma/prisma.js";

export async function getRoles(req: Request, res: Response) {
  const roles = await prismaClient.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
  const cleanedRoles = roles.map(role => ({
  id: role.id,
  name: role.name,
  permissions: role.permissions.map(rp => rp.permission.key), 
}));


  res.status(201).json({
    message: "Roles Fetched",
    roles: cleanedRoles,
  });
}

export async function createRole(req: Request, res: Response) {

    try{
  const { roleName, permissions } = req.body;
  const role = await prismaClient.role.create({
    data: {
      name: roleName,
    },
  });

  const validatedPermissions = await prismaClient.permission.findMany({
    where: {
      key: {
        in: permissions,
      },
    },
  });

  if (validatedPermissions.length !== permissions.length) {
    throw new Error("Invalid permissions provided");
  }

  const rolePermission=await prismaClient.rolePermission.createMany({
  data: validatedPermissions.map( p => ({
    roleId: role.id,
    permissionId: p.id
  }))
})

 await prismaClient.auditLog.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        //@ts-ignore
        orgId: req.org.orgId,
        action: "role:created",
      },
    });


  res.status(201).json({
    message: "Role Created",
    Role: rolePermission 
  });}catch(e){

    console.error("Creating Role Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
