import express from "express";
import * as insuranceTypeController from "./insurance-type.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Get all insurance types
router.get("/", insuranceTypeController.getAllInsuranceTypes);

// Get insurance type statistics
router.get("/stats", insuranceTypeController.getInsuranceTypeStats);

// Get insurance type by ID
router.get("/:id", insuranceTypeController.getInsuranceTypeById);

// Create insurance type (Admin only)
router.post("/", authorizeRoles(['ADMIN']), insuranceTypeController.createInsuranceType);

// Update insurance type (Admin only)
router.put("/:id", authorizeRoles(['ADMIN']), insuranceTypeController.updateInsuranceType);

// Update insurance type active status (Admin only)
router.patch("/:id/active", authorizeRoles(['ADMIN']), insuranceTypeController.updateInsuranceTypeActive);

export default router;
