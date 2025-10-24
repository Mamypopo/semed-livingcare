<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <HeadlessDialog as="div" class="relative z-50" @close="requestClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-200"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-150"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-[90vw] h-[90vh] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <div class="px-6 pt-5 pb-4 rounded-t-2xl border-b border-gray-100 bg-white">
                <!-- Patient Info Header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-6">
                    <!-- Patient Info -->
                    <div class="flex items-center gap-2">
                      <UserRound class="w-4 h-4 text-teal-600" />
                      <span class="text-gray-900 font-medium">{{ patientData?.hn || '-' }} : {{ patientData?.prefix }} {{ patientData?.first_name }} {{ patientData?.last_name }}</span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <Star class="w-4 h-4 text-teal-600" />
                      <span class="text-gray-700">แต้ม : {{ patientData?.points || 0 }}</span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <Wallet class="w-4 h-4 text-teal-600" />
                      <span class="text-gray-700">วงเงิน : {{ patientData?.balance || 0 }}</span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <Users class="w-4 h-4 text-teal-600" />
                      <span class="text-gray-700">กลุ่มลูกค้า : {{ patientData?.patientGroup?.name || 'ลูกค้าทั่วไป' }}</span>
                    </div>
                    
                    <!-- Patient Tags -->
                    <div v-if="patientData?.patientTags?.length" class="flex items-center gap-2">
                      <div class="flex items-center gap-1">
                        <span v-for="tag in patientData.patientTags" :key="tag.id" 
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              :style="{ backgroundColor: tag.tag?.color + '20', color: tag.tag?.color }">
                          {{ tag.tag?.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleQueueOPD"
                      class="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                      จัดคิว OPD
                    </button>
                
                    <button
                      @click="requestClose"
                      class="text-gray-400 hover:text-red-500 bg-gray-200 rounded-md p-1.5 transition-colors relative"
                    >
                      <X class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="flex h-[calc(100vh-180px)]">
                <!-- Left Panel - Patient Overview -->
                <div class="w-1/5 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
                  <!-- Patient Avatar -->
                  <div class="text-center mb-6">
                    <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-violet-300 to-purple-300 rounded-full flex items-center justify-center overflow-hidden">
                      <!-- Real Image -->
                      <img 
                        v-if="patientData?.profile_image" 
                        :src="patientData.profile_image" 
                        :alt="`รูป ${patientData.first_name} ${patientData.last_name}`"
                        class="w-full h-full object-cover"
                      />
                      <!-- Default Avatar -->
                      <User v-else class="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <!-- Personal Information -->
                  <div class="space-y-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">ข้อมูลส่วนตัว</h4>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-gray-600">วันเกิด:</span>
                          <span class="text-gray-900">{{ formatDate(patientData?.birth_date) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">อายุ:</span>
                          <span class="text-gray-900">{{ calculateAge(patientData?.birth_date) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">เพศ:</span>
                          <span class="text-gray-900">{{ patientData?.gender || '-' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">น้ำหนัก:</span>
                          <span class="text-gray-900">{{ patientData?.weight || '-' }} kg</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">ส่วนสูง:</span>
                          <span class="text-gray-900">{{ patientData?.height || '-' }} cm</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">รอบเอว:</span>
                          <span class="text-gray-900">{{ patientData?.waist || '-' }} cm</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">รอบอก:</span>
                          <span class="text-gray-900">{{ patientData?.chest || '-' }} cm</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">กรุ๊ปเลือด:</span>
                          <span class="text-gray-900">{{ patientData?.blood_group || '-' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">ข้อมูลติดต่อ</h4>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-gray-600">โทร:</span>
                          <span class="text-gray-900">{{ patientData?.phone || '-' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">ชื่อเล่น:</span>
                          <span class="text-gray-900">{{ patientData?.nickname || '-' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Medical Information -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">ข้อมูลการรักษา</h4>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-gray-600">ประเภทการรักษา:</span>
                          <span class="text-gray-900">{{ patientData?.treatment_type || '-' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">ประเภทสิทธิ์:</span>
                          <span class="text-gray-900">{{ patientData?.insuranceType?.name || '-' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Health Information -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">ข้อมูลสุขภาพ</h4>
                      <div class="space-y-2 text-sm">
                        <div>
                          <span class="text-gray-600">ประวัติการแพ้ยา:</span>
                          <p class="text-gray-900 mt-1">{{ patientData?.drug_allergy || '-' }}</p>
                        </div>
                        <div>
                          <span class="text-gray-600">ประวัติสุขภาพจิต:</span>
                          <p class="text-gray-900 mt-1">{{ patientData?.mental_health || '-' }}</p>
                        </div>
                        <div>
                          <span class="text-gray-600">โรคประจำตัว:</span>
                          <p class="text-gray-900 mt-1">{{ patientData?.underlying_disease || '-' }}</p>
                        </div>
                        <div>
                          <span class="text-gray-600">หมายเหตุ:</span>
                          <p class="text-gray-900 mt-1">{{ patientData?.health_note || '-' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Contact Persons -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">ผู้ติดต่อ</h4>
                      <div v-if="patientData?.contactPersons?.length" class="space-y-2">
                        <div v-for="contact in patientData.contactPersons" :key="contact.id" class="text-sm">
                          <div class="flex items-center gap-2">
                            <User class="w-4 h-4 text-gray-400" />
                            <span class="text-gray-900">{{ contact.name }}</span>
                          </div>
                          <div class="ml-6 text-gray-600">{{ contact.phone }} - {{ contact.relationship }}</div>
                        </div>
                      </div>
                      <div v-else class="text-sm text-gray-500">ไม่มีข้อมูลผู้ติดต่อ</div>
                    </div>
                  </div>
                </div>

                <!-- Right Panel - Tabs -->
                <div class="w-4/5 flex flex-col">
                  <!-- Tabs -->
                  <div class="flex-1 flex flex-col">
                    <!-- Tab Navigation -->
                    <div class="flex border-b border-gray-200 bg-white">
                      <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        :class="[
                          'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                          activeTab === tab.id
                            ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]"
                      >
                        {{ tab.name }}
                      </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="flex-1 p-6 bg-white overflow-y-auto">
                      <!-- OPD/IPD Tab -->
                      <div v-if="activeTab === 'opd-ipd'" class="space-y-4">
                        <!-- Search and Filter -->
                        <div class="flex items-center gap-4">
                          <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-600">แสดง</label>
                            <Listbox v-model="pageSizeOption" as="div" class="relative">
                              <div>
                                <ListboxButton
                                  class="px-3 py-1 text-sm bg-white border hover:bg-gray-50 text-gray-700 border-gray-200 rounded-md flex items-center gap-2"
                                >
                                  <span>{{ pageSizeOption.label }}</span>
                                  <ChevronDown class="w-3.5 h-3.5 opacity-60" />
                                </ListboxButton>
                              </div>
                              <transition
                                enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95"
                              >
                                <ListboxOptions
                                  class="absolute right-0 mt-2 z-50 p-1.5 shadow-xl bg-white rounded-lg border border-gray-100 w-full focus:outline-none"
                                >
                                  <ListboxOption
                                    v-for="opt in pageSizeOptions"
                                    :key="opt.value"
                                    :value="opt"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        'px-2 py-1.5 text-sm rounded cursor-pointer flex items-center justify-between',
                                        active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700'
                                      ]"
                                    >
                                      <span>{{ opt.label }}</span>
                                      <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </transition>
                            </Listbox>
                            <span class="text-sm text-gray-600">รายการต่อหน้า</span>
                          </div>
                          <div class="flex-1 relative">
                            <SearchIcon
                              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            />
                            <input
                              v-model.trim="searchQuery"
                              @input="onSearchInput"
                              type="text"
                              placeholder="ค้นหา"
                              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm pl-10 pr-4 
                               bg-white text-gray-700 placeholder-gray-400 
                               focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
                               focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            />
                          </div>
                        </div>

                        <!-- Table -->
                        <div class="overflow-x-auto">
                          <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                              <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">เลขที่</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">วันที่/เวลา</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">แพทย์ผู้ตรวจ</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">การวินิจฉัยโรค</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">จุดบริการ</th>
                              </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                              <tr v-for="(visit, index) in mockVisits" :key="index" class="hover:bg-gray-50">
                                <td class="px-4 py-2 text-sm text-gray-900">{{ index + 1 }}</td>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ visit.visitNumber }}</td>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ visit.dateTime }}</td>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ visit.doctor }}</td>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ visit.diagnosis || '-' }}</td>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ visit.location }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <!-- Pagination -->
                        <div class="flex items-center justify-between">
                          <div class="text-sm text-gray-700">
                            แสดง 1 ถึง 2 ทั้งหมด 2 รายการ
                          </div>
                          <div class="flex items-center gap-2">
                            <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                              &lt;&lt;
                            </button>
                            <button class="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm">
                              1
                            </button>
                            <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                              &gt;&gt;
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Other Tabs -->
                      <div v-else class="text-center text-gray-500 py-12">
                        <div class="text-4xl mb-4">📋</div>
                        <p>แท็บ "{{ tabs.find(t => t.id === activeTab)?.name }}" กำลังพัฒนา</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </TransitionRoot>
</template>

<script>
import { Dialog as HeadlessDialog, DialogPanel, TransitionRoot, TransitionChild, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { X, User, Star, Wallet, UserRound, ChevronDown, SearchIcon } from 'lucide-vue-next'

export default {
  name: 'PatientDetailModal',
  components: {
    HeadlessDialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    X,
    User,
    Star,
    Wallet,
    UserRound,
    ChevronDown,
    SearchIcon
  },
  props: {
    modelValue: { type: Boolean, required: true },
    patientData: { type: Object, default: null }
  },
  emits: ['update:modelValue', 'queue-opd', 'queue-ipd', 'queue-service', 'add-receipt'],
  data() {
    return {
      activeTab: 'opd-ipd',
      pageSizeOptions: [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 }
      ],
      pageSizeOption: { label: '10', value: 10 },
      searchQuery: '',
      searchTimer: null,
      tabs: [
        { id: 'opd-ipd', name: 'OPD/IPD' },
        // { id: 'invoice', name: 'ใบแจ้งหนี้' },
        // { id: 'receipt', name: 'ใบเสร็จ' },
        // { id: 'lab', name: 'ตรวจ/LAB/X-Ray' },
        // { id: 'course', name: 'คอร์สคงเหลือ' },
        // { id: 'appointment', name: 'นัดหมาย' }
      ],
      mockVisits: [
        {
          visitNumber: 'OPD0130-1',
          dateTime: '24/10/2025 14:51',
          doctor: 'น.พ.อนันตพัฒน์ สี่หิรัญวงศ์',
          diagnosis: '1. A57 แผลริมอ่อน',
          location: 'โรงพยาบาลซีเมดลีฟวิ่งแคร์'
        },
        {
          visitNumber: 'OPD0065-1',
          dateTime: '10/04/2025 13:32',
          doctor: 'น.พ.อนันตพัฒน์ สี่หิรัญวงศ์',
          diagnosis: '',
          location: 'โรงพยาบาลซีเมดลีฟวิ่งแคร์'
        }
      ]
    }
  },
  methods: {
    requestClose() {
      this.$emit('update:modelValue', false)
    },
    onSearchInput() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        // TODO: Implement search functionality
        console.log('Searching for:', this.searchQuery)
      }, 300)
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('th-TH')
    },
    calculateAge(birthDate) {
      if (!birthDate) return '-'
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      
      return `${age} ปี`
    },
    handleQueueOPD() {
      // Navigate to OPD Queue page with patient data
      const patientData = encodeURIComponent(JSON.stringify(this.patientData))
      this.$router.push({
        path: '/main/queue/opd',
        query: { patient: patientData }
      })
      this.$emit('update:modelValue', false)
    }
  },
  beforeUnmount() {
    // Cleanup search timer
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  }
}
</script>

<style scoped></style>
