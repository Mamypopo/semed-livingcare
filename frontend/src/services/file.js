import { apiClient, api } from './api'

// Get all files for a patient
export const getPatientFiles = async (patientId, options = {}) => {
  try {
    const { page = 1, limit = 20, search, sort = 'newest' } = options
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort
    })
    
    if (search) params.append('search', search)
    
    const response = await apiClient.get(`/patients/${patientId}/files?${params}`)
    return response.data
  } catch (error) {
    console.error('Error getting patient files:', error)
    throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลไฟล์ได้')
  }
}

// Upload file
export const uploadFile = async (patientId, file, name, description) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name || '')
    formData.append('description', description || '')
    
    const response = await api.post(`/patients/${patientId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถอัปโหลดไฟล์ได้'
    throw new Error(errorMessage)
  }
}

// Delete file
export const deleteFile = async (fileId) => {
  try {
    const response = await apiClient.delete(`/files/${fileId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error(error.response?.data?.message || 'ไม่สามารถลบไฟล์ได้')
  }
}



export default {
  getPatientFiles,
  uploadFile,
  deleteFile
}
