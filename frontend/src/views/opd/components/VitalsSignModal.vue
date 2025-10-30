<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <HeadlessDialog :open="isOpen" @close="handleRequestClose" as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-[90vw] h-[90vh] transform rounded-2xl bg-white shadow-xl transition-all flex flex-col"
            >
              <!-- Header -->
              <div class="bg-white px-6 py-4 rounded-t-2xl border-b border-gray-100 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg font-semibold text-gray-900">
                    {{ mode === 'edit' ? 'แก้ไขการซักประวัติ' : 'เพิ่มการซักประวัติ' }}
                  </DialogTitle>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="saveData"
                      class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
                    >
                      บันทึก
                    </button>
                    <button
                      @click="handleRequestClose"
                      class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div class="border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <nav class="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    v-for="tab in mainTabs"
                    :key="tab.id"
                    @click="activeMainTab = tab.id"
                    :class="[
                      activeMainTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </nav>
              </div>

              <!-- Content -->
              <div class="p-6 flex-1 overflow-y-auto">
                <!-- Vitals Sign Tab Content -->
                <div v-if="activeMainTab === 'vitals'" class="grid grid-cols-5 gap-6">
                  <!-- Left Panel (40% / 2 columns) -->
                  <div class="col-span-2 space-y-6 border border-gray-200 rounded-lg p-4">
                    <!-- Sub-tabs -->
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-1">
                      <nav class="flex gap-1" aria-label="Sub-tabs">
                        <button
                          v-for="subTab in subTabs"
                          :key="subTab.id"
                          @click="activeSubTab = subTab.id"
                          :class="[
                            activeSubTab === subTab.id
                              ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50',
                            'whitespace-nowrap py-2 px-3 font-medium text-xs flex items-center gap-1.5 rounded-md transition-all',
                          ]"
                        >
                          <component :is="subTab.icon" class="w-3.5 h-3.5" />
                          {{ subTab.name }}
                        </button>
                      </nav>
                    </div>

                    <!-- Sub-tab Content -->
                    <div>
                      <!-- ข้อมูลพื้นฐาน (Basic Info) -->
                      <div v-if="activeSubTab === 'basic'" class="space-y-6">
                        <!-- Basic Info Form -->
                        <div>
                          <div class="flex items-center gap-2 mb-3">
                            <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                            <label class="text-sm font-semibold text-gray-900">ข้อมูลพื้นฐาน</label>
                          </div>
                          <div class="space-y-3">
                            <!-- Grid Row 1 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  WT
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'น้ำหนัก (กิโลกรัม)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.weight"
                                  @input="calculate"
                                  type="number"
                                  step="0.1"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  PR
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'ชีพจร (ครั้งต่อนาที)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.pulseRate"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 2 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  HT
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'ส่วนสูง (เซนติเมตร)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.height"
                                  @input="calculate"
                                  type="number"
                                  step="0.1"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  RR
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'อัตราการหายใจ (ครั้งต่อนาที)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.respiratoryRate"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 3 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  BMI
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="
                                      'Body Mass Index - คำนวณอัตโนมัติจากน้ำหนักและส่วนสูง'
                                    "
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.bmi"
                                  type="number"
                                  readonly
                                  class="w-36 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-500 focus:outline-none"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  BSA
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'Body Surface Area - คำนวณอัตโนมัติ'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.bsa"
                                  type="text"
                                  readonly
                                  class="w-36 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-500 focus:outline-none"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 4 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  TEMP
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'อุณหภูมิร่างกาย (องศาเซลเซียส)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.temperature"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  CRT
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'Capillary Refill Time - เวลาเลือดไหลกลับ'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.crt"
                                  type="text"
                                  class="w-36 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 5 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  BP SYS
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'ความดันโลหิตค่าบน (Systolic)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.bpSys"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  BP DIA
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'ความดันโลหิตค่าล่าง (Diastolic)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.bpDia"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 6 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  VAS
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'Visual Analog Scale - ระดับความเจ็บปวด'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.vas"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  O2sat
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'ความอิ่มตัวของออกซิเจนในเลือด (%)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.o2sat"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 7 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  HC (cm)
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'รอบศีรษะ (เซนติเมตร)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.headCircumference"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  CHC (cm)
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'รอบอก (เซนติเมตร)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.chestCircumference"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 8 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label
                                  class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]"
                                >
                                  WC (cm)
                                  <Info
                                    class="w-3.5 h-3.5 text-gray-400"
                                    v-tooltip.right="'รอบเอว (เซนติเมตร)'"
                                  />
                                </label>
                                <input
                                  v-model="vitalsData.waistCircumference"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div></div>
                            </div>
                          </div>
                        </div>
                        <!-- Alcohol & Smoking & Custom -->
                        <div class="space-y-4 border-t border-gray-200 pt-4">
                          <div class="flex items-center gap-2 mb-2">
                            <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                            <label class="text-sm font-semibold text-gray-800"
                              >ตรวจการดื่มสุรา/สูบบุหรี่</label
                            >
                          </div>

                          <!-- Alcohol -->
                          <div class="flex items-center gap-4">
                            <span class="text-sm text-gray-600 min-w-[70px]">ดื่มสุรา</span>
                            <div class="flex gap-4">
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.alcohol"
                                  type="radio"
                                  name="alcohol"
                                  value="ไม่ดื่ม"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">ไม่ดื่ม</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.alcohol"
                                  type="radio"
                                  name="alcohol"
                                  value="ดื่มบางครั้ง"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">ดื่มบางครั้ง</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.alcohol"
                                  type="radio"
                                  name="alcohol"
                                  value="ดื่ม"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">ดื่ม</span>
                              </label>
                            </div>
                          </div>

                          <!-- Smoking -->
                          <div class="flex items-center gap-4">
                            <span class="text-sm text-gray-600 min-w-[70px]">สูบบุหรี่</span>
                            <div class="flex gap-4">
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.smoking"
                                  type="radio"
                                  name="smoking"
                                  value="ไม่สูบ"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">ไม่สูบ</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.smoking"
                                  type="radio"
                                  name="smoking"
                                  value="สูบบางครั้ง"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">สูบบางครั้ง</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.smoking"
                                  type="radio"
                                  name="smoking"
                                  value="สูบ"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">สูบ</span>
                              </label>
                            </div>
                          </div>

                          <!-- Custom Fields (Key/Value JSON) -->
                          <div class="space-y-2 pt-2">
                            <div class="flex items-center gap-2 mb-2">
                              <label class="text-sm font-medium text-gray-700"
                                >กำหนดเอง (Key/Value)</label
                              >
                            </div>
                            <div class="space-y-2">
                              <div
                                v-for="(row, i) in customFieldRows"
                                :key="'cf-' + i"
                                class="grid grid-cols-5 gap-2 items-center"
                              >
                                <input
                                  v-model="row.key"
                                  type="text"
                                  placeholder="หัวข้อ เช่น สูบกัญชา"
                                  class="col-span-2 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                />
                                <input
                                  v-model="row.value"
                                  type="text"
                                  placeholder="ค่า เช่น นานครั้ง"
                                  class="col-span-2 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                />
                                <div class="col-span-1 flex items-center justify-end gap-2">
                                  <button
                                    v-if="i === customFieldRows.length - 1"
                                    type="button"
                                    @click="addCustomRow()"
                                    class="px-3 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                                  >
                                    <Plus class="w-4 h-4" />
                                  </button>
                                  <button
                                    v-else
                                    type="button"
                                    @click="removeCustomRow(i)"
                                    class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    <X class="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Medical Certificate (OPD) -->
                          <div class="space-y-4 border-t border-gray-200 pt-4">
                            <div class="text-sm font-semibold text-gray-800">
                              การออกใบรับรอง Medical Certificate (OPD)
                            </div>
                            <div class="flex items-center gap-2">
                              <input
                                v-model="vitalsData.mcNotRest"
                                type="checkbox"
                                class="w-4 h-4 text-emerald-500"
                              />
                              <span class="text-sm text-gray-700">ไม่สมควรพัก</span>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                              <div>
                                <div class="text-sm font-medium text-gray-700 mb-1">
                                  สมควรพักตั้งแต่
                                </div>
                                <VueDatePicker
                                  v-model="vitalsData.mcStartDate"
                                  :auto-apply="true"
                                  :enable-time-picker="false"
                                  :format="'dd/MM/yyyy'"
                                  locale="th"
                                  class="w-full"
                                  :disabled="vitalsData.mcNotRest"
                                />
                              </div>
                              <div>
                                <div class="text-sm font-medium text-gray-700 mb-1">
                                  สมควรพักถึง
                                </div>
                                <VueDatePicker
                                  v-model="vitalsData.mcEndDate"
                                  :auto-apply="true"
                                  :enable-time-picker="false"
                                  :format="'dd/MM/yyyy'"
                                  locale="th"
                                  class="w-full"
                                  :disabled="vitalsData.mcNotRest"
                                />
                              </div>
                            </div>
                            <div class="flex items-center gap-6">
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.canFly"
                                  type="radio"
                                  name="fly"
                                  :value="true"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700">สามารถขึ้นเครื่องบินได้</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.canFly"
                                  type="radio"
                                  name="fly"
                                  :value="false"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-sm text-gray-700"
                                  >ไม่สามารถขึ้นเครื่องบินได้</span
                                >
                              </label>
                            </div>

                            <!-- Operator / Department -->
                            <div class="grid grid-cols-2 gap-3">
                              <!-- Operator -->
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 min-w-[85px]"
                                  >ผู้ทำรายการ</label
                                >
                                <Listbox
                                  v-model="vitalsData.operatorName"
                                  as="div"
                                  class="relative w-56"
                                >
                                  <div>
                                    <ListboxButton
                                      class="relative text-sm w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                    >
                                      <span class="block truncate">{{
                                        vitalsData.operatorName || '- เลือกผู้ทำรายการ -'
                                      }}</span>
                                      <span
                                        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                                      >
                                        <ChevronDown class="h-5 w-5 text-gray-400" />
                                      </span>
                                    </ListboxButton>
                                  </div>
                                  <Transition
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
                                        :value="vitalsData.operatorName"
                                        v-slot="{ active, selected }"
                                      >
                                        <li
                                          :class="[
                                            'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                                            active
                                              ? 'bg-emerald-50 text-gray-900'
                                              : 'text-gray-700',
                                          ]"
                                        >
                                          <span>{{ vitalsData.operatorName || '-' }}</span>
                                          <span v-if="selected" class="text-emerald-600 text-xs"
                                            >เลือก</span
                                          >
                                        </li>
                                      </ListboxOption>
                                    </ListboxOptions>
                                  </Transition>
                                </Listbox>
                              </div>
                            </div>

                            <!-- Department -->
                            <div class="flex items-start justify-between gap-4">
                              <label class="text-sm font-medium text-gray-700 min-w-[85px] pt-2"
                                >แผนก</label
                              >
                              <div class="flex-1">
                                <div class="flex flex-wrap gap-3">
                                  <span
                                    v-for="(dep, i) in vitalsData.departments"
                                    :key="i"
                                    class="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                                  >
                                    {{ dep }}
                                    <button
                                      type="button"
                                      class="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
                                      @click="removeDepartment(i)"
                                    >
                                      <X class="w-3 h-3 text-emerald-600" />
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- อาการทางคลินิก (Clinical Symptoms) -->
                      <div v-if="activeSubTab === 'clinical'" class="space-y-4">
                        <div class="space-y-3">
                          <!-- ระดับความเจ็บปวด (VAS) -->
                          <div class="flex items-center justify-between gap-2">
                            <label class="text-sm font-medium text-gray-700 min-w-[140px]"
                              >ระดับความเจ็บปวด (VAS 0-10)</label
                            >
                            <input
                              v-model="clinicalData.painLevel"
                              @input="updatePainTypeFromVAS"
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              class="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="0"
                            />
                          </div>

                          <!-- ลักษณะของอาการปวด -->
                          <div class="flex items-center justify-between gap-2">
                            <label class="text-sm font-medium text-gray-700 min-w-[140px]"
                              >ลักษณะของอาการปวด</label
                            >
                            <input
                              v-model="clinicalData.painType"
                              type="text"
                              readonly
                              class="w-64 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-700 focus:outline-none"
                            />
                          </div>

                          <!-- ตำแหน่งของอาการปวด -->
                          <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700"
                              >ตำแหน่งของอาการปวด</label
                            >
                            <textarea
                              v-model="clinicalData.painLocation"
                              rows="3"
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <!-- อาการบวม (Swelling) -->
                      <div v-if="activeSubTab === 'swelling'" class="space-y-4">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                          <label class="text-sm font-semibold text-gray-900">อาการบวม</label>
                        </div>

                        <div class="space-y-3">
                          <!-- ระดับอาการบวม -->
                          <div class="flex items-center justify-between gap-2">
                            <label class="text-sm font-medium text-gray-700 min-w-[140px]"
                              >ระดับอาการบวม</label
                            >
                            <Listbox v-model="swellingData.level" as="div" class="relative w-80">
                              <div>
                                <ListboxButton
                                  class="relative text-sm w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                >
                                  <span class="block truncate">{{
                                    swellingData.level || 'เลือก'
                                  }}</span>
                                  <span
                                    class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                                  >
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                              </div>
                              <Transition
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
                                    v-for="opt in swellingLevels"
                                    :key="opt"
                                    :value="opt"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                                        active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
                                      ]"
                                    >
                                      <span>{{ opt }}</span>
                                      <span v-if="selected" class="text-emerald-600 text-xs"
                                        >เลือก</span
                                      >
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </Transition>
                            </Listbox>
                          </div>

                          <!-- ลักษณะของอาการบวม -->
                          <div class="flex items-center justify-between gap-2">
                            <label class="text-sm font-medium text-gray-700 min-w-[140px]"
                              >ลักษณะของอาการบวม</label
                            >
                            <Listbox v-model="swellingData.type" as="div" class="relative w-80">
                              <div>
                                <ListboxButton
                                  class="relative text-sm w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                >
                                  <span class="block truncate">{{
                                    swellingData.type || 'เลือก'
                                  }}</span>
                                  <span
                                    class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                                  >
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                              </div>
                              <Transition
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
                                    v-for="opt in swellingTypes"
                                    :key="opt"
                                    :value="opt"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                                        active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
                                      ]"
                                    >
                                      <span>{{ opt }}</span>
                                      <span v-if="selected" class="text-emerald-600 text-xs"
                                        >เลือก</span
                                      >
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </Transition>
                            </Listbox>
                          </div>

                          <!-- ตำแหน่งของอาการบวม -->
                          <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700"
                              >ตำแหน่งของอาการบวม</label
                            >
                            <textarea
                              v-model="swellingData.location"
                              rows="3"
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Panel (60% / 3 columns) -->
                  <div class="col-span-3 space-y-6 border border-gray-200 rounded-lg p-4">
                    <!-- Diagnosis -->
                    <div>
                      <div class="flex items-center gap-2 mb-3">
                        <div class="w-1 h-5 bg-blue-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">การวินิจฉัยโรค</label>
                      </div>
                      <div class="flex gap-2 relative" ref="icdDropdownEl">
                        <SearchIcon
                          class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <input
                          v-model="diagnosisSearch"
                          @input="onSearchIcd"
                          type="text"
                          class="flex-1 pl-9 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ค้นหา ICD10 อย่างน้อย 3 ตัวอักษร"
                        />

                        <!-- Search dropdown -->
                        <div
                          v-if="showIcdDropdown"
                          class="absolute top-11 left-0 right-16 z-40 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-auto"
                        >
                          <div v-if="loadingIcd" class="p-3 text-sm text-gray-500">
                            กำลังค้นหา...
                          </div>
                          <template v-else>
                            <button
                              v-for="item in icdResults"
                              :key="item.id"
                              :disabled="isIcdSelected(item.code)"
                              @click="!isIcdSelected(item.code) && addDiagnosis(item)"
                              :class="[
                                'w-full text-left px-3 py-2 text-sm flex items-center justify-between',
                                isIcdSelected(item.code)
                                  ? 'cursor-not-allowed opacity-60'
                                  : 'hover:bg-emerald-50',
                              ]"
                            >
                              <span class="font-medium text-gray-900">{{ item.code }}</span>
                              <span class="flex-1 ml-3 text-gray-700 truncate">{{
                                item.nameTh
                              }}</span>
                              <span
                                v-if="isIcdSelected(item.code)"
                                class="ml-3 text-emerald-700 bg-emerald-100 border border-emerald-200 text-xs px-2 py-0.5 rounded-full"
                                >เลือกแล้ว</span
                              >
                            </button>
                            <div v-if="!icdResults.length" class="p-3 text-sm text-gray-500">
                              ไม่พบข้อมูล
                            </div>
                          </template>
                        </div>
                      </div>

                      <!-- ICD Table -->
                      <div class="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                        <div class="bg-emerald-50 px-4 py-2 border-b border-gray-200 sticky top-0">
                          <div
                            class="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-700 tracking-wide"
                          >
                            <div class="uppercase">ICD CODE</div>
                            <div class="uppercase">ชื่อรายการ</div>
                            <div class="uppercase text-right">ตัวเลือก</div>
                          </div>
                        </div>
                        <div
                          v-if="selectedDiagnoses.length === 0"
                          class="p-4 text-center text-gray-500 text-sm"
                        >
                          <p>ไม่มีข้อมูล</p>
                          <p class="text-xs text-gray-400 mt-1">พิมพ์เพื่อค้นหาและเลือกจากรายการ</p>
                        </div>
                        <div v-else class="divide-y divide-gray-100">
                          <div
                            v-for="(dx, i) in selectedDiagnoses"
                            :key="dx.code + '-' + i"
                            class="px-4 py-2 grid grid-cols-3 gap-4 items-center text-sm hover:bg-gray-50"
                          >
                            <div class="font-semibold text-gray-700">{{ dx.code }}</div>
                            <div class="text-gray-500 truncate" :title="dx.nameTh">
                              {{ dx.nameTh }}
                            </div>
                            <div class="text-right">
                              <button
                                @click="removeDiagnosis(i)"
                                class="text-red-600 hover:text-red-800"
                              >
                                ลบ
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- CC -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">CC:</label>
                      </div>
                      <textarea
                        v-model="formData.cc"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="CC: อาการสำคัญที่มาพบแพทย์ เช่น เจ็บหน้าอก, ปวดหัว"
                      ></textarea>
                    </div>

                    <!-- HPI -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">HPI:</label>
                      </div>
                      <textarea
                        v-model="formData.hpi"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="HPI: ประวัติอาการป่วยปัจจุบัน"
                      ></textarea>
                    </div>

                    <!-- PMH -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">PMH:</label>
                      </div>
                      <textarea
                        v-model="formData.pmh"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="PMH: ประวัติการรักษาในอดีต"
                      ></textarea>
                    </div>

                    <!-- DX -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">DX:</label>
                      </div>
                      <textarea
                        v-model="formData.dx"
                        rows="3"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="DX: การวินิจฉัยโรค"
                      ></textarea>
                    </div>

                    <!-- GA -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">GA:</label>
                      </div>
                      <textarea
                        v-model="formData.ga"
                        rows="3"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="GA: ลักษณะทั่วไป"
                      ></textarea>
                    </div>

                    <!-- PE -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">PE:</label>
                      </div>
                      <textarea
                        v-model="formData.pe"
                        rows="3"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="PE: การตรวจร่างกาย"
                      ></textarea>
                    </div>

                    <!-- คำแนะนำแพทย์ -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-orange-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">คำแนะนำแพทย์:</label>
                      </div>
                      <textarea
                        v-model="formData.doctorAdvice"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="คำแนะนำแพทย์"
                      ></textarea>
                    </div>

                    <!-- Doctor Note -->
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-1 h-5 bg-cyan-500 rounded-full"></div>
                        <label class="text-xs font-semibold text-gray-900">Doctor Note:</label>
                      </div>
                      <textarea
                        v-model="formData.doctorNote"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="Doctor Note"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Chart Tab Content -->
                <div v-if="activeMainTab === 'chart'" class="text-center text-gray-500 py-8">
                  <p>Chart - กำลังพัฒนา...</p>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </TransitionRoot>
  <ConfirmClosePopover
    v-if="showConfirmClose"
    @cancel="showConfirmClose = false"
    @confirm="resetAndClose"
  />
