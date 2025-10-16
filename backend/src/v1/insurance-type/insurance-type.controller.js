import * as insuranceTypeService from "./insurance-type.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Get all insurance types
 * GET /api/v1/insurance-types
 */
export const getAllInsuranceTypes = async (req, res) => {
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

    const { insuranceTypes, total } = await insuranceTypeService.getAllInsuranceTypes(filters);

    res.status(200).json({
      success: true,
      data: insuranceTypes,
      meta: {
        total,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        totalPages: Math.max(1, Math.ceil(total / (Number(pageSize) || 10)))
      }
    });

  } catch (error) {
    console.error("Get insurance types error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทประกัน"
    });
  }
};

/**
 * Get all insurance types for dropdown
 * GET /api/v1/insurance-types/dropdown
 */
export const getAllInsuranceTypesForDropdown = async (req, res) => {
  try {
    const { search, limit } = req.query;
    
    const filters = {
      ...(search && { search }),
      ...(limit && { limit: Number(limit) })
    };

    const insuranceTypes = await insuranceTypeService.getAllInsuranceTypesForDropdown(filters);

    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลประเภทประกันสำเร็จ',
      data: insuranceTypes
    });

  } catch (error) {
    console.error('Get insurance types for dropdown error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทประกัน'
    });
  }
};

/**
 * Get insurance type by ID
 * GET /api/v1/insurance-types/:id
 */
export const getInsuranceTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID ประเภทประกันไม่ถูกต้อง"
      });
    }

    const insuranceType = await insuranceTypeService.getInsuranceTypeById(id);

    res.status(200).json({
      success: true,
      data: {
        insuranceType
      }
    });

  } catch (error) {
    console.error("Get insurance type error:", error);
    
    const statusCode = error.message === "ไม่พบประเภทประกันที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทประกัน"
    });
  }
};

/**
 * Create new insurance type
 * POST /api/v1/insurance-types
 */
export const createInsuranceType = async (req, res) => {
  try {
    const { code, name, note } = req.body;

    // Basic validation
    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลที่จำเป็น (รหัส, ชื่อ)"
      });
    }

    // Code validation
    if (code.length < 2 || code.length > 10) {
      return res.status(400).json({
        success: false,
        message: "รหัสประเภทประกันต้องมี 2-10 ตัวอักษร"
      });
    }

    // Name validation
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "ชื่อประเภทประกันต้องมี 2-100 ตัวอักษร"
      });
    }

    const newInsuranceType = await insuranceTypeService.createInsuranceType({
      code: code.toUpperCase(),
      name,
      note,
      createdBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "CREATE_INSURANCE_TYPE", {
      insuranceTypeId: newInsuranceType.id,
      code: newInsuranceType.code,
      name: newInsuranceType.name
    });

    res.status(201).json({
      success: true,
      message: "สร้างประเภทประกันสำเร็จ",
      data: {
        insuranceType: newInsuranceType
      }
    });

  } catch (error) {
    console.error("Create insurance type error:", error);
    
    const statusCode = error.message === "รหัสประเภทประกันนี้มีอยู่แล้ว" ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างประเภทประกัน"
    });
  }
};

/**
 * Update insurance type
 * PUT /api/v1/insurance-types/:id
 */
export const updateInsuranceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, note, isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID ประเภทประกันไม่ถูกต้อง"
      });
    }

    // Code validation (if provided)
    if (code && (code.length < 2 || code.length > 10)) {
      return res.status(400).json({
        success: false,
        message: "รหัสประเภทประกันต้องมี 2-10 ตัวอักษร"
      });
    }

    // Name validation (if provided)
    if (name && (name.length < 2 || name.length > 100)) {
      return res.status(400).json({
        success: false,
        message: "ชื่อประเภทประกันต้องมี 2-100 ตัวอักษร"
      });
    }

    const updatedInsuranceType = await insuranceTypeService.updateInsuranceType(id, {
      code: code ? code.toUpperCase() : code,
      name,
      note,
      isActive,
      updatedBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "UPDATE_INSURANCE_TYPE", {
      insuranceTypeId: updatedInsuranceType.id,
      code: updatedInsuranceType.code,
      name: updatedInsuranceType.name
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตประเภทประกันสำเร็จ",
      data: {
        insuranceType: updatedInsuranceType
      }
    });

  } catch (error) {
    console.error("Update insurance type error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบประเภทประกันที่ระบุ") statusCode = 404;
    if (error.message === "รหัสประเภทประกันนี้มีอยู่แล้ว") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตประเภทประกัน"
    });
  }
};

/**
 * Update insurance type active status
 * PATCH /api/v1/insurance-types/:id/active
 */
export const updateInsuranceTypeActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID ประเภทประกันไม่ถูกต้อง"
      });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "isActive ต้องเป็นค่า boolean"
      });
    }

    const updatedInsuranceType = await insuranceTypeService.updateInsuranceTypeActive(id, isActive, req.user?.id);

    // Log system action
    await createSystemLog(req, isActive ? "ACTIVATE_INSURANCE_TYPE" : "DEACTIVATE_INSURANCE_TYPE", {
      insuranceTypeId: updatedInsuranceType.id,
      code: updatedInsuranceType.code,
      name: updatedInsuranceType.name,
      isActive
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตสถานะประเภทประกันสำเร็จ",
      data: {
        insuranceType: updatedInsuranceType
      }
    });

  } catch (error) {
    console.error("Update insurance type active error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบประเภทประกันที่ระบุ") statusCode = 404;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะประเภทประกัน"
    });
  }
};

/**
 * Get insurance type statistics
 * GET /api/v1/insurance-types/stats
 */
export const getInsuranceTypeStats = async (req, res) => {
  try {
    const stats = await insuranceTypeService.getInsuranceTypeStats();

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error("Get insurance type stats error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสถิติประเภทประกัน"
    });
  }
};
