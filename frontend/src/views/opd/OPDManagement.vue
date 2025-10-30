<template>
  <div class="space-y-6">
    <!-- Header with Queue Info -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Queue & Department Info -->
        <div>
          <div class="text-sm text-gray-600 mb-1">คิวตรวจเลขที่</div>
          <div class="text-lg font-semibold text-gray-700">
             {{ queueData?.registration?.opdNumber ||  '-' }}
          </div>
          <div class="text-sm text-gray-600 mt-2">
            แผนก: {{ queueData?.department?.name || '-' }}
          </div>
        </div>

        <!-- Date & Priority -->
        <div>
          <div class="text-sm text-gray-600 mb-1">วันที่</div>
          <div class="text-lg font-semibold text-gray-700">
            {{ formatDateTime(queueData?.createdAt) }}
          </div>
        </div>

        <!-- Doctor Info -->
        <div>
          <div class="text-sm text-gray-600 mb-1">แพทย์ผู้ตรวจ</div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <UserRound class="w-3 h-3 text-blue-600" />
            </div>
            <div class="text-sm text-gray-700">
              {{ queueData?.registration?.doctor?.name || '-' }}
            </div>
            <div class="text-xs text-gray-500">แพทย์</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Info Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <!-- Patient Basic Info Card -->
      <div class="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <UserRound class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <div class="text-lg font-semibold text-gray-700">{{ patientData?.hn || '-' }}</div>
            <div class="text-sm font-medium text-gray-700 mt-2">
              {{ patientData?.prefix || '' }} {{ patientData?.first_name || '' }}
              {{ patientData?.last_name || '' }}
            </div>
            <div class="text-sm text-gray-600 mt-2">
              วันเกิด: {{ formatDate(patientData?.birth_date) }}
            </div>
            <div class="text-sm text-gray-600">
              อายุ: {{ calculateAge(patientData?.birth_date) }}
            </div>
            <div class="text-sm text-gray-600">
              เพศ:
              {{ patientData?.gender === 'M' ? 'ชาย' : patientData?.gender === 'F' ? 'หญิง' : '-' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Treatment & Insurance Card -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText class="w-4 h-4 text-blue-600" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900">การรักษา & สิทธิ์</h3>
        </div>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-600 mb-1">ประเภทการรักษา</div>
            <div class="text-sm font-medium text-gray-900">OPD ผู้ป่วยนอก</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">ประเภทสิทธิ์การรักษา</div>
            <div class="text-sm font-medium text-gray-900">
              {{ patientData?.insuranceType?.name || 'อื่นๆ (รอยืนยันสิทธิ)' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Physical Info Card -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <UserRound class="w-4 h-4 text-green-600" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900">ข้อมูลร่างกาย</h3>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="text-sm text-gray-600 mb-1">น้ำหนัก</div>
            <div class="text-sm font-medium text-gray-900">{{ patientData?.weight || '0' }} kg</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">ส่วนสูง</div>
            <div class="text-sm font-medium text-gray-900">{{ patientData?.height || '0' }} cm</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">รอบเอว</div>
            <div class="text-sm font-medium text-gray-900">{{ patientData?.waist || '0' }} cm</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">รอบอก</div>
            <div class="text-sm font-medium text-gray-900">{{ patientData?.chest || '0' }} cm</div>
          </div>
          <div class="col-span-2">
            <div class="text-sm text-gray-600 mb-1">กรุ๊บเลือด</div>
            <div class="text-sm font-medium text-gray-900">
              {{ patientData?.blood_group || 'ไม่ระบุ' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Medical History Card -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Stethoscope class="w-4 h-4 text-red-600" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900">ประวัติการแพทย์</h3>
        </div>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-600 mb-1">ประวัติการแพ้ยา</div>
            <div class="text-sm font-medium text-gray-900">{{ patientData?.allergies || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">ประวัติสุขภาพจิต</div>
            <div class="text-sm font-medium text-gray-900">
              {{ patientData?.mental_health_history || '-' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">โรคประจำตัว</div>
            <div class="text-sm font-medium text-gray-900">
              {{ patientData?.chronic_diseases || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs and Action Buttons -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <!-- Tabs and Action Buttons in same row -->
      <div class="border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Tabs -->
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              ]"
            >
              <component :is="tab.icon" class="w-4 h-4" />
              {{ tab.name }}
            </button>
          </nav>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="openVitalsSign"
              class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Plus class="w-4 h-4" />
              Vitals Sign
            </button>

            <button
              @click="goBack"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <X class="w-4 h-4" />
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <!-- Diagnosis Tab -->
      <div v-if="activeTab === 'diagnosis'" class="p-6">
        <DiagnosisTable :items="medicalHistory" :loading="loadingHistory" @edit="openEditVisit" @cancel="onCancelVisit" />
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="p-6">
        <div class="text-center text-gray-500 py-8">
          <Clock class="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>ส่วนรายการประวัติ</p>
          <p class="text-sm text-gray-400">กำลังพัฒนา...</p>
        </div>
      </div>

      <!-- Images Tab -->
      <div v-if="activeTab === 'images'" class="p-6">
        <div class="text-center text-gray-500 py-8">
          <ImageIcon class="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>ส่วนรูปภาพ/PDF</p>
          <p class="text-sm text-gray-400">กำลังพัฒนา...</p>
        </div>
      </div>

      <!-- Certificate Tab -->
      <div v-if="activeTab === 'certificate'" class="p-6">
        <div class="text-center text-gray-500 py-8">
          <FileText class="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>ส่วนใบรับรองแพทย์</p>
          <p class="text-sm text-gray-400">กำลังพัฒนา...</p>
        </div>
      </div>
    </div>

    

    <!-- Vitals Sign Modal -->
    <VitalsSignModal
      :isOpen="showVitalsModal"
      :mode="editingVisitId ? 'edit' : 'create'"
      :visitId="editingVisitId"
      :departmentName="queueData?.department?.name || ''"
      :patientId="patientId"
      :registrationId="queueData?.registration?.id || null"
      :doctorId="queueData?.registration?.doctor?.id || null"
      :departmentId="queueData?.department?.id || queueData?.registration?.department?.id || null"
      :branchId="
        authStore.currentBranch?.id ||
        queueData?.registration?.branchId ||
        authStore.user?.branchId ||
        null
      "
      @close="onCloseModal"
    />
  </div>
</template>

<script>
import {
  Plus,
  X,
  UserRound,
  Stethoscope,
  Clock,
  Image as ImageIcon,
  FileText,
  Camera,
} from 'lucide-vue-next'
import opdService from '@/services/opd.js'
import Swal from 'sweetalert2'
import VitalsSignModal from '@/views/opd/components/VitalsSignModal.vue'
import DiagnosisTable from '@/views/opd/components/DiagnosisTable.vue'
import { useAuthStore } from '@/stores/auth.js'
import visitService from '@/services/visit.js'

export default {
  name: 'OPDManagement',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  components: {
    Plus,
    X,
    UserRound,
    Stethoscope,
    Clock,
    ImageIcon,
    FileText,
    Camera,
    VitalsSignModal,
    DiagnosisTable,
  },
  data() {
    return {
      loading: false,
      loadingHistory: false,
      queueData: null,
      patientData: null,
      medicalHistory: [],
      activeTab: 'diagnosis',
      showVitalsModal: false,
      editingVisitId: null,
      tabs: [
        { id: 'diagnosis', name: 'การวินิจฉัยโรค', icon: Stethoscope },
        { id: 'history', name: 'รายการประวัติ', icon: Clock },
        { id: 'images', name: 'รูปภาพ/PDF', icon: ImageIcon },
        { id: 'certificate', name: 'ใบรับรองแพทย์', icon: FileText },
      ],
    }
  },
  computed: {
    queueId() {
      return this.$route.params.queueId
    },
    queueNumber() {
      return this.$route.query.queueNumber
    },
    vnNumber() {
      return this.$route.query.vnNumber
    },
    patientId() {
      return this.$route.query.patientId
    },
  },
  methods: {
    async loadQueueData() {
      if (!this.queueId) return

      this.loading = true
      try {
        const response = await opdService.getQueueForOPDManagement(this.queueId)
        console.log(response)
        const data = response.data

        // ตั้งค่าข้อมูลคิว
          this.queueData = {
          queueNumber: data.queue.queueNumber,
          status: data.queue.status,
          createdAt: data.queue.createdAt,
          department: data.department,
          registration: {
            id: data.registration.id,
            vnNumber: data.registration.vnNumber,
              opdNumber: data.registration.opdNumber,
            doctor: data.doctor,
          },
        }

        // ตั้งค่าข้อมูลผู้ป่วย
        this.patientData = data.patient

        // Load medical history
        await this.loadMedicalHistory()
      } catch (error) {
        console.error('Error loading queue data:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลคิวได้',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    async loadMedicalHistory() {
      const id = this.patientData?.id || this.patientId
      if (!id) return

      this.loadingHistory = true
      try {
        const { data } = await visitService.listByPatient(id)
        const items = data?.data?.items || []
        // คำนวณลำดับต่อท้าย (-1, -2) ต่อ registration
        const counts = {}
        const ordered = [...items].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
        for (const rec of ordered) {
          const regId = rec?.registration?.id || rec.id
          counts[regId] = (counts[regId] || 0) + 1
          rec._ordinal = counts[regId]
        }
        // แสดงเก่า -> ใหม่ ตามที่ต้องการ
        this.medicalHistory = ordered
      } catch (error) {
        console.error('Error loading medical history:', error)
      } finally {
        this.loadingHistory = false
      }
    },

    openVitalsSign() {
      this.showVitalsModal = true
    },
    openEditVisit(rec) {
      this.editingVisitId = rec.id
      this.showVitalsModal = true
    },
    async onCancelVisit(rec) {
      if (!rec?.id) return
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: 'ยืนยันการยกเลิก Visit?',
        text: 'รายการนี้จะถูกซ่อนจากประวัติ แต่เลขลำดับจะยังคงอยู่',
        showCancelButton: true,
        confirmButtonText: 'ยกเลิก',
        cancelButtonText: 'ปิด',
        confirmButtonColor: '#ef4444'
      })
      if (!isConfirmed) return
      try {
        await visitService.cancel(rec.id)
        await this.loadMedicalHistory()
        Swal.fire({ icon: 'success', title: 'ยกเลิกแล้ว', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' })
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'ยกเลิกไม่สำเร็จ', text: e?.response?.data?.message || e.message })
      }
    },

    goBack() {
      this.$router.push({ name: 'OPDQueue' })
    },
    onCloseModal() {
      this.showVitalsModal = false
      this.editingVisitId = null
      // reload history after save/edit
      this.loadMedicalHistory()
    },

    formatDateTime(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return (
        d.toLocaleDateString('th-TH') +
        ' ' +
        d.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    },

    formatDate(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    },

    calculateAge(birthDate) {
      if (!birthDate) return '-'

      const birth = new Date(birthDate)
      const today = new Date()

      let years = today.getFullYear() - birth.getFullYear()
      let months = today.getMonth() - birth.getMonth()
      let days = today.getDate() - birth.getDate()

      if (days < 0) {
        months--
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
      }

      if (months < 0) {
        years--
        months += 12
      }

      return `${years} ปี ${months} เดือน ${days} วัน`
    },
    formatVisitNo(rec) {
      const vn = rec?.registration?.vnNumber ? String(rec.registration.vnNumber) : ''
      const base = `${vn.padStart(4, '0')}`
      const ord = rec?._ordinal || 1
      return `${base}-${ord}`
    }
  },

  mounted() {
    this.loadQueueData()
  },
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