</template>

<script>
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import {
  UserRound,
  Stethoscope,
  AlertTriangle,
  Info,
  Plus,
  ChevronDown,
  X,
  Search as SearchIcon,
} from 'lucide-vue-next'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useAuthStore } from '@/stores/auth.js'
import icd10Service from '@/services/icd10.js'
import visitService from '@/services/visit.js'
import Swal from 'sweetalert2'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'

export default {
  name: 'VitalsSignModal',
  components: {
    HeadlessDialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    UserRound,
    Stethoscope,
    AlertTriangle,
    Info,
    Plus,
    ChevronDown,
    X,
    SearchIcon,
    VueDatePicker,
    ConfirmClosePopover,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    mode: { type: String, default: 'create' },
    visitId: { type: String, default: null },
    departmentName: {
      type: String,
      default: '',
    },
    patientId: { type: [String, Number], default: null },
    registrationId: { type: String, default: null },
    doctorId: { type: [String, Number], default: null },
    departmentId: { type: String, default: null },
    branchId: { type: [String, Number], default: null },
  },
  emits: ['close'],
  data() {
    return {
      showConfirmClose: false,
      initialSnapshot: null,
      activeMainTab: 'vitals',
      activeSubTab: 'basic',
      mainTabs: [
        { id: 'vitals', name: 'Vitals Sign' },
        { id: 'chart', name: 'Chart' },
      ],
      subTabs: [
        { id: 'basic', name: 'ข้อมูลพื้นฐาน', icon: UserRound },
        { id: 'clinical', name: 'อาการทางคลินิก', icon: Stethoscope },
        { id: 'swelling', name: 'อาการบวม', icon: AlertTriangle },
      ],
      diagnosisSearch: '',
      icdResults: [],
      showIcdDropdown: false,
      loadingIcd: false,
      icdDebounceTimer: null,
      selectedDiagnoses: [],
      painTypes: ['ไม่ปวดเลย', 'ปวดเล็กน้อย', 'ปวดปานกลาง', 'ปวดมาก', 'ปวดมากที่สุด'],
      clinicalData: {
        painLevel: '',
        painType: '',
        painLocation: '',
      },
      swellingLevels: [
        '1+: มองเห็นไม่ชัดเจน รอยบุ๋มหายไปเร็ว',
        '2+: รอยบุ๋มหายใน 15 วินาที',
        '3+: รอยบุ๋มคงอยู่นานกว่า 1 นาที',
        '4+: รอยบุ๋มลึกชัดเจน และอยู่นานประมาณ 2-5 นาที',
      ],
      swellingTypes: ['Pitting', 'Non-Pitting'],
      swellingData: {
        level: '',
        type: '',
        location: '',
      },
      vitalsData: {
        weight: '',
        height: '',
        bmi: '',
        temperature: '',
        bpSys: '',
        bpDia: '',
        pulseRate: '',
        respiratoryRate: '',
        vas: '',
        bsa: '',
        crt: '',
        o2sat: '',
        headCircumference: '',
        waistCircumference: '',
        chestCircumference: '',
        alcohol: 'none',
        smoking: 'none',
        customFields: {},
        operationDate: new Date(),
        operatorName: '',
        departmentName: '',
        mcNotRest: false,
        mcStartDate: new Date(),
        mcEndDate: new Date(),
        canFly: true,
        departments: [],
      },
      newCustomKey: '',
      newCustomValue: '',
      customFieldRows: [{ key: '', value: '' }],
      formData: {
        cc: '',
        hpi: '',
        pmh: '',
        dx: '',
        ga: '',
        pe: '',
        doctorAdvice: '',
        doctorNote: '',
      },
    }
  },
  methods: {
    async preloadVisit() {
      try {
        const { data } = await visitService.getById(this.visitId)
        const v = data?.data || {}
        // map vitals
        this.vitalsData.weight = v.weightKg ?? ''
        this.vitalsData.height = v.heightCm ?? ''
        this.vitalsData.bmi = v.bmi ?? ''
        this.vitalsData.bsa = v.bsa ?? ''
        this.vitalsData.temperature = v.temperatureC ?? ''
        this.vitalsData.bpSys = v.bpSys ?? ''
        this.vitalsData.bpDia = v.bpDia ?? ''
        this.vitalsData.pulseRate = v.pulseRate ?? ''
        this.vitalsData.respiratoryRate = v.respiratoryRate ?? ''
        this.vitalsData.vas = v.vas ?? ''
        this.vitalsData.o2sat = v.o2Sat ?? ''
        this.vitalsData.crt = v.crt ?? ''
        this.vitalsData.headCircumference = v.headCircumferenceCm ?? ''
        this.vitalsData.chestCircumference = v.chestCircumferenceCm ?? ''
        this.vitalsData.waistCircumference = v.waistCircumferenceCm ?? ''
        this.vitalsData.alcohol = v.alcohol ?? 'ไม่ดื่ม'
        this.vitalsData.smoking = v.smoking ?? 'ไม่สูบ'
        this.vitalsData.customFields = v.customFields || {}
        this.vitalsData.operationDate = v.visitAt ? new Date(v.visitAt) : new Date()
        this.vitalsData.mcNotRest = v.mcNotRest ?? false
        this.vitalsData.mcStartDate = v.mcRestFrom ? new Date(v.mcRestFrom) : new Date()
        this.vitalsData.mcEndDate = v.mcRestTo ? new Date(v.mcRestTo) : new Date()
        this.vitalsData.canFly = v.mcCanFly ?? true

        // clinical
        this.formData.cc = v.cc ?? ''
        this.formData.hpi = v.hpi ?? ''
        this.formData.pmh = v.pmh ?? ''
        this.formData.dx = v.dxText ?? ''
        this.formData.ga = v.ga ?? ''
        this.formData.pe = v.pe ?? ''
        this.formData.doctorAdvice = v.doctorAdvice ?? ''
        this.formData.doctorNote = v.doctorNote ?? ''

        // pain
        this.clinicalData.painLevel = v.painVas ?? ''
        this.clinicalData.painType = v.painType ?? ''
        this.clinicalData.painLocation = v.painLocation ?? ''

        // swelling
        this.swellingData.level = v.swellingLevel ?? ''
        this.swellingData.type = v.swellingType ?? ''
        this.swellingData.location = v.swellingLocation ?? ''

        // custom fields rows
        const rows = []
        const cf = this.vitalsData.customFields || {}
        for (const k of Object.keys(cf)) {
          rows.push({ key: k, value: cf[k] })
        }
        this.customFieldRows = rows.length
          ? rows.concat([{ key: '', value: '' }])
          : [{ key: '', value: '' }]

        // diagnoses
        const dxs = Array.isArray(v.diagnoses)
          ? v.diagnoses.map((d) => ({
              id: d.icd10Id,
              code: d.icd10?.code,
              nameTh: d.icd10?.nameTh,
              nameEn: d.icd10?.nameEn,
              groupCode: d.icd10?.groupCode,
              groupNameTh: d.icd10?.groupNameTh,
              groupNameEn: d.icd10?.groupNameEn,
            }))
          : []
        this.selectedDiagnoses = dxs
        this.updateDxFromSelected()
        // set clean snapshot after preload completes
        this.$nextTick(() => {
          try {
            this.initialSnapshot = this.buildSnapshot()
          } catch {
            this.initialSnapshot = null
          }
        })
      } catch (e) {
        console.error('preload visit failed', e)
      }
    },
    closeModal() {
      this.$emit('close')
    },
    handleRequestClose() {
      if (!this.isFormDirty()) {
        this.resetAndClose()
      } else {
        this.showConfirmClose = true
      }
    },

    resetAndClose() {
      // รีเซ็ตค่าฟอร์มหลักๆ แล้วปิด modal
      this.diagnosisSearch = ''
      this.icdResults = []
      this.showIcdDropdown = false
      this.loadingIcd = false
      this.icdDebounceTimer = null
      this.selectedDiagnoses = []

      this.clinicalData = { painLevel: '', painType: '', painLocation: '' }
      this.swellingData = { level: '', type: '', location: '' }
      this.vitalsData = {
        weight: '',
        height: '',
        bmi: '',
        temperature: '',
        bpSys: '',
        bpDia: '',
        pulseRate: '',
        respiratoryRate: '',
        vas: '',
        bsa: '',
        crt: '',
        o2sat: '',
        headCircumference: '',
        waistCircumference: '',
        chestCircumference: '',
        alcohol: 'none',
        smoking: 'none',
        customFields: {},
        operationDate: new Date(),
        operatorName: '',
        departmentName: '',
        mcNotRest: false,
        mcStartDate: new Date(),
        mcEndDate: new Date(),
        canFly: true,
        departments: [],
      }
      this.newCustomKey = ''
      this.newCustomValue = ''
      this.customFieldRows = [{ key: '', value: '' }]
      this.formData = {
        cc: '',
        hpi: '',
        pmh: '',
        dx: '',
        ga: '',
        pe: '',
        doctorAdvice: '',
        doctorNote: '',
      }

      this.showConfirmClose = false
      this.initialSnapshot = null
      this.$emit('close')
    },
    handleGlobalClick(evt) {
      if (!this.showIcdDropdown) return
      const root = this.$refs.icdDropdownEl
      if (root && !root.contains(evt.target)) {
        this.showIcdDropdown = false
      }
    },
    buildSnapshot() {
      const d = (v) => (v instanceof Date ? v.toISOString() : v)
      return JSON.stringify({
        vitalsData: {
          ...this.vitalsData,
          operationDate: d(this.vitalsData.operationDate),
          mcStartDate: d(this.vitalsData.mcStartDate),
          mcEndDate: d(this.vitalsData.mcEndDate),
        },
        clinicalData: { ...this.clinicalData },
        swellingData: { ...this.swellingData },
        selectedDiagnoses: this.selectedDiagnoses,
        formData: { ...this.formData },
      })
    },
    isFormDirty() {
      try {
        const current = this.buildSnapshot()
        return current !== this.initialSnapshot
      } catch {
        return true
      }
    },
    onSearchIcd() {
      if (this.icdDebounceTimer) clearTimeout(this.icdDebounceTimer)
      this.icdDebounceTimer = setTimeout(this.performSearchIcd, 500)
    },
    async performSearchIcd() {
      const q = (this.diagnosisSearch || '').trim()
      if (q.length < 3) {
        this.icdResults = []
        this.showIcdDropdown = false
        return
      }
      this.loadingIcd = true
      this.showIcdDropdown = true
      try {
        const { data } = await icd10Service.search({ query: q, limit: 20 })
        const items = data?.data?.items || []
        this.icdResults = items
      } catch {
        this.icdResults = []
      } finally {
        this.loadingIcd = false
      }
    },
    isIcdSelected(code) {
      return this.selectedDiagnoses.some((dx) => dx.code === code)
    },
    addDiagnosis(item) {
      if (!item || !item.code) return
      const exists = this.selectedDiagnoses.some((dx) => dx.code === item.code)
      if (!exists) {
        this.selectedDiagnoses.push({
          id: item.id,
          code: item.code,
          nameTh: item.nameTh,
          nameEn: item.nameEn,
          groupCode: item.groupCode,
          groupNameTh: item.groupNameTh,
          groupNameEn: item.groupNameEn,
        })
        this.updateDxFromSelected()
      }
      this.diagnosisSearch = ''
      this.icdResults = []
      this.showIcdDropdown = false
    },
    removeDiagnosis(index) {
      if (index >= 0) this.selectedDiagnoses.splice(index, 1)
      this.updateDxFromSelected()
    },
    updateDxFromSelected() {
      if (!this.selectedDiagnoses.length) {
        this.formData.dx = ''
        return
      }
      const lines = this.selectedDiagnoses.map((dx, i) => {
        const name = dx?.nameTh || dx?.nameEn || ''
        return `${i + 1}. ${dx.code} ${name}`
      })
      this.formData.dx = lines.join('\n')
    },
    addCustomField() {
      const key = (this.newCustomKey || '').trim()
      if (!key) return
      if (!this.vitalsData.customFields || typeof this.vitalsData.customFields !== 'object') {
        this.vitalsData.customFields = {}
      }
      this.vitalsData.customFields[key] = this.newCustomValue
      this.newCustomKey = ''
      this.newCustomValue = ''
    },
    removeCustomField(key) {
      if (
        this.vitalsData.customFields &&
        Object.prototype.hasOwnProperty.call(this.vitalsData.customFields, key)
      ) {
        const copy = { ...this.vitalsData.customFields }
        delete copy[key]
        this.vitalsData.customFields = copy
      }
    },
    async saveData() {
      const auth = useAuthStore()
      const { isConfirmed } = await Swal.fire({
        icon: 'question',
        title: 'ยืนยันการบันทึก?',
        text: 'ตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#059669',
      })
      if (!isConfirmed) return
      const cf = {}
      for (const r of this.customFieldRows) {
        const k = (r.key || '').trim()
        if (!k) continue
        cf[k] = r.value ?? ''
      }
      this.vitalsData.customFields = cf
      const payload = {
        patientId: this.patientId,
        registrationId: this.registrationId,
        doctorId: this.doctorId,
        operatorId: auth?.user?.id || null,
        departmentId: this.departmentId,
        branchId: this.branchId || auth?.currentBranch?.id || auth?.user?.branchId,
        visitAt: this.vitalsData.operationDate || new Date(),
        vitals: this.vitalsData,
        clinical: this.formData,
        pain: this.clinicalData,
        swelling: this.swellingData,
        diagnoses: this.selectedDiagnoses,
      }
      try {
        const { data } =
          this.mode === 'edit' && this.visitId
            ? await visitService.update(this.visitId, payload)
            : await visitService.create(payload)
        if (data?.success) {
          await Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: 'ข้อมูล Visit ถูกบันทึกเรียบร้อย',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
          })
          this.$emit('close')
        }
      } catch (error) {
        console.error('Save visit error', error)
        Swal.fire({
          icon: 'error',
          title: 'บันทึกไม่สำเร็จ',
          text: error?.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
        })
      }
    },
    calculate() {
      const wStr = this.vitalsData.weight
      const hStr = this.vitalsData.height
      const w = wStr !== '' && wStr != null ? parseFloat(wStr) : NaN
      const hCm = hStr !== '' && hStr != null ? parseFloat(hStr) : NaN

      // BMI
      if (!isNaN(w) && !isNaN(hCm) && hCm > 0) {
        const hM = hCm / 100
        const bmi = w / (hM * hM)
        this.vitalsData.bmi = isFinite(bmi) ? bmi.toFixed(2) : ''
      } else {
        this.vitalsData.bmi = ''
      }

      // BSA (Mosteller)
      if (!isNaN(w) && !isNaN(hCm) && w > 0 && hCm > 0) {
        const bsa = Math.sqrt((hCm * w) / 3600)
        this.vitalsData.bsa = isFinite(bsa) ? bsa.toFixed(2) : ''
      } else {
        this.vitalsData.bsa = ''
      }
    },
    removeDepartment(index) {
      if (Array.isArray(this.vitalsData.departments)) {
        this.vitalsData.departments.splice(index, 1)
      }
    },
    addCustomRow() {
      this.customFieldRows.push({ key: '', value: '' })
    },
    removeCustomRow(index) {
      if (this.customFieldRows.length <= 1) {
        this.customFieldRows = [{ key: '', value: '' }]
        return
      }
      this.customFieldRows.splice(index, 1)
    },
    updatePainTypeFromVAS() {
      let v = parseFloat(this.clinicalData.painLevel)
      if (isNaN(v)) {
        this.clinicalData.painType = ''
        return
      }
      // Clamp between 0 and 10
      if (v < 0) v = 0
      if (v > 10) v = 10
      // Reflect clamped value back to input (keep one decimal if entered)
      this.clinicalData.painLevel = Number.isInteger(v) ? v : parseFloat(v.toFixed(1))
      if (v <= 0) this.clinicalData.painType = 'ไม่ปวดเลย'
      else if (v <= 3) this.clinicalData.painType = 'ปวดเล็กน้อย'
      else if (v <= 6) this.clinicalData.painType = 'ปวดปานกลาง'
      else if (v <= 8) this.clinicalData.painType = 'ปวดมาก'
      else this.clinicalData.painType = 'ปวดมากที่สุด'
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.handleGlobalClick)
    document.addEventListener('touchstart', this.handleGlobalClick)
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleGlobalClick)
    document.removeEventListener('touchstart', this.handleGlobalClick)
  },
  watch: {
    departmentName: {
      immediate: true,
      handler(val) {
        this.vitalsData.departmentName = val || ''
        if (val) {
          // push once if empty or not same as last
          if (
            !this.vitalsData.departments.length ||
            this.vitalsData.departments[this.vitalsData.departments.length - 1] !== val
          ) {
            this.vitalsData.departments = [val]
          }
        }
      },
    },
    isOpen(val) {
      if (val) {
        const auth = useAuthStore()
        this.vitalsData.operatorName = auth.userName || auth.user?.name || ''
        // preload when edit
        if (this.mode === 'edit' && this.visitId) {
          this.preloadVisit() // snapshot will be set after preload
        } else {
          this.$nextTick(() => {
            try {
              this.initialSnapshot = this.buildSnapshot()
            } catch {
              this.initialSnapshot = null
            }
          })
        }
      }
    },
    'vitalsData.mcNotRest'(val) {
      if (val) {
        this.vitalsData.mcStartDate = null
        this.vitalsData.mcEndDate = null
      } else {
        if (!this.vitalsData.mcStartDate) this.vitalsData.mcStartDate = new Date()
        if (!this.vitalsData.mcEndDate) this.vitalsData.mcEndDate = new Date()
      }
    },
  },
}
</script>
