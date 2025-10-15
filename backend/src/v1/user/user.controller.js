import * as userService from "./user.service.js";
import { createSystemLog } from "../utils/logger.js";
import bcrypt from "bcryptjs";

/**
 * Get all users
 * GET /api/v1/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const { 
      isActive, 
      role, 
      branchId, 
      staffLevelId,
      search, 
      page, 
      pageSize, 
      sort, 
      order 
    } = req.query;
    
    const filters = {
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(role && { role }),
      ...(branchId && { branchId }),
      ...(staffLevelId && { staffLevelId }),
      ...(search && { search }),
      ...(page && { page: Number(page) }),
      ...(pageSize && { pageSize: Number(pageSize) }),
      ...(sort && { sort }),
      ...(order && { order })
    };

    const { users, total } = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      data: users,
      meta: {
        total,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        totalPages: Math.max(1, Math.ceil(total / (Number(pageSize) || 10)))
      }
    });

  } catch (error) {
    console.error("Get users error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้"
    });
  }
};

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID ผู้ใช้ไม่ถูกต้อง"
      });
    }

    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error("Get user error:", error);
    
    const statusCode = error.message === "ไม่พบผู้ใช้ที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้"
    });
  }
};

/**
 * Create new user
 * POST /api/v1/users
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, branchId, staffLevelId } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, อีเมล, รหัสผ่าน)"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบอีเมลไม่ถูกต้อง"
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
      });
    }

    // Role validation
    const validRoles = ['ADMIN', 'STAFF', 'GUEST'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "ระดับผู้ใช้ไม่ถูกต้อง"
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      branchId,
      staffLevelId
    });

    // Log system action
    await createSystemLog(req, "CREATE_USER", {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      branchId: newUser.branchId
    });

    res.status(201).json({
      success: true,
      message: "สร้างผู้ใช้สำเร็จ",
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error("Create user error:", error);
    
    const statusCode = error.message === "อีเมลนี้ถูกใช้งานแล้ว" ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างผู้ใช้"
    });
  }
};

/**
 * Update user
 * PUT /api/v1/users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, branchId, staffLevelId, isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID ผู้ใช้ไม่ถูกต้อง"
      });
    }

    // Email validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "รูปแบบอีเมลไม่ถูกต้อง"
        });
      }
    }

    // Role validation (if provided)
    if (role) {
      const validRoles = ['ADMIN', 'STAFF', 'GUEST'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "ระดับผู้ใช้ไม่ถูกต้อง"
        });
      }
    }

    const updatedUser = await userService.updateUser(id, {
      name,
      email,
      role,
      branchId,
      staffLevelId,
      isActive
    });

    // Log system action
    await createSystemLog(req, "UPDATE_USER", {
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      branchId: updatedUser.branchId
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตผู้ใช้สำเร็จ",
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error("Update user error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบผู้ใช้ที่ระบุ") statusCode = 404;
    if (error.message === "อีเมลนี้ถูกใช้งานแล้ว") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้"
    });
  }
};

/**
 * Update only active status
 * PATCH /api/v1/users/:id/active
 */
export const updateUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID ผู้ใช้ไม่ถูกต้อง" 
      });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: "isActive ต้องเป็นค่า boolean" 
      });
    }

    const updated = await userService.updateUserActive(id, isActive);

    // Log
    await createSystemLog(req, isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER", {
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      isActive
    });

    res.status(200).json({ 
      success: true, 
      message: "อัปเดตสถานะผู้ใช้สำเร็จ", 
      data: { user: updated } 
    });
  } catch (error) {
    console.error("Update active error:", error);
    let statusCode = 500;
    if (error.message === "ไม่พบผู้ใช้ที่ระบุ") statusCode = 404;
    res.status(statusCode).json({ 
      success: false, 
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ" 
    });
  }
};

/**
 * Update user password
 * PATCH /api/v1/users/:id/password
 */
export const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID ผู้ใช้ไม่ถูกต้อง"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกรหัสผ่านใหม่"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updated = await userService.updateUserPassword(id, hashedPassword);

    // Log system action
    await createSystemLog(req, "UPDATE_USER_PASSWORD", {
      userId: updated.id,
      email: updated.email
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตรหัสผ่านสำเร็จ",
      data: {
        user: updated
      }
    });

  } catch (error) {
    console.error("Update password error:", error);
    
    const statusCode = error.message === "ไม่พบผู้ใช้ที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน"
    });
  }
};

/**
 * Get user statistics
 * GET /api/v1/users/stats
 */
export const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error("Get user stats error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสถิติผู้ใช้"
    });
  }
};

/**
 * Get branches for user assignment
 * GET /api/v1/users/branches
 */
export const getBranchesForUser = async (req, res) => {
  try {
    const branches = await userService.getBranchesForUser();

    res.status(200).json({
      success: true,
      data: branches
    });

  } catch (error) {
    console.error("Get branches for user error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลสาขา"
    });
  }
};

/**
 * Get staff levels for user assignment
 * GET /api/v1/users/staff-levels
 */
export const getStaffLevelsForUser = async (req, res) => {
  try {
    const staffLevels = await userService.getStaffLevelsForUser();

    res.status(200).json({
      success: true,
      data: staffLevels
    });

  } catch (error) {
    console.error("Get staff levels for user error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลระดับพนักงาน"
    });
  }
};
