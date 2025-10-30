import { apiClient } from './api'

export default {
  create(data) {
    return apiClient.post('/api/v1/visits', data)
  }
}


