import * as branchService from "./branch.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Get all branches
 * GET /api/v1/branches
 */
export const getAllBranches = async (req, res) => {
  try {
    const { isActive, search } = req.query;
    
    const filters = {
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && { search })
    };

    const branches = await branchService.getAllBranches(filters);

    res.status(200).json({
      success: true,
      data: {
        branches,
        count: branches.length
      }
    });

  } catch (error) {
    console.error("Get branches error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลสาขา"
    });
  }
};

/**
 * Get branch by ID
 * GET /api/v1/branches/:id
 */
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID สาขาไม่ถูกต้อง"
      });
    }

    const branch = await branchService.getBranchById(id);

    res.status(200).json({
      success: true,
      data: {
        branch
      }
    });

  } catch (error) {
    console.error("Get branch error:", error);
    
    const statusCode = error.message === "ไม่พบสาขาที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลสาขา"
    });
  }
};

/**
 * Create new branch
 * POST /api/v1/branches
 */
export const createBranch = async (req, res) => {
  try {
    const { code, name, address, phone } = req.body;

    // Basic validation
    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกรหัสสาขาและชื่อสาขา"
      });
    }

    // Code format validation
    if (!/^[A-Z]{2}\d{3}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "รหัสสาขาต้องเป็นรูปแบบ BR001 (ตัวอักษร 2 ตัว + ตัวเลข 3 ตัว)"
      });
    }

    const newBranch = await branchService.createBranch({
      code,
      name,
      address,
      phone
    });

    // Log system action
    await createSystemLog(req, "CREATE_BRANCH", {
      branchId: newBranch.id,
      code: newBranch.code,
      name: newBranch.name
    });

    res.status(201).json({
      success: true,
      message: "สร้างสาขาสำเร็จ",
      data: {
        branch: newBranch
      }
    });

  } catch (error) {
    console.error("Create branch error:", error);
    
    const statusCode = error.message === "รหัสสาขานี้ถูกใช้งานแล้ว" ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างสาขา"
    });
  }
};

/**
 * Update branch
 * PUT /api/v1/branches/:id
 */
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, address, phone, isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID สาขาไม่ถูกต้อง"
      });
    }

    // Code format validation (if provided)
    if (code && !/^[A-Z]{2}\d{3}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "รหัสสาขาต้องเป็นรูปแบบ BR001 (ตัวอักษร 2 ตัว + ตัวเลข 3 ตัว)"
      });
    }

    const updatedBranch = await branchService.updateBranch(id, {
      code,
      name,
      address,
      phone,
      isActive
    });

    // Log system action
    await createSystemLog(req, "UPDATE_BRANCH", {
      branchId: updatedBranch.id,
      code: updatedBranch.code,
      name: updatedBranch.name
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตสาขาสำเร็จ",
      data: {
        branch: updatedBranch
      }
    });

  } catch (error) {
    console.error("Update branch error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบสาขาที่ระบุ") statusCode = 404;
    if (error.message === "รหัสสาขานี้ถูกใช้งานแล้ว") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสาขา"
    });
  }
};

/**
 * Delete branch (soft delete)
 * DELETE /api/v1/branches/:id
 */
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID สาขาไม่ถูกต้อง"
      });
    }

    const deletedBranch = await branchService.deleteBranch(id);

    // Log system action
    await createSystemLog(req, "DELETE_BRANCH", {
      branchId: deletedBranch.id,
      code: deletedBranch.code,
      name: deletedBranch.name
    });

    res.status(200).json({
      success: true,
      message: "ลบสาขาสำเร็จ",
      data: {
        branch: deletedBranch
      }
    });

  } catch (error) {
    console.error("Delete branch error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบสาขาที่ระบุ") statusCode = 404;
    if (error.message === "ไม่สามารถลบสาขาที่มีผู้ใช้งานได้") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการลบสาขา"
    });
  }
};

/**
 * Get branch statistics
 * GET /api/v1/branches/stats
 */
export const getBranchStats = async (req, res) => {
  try {
    const stats = await branchService.getBranchStats();

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error("Get branch stats error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสถิติสาขา"
    });
  }
};
