import { prisma } from "../config/db.js";

/**
 * Get all insurance types
 * @param {Object} filters - Filter options
 * @returns {Array} List of insurance types
 */
export const getAllInsuranceTypes = async (filters = {}) => {
  const { 
    isActive, 
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
  
  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { note: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [insuranceTypes, total] = await Promise.all([
    prisma.insuranceType.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    }),
    prisma.insuranceType.count({ where })
  ]);

  return { insuranceTypes, total };
};

/**
 * Get insurance type by ID
 * @param {Number} id - Insurance Type ID
 * @returns {Object} Insurance type data
 */
export const getInsuranceTypeById = async (id) => {
  const insuranceType = await prisma.insuranceType.findUnique({
    where: { id: parseInt(id) },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      updatedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  if (!insuranceType) {
    throw new Error("ไม่พบประเภทประกันที่ระบุ");
  }

  return insuranceType;
};

/**
 * Create new insurance type
 * @param {Object} insuranceTypeData - Insurance Type data
 * @returns {Object} Created insurance type
 */
export const createInsuranceType = async (insuranceTypeData) => {
  const { code, name, note, createdBy } = insuranceTypeData;

  // Check if code already exists
  const existingInsuranceType = await prisma.insuranceType.findUnique({
    where: { code }
  });

  if (existingInsuranceType) {
    throw new Error("รหัสประเภทประกันนี้มีอยู่แล้ว");
  }

  const newInsuranceType = await prisma.insuranceType.create({
    data: {
      code,
      name,
      note,
      createdBy
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  return newInsuranceType;
};

/**
 * Update insurance type
 * @param {Number} id - Insurance Type ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated insurance type
 */
export const updateInsuranceType = async (id, updateData) => {
  const { code, name, note, isActive, updatedBy } = updateData;

  // Check if insurance type exists
  const existingInsuranceType = await prisma.insuranceType.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingInsuranceType) {
    throw new Error("ไม่พบประเภทประกันที่ระบุ");
  }

  // Check if new code already exists (if code is being changed)
  if (code && code !== existingInsuranceType.code) {
    const codeExists = await prisma.insuranceType.findUnique({
      where: { code }
    });

    if (codeExists) {
      throw new Error("รหัสประเภทประกันนี้มีอยู่แล้ว");
    }
  }

  const updatedInsuranceType = await prisma.insuranceType.update({
    where: { id: parseInt(id) },
    data: {
      ...(code && { code }),
      ...(name && { name }),
      ...(note !== undefined && { note }),
      ...(isActive !== undefined && { isActive }),
      ...(updatedBy && { updatedBy }),
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      updatedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  return updatedInsuranceType;
};

/**
 * Update insurance type active status
 * @param {Number} id - Insurance Type ID
 * @param {Boolean} isActive - Active status
 * @param {Number} updatedBy - User ID who updated
 * @returns {Object} Updated insurance type
 */
export const updateInsuranceTypeActive = async (id, isActive, updatedBy) => {
  // Check if insurance type exists
  const existingInsuranceType = await prisma.insuranceType.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingInsuranceType) {
    throw new Error("ไม่พบประเภทประกันที่ระบุ");
  }

  const updatedInsuranceType = await prisma.insuranceType.update({
    where: { id: parseInt(id) },
    data: { 
      isActive,
      ...(updatedBy && { updatedBy })
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      updatedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  return updatedInsuranceType;
};

/**
 * Get insurance type statistics
 * @returns {Object} Insurance type statistics
 */
export const getInsuranceTypeStats = async () => {
  const [totalInsuranceTypes, activeInsuranceTypes, insuranceTypesByUsage] = await Promise.all([
    prisma.insuranceType.count(),
    prisma.insuranceType.count({ where: { isActive: true } }),
    prisma.insuranceType.findMany({
      where: { isActive: true },
      include: {
      },
      orderBy: {
        patients: {
          _count: 'desc'
        }
      },
      take: 5
    })
  ]);

  return {
    totalInsuranceTypes,
    activeInsuranceTypes,
    inactiveInsuranceTypes: totalInsuranceTypes - activeInsuranceTypes,
    insuranceTypesByUsage
  };
};
