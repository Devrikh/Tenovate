import { prismaClient } from "../../lib/prisma/prisma.js";
import crypto from "crypto";
import { orgCreateSchema, rolePatchSchema } from "../../validators/orgScema.js";
import { invitationSchema, tokenSchema, } from "../../validators/inviteSchema.js";
export async function fetchEmployees(req, res) {
    try {
        //@ts-ignore
        const { orgId } = req.org;
        const employees = await prismaClient.employment.findMany({
            where: {
                orgId,
            },
            include: {
                user: true,
                role: true,
            },
        });
        res.status(201).json({
            message: "Employees Fetched",
            employees: employees.map((emp) => {
                return {
                    userId: emp.userId,
                    username: emp.user.username,
                    roleName: emp.role.name,
                };
            }),
        });
    }
    catch (e) {
        console.error("Fetching Employees Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function patchEmployeeRole(req, res) {
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
        //@ts-ignore
        const { employmentId } = req.employment;
        const employee = await prismaClient.employment.update({
            where: {
                id: employmentId,
            },
            data: {
                roleId: validatedRole?.id,
            },
        });
        res.status(201).json({
            message: "Employee Patched",
            employee,
        });
    }
    catch (e) {
        console.error("Employee Patching Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function deleteEmployee(req, res) {
    try {
        //@ts-ignore
        const { empId } = req.params;
        //@ts-ignore
        const { orgId } = req.org;
        // //@ts-ignore
        // const empId=req.employment.employmentId;
        if (!orgId) {
            return res.status(401).json({ message: "Organization Id Invalid" });
        }
        if (!empId || typeof empId != "string") {
            return res.status(401).json({ message: "User Param Id Invalid" });
        }
        const emp = await prismaClient.employment.delete({
            where: {
                userId_orgId: {
                    userId: empId,
                    orgId: orgId,
                },
            },
        });
        res.status(201).json({
            message: "Employee deleted successfully",
            employee: emp,
        });
    }
    catch (e) {
        console.error("Error deleting empoyment:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=employeeController.js.map