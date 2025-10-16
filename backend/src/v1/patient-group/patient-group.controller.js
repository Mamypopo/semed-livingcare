import * as patientGroupService from "./patient-group.service.js";
import { createSystemLog } from "../utils/logger.js";

/**
 * Get all patient groups
 * GET /api/v1/patient-groups
 */
export const getAllPatientGroups = async (req, res) => {
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

    const { patientGroups, total } = await patientGroupService.getAllPatientGroups(filters);

    res.status(200).json({
      success: true,
      data: patientGroups,
      meta: {
        total,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        totalPages: Math.max(1, Math.ceil(total / (Number(pageSize) || 10)))
      }
    });

  } catch (error) {
    console.error("Get patient groups error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มลูกค้า"
    });
  }
};

/**
 * Get all patient groups for dropdown
 * GET /api/v1/patient-groups/dropdown
 */
export const getAllPatientGroupsForDropdown = async (req, res) => {
  try {
    const { search, limit } = req.query;
    
    const filters = {
      ...(search && { search }),
      ...(limit && { limit: Number(limit) })
    };

    const patientGroups = await patientGroupService.getAllPatientGroupsForDropdown(filters);

    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลกลุ่มลูกค้าสำเร็จ',
      data: patientGroups
    });

  } catch (error) {
    console.error('Get patient groups for dropdown error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มลูกค้า'
    });
  }
};

/**
 * Get patient group by ID
 * GET /api/v1/patient-groups/:id
 */
export const getPatientGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID กลุ่มลูกค้าไม่ถูกต้อง"
      });
    }

    const patientGroup = await patientGroupService.getPatientGroupById(id);

    res.status(200).json({
      success: true,
      data: {
        patientGroup
      }
    });

  } catch (error) {
    console.error("Get patient group error:", error);
    
    const statusCode = error.message === "ไม่พบกลุ่มลูกค้าที่ระบุ" ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มลูกค้า"
    });
  }
};

/**
 * Create new patient group
 * POST /api/v1/patient-groups
 */
export const createPatientGroup = async (req, res) => {
  try {
    const { name, note, color, discount_type, discount_amount } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกชื่อกลุ่มลูกค้า"
      });
    }

    // Color validation (if provided)
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบสีไม่ถูกต้อง (ต้องเป็น #RRGGBB)"
      });
    }

    // Discount validation
    if (discount_type && !['percent', 'amount'].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message: "ประเภทส่วนลดต้องเป็น 'percent' หรือ 'amount'"
      });
    }

    if (discount_amount && discount_amount < 0) {
      return res.status(400).json({
        success: false,
        message: "จำนวนส่วนลดต้องไม่เป็นค่าลบ"
      });
    }

    const newPatientGroup = await patientGroupService.createPatientGroup({
      name,
      note,
      color,
      discount_type,
      discount_amount,
      createdBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "CREATE_PATIENT_GROUP", {
      patientGroupId: newPatientGroup.id,
      name: newPatientGroup.name,
      discount_type: newPatientGroup.discount_type,
      discount_amount: newPatientGroup.discount_amount
    });

    res.status(201).json({
      success: true,
      message: "สร้างกลุ่มลูกค้าสำเร็จ",
      data: {
        patientGroup: newPatientGroup
      }
    });

  } catch (error) {
    console.error("Create patient group error:", error);
    
    const statusCode = error.message === "ชื่อกลุ่มลูกค้านี้มีอยู่แล้ว" ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างกลุ่มลูกค้า"
    });
  }
};

/**
 * Update patient group
 * PUT /api/v1/patient-groups/:id
 */
export const updatePatientGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, note, color, discount_type, discount_amount, isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID กลุ่มลูกค้าไม่ถูกต้อง"
      });
    }

    // Color validation (if provided)
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบสีไม่ถูกต้อง (ต้องเป็น #RRGGBB)"
      });
    }

    // Discount validation
    if (discount_type && !['percent', 'amount'].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message: "ประเภทส่วนลดต้องเป็น 'percent' หรือ 'amount'"
      });
    }

    if (discount_amount && discount_amount < 0) {
      return res.status(400).json({
        success: false,
        message: "จำนวนส่วนลดต้องไม่เป็นค่าลบ"
      });
    }

    const updatedPatientGroup = await patientGroupService.updatePatientGroup(id, {
      name,
      note,
      color,
      discount_type,
      discount_amount,
      isActive,
      updatedBy: req.user?.id
    });

    // Log system action
    await createSystemLog(req, "UPDATE_PATIENT_GROUP", {
      patientGroupId: updatedPatientGroup.id,
      name: updatedPatientGroup.name,
      discount_type: updatedPatientGroup.discount_type,
      discount_amount: updatedPatientGroup.discount_amount
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตกลุ่มลูกค้าสำเร็จ",
      data: {
        patientGroup: updatedPatientGroup
      }
    });

  } catch (error) {
    console.error("Update patient group error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบกลุ่มลูกค้าที่ระบุ") statusCode = 404;
    if (error.message === "ชื่อกลุ่มลูกค้านี้มีอยู่แล้ว") statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตกลุ่มลูกค้า"
    });
  }
};

/**
 * Update patient group active status
 * PATCH /api/v1/patient-groups/:id/active
 */
export const updatePatientGroupActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID กลุ่มลูกค้าไม่ถูกต้อง"
      });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "isActive ต้องเป็นค่า boolean"
      });
    }

    const updatedPatientGroup = await patientGroupService.updatePatientGroupActive(id, isActive, req.user?.id);

    // Log system action
    await createSystemLog(req, isActive ? "ACTIVATE_PATIENT_GROUP" : "DEACTIVATE_PATIENT_GROUP", {
      patientGroupId: updatedPatientGroup.id,
      name: updatedPatientGroup.name,
      isActive
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตสถานะกลุ่มลูกค้าสำเร็จ",
      data: {
        patientGroup: updatedPatientGroup
      }
    });

  } catch (error) {
    console.error("Update patient group active error:", error);
    
    let statusCode = 500;
    if (error.message === "ไม่พบกลุ่มลูกค้าที่ระบุ") statusCode = 404;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะกลุ่มลูกค้า"
    });
  }
};

/**
 * Get patient group statistics
 * GET /api/v1/patient-groups/stats
 */
export const getPatientGroupStats = async (req, res) => {
  try {
    const stats = await patientGroupService.getPatientGroupStats();

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error("Get patient group stats error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสถิติกลุ่มลูกค้า"
    });
  }
};
