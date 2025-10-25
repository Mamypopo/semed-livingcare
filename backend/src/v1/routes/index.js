import express from "express";
import authRoutes from "../auth/auth.routes.js";
import branchRoutes from "../branch/branch.routes.js";
import userRoutes from "../user/user.routes.js";
import patientGroupRoutes from "../patient-group/patient-group.routes.js";
import tagRoutes from "../tag/tag.routes.js";
import insuranceTypeRoutes from "../insurance-type/insurance-type.routes.js";
import patientRoutes from "../patient/patient.routes.js";
import fileRoutes from "../file/file.routes.js";
import departmentRoutes from "../department/department.routes.js";

const router = express.Router();

// Routes
router.use("/auth", authRoutes);
router.use("/branches", branchRoutes);
router.use("/users", userRoutes);
router.use("/patient-groups", patientGroupRoutes);
router.use("/tags", tagRoutes);
router.use("/insurance-types", insuranceTypeRoutes);
router.use("/patients", patientRoutes);
router.use("/departments", departmentRoutes);
router.use("/", fileRoutes);

export default router;
