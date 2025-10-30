<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">คิวตรวจ OPD</h1>
      </div>
    </div>

    <!-- Create Queue Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- Patient Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">เลือกผู้ป่วย</label>
          <div class="relative">
            <div class="relative">
              <SearchIcon
                v-if="!isSearchingPatients"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <div v-else class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-emerald-500"
                ></div>
              </div>
              <input
                :value="
                  selectedPatient
                    ? `${selectedPatient.hn} - ${selectedPatient.prefix || ''} ${selectedPatient.first_name} ${selectedPatient.last_name}`
                    : patientSearchQuery
                "
                @input="onPatientSearchInput"
                @focus="onPatientSearchFocus"
                @blur="onPatientSearchBlur"
                @keydown.escape="showPatientResults = false"
                @keydown.enter="onPatientSearchEnter"
                type="text"
                :placeholder="
                  selectedPatient
                    ? `${selectedPatient.hn} - ${selectedPatient.prefix || ''} ${selectedPatient.first_name} ${selectedPatient.last_name}`
                    : 'ค้นหา HN, ชื่อ, บัตรประชาชน'
                "
                :class="[
                  'patient-search-input w-full px-3 py-2 text-sm border rounded-lg shadow-sm pl-10 pr-10 transition-colors duration-200 focus:outline-none',
                  selectedPatient
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : 'border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 hover:border-emerald-400',
                ]"
                :readonly="!!selectedPatient"
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

            <TransitionRoot
              :show="showPatientResults"
              as="template"
              enter="transition ease-out duration-100"
              enter-from="transform opacity-0 scale-95"
              enter-to="transform opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leave-from="transform opacity-100 scale-100"
              leave-to="transform opacity-0 scale-95"
            >
              <div
                class="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg focus:outline-none"
              >
                <!-- Loading State -->
                <div
                  v-if="isSearchingPatients"
                  class="px-3 py-2 text-sm text-gray-500 text-center flex items-center justify-center gap-2"
                >
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-emerald-500"
                  ></div>
                  กำลังค้นหา...
                </div>
                <!-- Empty State -->
                <div
                  v-else-if="filteredPatients.length === 0 && patientSearchQuery !== ''"
                  class="px-3 py-2 text-sm text-gray-500 text-center"
                >
                  <div class="flex flex-col items-center gap-2">
                    <UserRound class="w-8 h-8 text-gray-300" />
                    <div>ไม่พบผู้ป่วยที่ค้นหา</div>
                    <div class="text-xs text-gray-400">ลองค้นหาด้วย HN หรือชื่อ</div>
                  </div>
                </div>
                <!-- No Search Query -->
                <div
                  v-else-if="!patientSearchQuery.trim()"
                  class="px-3 py-2 text-sm text-gray-500 text-center"
                >
                  <div class="flex flex-col items-center gap-2">
                    <SearchIcon class="w-8 h-8 text-gray-300" />
                    <div>เริ่มพิมพ์เพื่อค้นหาผู้ป่วย</div>
                  </div>
                </div>
                <!-- Search Results -->
                <div
                  v-for="patient in filteredPatients"
                  :key="patient.id"
                  @click="selectPatient(patient)"
                  class="relative cursor-pointer select-none py-3 px-3 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-900 text-gray-900"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <UserRound class="w-4 h-4 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div
                        class="text-sm font-medium truncate"
                        v-tooltip:top="
                          `${patient.hn} - ${patient.prefix || ''} ${patient.first_name} ${patient.last_name}`
                        "
                      >
                        <span class="font-semibold text-gray-900">{{ patient.hn }}</span>
                        <span class="text-gray-600">
                          - {{ patient.prefix || '' }} {{ patient.first_name }}
                          {{ patient.last_name }}</span
                        >
                      </div>
                      <div
                        class="text-xs text-gray-500 truncate mt-1"
                        v-tooltip:top="patient.national_id"
                      >
                        บัตรประชาชน: {{ patient.national_id }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionRoot>
          </div>
        </div>

        <!-- Doctor Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">แพทย์</label>
          <Listbox v-model="selectedDoctor" as="div" class="relative">
            <div>
              <ListboxButton
                class="relative w-full text-sm cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
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
                class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-full focus:outline-none"
              >
                <!-- Debug info -->
                <div v-if="doctors.length === 0" class="px-3 py-2 text-sm text-gray-500">
                  ไม่พบข้อมูลแพทย์ ({{ doctors.length }} รายการ)
                </div>
                <ListboxOption
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  :value="doctor"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                      active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
                    ]"
                  >
                    <span class="block truncate">{{ doctor.name }}</span>
                    <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>

        <!-- Department Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
          <Listbox v-model="selectedDepartment" as="div" class="relative">
            <div>
              <ListboxButton
                class="relative w-full text-sm cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              >
                <span class="block truncate">{{
                  selectedDepartment?.name || '- เลือกแผนก -'
                }}</span>
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
                class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-full focus:outline-none"
              >
                <ListboxOption
                  v-for="department in departments"
                  :key="department.id"
                  :value="department"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                      active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
                    ]"
                  >
                    <span class="block truncate">{{ department.name }}</span>
                    <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
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
            :disabled="!selectedPatient || !selectedDoctor || !selectedDepartment"
            @click="openCreateQueue"
          >
            <Plus class="w-4 h-4 inline mr-1" />
            เพิ่มคิว
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex justify-end gap-4">
        <!-- General Search -->
        <div class="w-80">
          <label class="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
          <div class="relative">
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              v-model.trim="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="ค้นหาชื่อลูกค้า / เลขบัตรประชาชน"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm pl-10 pr-4 bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
            />
          </div>
        </div>

        <!-- Page Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">แสดง</label>
          <Listbox v-model="pageSizeOption" as="div" class="relative">
            <div>
              <ListboxButton
                class="relative text-sm w-full min-w-36 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              >
                <span class="block truncate">{{ pageSizeOption?.label || '- เลือกจำนวน -' }}</span>
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
                class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-48 focus:outline-none"
              >
                <ListboxOption
                  v-for="opt in pageSizeOptions"
                  :key="opt.value"
                  :value="opt"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                      active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
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
                class="px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full"
              >
                <span>{{ selectedStatus?.label || '- เลือกสถานะ -' }}</span>
                <ChevronDown class="w-5 h-5 text-gray-400" />
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
                class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-48 focus:outline-none"
              >
                <ListboxOption
                  v-for="status in statusOptions"
                  :key="status.value"
                  :value="status"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                      active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
                    ]"
                  >
                    <span>{{ status.label }}</span>
                    <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
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
      <div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">เลขที่</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">แผนก</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">แพทย์</th>
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
                    <div
                      :class="[
                        'w-2.5 h-2.5 rounded-full',
                        queue.status === 'WAITING'
                          ? 'bg-yellow-500'
                          : queue.status === 'EXAMINING'
                            ? 'bg-blue-500'
                            : queue.status === 'COMPLETED'
                              ? 'bg-green-500'
                              : queue.status === 'CANCELLED'
                                ? 'bg-red-500'
                                : 'bg-gray-500',
                      ]"
                    ></div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">Queue: {{ queue.queueNumber }}</div>
                      <div class="text-sm font-medium text-gray-500">VN: {{ queue.registration?.vnNumber || '-' }}</div>
                      <div class="text-sm font-medium text-gray-500">OPD: {{ queue.registration?.opdNumber || '-' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <div class="text-sm text-gray-900">{{ queue.department?.name || '-' }}</div>
                    <div class="text-xs text-gray-500">
                      {{ formatDateTime(queue.createdAt) }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-900">
                    {{ queue.registration?.doctor?.name || '-' }}
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center"
                    >
                      <UserRound class="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ queue.registration?.patient?.prefix || '' }}
                        {{ queue.registration?.patient?.first_name || '' }}
                        {{ queue.registration?.patient?.last_name || '' }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ queue.registration?.patient?.hn || '-' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded-full',
                        queue.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : queue.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : queue.status === 'EXAMINING'
                              ? 'bg-blue-100 text-blue-800'
                              : queue.status === 'WAITING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800',
                      ]"
                    >
                      {{ getStatusLabel(queue.status) }}
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center gap-2 justify-end">
                    <!-- ทำรายการ Button -->
                    <button
                      @click="openOPDManagement(queue)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <Navigation class="w-3.5 h-3.5" />
                      ทำรายการ
                    </button>

                    <!-- Cancel Button -->
                    <button
                      @click="cancelQueue(queue)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 rounded-md bg-white text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <X class="w-3.5 h-3.5" />
                      ยกเลิก
                    </button>
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
      <div
        class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm"
      >
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
          <span
            class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md text-gray-700"
          >
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
  Navigation,
} from 'lucide-vue-next'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import departmentService from '@/services/department.js'
import { userService } from '@/services/user.js'
import patientService from '@/services/patient.js'
import queueService from '@/services/queue.js'
import { createRegistrationWithQueue } from '@/services/registrationWithQueue.js'
import { useAuthStore } from '@/stores/auth.js'
import Swal from 'sweetalert2'

export default {
  name: 'OPDQueue',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  components: {
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    SearchIcon,
    UserRound,
    X,
    Check,
    Navigation,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TransitionRoot,
    VueDatePicker,
  },
  data() {
    return {
      loading: false,
      searchQuery: '',
      searchTimer: null,
      patientSearchQuery: '',
      patientSearchTimer: null,
      patientSearchResults: [],
      isSearchingPatients: false,
      showPatientResults: false,
      selectedPatient: null,
      selectedDoctor: null,
      selectedDepartment: null,
      selectedDate: new Date(),
      selectedStatus: null,
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 },
      ],
      meta: { page: 1, totalPages: 1, total: 0 },
      prefilledPatient: null,

      // Data
      doctors: [],
      departments: [],

      statusOptions: [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'รอตรวจ', value: 'WAITING' },
        { label: 'กำลังตรวจ', value: 'EXAMINING' },
        { label: 'เสร็จสิ้น', value: 'COMPLETED' },
        { label: 'ยกเลิก', value: 'CANCELLED' },
        { label: 'ไม่มา', value: 'NO_SHOW' },
      ],
      queues: [],
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
    },
    // สำหรับ Headless UI Combobox
    filteredPatients() {
      return this.patientSearchResults
    },
    // Best Practice: Centralized parameters for API calls
    queueParams() {
      const currentBranchId = this.authStore.currentBranch?.id || this.authStore.user?.branchId
      return {
        page: this.meta.page,
        limit: this.pageSizeOption.value,
        search: this.searchQuery,
        status: this.selectedStatus?.value || 'all',
        queueType: 'OPD',
        branchId: currentBranchId,
        sort: 'createdAt',
        order: 'desc',
      }
    },
  },
  methods: {
    onSearchInput() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadQueues()
      }, 300)
    },
    onPatientSearchInput(event) {
      this.patientSearchQuery = event.target.value

      // ถ้าผู้ใช้เริ่มพิมพ์ใหม่ ให้ล้างข้อมูลผู้ป่วยที่เลือกไว้
      if (this.selectedPatient) {
        const selectedDisplayName = `${this.selectedPatient.hn} - ${this.selectedPatient.prefix || ''} ${this.selectedPatient.first_name} ${this.selectedPatient.last_name}`
        if (this.patientSearchQuery !== selectedDisplayName) {
          this.selectedPatient = null
        }
      }

      clearTimeout(this.patientSearchTimer)
      this.patientSearchTimer = setTimeout(() => {
        this.searchPatients()
      }, 300)
    },
    onPatientSearchFocus() {
      this.showPatientResults = true
      // ถ้ามี query อยู่แล้วให้ค้นหาทันที
      if (this.patientSearchQuery.trim()) {
        this.searchPatients()
      }
    },
    onPatientSearchBlur() {
      // หน่วงเวลาการปิด dropdown เพื่อให้เวลาคลิกเลือก
      setTimeout(() => {
        this.showPatientResults = false
      }, 200)
    },
    onPatientSearchEnter(event) {
      // ป้องกันการ submit form และเรียกค้นหาทันที
      event.preventDefault()
      if (this.patientSearchQuery.trim()) {
        this.searchPatients()
      }
    },
    selectPatient(patient) {
      this.selectedPatient = patient
      // ล้าง search query และ results เมื่อเลือกผู้ป่วย
      this.patientSearchQuery = ''
      this.patientSearchResults = []
      this.showPatientResults = false
    },
    async searchPatients() {
      if (!this.patientSearchQuery.trim()) {
        this.patientSearchResults = []
        this.isSearchingPatients = false
        return
      }

      this.isSearchingPatients = true

      try {
        const currentBranchId = this.authStore.currentBranch?.id || this.authStore.user?.branchId

        if (!currentBranchId) {
          console.warn('⚠️ No branch ID found')
          this.patientSearchResults = []
          return
        }

        const response = await patientService.searchForDropdown(
          this.patientSearchQuery,
          currentBranchId,
          10,
        )

        this.patientSearchResults = response.data || []
        this.showPatientResults = true
      } catch (error) {
        console.error('❌ Error searching patients:', error)
        this.patientSearchResults = []
      } finally {
        this.isSearchingPatients = false
      }
    },
    clearSelectedPatient() {
      this.selectedPatient = null
      this.patientSearchQuery = ''
      this.patientSearchResults = []
      this.showPatientResults = false
    },
    async openCreateQueue() {
      if (!this.selectedPatient) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกผู้ป่วย',
          text: 'คุณต้องเลือกผู้ป่วยก่อนสร้างคิว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#8b5cf6',
        })
        return
      }

      if (!this.selectedDoctor) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกแพทย์',
          text: 'คุณต้องเลือกแพทย์ก่อนสร้างคิว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#8b5cf6',
        })
        return
      }

      if (!this.selectedDepartment) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกแผนก',
          text: 'คุณต้องเลือกแผนกก่อนสร้างคิว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#8b5cf6',
        })
        return
      }

      // แสดงข้อมูลที่จะสร้างคิว
      const patientName = `${this.selectedPatient.prefix || ''} ${this.selectedPatient.first_name} ${this.selectedPatient.last_name}`

      const result = await Swal.fire({
        title: 'ยืนยันการสร้างคิว',
        html: `
          <div class="text-left">
            <div class="mb-3">
              <strong>ผู้ป่วย:</strong> ${this.selectedPatient.hn} - ${patientName}
            </div>
            <div class="mb-3">
              <strong>แพทย์:</strong> ${this.selectedDoctor.name}
            </div>
            <div class="mb-3">
              <strong>แผนก:</strong> ${this.selectedDepartment.name}
            </div>
            <div class="mb-3">
              <strong>ประเภทคิว:</strong> OPD
            </div>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'สร้างคิว',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#8b5cf6',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      })

      if (!result.isConfirmed) {
        return
      }

      // แสดง loading
      Swal.fire({
        title: 'กำลังสร้างคิว...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      try {
        const currentBranchId = this.authStore.currentBranch?.id || this.authStore.user?.branchId

        if (!currentBranchId) {
          throw new Error('ไม่พบข้อมูลสาขา')
        }

        const response = await createRegistrationWithQueue({
          patientId: this.selectedPatient.id,
          doctorId: this.selectedDoctor.id,
          departmentId: this.selectedDepartment.id,
          branchId: currentBranchId,
          queueType: 'OPD',
          createdDate: this.selectedDate,
        })

        // รีเฟรชข้อมูลคิว
        await this.loadQueues()

        // ล้างข้อมูลที่เลือก
        this.selectedPatient = null
        this.selectedDoctor = null
        this.selectedDepartment = null

        // แสดงข้อความสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'สร้างคิวสำเร็จ!',
          text: `คิวหมายเลข ${response.data.queue.queueNumber} ถูกสร้างเรียบร้อยแล้ว`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
      } catch (error) {
        console.error('❌ Error creating registration with queue:', error)

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.response?.data?.message || error.message || 'ไม่สามารถสร้างคิวได้',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      }
    },
    async loadQueues() {
      this.loading = true

      try {
        // Best Practice: Use computed property
        const params = this.queueParams
        if (!params.branchId) {
          console.warn('⚠️ No branch ID found')
          this.queues = []
          this.meta.total = 0
          return
        }

        const response = await queueService.getAllQueues(params)
        this.queues = response.data || []
        this.meta.total = response.pagination?.total || 0
        this.meta.totalPages = response.pagination?.totalPages || 1
      } catch (error) {
        console.error('❌ Error loading queues:', error)
        this.queues = []
        this.meta.total = 0

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลคิวได้',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      } finally {
        this.loading = false
      }
    },
    clearPrefilledPatient() {
      this.prefilledPatient = null
      this.selectedPatient = null
      this.patientSearchQuery = ''
    },
    formatDateTime(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return (
        d.toLocaleDateString('th-TH') +
        ' ' +
        d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      )
    },
    getStatusLabel(status) {
      const statusMap = {
        WAITING: 'รอตรวจ',
        EXAMINING: 'กำลังตรวจ',
        COMPLETED: 'เสร็จสิ้น',
        CANCELLED: 'ยกเลิก',
        NO_SHOW: 'ไม่มา',
      }
      return statusMap[status] || status
    },
    openOPDManagement(queue) {
      // Navigate to OPD Management page with queue data
      this.$router.push({
        name: 'OPDManagement',
        params: { queueId: queue.id },
        query: {
          queueNumber: queue.queueNumber,
          vnNumber: queue.registration?.vnNumber,
          patientId: queue.registration?.patient?.id,
        },
      })
    },
    cancelQueue(queue) {
      Swal.fire({
        title: 'ยืนยันการยกเลิกคิว',
        html: `
          <div class="text-left">
            <div class="mb-3">
              <strong>หมายเลขคิว:</strong> ${queue.queueNumber}
            </div>
            <div class="mb-3">
              <strong>ผู้ป่วย:</strong> ${queue.registration?.patient?.hn || '-'} - ${queue.registration?.patient?.prefix || ''} ${queue.registration?.patient?.first_name || ''} ${queue.registration?.patient?.last_name || ''}
            </div>
            <div class="mb-3">
              <strong>แผนก:</strong> ${queue.department?.name || '-'}
            </div>
            <div class="mb-3">
              <strong>แพทย์:</strong> ${queue.registration?.doctor?.name || '-'}
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">เหตุผลในการยกเลิก:</label>
            <textarea 
              id="cancelReason" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
              rows="3" 
              placeholder="กรุณาระบุเหตุผลในการยกเลิกคิว..."
            ></textarea>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยกเลิกคิว',
        cancelButtonText: 'ไม่ยกเลิก',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        preConfirm: () => {
          const reason = document.getElementById('cancelReason').value.trim()
          if (!reason) {
            Swal.showValidationMessage('กรุณาระบุเหตุผลในการยกเลิกคิว')
            return false
          }
          return reason
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const reason = result.value

          // แสดง loading
          Swal.fire({
            title: 'กำลังยกเลิกคิว...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })

          try {
            // Call cancel queue API
            await queueService.cancelQueue(queue.id, reason)

            // รีเฟรชข้อมูลคิว
            await this.loadQueues()

            // แสดงข้อความสำเร็จ
            Swal.fire({
              icon: 'success',
              title: 'ยกเลิกคิวสำเร็จ!',
              text: `คิวหมายเลข ${queue.queueNumber} ถูกยกเลิกเรียบร้อยแล้ว`,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } catch (error) {
            console.error('❌ Error cancelling queue:', error)

            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: error.response?.data?.message || 'ไม่สามารถยกเลิกคิวได้',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            })
          }
        }
      })
    },
    go(page) {
      if (page < 1 || page > this.totalPages) return
      this.meta.page = page
      // No need to call loadQueues() - watcher will handle it automatically
    },
    async loadDepartments() {
      try {
        const response = await departmentService.getAllForDropdown()
        this.departments = response.data
      } catch (error) {
        console.error('❌ Error loading departments:', error)
      }
    },
    async loadDoctors() {
      try {
        const doctors = await userService.getAllDoctorsForDropdown()
        this.doctors = doctors
      } catch (error) {
        console.error('❌ Error loading doctors:', error)
      }
    },
  },
  watch: {
    selectedPatient(newPatient, oldPatient) {
      if (newPatient && newPatient !== oldPatient) {
        // ไม่ล้าง search query เมื่อเลือกผู้ป่วย
        this.patientSearchResults = []
        this.showPatientResults = false
      }
    },
    patientSearchQuery(newQuery) {
      if (!newQuery.trim()) {
        this.patientSearchResults = []
        this.showPatientResults = false
      } else {
        this.showPatientResults = true
      }
    },
    queueParams: {
      handler(newParams, oldParams) {
        if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
          this.loadQueues()
        }
      },
      deep: true,
      immediate: false, // Don't run on initial load
    },
  },
  mounted() {
    if (this.$route.query.patient) {
      try {
        this.prefilledPatient = JSON.parse(decodeURIComponent(this.$route.query.patient))
        this.selectedPatient = this.prefilledPatient
      } catch (e) {
        console.error('Error parsing patient data:', e)
      }
    }
    this.loadDepartments()
    this.loadDoctors()
    this.loadQueues()
  },
  beforeUnmount() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    if (this.patientSearchTimer) {
      clearTimeout(this.patientSearchTimer)
    }
  },
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

/* Patient Search Input Styles */
.patient-search-input {
  border: 1px solid #e5e7eb !important;
  outline: none !important;
}

.patient-search-input:focus {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.3) !important;
  outline: none !important;
}

.patient-search-input:hover {
  border-color: #10b981 !important;
}
</style>
