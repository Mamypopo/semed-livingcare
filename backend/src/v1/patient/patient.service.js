import { prisma } from '../config/db.js'

// ดึงข้อมูลผู้ป่วยทั้งหมด (พร้อม pagination และ filter)
export const getAllPatients = async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all', // all, active, inactive
      branchId = null,
      patientGroupId = null,
      insuranceTypeId = null,
      tagIds = []
    } = params

    const skip = (page - 1) * limit
    const where = {}

    // Filter by status
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Filter by branch
    if (branchId) {
      where.branchId = parseInt(branchId)
    }

    // Filter by patient group
    if (patientGroupId) {
      where.patientGroupId = parseInt(patientGroupId)
    }

    // Filter by insurance type
    if (insuranceTypeId) {
      where.insuranceTypeId = parseInt(insuranceTypeId)
    }

    // Filter by tags
    if (tagIds.length > 0) {
      where.patientTags = {
        some: {
          tag_id: {
            in: tagIds.map(id => parseInt(id))
          }
        }
      }
    }

    // Search by name, phone, email, HN
    if (search) {
      where.OR = [
        { hn: { contains: search, mode: 'insensitive' } },
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { phone_1: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { national_id: { contains: search } }
      ]
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: {
          branch: {
            select: { id: true, name: true, code: true }
          },
          patientGroup: {
            select: { id: true, name: true, color: true }
          },
          insuranceType: {
            select: { id: true, name: true }
          },
          patientTags: {
            include: {
              tag: {
                select: { id: true, name: true, color: true }
              }
            }
          },
    createdByUser: {
      select: { id: true, name: true, email: true }
    },
    updatedByUser: {
      select: { id: true, name: true, email: true }
    }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.patient.count({ where })
    ])

  return {
    patients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

// ดึงข้อมูลผู้ป่วยตาม ID
export const getPatientById = async (id) => {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: {
        branch: {
          select: { id: true, name: true, code: true }
        },
        patientGroup: {
          select: { id: true, name: true, color: true }
        },
        insuranceType: {
          select: { id: true, name: true }
        },
        patientTags: {
          include: {
            tag: {
              select: { id: true, name: true, color: true }
            }
          }
        },
    createdByUser: {
      select: { id: true, name: true, email: true }
    },
    updatedByUser: {
      select: { id: true, name: true, email: true }
    }
      }
    })

    if (!patient) {
      throw new Error('ไม่พบข้อมูลผู้ป่วย')
    }

    return patient
}

