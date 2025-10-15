import express from "express";
import * as userController from "./user.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Get all users
router.get("/", userController.getAllUsers);

// Get user statistics
router.get("/stats", userController.getUserStats);

// Get user by ID
router.get("/:id", userController.getUserById);

// Create user (Admin only)
router.post("/", authorizeRoles(['ADMIN']), userController.createUser);

// Update user (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), userController.updateUser);

// Update active status only (Admin only)
router.patch("/:id/active", authorizeRoles(['ADMIN']), userController.updateUserActive);

// Update user password (Admin only)
router.patch("/:id/password", authorizeRoles(['ADMIN']), userController.updateUserPassword);

export default router;
