import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

/**
 * JWT Authentication Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "ไม่พบ Token การเข้าสู่ระบบ"
      });
    }

    // Verify token
    jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Token ไม่ถูกต้องหรือหมดอายุ"
        });
      }

      // Add user info to request
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์"
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "ไม่พบข้อมูลผู้ใช้"
        });
      }

      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้"
        });
      }

      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      return res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์"
      });
    }
  };
};
