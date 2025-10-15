import express from "express";
import * as tagController from "./tag.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Get all tags
router.get("/", tagController.getAllTags);

// Get tag statistics
router.get("/stats", tagController.getTagStats);

// Get tag by ID
router.get("/:id", tagController.getTagById);

// Create tag (Admin only)
router.post("/", authorizeRoles(['ADMIN']), tagController.createTag);

// Update tag (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), tagController.updateTag);

// Update tag active status (Admin only)
router.patch("/:id/active", authorizeRoles(['ADMIN']), tagController.updateTagActive);

export default router;