// สร้างผู้ป่วยใหม่
export const createPatient = async (data, createdBy) => {
    const {
      hn,
      prefix,
      first_name,
      last_name,
      nickname,
      first_name_en,
      last_name_en,
      gender,
      birth_date,
      national_id,
      passport_no,
      nationality,
      religion,
      marital_status,
      education_level,
      blood_group,
      phone_1,
      phone_2,
      email,
      address,
      sub_district,
      district,
      province,
      postal_code,
      company_name,
      company_tax_id,
      company_phone,
      company_email,
      company_address,
      company_subdistrict,
      company_district,
      company_province,
      company_postal_code,
      weight,
      height,
      waist,
      chest,
      allergy_history,
      mental_health,
      underlying_disease,
      health_note,
      treatment_type,
      insurance_type_id,
      patient_group_id,
      branchId,
      note,
      tagIds = []
    } = data

    // ตรวจสอบข้อมูลที่จำเป็น (ไม่รวม HN เพราะจะสร้างให้)
    console.log('🔍 Backend ตรวจสอบข้อมูลที่ได้รับ:')
    console.log('Data received:', data)
    
    const requiredFields = {
      prefix, first_name, last_name, patient_group_id, gender,
      nationality, religion, education_level, marital_status, blood_group,
      birth_date, treatment_type, insurance_type_id, address
    }
    
    console.log('Required fields check:')
    Object.entries(requiredFields).forEach(([key, value]) => {
      const isEmpty = !value || value === ''
      console.log(`  ${key}: "${value}" ${isEmpty ? '❌ ขาด' : '✅ ครบ'}`)
    })
    
    if (!prefix || !first_name || !last_name || !patient_group_id || !gender || 
        !nationality || !religion || !education_level || !marital_status || !blood_group || 
        !birth_date || !treatment_type || !insurance_type_id || !address) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็นครบถ้วน (คำนำหน้า, ชื่อ, นามสกุล, กลุ่มลูกค้า, เพศ, สัญชาติ, ศาสนา, ระดับการศึกษา, สถานะภาพสมรส, กรุ๊บเลือด, วันเกิด, ประเภทการรักษา, ประเภทสิทธิ์การรักษา, ที่อยู่)')
    }

    // สร้าง HN อัตโนมัติ
    let generatedHn
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10
    
    while (!isUnique && attempts < maxAttempts) {
      // สร้าง HN แบบง่ายๆ: HN + timestamp + random
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      generatedHn = `HN${timestamp}${random}`
      
      // ตรวจสอบว่า HN นี้มีอยู่แล้วหรือไม่
      const existingHn = await prisma.patient.findFirst({
        where: { hn: generatedHn }
      })
      
      if (!existingHn) {
        isUnique = true
      }
      attempts++
    }
    
    if (!isUnique) {
      throw new Error('ไม่สามารถสร้างหมายเลข HN ได้ กรุณาลองใหม่อีกครั้ง')
    }

    // ตรวจสอบอีเมลซ้ำ (ถ้ามี)
    if (email) {
      const existingEmail = await prisma.patient.findFirst({
        where: { email }
      })
      if (existingEmail) {
        throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว')
      }
    }

    // ตรวจสอบเลขบัตรประชาชนซ้ำ (ถ้ามี)
    if (national_id) {
      const existingNationalId = await prisma.patient.findFirst({
        where: { national_id }
      })
      if (existingNationalId) {
        throw new Error('เลขบัตรประชาชนนี้มีผู้ใช้งานแล้ว')
      }
    }

    const patient = await prisma.patient.create({
      data: {
        hn: generatedHn,
        prefix,
        first_name,
        last_name,
        nickname,
        first_name_en,
        last_name_en,
        gender,
        birth_date: new Date(birth_date),
        national_id,
        passport_no,
        nationality,
        religion,
        marital_status,
        education_level,
        blood_group,
        phone_1,
        phone_2,
        email,
        address,
        sub_district,
        district,
        province,
        postal_code,
        company_name,
        company_tax_id,
        company_phone,
        company_email,
        company_address,
        company_subdistrict,
        company_district,
        company_province,
        company_postal_code,
        weight,
        height,
        waist,
        chest,
        allergy_history,
        mental_health,
        underlying_disease,
        health_note,
        treatment_type,
        insurance_type_id: insurance_type_id ? parseInt(insurance_type_id) : null,
        patient_group_id: patient_group_id ? parseInt(patient_group_id) : null,
        branchId: branchId ? parseInt(branchId) : null,
        note,
        isActive: true,
        createdBy: createdBy ? parseInt(createdBy) : null,
        patientTags: {
          create: tagIds.map(tagId => ({
            tag_id: parseInt(tagId)
          }))
        }
      },
      include: {
        branch: {
          select: { id: true, name: true, code: true }
        },
        patientGroup: {
          select: { id: true, name: true, color: true }
        },
        insuranceType: {
          select: { id: true, name: true }
        },
        patientTags: {
          include: {
            tag: {
              select: { id: true, name: true, color: true }
            }
          }
        },
        createdByUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return patient
}

// อัปเดตข้อมูลผู้ป่วย
export const updatePatient = async (id, data, updatedBy) => {
    const {
      hn,
      prefix,
      first_name,
      last_name,
      nickname,
      first_name_en,
      last_name_en,
      gender,
      birth_date,
      national_id,
      passport_no,
      nationality,
      religion,
      marital_status,
      education_level,
      blood_group,
      phone_1,
      phone_2,
      email,
      address,
      sub_district,
      district,
      province,
      postal_code,
      company_name,
      company_tax_id,
      company_phone,
      company_email,
      company_address,
      company_subdistrict,
      company_district,
      company_province,
      company_postal_code,
      weight,
      height,
      waist,
      chest,
      allergy_history,
      mental_health,
      underlying_disease,
      health_note,
      treatment_type,
      insurance_type_id,
      patient_group_id,
      branchId,
      note,
      tagIds = []
    } = data

    // ตรวจสอบข้อมูลที่จำเป็น (ไม่รวม HN เพราะใช้ HN เดิม)
    if (!prefix || !first_name || !last_name || !patient_group_id || !gender || 
        !nationality || !religion || !education_level || !marital_status || !blood_group || 
        !birth_date || !treatment_type || !insurance_type_id || !address) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็นครบถ้วน (คำนำหน้า, ชื่อ, นามสกุล, กลุ่มลูกค้า, เพศ, สัญชาติ, ศาสนา, ระดับการศึกษา, สถานะภาพสมรส, กรุ๊บเลือด, วันเกิด, ประเภทการรักษา, ประเภทสิทธิ์การรักษา, ที่อยู่)')
    }
    
    // ตรวจสอบอีเมลซ้ำ (ถ้ามี)
    if (email) {
      const existingEmail = await prisma.patient.findFirst({
        where: { 
          email,
          id: { not: parseInt(id) }
        }
      })
      if (existingEmail) {
        throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว')
      }
    }

    // ตรวจสอบเลขบัตรประชาชนซ้ำ (ถ้ามี)
    if (national_id) {
      const existingNationalId = await prisma.patient.findFirst({
        where: { 
          national_id,
          id: { not: parseInt(id) }
        }
      })
      if (existingNationalId) {
        throw new Error('เลขบัตรประชาชนนี้มีผู้ใช้งานแล้ว')
      }
    }

    const patient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: {
        // ไม่อัปเดต hn เพราะ HN ไม่สามารถแก้ไขได้
        prefix,
        first_name,
        last_name,
        nickname,
        first_name_en,
        last_name_en,
        gender,
        birth_date: new Date(birth_date),
        national_id,
        passport_no,
        nationality,
        religion,
        marital_status,
        education_level,
        blood_group,
        phone_1,
        phone_2,
        email,
        address,
        sub_district,
        district,
        province,
        postal_code,
        company_name,
        company_tax_id,
        company_phone,
        company_email,
        company_address,
        company_subdistrict,
        company_district,
        company_province,
        company_postal_code,
        weight,
        height,
        waist,
        chest,
        allergy_history,
        mental_health,
        underlying_disease,
        health_note,
        treatment_type,
        insurance_type_id: insurance_type_id ? parseInt(insurance_type_id) : null,
        patient_group_id: patient_group_id ? parseInt(patient_group_id) : null,
        branchId: branchId ? parseInt(branchId) : null,
        note,
        updatedBy: updatedBy ? parseInt(updatedBy) : null,
        patientTags: {
          deleteMany: {},
          create: tagIds.map(tagId => ({
            tag_id: parseInt(tagId)
          }))
        }
      },
      include: {
        branch: {
          select: { id: true, name: true, code: true }
        },
        patientGroup: {
          select: { id: true, name: true, color: true }
        },
        insuranceType: {
          select: { id: true, name: true }
        },
        patientTags: {
          include: {
            tag: {
              select: { id: true, name: true, color: true }
            }
          }
        },
    createdByUser: {
      select: { id: true, name: true, email: true }
    },
    updatedByUser: {
      select: { id: true, name: true, email: true }
    }
      }
    })

    return patient
}

