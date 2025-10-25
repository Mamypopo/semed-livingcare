import { prisma } from "../config/db.js";

/**
 * Get all departments
 * @param {Object} filters - Filter options
 * @returns {Array} List of departments
 */
export const getAllDepartments = async (filters = {}) => {
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
    where.name = { contains: search, mode: 'insensitive' };
  }

  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    }),
    prisma.department.count({ where })
  ]);

  return { departments, total };
};

/**
 * Get all departments for dropdown (simple list with search and limit)
 * @param {Object} filters - Filter options
 * @returns {Array} List of departments for dropdown
 */
export const getAllDepartmentsForDropdown = async (filters = {}) => {
  try {
    const { search, limit = 20 } = filters;
    
    const where = { isActive: true };
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const departments = await prisma.department.findMany({
      where,
      select: {
        id: true,
        name: true
      },
      orderBy: { name: 'asc' },
      take: Number(limit)
    });

    return departments;
  } catch (error) {
    console.error('Error getting departments for dropdown:', error);
    throw error;
  }
};

/**
 * Get department by ID
 * @param {String} id - Department ID
 * @returns {Object} Department data
 */
export const getDepartmentById = async (id) => {
  const department = await prisma.department.findUnique({
    where: { id }
  });

  if (!department) {
    throw new Error("ไม่พบแผนกที่ระบุ");
  }

  return department;
};

/**
 * Create new department
 * @param {Object} departmentData - Department data
 * @returns {Object} Created department
 */
export const createDepartment = async (departmentData) => {
  const { name, createdBy } = departmentData;

  // Check if name already exists
  const existingDepartment = await prisma.department.findFirst({
    where: { name }
  });

  if (existingDepartment) {
    throw new Error("ชื่อแผนกนี้มีอยู่แล้ว");
  }

  const newDepartment = await prisma.department.create({
    data: {
      name,
      createdBy: String(createdBy),
      updatedBy: String(createdBy)
    }
  });

  return newDepartment;
};

/**
 * Update department
 * @param {String} id - Department ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated department
 */
export const updateDepartment = async (id, updateData) => {
  const { name, isActive, updatedBy } = updateData;

  // Check if department exists
  const existingDepartment = await prisma.department.findUnique({
    where: { id }
  });

  if (!existingDepartment) {
    throw new Error("ไม่พบแผนกที่ระบุ");
  }

  // Check if new name already exists (if name is being changed)
  if (name && name !== existingDepartment.name) {
    const nameExists = await prisma.department.findFirst({
      where: { 
        name,
        id: { not: id }
      }
    });

    if (nameExists) {
      throw new Error("ชื่อแผนกนี้มีอยู่แล้ว");
    }
  }

  const updatedDepartment = await prisma.department.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(isActive !== undefined && { isActive }),
      ...(updatedBy && { updatedBy: String(updatedBy) }),
    }
  });

  return updatedDepartment;
};

/**
 * Update department active status
 * @param {String} id - Department ID
 * @param {Boolean} isActive - Active status
 * @returns {Object} Updated department
 */
export const updateDepartmentActive = async (id, isActive, updatedBy) => {
  // Check if department exists
  const existingDepartment = await prisma.department.findUnique({
    where: { id }
  });

  if (!existingDepartment) {
    throw new Error("ไม่พบแผนกที่ระบุ");
  }

  const updatedDepartment = await prisma.department.update({
    where: { id },
    data: { 
      isActive,
      ...(updatedBy && { updatedBy: String(updatedBy) })
    }
  });

  return updatedDepartment;
};
