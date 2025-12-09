import express from "express";
import { updatePassword, updateTheme } from "../controllers/settingsController";
import { verifyToken } from "../middleware/authMiddleware.js";

const router= express.Router();

router.patch("/password",verifyToken ,updatePassword);
router.patch("/theme", verifyToken, updateTheme);

export default router;