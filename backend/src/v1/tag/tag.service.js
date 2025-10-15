import { prisma } from "../config/db.js";

/**
 * Get all tags
 * @param {Object} filters - Filter options
 * @returns {Array} List of tags
 */
export const getAllTags = async (filters = {}) => {
  const { 
    search, 
    page = 1, 
    pageSize = 10, 
    sort = 'createdAt', 
    order = 'desc' 
  } = filters;
  
  const where = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { note: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    }),
    prisma.tag.count({ where })
  ]);

  return { tags, total };
};

/**
 * Get tag by ID
 * @param {Number} id - Tag ID
 * @returns {Object} Tag data
 */
export const getTagById = async (id) => {
  const tag = await prisma.tag.findUnique({
    where: { id: parseInt(id) }
  });

  if (!tag) {
    throw new Error("ไม่พบแท็กที่ระบุ");
  }

  return tag;
};

/**
 * Create new tag
 * @param {Object} tagData - Tag data
 * @returns {Object} Created tag
 */
export const createTag = async (tagData) => {
  const { name, color, note, createdBy } = tagData;

  // Check if name already exists
  const existingTag = await prisma.tag.findUnique({
    where: { name }
  });

  if (existingTag) {
    throw new Error("ชื่อแท็กนี้มีอยู่แล้ว");
  }

  const newTag = await prisma.tag.create({
    data: {
      name,
      color,
      note,
      createdBy
    },
  });

  return newTag;
};

/**
 * Update tag
 * @param {Number} id - Tag ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated tag
 */
export const updateTag = async (id, updateData) => {
  const { name, color, note, isActive, updatedBy } = updateData;

  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingTag) {
    throw new Error("ไม่พบแท็กที่ระบุ");
  }

  // Check if new name already exists (if name is being changed)
  if (name && name !== existingTag.name) {
    const nameExists = await prisma.tag.findUnique({
      where: { name }
    });

    if (nameExists) {
      throw new Error("ชื่อแท็กนี้มีอยู่แล้ว");
    }
  }

  const updatedTag = await prisma.tag.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(color !== undefined && { color }),
      ...(note !== undefined && { note }),
      ...(isActive !== undefined && { isActive }),
      ...(updatedBy && { updatedBy }),
    },
  });

  return updatedTag;
};

/**
 * Update tag active status
 * @param {Number} id - Tag ID
 * @param {Boolean} isActive - Active status
 * @returns {Object} Updated tag
 */
export const updateTagActive = async (id, isActive, updatedBy) => {
  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingTag) {
    throw new Error("ไม่พบแท็กที่ระบุ");
  }

  const updatedTag = await prisma.tag.update({
    where: { id: parseInt(id) },
    data: { 
      isActive,
      ...(updatedBy && { updatedBy })
    },
  });

  return updatedTag;
};

/**
 * Get tag statistics
 * @returns {Object} Tag statistics
 */
export const getTagStats = async () => {
  const [totalTags, tagsWithPatients, tagsWithoutPatients] = await Promise.all([
    prisma.tag.count(),
    prisma.tag.count({
      where: {
        patients: {
          some: {}
        }
      }
    }),
    prisma.tag.count({
      where: {
        patients: {
          none: {}
        }
      }
    })
  ]);

  return {
    totalTags,
    tagsWithPatients,
    tagsWithoutPatients
  };
};
