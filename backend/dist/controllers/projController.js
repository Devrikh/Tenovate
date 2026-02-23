import { prismaClient } from "../lib/prisma.js";
export async function createProject(req, res) {
    //@ts-ignore
    const userId = req.user.id;
    //@ts-ignore
    const { orgId } = req.org;
    //@ts-ignore
    const usage = req.org.usage;
    const { name } = req.body;
    const project = await prismaClient.project.create({
        data: {
            name: name,
            organizationId: orgId
        }
    });
    await prismaClient.usageLog.update({
        where: {
            id: usage.id,
        },
        data: {
            count: { increment: 1 },
        },
    });
    res.json({ message: "Project Created",
        project
    });
}
export async function fetchProjects(req, res) {
    //@ts-ignore
    const { orgId } = req.org;
    const projects = await prismaClient.project.findMany({
        where: {
            organizationId: orgId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    res.json({
        projects
    });
}
//# sourceMappingURL=projController.js.map