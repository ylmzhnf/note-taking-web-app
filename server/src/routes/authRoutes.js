import express from "express";
import { login, register, passwordForget, passwordReset, googleAuth } from "../controllers/authController.js";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/password-forget", passwordForget);
router.post("/password-reset", passwordReset);
router.post("/google", googleAuth);

export default router;