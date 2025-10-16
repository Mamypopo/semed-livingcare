import express from "express";
import * as patientGroupController from "./patient-group.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Get all patient groups
router.get("/", patientGroupController.getAllPatientGroups);

// Get all patient groups for dropdown
router.get("/dropdown", patientGroupController.getAllPatientGroupsForDropdown);

// Get patient group statistics
router.get("/stats", patientGroupController.getPatientGroupStats);

// Get patient group by ID
router.get("/:id", patientGroupController.getPatientGroupById);

// Create patient group (Admin only)
router.post("/", authorizeRoles(['ADMIN']), patientGroupController.createPatientGroup);

// Update patient group (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), patientGroupController.updatePatientGroup);

// Update patient group active status (Admin only)
router.patch("/:id/active", authorizeRoles(['ADMIN']), patientGroupController.updatePatientGroupActive);

export default router;
