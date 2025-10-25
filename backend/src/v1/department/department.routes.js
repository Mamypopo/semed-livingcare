import express from "express";
import * as departmentController from "./department.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Get all departments
router.get("/", departmentController.getAllDepartments);

// Get all departments for dropdown
router.get("/dropdown", departmentController.getAllDepartmentsForDropdown);

// Get department by ID
router.get("/:id", departmentController.getDepartmentById);

// Create department (Admin only)
router.post("/", authorizeRoles(['ADMIN']), departmentController.createDepartment);

// Update department (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), departmentController.updateDepartment);

// Update department active status (Admin only)
router.patch("/:id/active", authorizeRoles(['ADMIN']), departmentController.updateDepartmentActive);

export default router;
