import * as departmentService from "./department.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Get all departments
 * GET /api/v1/departments
 */
export const getAllDepartments = async (req, res) => {
  try {
    const { 
      isActive, 
      search, 
      page, 
      pageSize, 
      sort, 
      order 
    } = req.query;
    
    const filters = {
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && { search }),
      ...(page && { page: Number(page) }),
      ...(pageSize && { pageSize: Number(pageSize) }),
      ...(sort && { sort }),
      ...(order && { order })
    };

    const { departments, total } = await departmentService.getAllDepartments(filters);
    res.status(200).json({
      success: true,
      data: departments,
      meta: {
        total,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        totalPages: Math.max(1, Math.ceil(total / (Number(pageSize) || 10)))
      }
    });

  } catch (error) {
    console.error("Get departments error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลแผนก"
    });
  }
};

/**
 * Get all departments for dropdown
 * GET /api/v1/departments/dropdown
 */
export const getAllDepartmentsForDropdown = async (req, res) => {
  try {
    const { search, limit } = req.query;
    
    const filters = {
      ...(search && { search }),
      ...(limit && { limit: Number(limit) })
    };

    const departments = await departmentService.getAllDepartmentsForDropdown(filters);

    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลแผนกสำเร็จ',
      data: departments
    });

  } catch (error) {
    console.error('Get departments for dropdown error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก'
    });
  }
};

/**
 * Get department by ID
 * GET /api/v1/departments/:id
 */
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID แผนกไม่ถูกต้อง"
      });
    }

    const department = await departmentService.getDepartmentById(id);

    res.status(200).json({
      success: true,
      data: {
        department
      }
    });

  } catch (error) {
    console.error("Get department error:", error);
    
    const statusCode = error.message === "ไม่พบแผนกที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลแผนก"
    });
  }
};

/**
 * Create new department
 * POST /api/v1/departments
 */
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกชื่อแผนก"
      });
    }

    const newDepartment = await departmentService.createDepartment({
      name,
      createdBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "CREATE_DEPARTMENT", {
      departmentId: newDepartment.id,
      name: newDepartment.name
    });

    res.status(201).json({
      success: true,
      message: "สร้างแผนกสำเร็จ",
      data: {
        department: newDepartment
      }
    });

  } catch (error) {
    console.error("Create department error:", error);
    
    const statusCode = error.message === "ชื่อแผนกนี้มีอยู่แล้ว" ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างแผนก"
    });
  }
};

/**
 * Update department
 * PUT /api/v1/departments/:id
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID แผนกไม่ถูกต้อง"
      });
    }

    const updatedDepartment = await departmentService.updateDepartment(id, {
      name,
      isActive,
      updatedBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "UPDATE_DEPARTMENT", {
      departmentId: updatedDepartment.id,
      name: updatedDepartment.name,
      isActive: updatedDepartment.isActive
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตแผนกสำเร็จ",
      data: {
        department: updatedDepartment
      }
    });

  } catch (error) {
    console.error("Update department error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบแผนกที่ระบุ") statusCode = 404;
    if (error.message === "ชื่อแผนกนี้มีอยู่แล้ว") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตแผนก"
    });
  }
};

/**
 * Update department active status
 * PATCH /api/v1/departments/:id/active
 */
export const updateDepartmentActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID แผนกไม่ถูกต้อง"
      });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "isActive ต้องเป็นค่า boolean"
      });
    }

    const updatedDepartment = await departmentService.updateDepartmentActive(id, isActive, req.user?.id);

    // Log system action
    await createSystemLog(req, isActive ? "ACTIVATE_DEPARTMENT" : "DEACTIVATE_DEPARTMENT", {
      departmentId: updatedDepartment.id,
      name: updatedDepartment.name,
      isActive
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตสถานะแผนกสำเร็จ",
      data: {
        department: updatedDepartment
      }
    });

  } catch (error) {
    console.error("Update department active error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบแผนกที่ระบุ") statusCode = 404;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะแผนก"
    });
  }
};
