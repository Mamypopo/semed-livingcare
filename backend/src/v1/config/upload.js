import multer from 'multer'

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP)'), false)
    }
  }
})

export { upload }