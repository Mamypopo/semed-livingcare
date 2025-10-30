import { apiClient } from './api'

export default {
  create(data) {
    return apiClient.post('/visits', data)
  },
  listByPatient(patientId) {
    return apiClient.get('/visits', { patientId })
  },
  getById(id) {
    return apiClient.get(`/visits/${id}`)
  },
  update(id, data) {
    return apiClient.put(`/visits/${id}`, data)
  },
  cancel(id) {
    return apiClient.patch(`/visits/${id}/cancel`)
  }
}


