<template>
  <div class="space-y-6 pb-64">
    <!-- Header with Queue Info -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Queue & Department Info -->
        <div>
          <div class="text-sm text-slate-600 mb-1">คิวตรวจเลขที่</div>
          <div class="text-lg font-semibold text-slate-800">
             {{ queueData?.registration?.opdNumber ||  '-' }}
          </div>
          <div class="text-sm text-slate-600 mt-2">
            แผนก: {{ queueData?.department?.name || '-' }}
          </div>
        </div>

        <!-- Date & Priority -->
        <div>
          <div class="text-sm text-slate-600 mb-1">วันที่</div>
          <div class="text-lg font-semibold text-slate-800">
            {{ formatDateTime(queueData?.createdAt) }}
          </div>
        </div>

        <!-- Doctor Info -->
        <div>
          <div class="text-sm text-slate-600 mb-1">แพทย์ผู้ตรวจ</div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center">
              <UserRound class="w-3 h-3 text-emerald-500" />
            </div>
            <div class="text-sm text-slate-700">
              {{ queueData?.registration?.doctor?.name || '-' }}
            </div>
            <div class="text-xs text-slate-500">แพทย์</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Info Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <!-- Patient Basic Info Card -->
      <div class="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
          <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <UserRound class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <div class="text-lg font-semibold text-slate-800">HN</div>
              <span
                class="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-sm font-semibold"
              >
                {{ patientData?.hn || '-' }}
                <button
                  v-if="patientData?.hn"
                  class="text-emerald-600 hover:text-emerald-700"
                  @click="copyToClipboard(patientData.hn, 'HN')"
                  v-tooltip:top="'คัดลอก'"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
            <div class="text-sm font-medium text-slate-800 mt-2">
              {{ patientData?.prefix || '' }} {{ patientData?.first_name || '' }}
              {{ patientData?.last_name || '' }}
            </div>
            <div class="text-sm text-slate-600 mt-2">
              วันเกิด: {{ formatDate(patientData?.birth_date) }}
            </div>
            <div class="text-sm text-slate-600">
              อายุ: {{ calculateAge(patientData?.birth_date) }}
            </div>
            <div class="text-sm text-slate-600">
              เพศ:
              <span class="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                {{ patientData?.gender || '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Treatment & Insurance Card -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
            <FileText class="w-4 h-4 text-emerald-500" />
          </div>
          <h3 class="text-sm font-semibold text-slate-900">การรักษา & สิทธิ์</h3>
        </div>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-slate-600 mb-1">ประเภทการรักษา</div>
            <div class="text-sm font-medium text-slate-900">OPD ผู้ป่วยนอก</div>
          </div>
          <div>
            <div class="text-sm text-slate-600 mb-1">ประเภทสิทธิ์การรักษา</div>
            <div class="text-sm font-medium text-slate-900">
              <span class="inline-flex px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs">
                {{ patientData?.insuranceType?.name || 'อื่นๆ (รอยืนยันสิทธิ)' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Physical Info Card -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
            <UserRound class="w-4 h-4 text-emerald-500" />
          </div>
          <h3 class="text-sm font-semibold text-slate-900">ข้อมูลร่างกาย</h3>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="text-sm text-slate-600 mb-1">น้ำหนัก</div>
            <div class="text-sm font-medium text-slate-900">{{ patientData?.weight || '0' }} kg</div>
          </div>
          <div>
            <div class="text-sm text-slate-600 mb-1">ส่วนสูง</div>
            <div class="text-sm font-medium text-slate-900">{{ patientData?.height || '0' }} cm</div>
          </div>
          <div>
            <div class="text-sm text-slate-600 mb-1">รอบเอว</div>
            <div class="text-sm font-medium text-slate-900">{{ patientData?.waist || '0' }} cm</div>
          </div>
          <div>
            <div class="text-sm text-slate-600 mb-1">รอบอก</div>
            <div class="text-sm font-medium text-slate-900">{{ patientData?.chest || '0' }} cm</div>
          </div>
          <div class="col-span-2">
            <div class="text-sm text-slate-600 mb-1">กรุ๊บเลือด</div>
            <div class="text-sm font-medium text-slate-900">
              <span class="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                {{ patientData?.blood_group || 'ไม่ระบุ' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Medical History Card -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
            <Stethoscope class="w-4 h-4 text-emerald-500" />
          </div>
          <h3 class="text-sm font-semibold text-slate-900">ประวัติการแพทย์</h3>
        </div>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-slate-600 mb-1">ประวัติการแพ้ยา</div>
            <div class="text-sm font-medium text-slate-900">{{ patientData?.allergies || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-slate-600 mb-1">ประวัติสุขภาพจิต</div>
            <div class="text-sm font-medium text-slate-900">
              {{ patientData?.mental_health_history || '-' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-slate-600 mb-1">โรคประจำตัว</div>
            <div class="text-sm font-medium text-slate-900">
              {{ patientData?.chronic_diseases || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs and Action Buttons -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50">
      <!-- Tabs and Action Buttons in same row -->
      <div class="border-b border-slate-200/50 px-6 py-4">
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
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300',
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
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
            >
              <Plus class="w-4 h-4" />
              Vitals Sign
            </button>

            <button
              @click="goBack"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
            >
              <X class="w-4 h-4" />
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50">
      <!-- Diagnosis Tab -->
      <div v-if="activeTab === 'diagnosis'" class="p-6">
        <DiagnosisTable :items="medicalHistory" :loading="loadingHistory" @edit="openEditVisit" @cancel="onCancelVisit" />
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="p-6">
        <div class="text-center text-slate-500 py-8">
          <Clock class="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>ส่วนรายการประวัติ</p>
          <p class="text-sm text-slate-400">กำลังพัฒนา...</p>
        </div>
      </div>

      <!-- Images Tab -->
      <div v-if="activeTab === 'images'" class="p-6">
        <div class="text-center text-slate-500 py-8">
          <ImageIcon class="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>ส่วนรูปภาพ/PDF</p>
          <p class="text-sm text-slate-400">กำลังพัฒนา...</p>
        </div>
      </div>

      <!-- Certificate Tab -->
      <div v-if="activeTab === 'certificate'" class="p-6">
        <div class="text-center text-slate-500 py-8">
          <FileText class="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>ส่วนใบรับรองแพทย์</p>
          <p class="text-sm text-slate-400">กำลังพัฒนา...</p>
        </div>
      </div>
    </div>

    <!-- Summary Section (สรุปรายการ) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50 mb-64">
      <!-- Summary Tabs Header -->
      <div class="border-b border-slate-200/50 px-6 py-4">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">สรุปรายการ</h3>
        <nav class="flex space-x-8" aria-label="Summary Tabs">
          <button
            v-for="tab in summaryTabs"
            :key="tab.id"
            @click="activeSummaryTab = tab.id"
            :class="[
              activeSummaryTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Summary Tab Content -->
      <div class="pb-8">
        <!-- Summary Tab -->
        <div v-if="activeSummaryTab === 'summary'">
          <SummaryTab 
            v-if="currentVisitId"
            :visit-id="currentVisitId" 
            @updated="handleSummaryUpdated"
          />
          <div v-else class="p-6 text-center text-gray-500">
            <p>กรุณาสร้าง Visit ก่อนเพื่อดูสรุปรายการ</p>
          </div>
        </div>

        <!-- Examination Tab -->
        <div v-if="activeSummaryTab === 'examination'">
          <ExaminationTab 
            v-if="currentVisitId"
            :visit-id="currentVisitId" 
            @updated="handleExaminationUpdated"
          />
          <div v-else class="p-6 text-center text-gray-500">
            <p>กรุณาสร้าง Visit ก่อนเพื่อสั่งรายการตรวจ</p>
          </div>
        </div>

        <!-- Medication Tab -->
        <div v-if="activeSummaryTab === 'medication'" class="p-6">
          <div class="text-center text-slate-500 py-8">
            <FileText class="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>ส่วนสั่งยา/อุปกรณ์</p>
            <p class="text-sm text-slate-400">กำลังพัฒนา...</p>
          </div>
        </div>

        <!-- Service Tab -->
        <div v-if="activeSummaryTab === 'service'" class="p-6">
          <div class="text-center text-slate-500 py-8">
            <Clock class="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>ส่วนใช้บริการ</p>
            <p class="text-sm text-slate-400">กำลังพัฒนา...</p>
          </div>
        </div>

        <!-- Medication Use Tab -->
        <div v-if="activeSummaryTab === 'medication-use'" class="p-6">
          <div class="text-center text-slate-500 py-8">
            <FileText class="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>ส่วนใช้ยา/อุปกรณ์</p>
            <p class="text-sm text-slate-400">กำลังพัฒนา...</p>
          </div>
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
  Copy,
  Beaker,
  ClipboardList,
} from 'lucide-vue-next'
import opdService from '@/services/opd.js'
import Swal from 'sweetalert2'
import VitalsSignModal from '@/views/opd/components/VitalsSignModal.vue'
import DiagnosisTable from '@/views/opd/components/DiagnosisTable.vue'
import ExaminationTab from '@/views/opd/components/ExaminationTab.vue'
import SummaryTab from '@/views/opd/components/SummaryTab.vue'
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
    Copy,
    Beaker,
    ClipboardList,
    VitalsSignModal,
    DiagnosisTable,
    ExaminationTab,
    SummaryTab,
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
      currentVisitId: null, // Visit ID for examination tab
      tabs: [
        { id: 'diagnosis', name: 'การวินิจฉัยโรค', icon: Stethoscope },
        { id: 'history', name: 'รายการประวัติ', icon: Clock },
        { id: 'images', name: 'รูปภาพ/PDF', icon: ImageIcon },
        { id: 'certificate', name: 'ใบรับรองแพทย์', icon: FileText },
      ],
      // Tabs สำหรับส่วนสรุปรายการ
      summaryTabs: [
        { id: 'summary', name: 'สรุปรายการ', icon: ClipboardList },
        { id: 'examination', name: 'ตรวจ/LAB/X-Ray', icon: Beaker },
        { id: 'medication', name: 'สั่งยา/อุปกรณ์', icon: FileText },
        { id: 'service', name: 'ใช้บริการ', icon: Clock },
        { id: 'medication-use', name: 'ใช้ยา/อุปกรณ์', icon: FileText },
      ],
      activeSummaryTab: 'summary',
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
    copyToClipboard(text, label = '') {
      if (!text) return
      try {
        navigator.clipboard?.writeText(String(text))
        Swal.fire({
          icon: 'success',
          title: 'คัดลอกแล้ว',
          text: label ? `${label}: ${text}` : String(text),
          toast: true,
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end'
        })
      } catch {
        Swal.fire({ icon: 'error', title: 'คัดลอกไม่สำเร็จ' })
      }
    },
    async loadQueueData() {
      if (!this.queueId) return

      this.loading = true
      try {
        const response = await opdService.getQueueForOPDManagement(this.queueId)
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
        const currentRegId = this.queueData?.registration?.id || null
        const { data } = await visitService.listByPatient(id, currentRegId)
        const items = data?.data?.items || []
        this.medicalHistory = items
        
        // Set currentVisitId to the latest visit of current registration
        if (items && items.length > 0 && currentRegId) {
          // Find visit for current registration
          const currentVisit = items.find(v => v.registration?.id === currentRegId || v.registrationId === currentRegId)
          if (currentVisit) {
            this.currentVisitId = currentVisit.id
          } else {
            // Use the latest visit if no visit for current registration
            this.currentVisitId = items[0].id
          }
        } else if (items && items.length > 0) {
          // Use latest visit if no registration filter
          this.currentVisitId = items[0].id
        } else {
          this.currentVisitId = null
        }
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
    
    async handleExaminationUpdated() {
      // Reload summary tab เมื่อมีการอัปเดตใน ExaminationTab
      if (this.$refs.summaryTabRef && this.activeSummaryTab === 'summary') {
        await this.$refs.summaryTabRef.loadItems()
      }
    },

    handleSummaryUpdated() {
      // Handle summary tab update event
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
    },

    handleSummaryTabChange(tabId) {
      this.activeSummaryTab = tabId
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
