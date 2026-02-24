import type { Request, Response } from "express";
import { prismaClient } from "../lib/prisma.js";
import { createProjectSchema } from "../schemas/projectSchema.js";

export async function createProject(req: Request, res: Response){


    const parsed = createProjectSchema.safeParse(req.body);
  
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid token",
        errors: parsed.error.format(),
      });
    }



    //@ts-ignore
    const userId= req.user.id;
    //@ts-ignore
    const {orgId}= req.org;
    //@ts-ignore
    const usage= req.org.usage;

    const {name}=parsed.data;

    
    const project= await prismaClient.project.create({
        data:{
            name: name,
            organizationId: orgId
        }
    })

    await prismaClient.usageLog.update({
      where: {
        id: usage.id,
      },
      data: {
        count: {increment: 1},
      },
    });


    res.json({message: "Project Created",
        project
    })



}


export async function fetchProjects(req: Request, res: Response) {
    //@ts-ignore
    const {orgId}= req.org;

    const projects= await prismaClient.project.findMany({
        where:{
            organizationId: orgId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })


    res.json({
        projects
    })

}