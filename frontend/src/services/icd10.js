import { apiClient } from './api'

export default {
  search(params) {
    return apiClient.get('/icd10', params)
  }
}


