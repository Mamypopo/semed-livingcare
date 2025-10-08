import { prisma } from "../config/db.js";

/**
 * @param {Object} req - Express Request (ต้องมี req.user ถ้ามี user login)
 * @param {String} action - Action เช่น "CREATE_USER", "LOGIN", "APPROVE_USER"
 * @param {Object} details - รายละเอียดเพิ่มเติม เช่น { userId: 1, before: {}, after: {} }
 */
export const createSystemLog = async (req, action, details = {}) => {
  try {
    const user = req?.user || null;

    await prisma.systemLog.create({
      data: {
        action,
        details,
        userId: user?.id || null,
        branchId: user?.branchId || null,
      },
    });
  } catch (err) {
    console.warn("⚠️ Failed to create system log:", err.message);
  }
};
