import * as branchService from "./branch.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Get branches accessible by user
 * GET /api/v1/branches/user-branches
 */
export const getUserBranches = async (req, res) => {
  try {
    const user = req.user; // User from auth middleware
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const branches = await branchService.getUserBranches(user);

    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลสาขาสำเร็จ',
      data: branches
    });

  } catch (error) {
    console.error('Get user branches error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสาขา'
    });
  }
};

/**
 * Get all branches for dropdown
 * GET /api/v1/branches/dropdown
 */
export const getAllBranchesForDropdown = async (req, res) => {
  try {
    const { search, limit } = req.query;
    
    const filters = {
      ...(search && { search }),
      ...(limit && { limit: Number(limit) })
    };

    const branches = await branchService.getAllBranchesForDropdown(filters);

    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลสาขาสำเร็จ',
      data: branches
    });

  } catch (error) {
    console.error('Get branches for dropdown error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสาขา'
    });
  }
};

/**
 * Get all branches
 * GET /api/v1/branches
 */
export const getAllBranches = async (req, res) => {
  try {
    const { isActive, search, page, pageSize, sort, order } = req.query;
    
    const filters = {
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && { search }),
      ...(page && { page: Number(page) }),
      ...(pageSize && { pageSize: Number(pageSize) }),
      ...(sort && { sort }),
      ...(order && { order })
    };

    const { branches, total } = await branchService.getAllBranches(filters);

    res.status(200).json({
      success: true,
      data: branches,
      meta: {
        total,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        totalPages: Math.max(1, Math.ceil(total / (Number(pageSize) || 10)))
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
 * Get latest branch code
 * GET /api/v1/branches/latest-code
 */
export const getLatestCode = async (req, res) => {
  try {
    const latest = await branchService.getLatestCode();
    res.status(200).json({ success: true, data: { code: latest } });
  } catch (error) {
    console.error("Get latest branch code error:", error);
    res.status(500).json({ success: false, message: error.message || 'ไม่สามารถดึงรหัสสาขาล่าสุดได้' });
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
    const { code, name, address, phone, isMainBranch } = req.body;

    // Basic validation
    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกรหัสสาขาและชื่อสาขา"
      });
    }

    // Code format validation (S + 3 digits, e.g., S001)
    if (!/^S\d{3}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "รหัสสาขาต้องเป็นรูปแบบ SXXX (ตัวอักษร S + ตัวเลข 3 ตัว)"
      });
    }

    const newBranch = await branchService.createBranch({
      code,
      name,
      address,
      phone,
      isMainBranch
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
    const { code, name, address, phone, isActive, isMainBranch } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID สาขาไม่ถูกต้อง"
      });
    }

    // Code format validation (if provided)
    if (code && !/^S\d{3}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "รหัสสาขาต้องเป็นรูปแบบ SXXX (ตัวอักษร S + ตัวเลข 3 ตัว)"
      });
    }

    const updatedBranch = await branchService.updateBranch(id, {
      code,
      name,
      address,
      phone,
      isActive,
      isMainBranch
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
 * Update only active status
 * PATCH /api/v1/branches/:id/active
 */
export const updateBranchActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID สาขาไม่ถูกต้อง" });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: "isActive ต้องเป็นค่า boolean" });
    }

    const updated = await branchService.updateBranchActive(id, isActive);

    // Log
    await createSystemLog(req, isActive ? "ACTIVATE_BRANCH" : "DEACTIVATE_BRANCH", {
      branchId: updated.id,
      code: updated.code,
      name: updated.name,
      isActive
    });

    res.status(200).json({ success: true, message: "อัปเดตสถานะสาขาสำเร็จ", data: { branch: updated } });
  } catch (error) {
    console.error("Update active error:", error);
    let statusCode = 500;
    if (error.message === "ไม่พบสาขาที่ระบุ") statusCode = 404;
    res.status(statusCode).json({ success: false, message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
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
