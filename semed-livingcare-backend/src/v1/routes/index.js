import express from "express";
import authRoutes from "../auth/auth.routes.js";
import permissionsRoutes from "./permissions.routes.js";

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/permissions", permissionsRoutes);

export default router;
