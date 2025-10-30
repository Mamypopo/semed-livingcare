import { apiClient } from './api'

export default {
  create(data) {
    return apiClient.post('/visits', data)
  },
  listByPatient(patientId, registrationId) {
    const params = { patientId }
    if (registrationId) params.registrationId = registrationId
    return apiClient.get('/visits', params)
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


