import express from "express";
import authRoutes from "../auth/auth.routes.js";
import branchRoutes from "../branch/branch.routes.js";
import userRoutes from "../user/user.routes.js";
import patientGroupRoutes from "../patient-group/patient-group.routes.js";
import tagRoutes from "../tag/tag.routes.js";
import insuranceTypeRoutes from "../insurance-type/insurance-type.routes.js";

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/branches", branchRoutes);
router.use("/users", userRoutes);
router.use("/patient-groups", patientGroupRoutes);
router.use("/tags", tagRoutes);
router.use("/insurance-types", insuranceTypeRoutes);

export default router;
