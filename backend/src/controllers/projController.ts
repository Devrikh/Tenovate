import type { Request, Response } from "express";
import { prismaClient } from "../lib/prisma.js";
import { createProjectSchema, deleteProjectSchema } from "../schemas/projectSchema.js";



export async function fetchProjects(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { orgId } = req.org;

    const projects = await prismaClient.project.findMany({
      where: {
        orgId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ projects });
  } catch (e) {
    console.error("Fetch Projects Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createProject(req: Request, res: Response) {
  try{
    const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid token",
      errors: parsed.error.format(),
    });
  }
  const { name } = parsed.data;

  //@ts-ignore
  const userId = req.user.id;
  //@ts-ignore
  const { orgId } = req.org;
  //@ts-ignore
  const usage = req.org.usage;

 


  const project = await prismaClient.project.create({
    data: {
      name: name,
      orgId: orgId,
    },
  });

  await prismaClient.usageLog.update({
    where: {
      id: usage.id,
    },
    data: {
      count: { increment: 1 },
    },
  });

  res.status(201).json({ message: "Project created", project });

}catch(e){
console.error("Create Project Error:", e);
    res.status(500).json({ message: "Internal server error" });
}
}

export async function deleteProject(req: Request, res: Response) {
  try{
    const parsed = deleteProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid token",
      errors: parsed.error.format(),
    });
  }
  const { projId } = parsed.data;

  //@ts-ignore
  const userId = req.user.id;
  //@ts-ignore
  const { orgId } = req.org;
  //@ts-ignore
  const usage = req.org.usage;

 


  const project = await prismaClient.project.delete({
    where:{
        id: projId,
        orgId: orgId
    }
  });

  if(usage.count>0) {
     await prismaClient.usageLog.update({
    where: {
      id: usage.id,
    },
    data: {
      count: { decrement: 1 },
    },
  });
  }
 

  res.status(201).json({ message: "Project Deleted", project });

}catch(e){
console.error("Delete Project Error:", e);
    res.status(500).json({ message: "Internal server error" });
}
}
