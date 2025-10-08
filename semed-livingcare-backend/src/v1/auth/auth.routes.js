import express from "express";
import * as authController from "./auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

router.use(authenticateToken)
// Protected routes
router.get("/me",  authController.getProfile);

export default router;