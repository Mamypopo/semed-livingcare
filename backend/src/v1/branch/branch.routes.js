import express from "express";
import * as branchController from "./branch.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes (if needed)
// router.get("/", branchController.getAllBranches);

// Protected routes - require authentication
router.use(authenticateToken);

// Get all branches
router.get("/", branchController.getAllBranches);

// Get latest branch code
router.get("/latest-code", branchController.getLatestCode);

// Get branch statistics
router.get("/stats", branchController.getBranchStats);

// Get branch by ID
router.get("/:id", branchController.getBranchById);

// Create branch (Admin only)
router.post("/", authorizeRoles(['ADMIN']), branchController.createBranch);

// Update branch (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), branchController.updateBranch);

// Update active status only (Admin only)
router.patch("/:id/active", authorizeRoles(['ADMIN']), branchController.updateBranchActive);

export default router;
