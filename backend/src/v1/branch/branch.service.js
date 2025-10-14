import { prisma } from "../config/db.js";

/**
 * Get all branches
 * @param {Object} filters - Filter options
 * @returns {Array} List of branches
 */
export const getAllBranches = async (filters = {}) => {
  const { isActive, search } = filters;
  
  const where = {};
  
  if (isActive !== undefined) {
    where.isActive = isActive;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } }
    ];
  }

  const branches = await prisma.branch.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          users: true,
          systemLogs: true
        }
      }
    }
  });

  return branches;
};

/**
 * Get branch by ID
 * @param {Number} id - Branch ID
 * @returns {Object} Branch data
 */
export const getBranchById = async (id) => {
  const branch = await prisma.branch.findUnique({
    where: { id: parseInt(id) },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true
        }
      },
      _count: {
        select: {
          users: true,
          systemLogs: true
        }
      }
    }
  });

  if (!branch) {
    throw new Error("ไม่พบสาขาที่ระบุ");
  }

  return branch;
};

/**
 * Create new branch
 * @param {Object} branchData - Branch data
 * @returns {Object} Created branch
 */
export const createBranch = async (branchData) => {
  const { code, name, address, phone } = branchData;

  // Check if code already exists
  const existingBranch = await prisma.branch.findUnique({
    where: { code }
  });

  if (existingBranch) {
    throw new Error("รหัสสาขานี้ถูกใช้งานแล้ว");
  }

  const newBranch = await prisma.branch.create({
    data: {
      code,
      name,
      address: address || null,
      phone: phone || null,
    },
    include: {
      _count: {
        select: {
          users: true,
          systemLogs: true
        }
      }
    }
  });

  return newBranch;
};

/**
 * Update branch
 * @param {Number} id - Branch ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated branch
 */
export const updateBranch = async (id, updateData) => {
  const { code, name, address, phone, isActive } = updateData;

  // Check if branch exists
  const existingBranch = await prisma.branch.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingBranch) {
    throw new Error("ไม่พบสาขาที่ระบุ");
  }

  // Check if new code already exists (if code is being changed)
  if (code && code !== existingBranch.code) {
    const codeExists = await prisma.branch.findUnique({
      where: { code }
    });

    if (codeExists) {
      throw new Error("รหัสสาขานี้ถูกใช้งานแล้ว");
    }
  }

  const updatedBranch = await prisma.branch.update({
    where: { id: parseInt(id) },
    data: {
      ...(code && { code }),
      ...(name && { name }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      _count: {
        select: {
          users: true,
          systemLogs: true
        }
      }
    }
  });

  return updatedBranch;
};

/**
 * Delete branch (soft delete)
 * @param {Number} id - Branch ID
 * @returns {Object} Deleted branch
 */
export const deleteBranch = async (id) => {
  // Check if branch exists
  const existingBranch = await prisma.branch.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          users: true
        }
      }
    }
  });

  if (!existingBranch) {
    throw new Error("ไม่พบสาขาที่ระบุ");
  }

  // Check if branch has users
  if (existingBranch._count.users > 0) {
    throw new Error("ไม่สามารถลบสาขาที่มีผู้ใช้งานได้");
  }

  // Soft delete (set isActive to false)
  const deletedBranch = await prisma.branch.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
    include: {
      _count: {
        select: {
          users: true,
          systemLogs: true
        }
      }
    }
  });

  return deletedBranch;
};

/**
 * Get branch statistics
 * @returns {Object} Branch statistics
 */
export const getBranchStats = async () => {
  const stats = await prisma.branch.aggregate({
    _count: {
      id: true
    },
    where: {
      isActive: true
    }
  });

  const branchesWithUsers = await prisma.branch.count({
    where: {
      isActive: true,
      users: {
        some: {}
      }
    }
  });

  return {
    totalBranches: stats._count.id,
    activeBranches: stats._count.id,
    branchesWithUsers,
    emptyBranches: stats._count.id - branchesWithUsers
  };
};