// อัปเดตสถานะการใช้งาน
export const updatePatientActive = async (id, isActive, updatedBy) => {
    const patient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: {
        isActive: isActive,
        updatedBy: updatedBy ? parseInt(updatedBy) : null
      },
      include: {
        branch: {
          select: { id: true, name: true, code: true }
        },
        patientGroup: {
          select: { id: true, name: true, color: true }
        },
        insuranceType: {
          select: { id: true, name: true }
        },
        patientTags: {
          include: {
            tag: {
              select: { id: true, name: true, color: true }
            }
          }
        },
    createdByUser: {
      select: { id: true, name: true, email: true }
    },
    updatedByUser: {
      select: { id: true, name: true, email: true }
    }
      }
    })

    return patient
}

// ดึงสถิติผู้ป่วย
export const getPatientStats = async () => {
    const [total, active, inactive, byGender, byBranch] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { isActive: true } }),
      prisma.patient.count({ where: { isActive: false } }),
      prisma.patient.groupBy({
        by: ['gender'],
        _count: { gender: true }
      }),
      prisma.patient.groupBy({
        by: ['branchId'],
        _count: { branchId: true },
        where: { branchId: { not: null } }
      })
    ])

    return {
      total,
      active,
      inactive,
      byGender,
      byBranch
    }
}
