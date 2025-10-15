import { prisma } from "../config/db.js";

/**
 * Get all users
 * @param {Object} filters - Filter options
 * @returns {Array} List of users
 */
export const getAllUsers = async (filters = {}) => {
  const { 
    isActive, 
    role, 
    branchId, 
    staffLevelId,
    search, 
    page = 1, 
    pageSize = 10, 
    sort = 'createdAt', 
    order = 'desc' 
  } = filters;
  
  const where = {};
  
  if (isActive !== undefined) {
    where.isActive = isActive;
  }
  
  if (role) {
    where.role = role;
  }
  
  if (branchId) {
    where.branchId = parseInt(branchId);
  }
  
  if (staffLevelId) {
    where.staffLevelId = parseInt(staffLevelId);
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        staffLevel: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        _count: {
          select: {
            systemLogs: true
          }
        }
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    }),
    prisma.user.count({ where })
  ]);

  return { users, total };
};

/**
 * Get user by ID
 * @param {Number} id - User ID
 * @returns {Object} User data
 */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      branch: {
        select: {
          id: true,
          code: true,
          name: true,
          address: true,
          phone: true
        }
      },
      staffLevel: {
        select: {
          id: true,
          name: true,
          description: true
        },
        include: {
          permissions: {
            select: {
              id: true,
              permissionCode: true,
              isActive: true
            }
          }
        }
      },
      _count: {
        select: {
          systemLogs: true
        }
      }
    }
  });

  if (!user) {
    throw new Error("ไม่พบผู้ใช้ที่ระบุ");
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
export const createUser = async (userData) => {
  const { name, email, password, role, branchId, staffLevelId } = userData;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
  }

  // Validate branch exists (if provided)
  if (branchId) {
    const branch = await prisma.branch.findUnique({
      where: { id: parseInt(branchId) }
    });
    if (!branch) {
      throw new Error("ไม่พบสาขาที่ระบุ");
    }
  }

  // Validate staff level exists (if provided)
  if (staffLevelId) {
    const staffLevel = await prisma.staffLevel.findUnique({
      where: { id: parseInt(staffLevelId) }
    });
    if (!staffLevel) {
      throw new Error("ไม่พบระดับพนักงานที่ระบุ");
    }
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: role || 'GUEST',
      branchId: branchId ? parseInt(branchId) : null,
      staffLevelId: staffLevelId ? parseInt(staffLevelId) : null,
    },
    include: {
      branch: {
        select: {
          id: true,
          code: true,
          name: true
        }
      },
      staffLevel: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      _count: {
        select: {
          systemLogs: true
        }
      }
    }
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Update user
 * @param {Number} id - User ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated user
 */
export const updateUser = async (id, updateData) => {
  const { name, email, role, branchId, staffLevelId, isActive } = updateData;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingUser) {
    throw new Error("ไม่พบผู้ใช้ที่ระบุ");
  }

  // Check if new email already exists (if email is being changed)
  if (email && email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email }
    });

    if (emailExists) {
      throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
    }
  }

  // Validate branch exists (if provided)
  if (branchId) {
    const branch = await prisma.branch.findUnique({
      where: { id: parseInt(branchId) }
    });
    if (!branch) {
      throw new Error("ไม่พบสาขาที่ระบุ");
    }
  }

  // Validate staff level exists (if provided)
  if (staffLevelId) {
    const staffLevel = await prisma.staffLevel.findUnique({
      where: { id: parseInt(staffLevelId) }
    });
    if (!staffLevel) {
      throw new Error("ไม่พบระดับพนักงานที่ระบุ");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(branchId !== undefined && { branchId: branchId ? parseInt(branchId) : null }),
      ...(staffLevelId !== undefined && { staffLevelId: staffLevelId ? parseInt(staffLevelId) : null }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      branch: {
        select: {
          id: true,
          code: true,
          name: true
        }
      },
      staffLevel: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      _count: {
        select: {
          systemLogs: true
        }
      }
    }
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * Update only active status
 * @param {Number} id
 * @param {Boolean} isActive
 */
export const updateUserActive = async (id, isActive) => {
  const existingUser = await prisma.user.findUnique({ 
    where: { id: parseInt(id) } 
  });
  
  if (!existingUser) {
    throw new Error("ไม่พบผู้ใช้ที่ระบุ");
  }
  
  const updated = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isActive },
    include: {
      branch: {
        select: {
          id: true,
          code: true,
          name: true
        }
      },
      staffLevel: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      _count: {
        select: {
          systemLogs: true
        }
      }
    }
  });
  
  // Remove password from response
  const { password, ...userWithoutPassword } = updated;
  return userWithoutPassword;
};

/**
 * Update user password
 * @param {Number} id - User ID
 * @param {String} newPassword - New password
 * @returns {Object} Updated user
 */
export const updateUserPassword = async (id, newPassword) => {
  const existingUser = await prisma.user.findUnique({ 
    where: { id: parseInt(id) } 
  });
  
  if (!existingUser) {
    throw new Error("ไม่พบผู้ใช้ที่ระบุ");
  }

  const updated = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { password: newPassword },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      branchId: true,
      staffLevelId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return updated;
};

/**
 * Get user statistics
 * @returns {Object} User statistics
 */
export const getUserStats = async () => {
  const [totalUsers, activeUsers, usersByRole, usersByBranch] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
      where: { isActive: true }
    }),
    prisma.user.groupBy({
      by: ['branchId'],
      _count: { id: true },
      where: { isActive: true }
    })
  ]);

  const usersWithoutBranch = await prisma.user.count({
    where: {
      isActive: true,
      branchId: null
    }
  });

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    usersByRole,
    usersByBranch,
    usersWithoutBranch
  };
};

/**
 * Get all branches for user assignment
 * @returns {Array} List of active branches
 */
export const getBranchesForUser = async () => {
  return await prisma.branch.findMany({
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      name: true
    },
    orderBy: { name: 'asc' }
  });
};

/**
 * Get all staff levels for user assignment
 * @returns {Array} List of active staff levels
 */
export const getStaffLevelsForUser = async () => {
  return await prisma.staffLevel.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true
    },
    orderBy: { name: 'asc' }
  });
};
