import express from "express";
import { login, register, passwordForget, passwordReset, googleAuth, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/password-forgot", passwordForget);
router.post("/password-reset", passwordReset);
router.post("/google", googleAuth);
router.get("/me", verifyToken, getMe);

export default router;