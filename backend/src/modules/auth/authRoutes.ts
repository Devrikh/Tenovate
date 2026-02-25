import { Router } from "express";
import { login, signUp, userDetails } from "./authController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

// /api/v1/auth
//   POST   /signup
//   POST   /login
//   GET    /me
//   POST   /logout
//   POST   /refresh


const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/me", authMiddleware, userDetails);


export default router;
