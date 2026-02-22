import bcrypt from "bcrypt";
import { prismaClient } from "../lib/prisma.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";


export async function signUp(req: Request, res: Response) {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  res.json({ message: "User Created", user: user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prismaClient.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user!.password);

  if (!valid) return res.status(401).json({ error: "Invalid Password" });


  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }


  const token = jwt.sign({ userId: user!.id }, secret);

  res.json({ message: "Logged In", token });
}
