import { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob'

// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'semed-files'

let blobServiceClient = null

// Initialize Blob Service Client
export const initializeBlobService = () => {
  try {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      console.warn('⚠️ AZURE_STORAGE_CONNECTION_STRING not found, using local storage fallback')
      return null
    }
    
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
    return blobServiceClient
  } catch (error) {
    console.error('❌ Failed to initialize Azure Blob Storage:', error.message)
    return null
  }
}

// Get Blob Service Client
export const getBlobServiceClient = () => {
  if (!blobServiceClient) {
    return initializeBlobService()
  }
  return blobServiceClient
}

// Get Container Client
export const getContainerClient = () => {
  const blobService = getBlobServiceClient()
  if (!blobService) return null
  
  return blobService.getContainerClient(AZURE_CONTAINER_NAME)
}

// Generate unique blob name
export const generateBlobName = (patientId, fileType, originalName) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const extension = originalName.split('.').pop()
  
  if (fileType === 'profile') {
    return `patients/${patientId}/profile/profile-${timestamp}-${random}.${extension}`
  } else {
    return `patients/${patientId}/documents/doc-${timestamp}-${random}.${extension}`
  }
}


// Upload file to blob storage
export const uploadToBlob = async (fileBuffer, blobName, contentType) => {
  try {
    const containerClient = getContainerClient()
    if (!containerClient) {
      throw new Error('Blob storage not available')
    }
    
    // Container should already exist (private access)
    // ไม่สร้าง container ใหม่
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: contentType
      }
    }
    
    const uploadResult = await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions)
    
    return {
      success: true,
      url: blockBlobClient.url,
      etag: uploadResult.etag,
      lastModified: uploadResult.lastModified
    }
  } catch (error) {
    console.error('Error uploading to blob:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}


// Delete file from blob storage
export const deleteFromBlob = async (blobName) => {
  try {
    const containerClient = getContainerClient()
    if (!containerClient) {
      throw new Error('Blob storage not available')
    }
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    await blockBlobClient.delete()
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting from blob:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

// Generate SAS URL for temporary access (แบบโปรเจคเก่า)
export const generateSasUrl = async (blobName, expiresInHours = 24) => {
  try {
    const containerClient = getContainerClient()
    if (!containerClient) {
      throw new Error('Blob storage not available')
    }
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    
    // Generate SAS token (expires in specified hours) - แบบโปรเจคเก่า
    const startDate = new Date()
    startDate.setMinutes(startDate.getMinutes() - 5) // เริ่มต้น 5 นาทีที่แล้ว
    
    const expiresOn = new Date()
    expiresOn.setTime(expiresOn.getTime() + (expiresInHours * 60 * 60 * 1000)) // 24 ชั่วโมง
    
    const sasOptions = {
      containerName: AZURE_CONTAINER_NAME,
      blobName: blobName,
      permissions: BlobSASPermissions.parse('r'), // read only
      startsOn: startDate,
      expiresOn: expiresOn
    }
    
    // ใช้ credential จาก blobServiceClient แบบโปรเจคเก่า
    const blobServiceClient = getBlobServiceClient()
    const sasToken = generateBlobSASQueryParameters(sasOptions, blobServiceClient.credential).toString()
    const sasUrl = `${blockBlobClient.url}?${sasToken}`
    
    return {
      success: true,
      url: sasUrl,
      expiresOn
    }
  } catch (error) {
    console.error('Error generating SAS URL:', error)
    throw new Error(`Failed to generate download URL: ${error.message}`)
  }
}

export default {
  initializeBlobService,
  getBlobServiceClient,
  getContainerClient,
  generateBlobName,
  uploadToBlob,
  deleteFromBlob,
  generateSasUrl
}
