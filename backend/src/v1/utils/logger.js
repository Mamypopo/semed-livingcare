import { prisma } from "../config/db.js";

/**
 * @param {Object} req - Express Request (ต้องมี req.user ถ้ามี user login)
 * @param {String} action - Action เช่น "CREATE_USER", "LOGIN", "APPROVE_USER"
 * @param {Object} details - รายละเอียดเพิ่มเติม เช่น { userId: 1, before: {}, after: {} }
 * @param {Number} branchId - ID ของสาขา (optional, ถ้าไม่ส่งจะใช้ user.branchId)
 * @param {String} hn - หมายเลข HN ของผู้ป่วย (optional, สำหรับกรอง log)
 */
export const createSystemLog = async (req, action, details = {}, branchId = null, hn = null) => {
  try {
    const user = req?.user || null;

    await prisma.systemLog.create({
      data: {
        action,
        details,
        userId: user?.id || null,
        branchId: branchId || user?.branchId || null,
        hn: hn || null,
      },
    });
  } catch (err) {
    console.warn("⚠️ Failed to create system log:", err.message);
  }
};
