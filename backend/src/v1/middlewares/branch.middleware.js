import { prisma } from '../config/db.js'

/**
 * Middleware to add branch filter to request
 * This ensures all API calls are filtered by user's branch
 */
export const addBranchFilter = (req, res, next) => {
  try {
    const user = req.user
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      })
    }

    // Add branch filter to request
    req.branchFilter = {}

    // ADMIN can see all branches (no filter)
    if (user.role === 'ADMIN') {
      // No branch filter for admin
    } else {
      // STAFF/GUEST can only see their assigned branch
      if (user.branchId) {
        req.branchFilter.branchId = user.branchId
      } else {
        // User without branch assignment - return empty results
        req.branchFilter.branchId = -1 // Non-existent branch ID
      }
    }

    next()
  } catch (error) {
    console.error('Error in addBranchFilter middleware:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการกรองข้อมูลสาขา'
    })
  }
}

/**
 * Helper function to build where clause with branch filter
 */
export const buildBranchWhereClause = (baseWhere = {}, branchFilter = {}) => {
  const where = { ...baseWhere }

  // Add branch filter if exists
  if (branchFilter.branchId !== undefined) {
    if (branchFilter.branchId === -1) {
      // User without branch assignment - return no results
      where.id = -1
    } else {
      where.branchId = branchFilter.branchId
    }
  }

  return where
}

/**
 * Helper function to validate branch access
 */
export const validateBranchAccess = async (userId, branchId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, branchId: true }
    })

    if (!user) {
      return false
    }

    // ADMIN can access any branch
    if (user.role === 'ADMIN') {
      return true
    }

    // STAFF/GUEST can only access their assigned branch
    return user.branchId === branchId
  } catch (error) {
    console.error('Error validating branch access:', error)
    return false
  }
}
