import express from 'express'
import multer from 'multer'
import {
  getPatientFilesController,
  uploadFileController,
  deleteFileController
} from './file.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('ประเภทไฟล์ไม่ถูกต้อง'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
})

router.use(authenticateToken)

// File routes
router.get('/patients/:id/files', getPatientFilesController)
router.post('/patients/:id/files', upload.single('file'), (err, req, res, next) => {
  if (err) {
    console.error('❌ Multer Error:', err.message)
    return res.status(400).json({
      success: false,
      message: err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    })
  }
  next()
}, uploadFileController)
router.delete('/files/:id', deleteFileController)

export default router
