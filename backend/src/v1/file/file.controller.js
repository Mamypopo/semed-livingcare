import { 
  getPatientFiles, 
  uploadFile, 
  deleteFile
} from './file.service.js'

// Get all files for a patient
export const getPatientFilesController = async (req, res) => {
  try {
    const { id: patientId } = req.params
    const { page, limit, search, sort } = req.query
   
    const result = await getPatientFiles(patientId, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      sort
    })
        
    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลไฟล์สำเร็จ',
      data: result.files,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('❌ Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'ไม่สามารถดึงข้อมูลไฟล์ได้'
    })
  }
}

// Upload file
export const uploadFileController = async (req, res) => {
  try {
    const { id: patientId } = req.params
    const { name, description } = req.body
    const uploadedBy = req.user?.id ? req.user.id.toString() : 'system'
       
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบไฟล์ที่อัปโหลด'
      })
    }
    
    // Prepare file data
    const fileData = {
      patientId,
      name: name || req.file.originalname,
      description: description || '',
      originalName: req.file.originalname,
      fileBuffer: req.file.buffer,
      contentType: req.file.mimetype
    }
    
    const file = await uploadFile(fileData, uploadedBy)
        
    res.status(201).json({
      success: true,
      message: 'อัปโหลดไฟล์สำเร็จ',
      data: file
    })
  } catch (error) {
    console.error('❌ Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'ไม่สามารถอัปโหลดไฟล์ได้'
    })
  }
}

// Delete file
export const deleteFileController = async (req, res) => {
  try {
    const { id: fileId } = req.params
        
    const result = await deleteFile(fileId)
        
    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    console.error('❌ Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'ไม่สามารถลบไฟล์ได้'
    })
  }
}

