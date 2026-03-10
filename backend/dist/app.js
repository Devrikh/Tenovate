import express from "express";
import cors from "cors";
import env from "dotenv";
import apiRouter from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";
env.config();
const app = express();
setupSwagger(app);
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "API Running" });
});
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/v1", apiRouter);
export default app;
//# sourceMappingURL=app.js.map