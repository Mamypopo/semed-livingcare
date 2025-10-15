import * as authService from "./auth.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Register new user
 * POST /api/v1/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, registrationCode, role, branchId } = req.body;

    // Basic validation
    if (!name || !email || !password || !registrationCode) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, อีเมล, รหัสผ่าน, รหัสสมัครสมาชิก)"
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

    // Create user
    const newUser = await authService.registerUser({
      name,
      email,
      password,
      registrationCode,
      role,
      branchId
    });

    // Log system action
    await createSystemLog(req, "REGISTER_USER", {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    
    res.status(400).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก"
    });
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกอีเมลและรหัสผ่าน"
      });
    }

    // Login user
    const result = await authService.loginUser({ email, password });

    // Log system action
    await createSystemLog(req, "LOGIN", {
      userId: result.user.id,
      email: result.user.email
    });

    res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      data: result
    });

  } catch (error) {
    console.error("Login error:", error);
    
    res.status(401).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
    });
  }
};

/**
 * Get user profile
 * GET /api/v1/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้"
      });
    }

    const user = await authService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    
    res.status(400).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้"
    });
  }
};