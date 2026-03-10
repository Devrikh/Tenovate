import bcrypt from "bcrypt";
import { prismaClient } from "../../lib/prisma/prisma.js";
import jwt from "jsonwebtoken";
import { userLoginSchema, userSignupSchema, } from "../../validators/authSchema.js";
export async function signUp(req, res) {
    try {
        const parsed = userSignupSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: parsed.error.format(),
            });
        }
        const { username, email, password } = parsed.data;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });
        await prismaClient.auditLog.create({
            data: {
                userId: user.id,
                action: "user:registered",
            },
        });
        res.json({
            message: "User Created",
            user: { id: user.id, email: user.email, username: user.username },
        });
    }
    catch (e) {
        if (e.code === "P2002") {
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error("SignUp Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function login(req, res) {
    try {
        const parsed = userLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: parsed.error.format(),
            });
        }
        const { email, password } = parsed.data;
        const user = await prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            return res
                .status(409)
                .json({ message: "User not found, please register !" });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid Password" });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign({ userId: user.id }, secret);
        res.status(200).json({
            message: "Logged In",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (e) {
        console.error("Login Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function userDetails(req, res) {
    try {
        //@ts-ignore
        const userId = req.user.id;
        const user = await prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res
                .status(409)
                .json({ message: "User not found, please register !" });
        }
        res.status(200).json({
            message: "User details",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (e) {
        console.error("User Details Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=authController.js.map