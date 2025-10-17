import { createHttp } from '../api'

const BASE_URL =
  'https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database'
const addressApi = createHttp(BASE_URL)

// Service functions
export const addressService = {
  // ดึงข้อมูลที่อยู่ทั้งหมด (จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์)
  async getAllAddressData() {
    try {
      const response = await addressApi.get('/raw_database.json')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Error fetching address data:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // ดึงรายการจังหวัดทั้งหมด
  async getProvinces() {
    try {
      const result = await this.getAllAddressData()
      if (result.success) {
        // แยกจังหวัดออกมา (unique)
        const provinces = [...new Set(result.data.map((item) => item.province))].map(
          (province, index) => ({
            id: index + 1,
            name_th: province,
            name_en: province,
          }),
        )
        return {
          success: true,
          data: provinces,
        }
      } else {
        return result
      }
    } catch (error) {
      console.error('Error fetching provinces:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // ดึงรายการอำเภอตามจังหวัด
  async getDistricts(provinceName) {
    try {
      const result = await this.getAllAddressData()
      if (result.success) {
        // กรองอำเภอตามจังหวัด (ใช้ amphoe แทน district)
        const districts = [
          ...new Set(
            result.data.filter((item) => item.province === provinceName).map((item) => item.amphoe),
          ),
        ].map((amphoe, index) => ({
          id: index + 1,
          name_th: amphoe,
          name_en: amphoe,
        }))

        return {
          success: true,
          data: districts,
        }
      } else {
        return result
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // ดึงรายการตำบลตามอำเภอ
  async getSubDistricts(districtName) {
    try {
      const result = await this.getAllAddressData()
      if (result.success) {
        // กรองตำบลตามอำเภอ (ใช้ district แทน subdistrict)
        const subDistricts = [
          ...new Set(
            result.data.filter((item) => item.amphoe === districtName).map((item) => item.district),
          ),
        ].map((district, index) => ({
          id: index + 1,
          name_th: district,
          name_en: district,
        }))
        return {
          success: true,
          data: subDistricts,
        }
      } else {
        return result
      }
    } catch (error) {
      console.error('Error fetching sub-districts:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // ดึงรหัสไปรษณีย์ตามตำบล
  async getPostcodes(subDistrictName) {
    try {
      const result = await this.getAllAddressData()
      if (result.success) {
        // หารหัสไปรษณีย์ตามตำบล (ใช้ district แทน subdistrict)
        const postcodes = [
          ...new Set(
            result.data
              .filter((item) => item.district === subDistrictName)
              .map((item) => item.zipcode),
          ),
        ]
        return {
          success: true,
          data: postcodes.map((postcode) => ({ postcode: String(postcode) })),
        }
      } else {
        return result
      }
    } catch (error) {
      console.error('Error fetching postcodes:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },
}

export default addressService
