import * as tagService from "./tag.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Get all tags
 * GET /api/v1/tags
 */
export const getAllTags = async (req, res) => {
  try {
    const { 
      search, 
      page, 
      pageSize, 
      sort, 
      order 
    } = req.query;
    
    const filters = {
      ...(search && { search }),
      ...(page && { page: Number(page) }),
      ...(pageSize && { pageSize: Number(pageSize) }),
      ...(sort && { sort }),
      ...(order && { order })
    };

    const { tags, total } = await tagService.getAllTags(filters);

    res.status(200).json({
      success: true,
      data: tags,
      meta: {
        total,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        totalPages: Math.max(1, Math.ceil(total / (Number(pageSize) || 10)))
      }
    });

  } catch (error) {
    console.error("Get tags error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลแท็ก"
    });
  }
};

/**
 * Get tag by ID
 * GET /api/v1/tags/:id
 */
export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID แท็กไม่ถูกต้อง"
      });
    }

    const tag = await tagService.getTagById(id);

    res.status(200).json({
      success: true,
      data: {
        tag
      }
    });

  } catch (error) {
    console.error("Get tag error:", error);
    
    const statusCode = error.message === "ไม่พบแท็กที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลแท็ก"
    });
  }
};

/**
 * Create new tag
 * POST /api/v1/tags
 */
export const createTag = async (req, res) => {
  try {
    const { name, color, note } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกชื่อแท็ก"
      });
    }

    // Color validation (if provided)
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบสีไม่ถูกต้อง (ต้องเป็น #RRGGBB)"
      });
    }

    const newTag = await tagService.createTag({
      name,
      color,
      note,
      createdBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "CREATE_TAG", {
      tagId: newTag.id,
      name: newTag.name,
      color: newTag.color
    });

    res.status(201).json({
      success: true,
      message: "สร้างแท็กสำเร็จ",
      data: {
        tag: newTag
      }
    });

  } catch (error) {
    console.error("Create tag error:", error);
    
    const statusCode = error.message === "ชื่อแท็กนี้มีอยู่แล้ว" ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างแท็ก"
    });
  }
};

/**
 * Update tag
 * PUT /api/v1/tags/:id
 */
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, note, isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID แท็กไม่ถูกต้อง"
      });
    }

    // Color validation (if provided)
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบสีไม่ถูกต้อง (ต้องเป็น #RRGGBB)"
      });
    }

    const updatedTag = await tagService.updateTag(id, {
      name,
      color,
      note,
      isActive,
      updatedBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "UPDATE_TAG", {
      tagId: updatedTag.id,
      name: updatedTag.name,
      color: updatedTag.color
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตแท็กสำเร็จ",
      data: {
        tag: updatedTag
      }
    });

  } catch (error) {
    console.error("Update tag error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบแท็กที่ระบุ") statusCode = 404;
    if (error.message === "ชื่อแท็กนี้มีอยู่แล้ว") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตแท็ก"
    });
  }
};

/**
 * Update tag active status
 * PATCH /api/v1/tags/:id/active
 */
export const updateTagActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID แท็กไม่ถูกต้อง"
      });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "isActive ต้องเป็นค่า boolean"
      });
    }

    const updatedTag = await tagService.updateTagActive(id, isActive, req.user?.id);

    // Log system action
    await createSystemLog(req, isActive ? "ACTIVATE_TAG" : "DEACTIVATE_TAG", {
      tagId: updatedTag.id,
      name: updatedTag.name,
      isActive
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตสถานะแท็กสำเร็จ",
      data: {
        tag: updatedTag
      }
    });

  } catch (error) {
    console.error("Update tag active error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบแท็กที่ระบุ") statusCode = 404;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะแท็ก"
    });
  }
};

/**
 * Get tag statistics
 * GET /api/v1/tags/stats
 */
export const getTagStats = async (req, res) => {
  try {
    const stats = await tagService.getTagStats();

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error("Get tag stats error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสถิติแท็ก"
    });
  }
};
