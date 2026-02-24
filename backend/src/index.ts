import express from "express";
import cors from "cors";
import { prismaClient } from "./lib/prisma/prisma.js";
import authRouter from "./routes/authRoutes.js";
import env from "dotenv";
import orgRouter from "./routes/orgRoutes.js";
import projRouter from "./routes/projectRoutes.js";

const app = express();
env.config();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});

app.get("/test-db", async (req, res) => {
  await prismaClient.$connect();
  res.json({
    message: "connected",
  });
});


app.use("/auth", authRouter);
app.use("/org", orgRouter);
app.use("/project", projRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
