<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">คิวตรวจ OPD</h1>
      </div>
      
    </div>

    <!-- Search and Filter Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
       <!-- Filter Row 1 -->
       <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
         <!-- Patient Search -->
         <div class="md:col-span-2">
           <label class="block text-sm font-medium text-gray-700 mb-1">เลือกผู้ป่วย</label>
           <div class="relative">
             <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input
               v-model.trim="patientSearchQuery"
               @input="onPatientSearchInput"
               type="text"
               :placeholder="selectedPatient ? `${selectedPatient.hn} - ${selectedPatient.prefix} ${selectedPatient.first_name} ${selectedPatient.last_name}` : 'ค้นหา HN, ชื่อ, บัตรประชาชน'"
               class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm pl-10 pr-10 
                 bg-white text-gray-700 placeholder-gray-400 
                 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
                 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
             />
             <!-- Clear Patient Button -->
             <button
               v-if="selectedPatient"
               @click="clearSelectedPatient"
               class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
             >
               <X class="w-4 h-4" />
             </button>
           </div>
           
           <!-- Patient Search Results -->
           <div v-if="patientSearchResults.length > 0" class="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg">
             <div
               v-for="patient in patientSearchResults"
               :key="patient.id"
               @click="selectPatient(patient)"
               class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
             >
               <div class="flex items-center gap-3">
                 <div class="w-6 h-6 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center">
                   <UserRound class="w-3 h-3 text-white" />
                 </div>
                 <div class="flex-1">
                   <div class="text-sm font-medium text-gray-900">
                     {{ patient.hn }} - {{ patient.prefix }} {{ patient.first_name }} {{ patient.last_name }}
                   </div>
                   <div class="text-xs text-gray-500">
                     {{ patient.national_id }}
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
         
         </div>

        <!-- Doctor Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">แพทย์</label>
          <Listbox v-model="selectedDoctor" as="div" class="relative">
            <div>
              <ListboxButton
                class="relative w-full text-sm  cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              >
                <span class="block truncate">{{ selectedDoctor?.name || '- เลือกแพทย์ -' }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown class="h-5 w-5 text-gray-400" />
                </span>
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
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  :value="doctor"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pr-4',
                      selected ? 'pl-10' : 'pl-3'
                    ]"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      {{ doctor.name }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                    >
                      <Check class="h-5 w-5" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>

        <!-- Room Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ห้อง</label>
          <Listbox v-model="selectedRoom" as="div" class="relative">
            <div>
              <ListboxButton
                class="relative w-full  text-sm  cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              >
                <span class="block truncate">{{ selectedRoom?.name || '- เลือกห้อง -' }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown class="h-5 w-5 text-gray-400" />
                </span>
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
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-for="room in rooms"
                  :key="room.id"
                  :value="room"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pr-4',
                      selected ? 'pl-10' : 'pl-3'
                    ]"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      {{ room.name }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                    >
                      <Check class="h-5 w-5" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>

        <!-- Date Picker -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
          <VueDatePicker
            v-model="selectedDate"
            :format="'dd/MM/yyyy'"
            :enable-time-picker="false"
            :clearable="true"
            placeholder="เลือกวันที่"
            class="w-full text-sm"
          />
        </div>

         <!-- Add Button -->
         <div class="flex items-end">
           <button
             class="w-full px-3 py-2 text-sm bg-purple-400 text-white rounded-md hover:bg-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
             :disabled="!selectedPatient"
             @click="openCreateQueue"
           >
             <Plus class="w-4 h-4 inline mr-1" />
             เพิ่มคิว
           </button>
         </div>
      </div>

      <!-- Filter Row 2 -->
      <div class="flex justify-end gap-4">
        <!-- General Search -->
        <div class="w-80">
          <label class="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model.trim="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="ค้นหาชื่อลูกค้า / เลขบัตรประชาชน"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm pl-10 pr-4 
                bg-white text-gray-700 placeholder-gray-400 
                focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
                focus:outline-none transition-colors duration-200 hover:border-emerald-400"
            />
          </div>
        </div>

        <!-- Page Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">แสดง</label>
          <Listbox v-model="pageSizeOption" as="div" class="relative">
            <div>
              <ListboxButton
                class="px-4 py-2 text-sm bg-white border hover:bg-gray-50 text-gray-700 border-gray-200 rounded-md flex items-center gap-2"
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
                class="absolute right-0 mt-2 z-50 p-1.5 shadow-xl bg-white rounded-lg border border-gray-100 w-32 focus:outline-none"
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
        </div>

        <!-- Status Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
          <Listbox v-model="selectedStatus" as="div" class="relative">
            <div>
              <ListboxButton
                class="relative text-sm w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              >
                <span class="block truncate">{{ selectedStatus?.label || '- เลือกสถานะ -' }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown class="h-5 w-5 text-gray-400" />
                </span>
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
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-for="status in statusOptions"
                  :key="status.value"
                  :value="status"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pr-4',
                      selected ? 'pl-10' : 'pl-3'
                    ]"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      {{ status.label }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                    >
                      <Check class="h-5 w-5" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>
      </div>
    </div>

    <!-- Queue Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <!-- <div class="overflow-x-auto"> -->
        <div >

        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">เลขที่/ประเภท</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">แผนก</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">ห้อง/แพทย์</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">ชื่อลูกค้า</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">สถานะ</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">ตัวเลือก</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading skeleton -->
            <template v-if="loading">
              <tr v-for="n in 5" :key="'skeleton-' + n">
                <td class="px-4 py-3">
                  <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-28 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-36 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-6 w-20 bg-gray-100 animate-pulse rounded-full"></div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="h-8 w-24 bg-gray-100 animate-pulse rounded ml-auto"></div>
                </td>
              </tr>
            </template>

            <!-- Queue Rows -->
            <template v-if="!loading">
              <tr v-for="queue in queues" :key="queue.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ queue.queueNumber }}</div>
                      <div class="text-xs text-gray-500">รหัสคิว : {{ queue.queueCode }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <div class="text-sm text-gray-900">{{ queue.department }}</div>
                    <div class="text-xs text-gray-500">{{ formatDateTime(queue.createdAt) }}</div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <div class="text-sm text-gray-900">{{ queue.room }}</div>
                    <div class="text-xs text-gray-500">{{ queue.doctor }}</div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center">
                      <UserRound class="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ queue.patientName }}</div>
                      <div class="text-xs text-gray-500">{{ queue.patientId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded-full',
                        queue.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ getStatusLabel(queue.status) }}
                    </button>
                    <div class="flex gap-1">
                      <button class="p-1 text-gray-400 hover:text-gray-600" disabled>
                        <Hand class="w-4 h-4" />
                      </button>
                      <button class="p-1 text-gray-400 hover:text-gray-600" disabled>
                        <DollarSign class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="relative inline-block text-left">
                    <Menu as="div" class="relative">
                      <MenuButton
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-blue-200 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        ทำรายการ
                        <ChevronDown class="w-3 h-3" />
                      </MenuButton>

                      <MenuItems
                        class="absolute right-0 z-50 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <button
                              @click="viewQueue(queue)"
                              :class="[
                                active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700',
                                'flex items-center gap-2 w-full px-4 py-2 text-sm'
                              ]"
                            >
                              <Eye class="w-4 h-4" />
                              ดูรายละเอียด
                            </button>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <button
                              @click="editQueue(queue)"
                              :class="[
                                active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                                'flex items-center gap-2 w-full px-4 py-2 text-sm'
                              ]"
                            >
                              <Pencil class="w-4 h-4" />
                              แก้ไข
                            </button>
                          </MenuItem>
                          <div class="border-t border-gray-100"></div>
                          <MenuItem v-slot="{ active }">
                            <button
                              @click="cancelQueue(queue)"
                              :class="[
                                active ? 'bg-red-50 text-red-700' : 'text-red-700',
                                'flex items-center gap-2 w-full px-4 py-2 text-sm'
                              ]"
                            >
                              <X class="w-4 h-4" />
                              ยกเลิกคิว
                            </button>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-if="!loading && queues.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500 text-sm">
                ไม่พบข้อมูลคิว
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm">
        <div class="text-gray-600">
          แสดง
          <span class="mx-1 text-gray-900 font-medium">{{ from }}</span>
          -
          <span class="mx-1 text-gray-900 font-medium">{{ to }}</span>
          จากทั้งหมด
          <span class="mx-1 text-gray-900 font-medium">{{ meta.total }}</span>
          รายการ
        </div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="meta.page <= 1 || loading"
            @click="go(meta.page - 1)"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            ก่อนหน้า
          </button>
          <span class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md text-gray-700">
            หน้า <span class="text-gray-900 font-medium">{{ meta.page }}</span> / {{ totalPages }}
          </span>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="meta.page >= totalPages || loading"
            @click="go(meta.page + 1)"
          >
            ถัดไป
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  UserRound,
  X,
  Check,
  Eye,
  Pencil,
  Hand,
  DollarSign
} from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'OPDQueue',
  components: {
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    SearchIcon,
    UserRound,
    X,
    Check,
    Eye,
    Pencil,
    Hand,
    DollarSign,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    VueDatePicker
  },
  data() {
    return {
      loading: false,
      searchQuery: '',
      searchTimer: null,
      patientSearchQuery: '',
      patientSearchTimer: null,
      patientSearchResults: [],
      selectedPatient: null,
      selectedDoctor: null,
      selectedRoom: null,
      selectedDate: new Date(),
      selectedStatus: null,
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 }
      ],
      meta: { page: 1, totalPages: 1, total: 0 },
      prefilledPatient: null,
      
      // Mock Data
      doctors: [
        { id: 1, name: 'น.พ.อนันตพัฒน์ สี่หิรัญวงศ์' },
        { id: 2, name: 'น.พ.สมชาย ใจดี' },
        { id: 3, name: 'น.พ.สมหญิง รักงาน' }
      ],
      rooms: [
        { id: 1, name: 'ห้องพบแพทย์ 1' },
        { id: 2, name: 'ห้องพบแพทย์ 2' },
        { id: 3, name: 'ห้องตรวจ 1' }
      ],
   
      statusOptions: [
        { label: 'รอตรวจ', value: 'waiting' },
        { label: 'กำลังตรวจ', value: 'examining' },
        { label: 'เสร็จสิ้น', value: 'completed' },
        { label: 'ยกเลิก', value: 'cancelled' }
      ],
      queues: [
        {
          id: 1,
          queueNumber: 'OPD0130',
          queueCode: 'OPD0001',
          queueType: 'OPD',
          department: 'ห้องใช้บริการ',
          room: '1 ห้องพบแพทย์ 1/1',
          doctor: 'น.พ.อนันตพัฒน์ สี่หิรัญวงศ์',
          patientName: 'นาย วิชิต สุรดินทร์กูร',
          patientId: '111640121',
          status: 'cancelled',
          createdAt: '2025-10-24T14:47:00Z'
        }
      ]
    }
  },
  computed: {
    from() {
      if (this.meta.total === 0) return 0
      return (this.meta.page - 1) * this.pageSizeOption.value + 1
    },
    to() {
      return Math.min(this.meta.page * this.pageSizeOption.value, this.meta.total)
    },
    totalPages() {
      if (this.pageSizeOption.value <= 0) return 1
      return Math.max(1, Math.ceil(this.meta.total / this.pageSizeOption.value))
    }
  },
  methods: {
    onSearchInput() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadQueues()
      }, 300)
    },
    onPatientSearchInput() {
      clearTimeout(this.patientSearchTimer)
      this.patientSearchTimer = setTimeout(() => {
        this.searchPatients()
      }, 300)
    },
    searchPatients() {
      if (!this.patientSearchQuery.trim()) {
        this.patientSearchResults = []
        return
      }
      
      console.log('Searching patients with:', this.patientSearchQuery)
      // TODO: Implement actual patient search API
      // Mock data for now
      this.patientSearchResults = [
        {
          id: 1,
          hn: 'HN001',
          prefix: 'นาย',
          first_name: 'วิชิต',
          last_name: 'สุรดินทร์กูร',
          national_id: '111640121',
          patientGroup: { name: 'VIP' }
        },
        {
          id: 2,
          hn: 'HN002',
          prefix: 'นาง',
          first_name: 'สมหญิง',
          last_name: 'ใจดี',
          national_id: '222640121',
          patientGroup: { name: 'ทั่วไป' }
        }
      ]
    },
    selectPatient(patient) {
      this.selectedPatient = patient
      this.patientSearchQuery = ''
      this.patientSearchResults = []
    },
    clearSelectedPatient() {
      this.selectedPatient = null
      this.patientSearchQuery = ''
    },
    openCreateQueue() {
      if (!this.selectedPatient) {
        console.log('No patient selected')
        return
      }
      console.log('Opening create queue modal for patient:', this.selectedPatient)
      // TODO: Open create queue modal with selected patient
    },
    clearPrefilledPatient() {
      this.prefilledPatient = null
      this.selectedPatient = null
      this.patientSearchQuery = ''
    },
    formatDateTime(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return d.toLocaleDateString('th-TH') + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    },
    getStatusLabel(status) {
      const statusMap = {
        waiting: 'รอตรวจ',
        examining: 'กำลังตรวจ',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก'
      }
      return statusMap[status] || status
    },
    viewQueue(queue) {
      console.log('View queue:', queue)
    },
    editQueue(queue) {
      console.log('Edit queue:', queue)
    },
    cancelQueue(queue) {
      console.log('Cancel queue:', queue)
    },
    go(page) {
      if (page < 1 || page > this.totalPages) return
      this.meta.page = page
      this.loadQueues()
    },
    loadQueues() {
      console.log('Loading queues with filters:', {
        searchQuery: this.searchQuery,
        doctor: this.selectedDoctor,
        room: this.selectedRoom,
        date: this.selectedDate,
        status: this.selectedStatus
      })
      // TODO: Load queues from API with filters
      this.meta.total = this.queues.length
    }
  },
  mounted() {
    // Check if patient data was passed from previous page
    if (this.$route.query.patient) {
      try {
        this.prefilledPatient = JSON.parse(decodeURIComponent(this.$route.query.patient))
        this.selectedPatient = this.prefilledPatient
      } catch (e) {
        console.error('Error parsing patient data:', e)
      }
    }
    this.loadQueues()
  },
  beforeUnmount() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    if (this.patientSearchTimer) {
      clearTimeout(this.patientSearchTimer)
    }
  }
}
</script>

<style scoped>
:deep(.dp-custom-input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  height: 38px;
  font-size: 0.875rem;
}

:deep(.dp-custom-input:hover) {
  border-color: #10b981;
}

:deep(.dp-custom-input:focus) {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.3);
}

:deep(.dp__input_wrap) {
  height: 38px;
}

:deep(.dp__input) {
  height: 38px;
  padding: 0.5rem 0.75rem;
  padding-left: 2.5rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

:deep(.dp__input:hover) {
  border-color: #10b981;
}

:deep(.dp__input:focus) {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.3);
}

:deep(.dp__input_icon) {
  left: 0.5rem;
  right: auto;
}

:deep(.dp__input_icon_pad) {
  padding-left: 2.5rem;
}
</style>
