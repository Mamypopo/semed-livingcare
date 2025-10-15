import { prisma } from "../config/db.js";

/**
 * Get all patient groups
 * @param {Object} filters - Filter options
 * @returns {Array} List of patient groups
 */
export const getAllPatientGroups = async (filters = {}) => {
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
      { name: { contains: search, mode: 'insensitive' } },
      { note: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [patientGroups, total] = await Promise.all([
    prisma.patientGroup.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    }),
    prisma.patientGroup.count({ where })
  ]);

  return { patientGroups, total };
};

/**
 * Get patient group by ID
 * @param {Number} id - Patient Group ID
 * @returns {Object} Patient Group data
 */
export const getPatientGroupById = async (id) => {
  const patientGroup = await prisma.patientGroup.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  if (!patientGroup) {
    throw new Error("ไม่พบกลุ่มลูกค้าที่ระบุ");
  }

  return patientGroup;
};

/**
 * Create new patient group
 * @param {Object} patientGroupData - Patient Group data
 * @returns {Object} Created patient group
 */
export const createPatientGroup = async (patientGroupData) => {
  const { name, note, color, discount_type, discount_amount, createdBy } = patientGroupData;

  // Check if name already exists
  const existingGroup = await prisma.patientGroup.findFirst({
    where: { name }
  });

  if (existingGroup) {
    throw new Error("ชื่อกลุ่มลูกค้านี้มีอยู่แล้ว");
  }

  const newPatientGroup = await prisma.patientGroup.create({
    data: {
      name,
      note,
      color,
      discount_type,
      discount_amount: discount_amount ? parseFloat(discount_amount) : null,
      createdBy,
    },
    include: {
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  return newPatientGroup;
};

/**
 * Update patient group
 * @param {Number} id - Patient Group ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated patient group
 */
export const updatePatientGroup = async (id, updateData) => {
  const { name, note, color, discount_type, discount_amount, isActive, updatedBy } = updateData;

  // Check if patient group exists
  const existingGroup = await prisma.patientGroup.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingGroup) {
    throw new Error("ไม่พบกลุ่มลูกค้าที่ระบุ");
  }

  // Check if new name already exists (if name is being changed)
  if (name && name !== existingGroup.name) {
    const nameExists = await prisma.patientGroup.findFirst({
      where: { 
        name,
        id: { not: parseInt(id) }
      }
    });

    if (nameExists) {
      throw new Error("ชื่อกลุ่มลูกค้านี้มีอยู่แล้ว");
    }
  }

  const updatedPatientGroup = await prisma.patientGroup.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(note !== undefined && { note }),
      ...(color !== undefined && { color }),
      ...(discount_type !== undefined && { discount_type }),
      ...(discount_amount !== undefined && { discount_amount: discount_amount ? parseFloat(discount_amount) : null }),
      ...(isActive !== undefined && { isActive }),
      ...(updatedBy && { updatedBy }),
    },
    include: {
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  return updatedPatientGroup;
};

/**
 * Update patient group active status
 * @param {Number} id - Patient Group ID
 * @param {Boolean} isActive - Active status
 * @returns {Object} Updated patient group
 */
export const updatePatientGroupActive = async (id, isActive, updatedBy) => {
  // Check if patient group exists
  const existingGroup = await prisma.patientGroup.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingGroup) {
    throw new Error("ไม่พบกลุ่มลูกค้าที่ระบุ");
  }

  const updatedPatientGroup = await prisma.patientGroup.update({
    where: { id: parseInt(id) },
    data: { 
      isActive,
      ...(updatedBy && { updatedBy })
    },
    include: {
      _count: {
        select: {
          patients: true
        }
      }
    }
  });

  return updatedPatientGroup;
};

/**
 * Get patient group statistics
 * @returns {Object} Patient group statistics
 */
export const getPatientGroupStats = async () => {
  const [totalGroups, groupsWithPatients, groupsWithoutPatients] = await Promise.all([
    prisma.patientGroup.count(),
    prisma.patientGroup.count({
      where: {
        patients: {
          some: {}
        }
      }
    }),
    prisma.patientGroup.count({
      where: {
        patients: {
          none: {}
        }
      }
    })
  ]);

  return {
    totalGroups,
    groupsWithPatients,
    groupsWithoutPatients
  };
};
