import { prisma } from "../config/db.js";
import { 
  uploadToBlob, 
  deleteFromBlob, 
  generateBlobName, 
  generateSasUrl 
} from '../config/blob.js'


// Get all files for a patient
export const getPatientFiles = async (patientId, options = {}) => {
  try {
    const { page = 1, limit = 20, search, sort = 'newest' } = options
    
    // Build where clause
    const where = {
      patient_id: parseInt(patientId)
    }
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Build orderBy clause
    let orderBy = {}
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    
    // Get files with pagination
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          patient: {
            select: { id: true, hn: true, first_name: true, last_name: true }
          }
        }
      }),
      prisma.file.count({ where })
    ])
    
    // Generate SAS URLs for each file
    const filesWithSasUrls = await Promise.all(
      files.map(async (file) => {
        // ตรวจสอบว่าเป็น blob name หรือไม่ (ไม่ขึ้นต้นด้วย http)
        if (!file.url.startsWith('http')) {
          let blobName = file.url
          
          // ถ้ามี blob: prefix ให้ลบออก
          if (blobName.startsWith('blob:')) {
            blobName = blobName.replace('blob:', '')
          }
          
          try {
            const sasResult = await generateSasUrl(blobName, 24) // 24 hours
            return {
              ...file,
              url: sasResult.success ? sasResult.url : file.url
            }
          } catch (error) {
            return file
          }
        }
        return file
      })
    )
    
    return {
      files: filesWithSasUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    }
  } catch (error) {
    console.error('Error getting patient files:', error)
    throw new Error('ไม่สามารถดึงข้อมูลไฟล์ได้')
  }
}


// Upload file
export const uploadFile = async (fileData, uploadedBy) => {
  try {
    const {
      patientId,
      name,
      description,
      originalName,
      fileBuffer,
      contentType
    } = fileData
    
    // Validate required fields
    if (!patientId || !originalName || !fileBuffer || !contentType) {
      throw new Error('ข้อมูลไฟล์ไม่ครบถ้วน')
    }
    
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    })
    
    if (!patient) {
      throw new Error('ไม่พบข้อมูลผู้ป่วย')
    }
    
    // Generate blob name
    const blobName = generateBlobName(patientId, 'document', originalName)
    
    // Upload to blob storage
    const uploadResult = await uploadToBlob(fileBuffer, blobName, contentType)
    
    if (!uploadResult.success) {
      throw new Error('ไม่สามารถอัปโหลดไฟล์ได้')
    }
    
    // Store blob name for SAS URL generation
    const fileUrl = blobName
    
    // Create file record in database
    const file = await prisma.file.create({
      data: {
        url: fileUrl,
        name: name || originalName,
        originalName: originalName,
        fileSize: fileBuffer.length,
        description: description || '',
        uploadedBy,
        patient_id: parseInt(patientId),
        branchId: patient.branchId || null
      },
      include: {
        patient: {
          select: { id: true, hn: true, first_name: true, last_name: true }
        }
      }
    })
    
    return file
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error(error.message || 'ไม่สามารถอัปโหลดไฟล์ได้')
  }
}


// Delete file
export const deleteFile = async (fileId) => {
  try {
    // Check if file exists
    const existingFile = await prisma.file.findUnique({
      where: { id: parseInt(fileId) }
    })
    
    if (!existingFile) {
      throw new Error('ไม่พบไฟล์ที่ต้องการลบ')
    }
    
    // Get blob name from database (stored directly)
    let blobName = existingFile.url
    
    // ถ้ามี blob: prefix ให้ลบออก
    if (blobName.startsWith('blob:')) {
      blobName = blobName.replace('blob:', '')
    }
    
    // Delete from blob storage
    try {
      await deleteFromBlob(blobName)
    } catch (blobError) {
      console.warn('Failed to delete from blob storage:', blobError.message)
      // Continue with database deletion even if blob deletion fails
    }
    
    // Delete file record from database
    await prisma.file.delete({
      where: { id: parseInt(fileId) }
    })
    
    return { success: true, message: 'ลบไฟล์สำเร็จ' }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error(error.message || 'ไม่สามารถลบไฟล์ได้')
  }
}

