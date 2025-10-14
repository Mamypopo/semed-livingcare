import express from "express";
import authRoutes from "../auth/auth.routes.js";
import branchRoutes from "../branch/branch.routes.js";

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/branches", branchRoutes);

export default router;
