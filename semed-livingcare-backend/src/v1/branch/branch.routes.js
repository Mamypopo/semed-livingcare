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

// Get branch statistics
router.get("/stats", branchController.getBranchStats);

// Get branch by ID
router.get("/:id", branchController.getBranchById);

// Create branch (Admin only)
router.post("/", authorizeRoles(['ADMIN']), branchController.createBranch);

// Update branch (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), branchController.updateBranch);

// Delete branch (Admin only)
router.delete("/:id", authorizeRoles(['ADMIN']), branchController.deleteBranch);

export default router;
