import jwt from "jsonwebtoken";
export function authMiddleware(req, res, next) {
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
    //@ts-ignore
    req.user = decoded;
    next();
}
//# sourceMappingURL=authMiddleware.js.map