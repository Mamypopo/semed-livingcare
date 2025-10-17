import { 
  getPatientFiles, 
  getFileById, 
  uploadFile, 
  updateFile, 
  deleteFile
} from './file.service.js'

// Get all files for a patient
export const getPatientFilesController = async (req, res) => {
  try {
    const { id: patientId } = req.params
    const { page, limit, search, sort } = req.query
    
    console.log('📁 Controller รับคำขอไฟล์:')
    console.log('Patient ID:', patientId)
    console.log('Query params:', { page, limit, search, sort })
    
    const result = await getPatientFiles(patientId, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      sort
    })
    
    console.log('✅ ดึงไฟล์สำเร็จ:', result.files.length, 'ไฟล์')
    
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

// Get single file
export const getFileByIdController = async (req, res) => {
  try {
    const { id: fileId } = req.params
    
    console.log('📁 Controller รับคำขอไฟล์:', fileId)
    
    const file = await getFileById(fileId)
    
    console.log('✅ ดึงไฟล์สำเร็จ:', file.name)
    
    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลไฟล์สำเร็จ',
      data: file
    })
  } catch (error) {
    console.error('❌ Controller Error:', error.message)
    res.status(404).json({
      success: false,
      message: error.message || 'ไม่พบไฟล์ที่ต้องการ'
    })
  }
}

// Upload file
export const uploadFileController = async (req, res) => {
  try {
    const { id: patientId } = req.params
    const { name, description } = req.body
    const uploadedBy = req.user?.id ? req.user.id.toString() : 'system'
    
    console.log('📤 Controller รับคำขออัปโหลด:')
    console.log('Patient ID:', patientId)
    console.log('File info:', req.file)
    console.log('Body data:', req.body)
    console.log('Content-Type:', req.headers['content-type'])
    console.log('User data:', { name, description })
    
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
    
    console.log('✅ อัปโหลดไฟล์สำเร็จ:', file.name)
    
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

// Update file
export const updateFileController = async (req, res) => {
  try {
    const { id: fileId } = req.params
    const { name, description } = req.body
    
    console.log('📝 Controller รับคำขอแก้ไขไฟล์:')
    console.log('File ID:', fileId)
    console.log('Update data:', { name, description })
    
    const file = await updateFile(fileId, { name, description })
    
    console.log('✅ แก้ไขไฟล์สำเร็จ:', file.name)
    
    res.status(200).json({
      success: true,
      message: 'แก้ไขไฟล์สำเร็จ',
      data: file
    })
  } catch (error) {
    console.error('❌ Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'ไม่สามารถแก้ไขไฟล์ได้'
    })
  }
}

// Delete file
export const deleteFileController = async (req, res) => {
  try {
    const { id: fileId } = req.params
    
    console.log('🗑️ Controller รับคำขอลบไฟล์:', fileId)
    
    const result = await deleteFile(fileId)
    
    console.log('✅ ลบไฟล์สำเร็จ')
    
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

