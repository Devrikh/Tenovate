import jwt from "jsonwebtoken";
import { prismaClient } from "../lib/prisma.js";
export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "You are not Authenticated" });
        }
        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        }
        catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        const validatedUser = await prismaClient.user.findFirst({
            //@ts-ignore
            where: { id: decoded.userId },
        });
        if (!validatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //@ts-ignore
        req.user = {
            username: validatedUser.username,
            email: validatedUser.email,
            id: validatedUser.id,
        };
    }
    catch (e) {
        console.error("Auth Middleware Error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}
//# sourceMappingURL=authMiddleware.js.map