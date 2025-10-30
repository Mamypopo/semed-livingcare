import { apiClient } from './api'

export default {
  create(data) {
    return apiClient.post('/visits', data)
  },
  listByPatient(patientId) {
    return apiClient.get('/visits', { patientId })
  }
}


