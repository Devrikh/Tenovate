import jwt from "jsonwebtoken";
import { prismaClient } from "../lib/prisma.js";
export async function authMiddleware(req, res, next) {
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
        return;
    }
    const decoded = jwt.verify(token, secret);
    const validatedUser = await prismaClient.user.findFirst({
        //@ts-ignore
        where: { id: decoded.userId }
    });
    if (!validatedUser)
        return res.json({ message: "User Not Found" });
    //@ts-ignore
    req.user = {
        username: validatedUser.username,
        email: validatedUser.email,
        id: validatedUser.id
    };
    next();
}
//# sourceMappingURL=authMiddleware.js.map