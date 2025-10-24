import { prisma } from "../config/db.js";

/**
 * Get all branches
 * @param {Object} filters - Filter options
 * @returns {Array} List of branches
 */
export const getAllBranches = async (filters = {}) => {
  const { isActive, search, page = 1, pageSize = 10, sort = 'createdAt', order = 'desc' } = filters;
  
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

  const [branches, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
        _count: {
          select: {
            users: true,
            systemLogs: true
          }
        }
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    }),
    prisma.branch.count({ where })
  ]);

  return { branches, total };
};

/**
 * Get all branches for dropdown (simple list with search and limit)
 * @param {Object} filters - Filter options
 * @returns {Array} List of branches for dropdown
 */
export const getAllBranchesForDropdown = async (filters = {}) => {
  try {
    const { search, limit = 20 } = filters;
    
    const where = { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const branches = await prisma.branch.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true
      },
      orderBy: { name: 'asc' },
      take: Number(limit)
    });

    return branches;
  } catch (error) {
    console.error('Error getting branches for dropdown:', error);
    throw error;
  }
};

/**
 * Get branches accessible by user based on role and branch assignment
 * @param {Object} user - User object with role and branchId
 * @returns {Array} List of accessible branches
 */
export const getUserBranches = async (user) => {
  try {
    let where = { isActive: true };

    // ADMIN can see all branches
    if (user.role === 'ADMIN') {
      // No additional filter - show all active branches
    } else {
      // STAFF/GUEST can only see their assigned branch
      if (user.branchId) {
        where.id = user.branchId;
      } else {
        // User without branch assignment - return empty array
        return [];
      }
    }

    const branches = await prisma.branch.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        address: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: { code: 'asc' }
    });

    // Transform the data to include user count
    return branches.map(branch => ({
      ...branch,
      userCount: branch._count.users
    }));
  } catch (error) {
    console.error('Error getting user branches:', error);
    throw error;
  }
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
  const { code, name, address, phone, isMainBranch } = branchData;

  // Check if code already exists
  const existingBranch = await prisma.branch.findUnique({
    where: { code }
  });

  if (existingBranch) {
    throw new Error("รหัสสาขานี้ถูกใช้งานแล้ว");
  }

  // Check if trying to set as main branch when another main branch exists
  if (isMainBranch) {
    const existingMainBranch = await prisma.branch.findFirst({
      where: { isMainBranch: true }
    });

    if (existingMainBranch) {
      throw new Error("มีสาขาหลักอยู่แล้ว กรุณาเปลี่ยนสาขาหลักเดิมเป็นสาขาย่อยก่อน");
    }
  }

  const newBranch = await prisma.branch.create({
    data: {
      code,
      name,
      address: address || null,
      phone: phone || null,
      isMainBranch: isMainBranch || false,
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
  const { code, name, address, phone, isActive, isMainBranch } = updateData;

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

  // Check if trying to set as main branch when another main branch exists
  if (isMainBranch && existingBranch.id !== parseInt(id)) {
    const existingMainBranch = await prisma.branch.findFirst({
      where: { 
        isMainBranch: true,
        id: { not: parseInt(id) }
      }
    });

    if (existingMainBranch) {
      throw new Error("มีสาขาหลักอยู่แล้ว กรุณาเปลี่ยนสาขาหลักเดิมเป็นสาขาย่อยก่อน");
    }
  }

  // Check if trying to deactivate main branch
  if (isActive === false && existingBranch.isMainBranch) {
    throw new Error("ไม่สามารถปิดใช้งานสาขาหลักได้ กรุณาเปลี่ยนสาขาหลักก่อน");
  }

  const updatedBranch = await prisma.branch.update({
    where: { id: parseInt(id) },
    data: {
      ...(code && { code }),
      ...(name && { name }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(isActive !== undefined && { isActive }),
      ...(isMainBranch !== undefined && { isMainBranch }),
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

/**
 * Get latest branch code in pattern like BR001, BR002 ...
 */
export const getLatestCode = async () => {
  const last = await prisma.branch.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  if (!last || !last.code) {
    return 'S001';
  }
  const match = last.code.match(/^(\D*)(\d+)$/);
  if (!match) return 'S001';
  const prefix = match[1] || 'S';
  const num = String(parseInt(match[2] || '0', 10) + 1).padStart(match[2].length, '0');
  return `${prefix}${num}`;
};

/**
 * Update only active status
 * @param {Number} id
 * @param {Boolean} isActive
 */
export const updateBranchActive = async (id, isActive) => {
  const existingBranch = await prisma.branch.findUnique({ where: { id: parseInt(id) } });
  if (!existingBranch) {
    throw new Error("ไม่พบสาขาที่ระบุ");
  }

  // Check if trying to deactivate main branch
  if (!isActive && existingBranch.isMainBranch) {
    throw new Error("ไม่สามารถปิดใช้งานสาขาหลักได้ กรุณาเปลี่ยนสาขาหลักก่อน");
  }

  const updated = await prisma.branch.update({
    where: { id: parseInt(id) },
    data: { isActive },
    include: {
      _count: { select: { users: true, systemLogs: true } }
    }
  });
  return updated;
};
