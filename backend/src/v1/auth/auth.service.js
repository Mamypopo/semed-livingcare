import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { ENV } from "../config/env.js";

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Object} Created user data (without password)
 */
export const registerUser = async (userData) => {
  const { name, email, password, registrationCode, role = "GUEST", branchId } = userData;

  // Validate registration code
  if (!registrationCode) {
    throw new Error("กรุณากรอกรหัสสมัครสมาชิก");
  }

  if (registrationCode !== ENV.REGISTRATION_CODE) {
    throw new Error("รหัสสมัครสมาชิกไม่ถูกต้อง");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      branchId: branchId || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      branchId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return newUser;
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Object} User data and JWT token
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      branch: {
        select: {
          id: true,
          code: true,
          name: true
        }
      },
    }
  });

  if (!user) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  if (!user.isActive) {
    throw new Error("บัญชีนี้ถูกปิดใช้งาน");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      userId: user.id,  // Keep both for compatibility
      email: user.email, 
      role: user.role,
      branchId: user.branchId 
    },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Get user profile
 * @param {Number} userId - User ID
 * @returns {Object} User profile data
 */
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      branchId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      branch: {
        select: {
          id: true,
          code: true,
          name: true
        }
      },
    }
  });

  if (!user) {
    throw new Error("ไม่พบผู้ใช้");
  }

  return user;
};