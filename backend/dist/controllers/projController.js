import { prismaClient } from "../lib/prisma.js";
export async function createProject(req, res) {
    //@ts-ignore
    const userId = req.user.id;
    //@ts-ignore
    const { orgId, roleId } = req.employment;
    const { name } = req.body;
    const project = await prismaClient.project.create({
        data: {
            name: name,
            organizationId: orgId
        }
    });
    res.json({ message: "Project Created",
        project
    });
}
export async function fetchProjects(req, res) {
    //@ts-ignore
    const { orgId, roleId } = req.employment;
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