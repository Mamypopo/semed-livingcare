<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <HeadlessDialog :open="isOpen" @close="closeModal" as="div" class="relative z-50">
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
            <DialogPanel class="w-full max-w-[90vw] h-[90vh] transform rounded-2xl bg-white shadow-xl transition-all flex flex-col">
              <!-- Header -->
              <div class="bg-white px-6 py-4 rounded-t-2xl border-b border-gray-100 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg font-semibold text-gray-900">
                    เพิ่มการซักประวัติ
                  </DialogTitle>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="saveData"
                      class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
                    >
                      บันทึก
                    </button>
                    <button
                      @click="closeModal"
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
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
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
                            'whitespace-nowrap py-2 px-3 font-medium text-xs flex items-center gap-1.5 rounded-md transition-all'
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  WT
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'น้ำหนัก (กิโลกรัม)'" />
                                </label>
                                <input
                                  v-model="vitalsData.weight"
                                  @input="calculateBMI"
                                  type="number"
                                  step="0.1"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  PR
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'ชีพจร (ครั้งต่อนาที)'" />
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  HT
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'ส่วนสูง (เซนติเมตร)'" />
                                </label>
                                <input
                                  v-model="vitalsData.height"
                                  @input="calculateBMI"
                                  type="number"
                                  step="0.1"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  RR
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'อัตราการหายใจ (ครั้งต่อนาที)'" />
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  BMI
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'Body Mass Index - คำนวณอัตโนมัติจากน้ำหนักและส่วนสูง'" />
                                </label>
                                <input
                                  v-model="vitalsData.bmi"
                                  type="number"
                                  readonly
                                  class="w-36 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-500  focus:outline-none"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  BSA
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'Body Surface Area - คำนวณอัตโนมัติ'" />
                                </label>
                                <input
                                  v-model="vitalsData.bsa"
                                  type="text"
                                  readonly
                                  class="w-36 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-500  focus:outline-none"
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <!-- Grid Row 4 -->
                            <div class="grid grid-cols-2 gap-3">
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  TEMP
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'อุณหภูมิร่างกาย (องศาเซลเซียส)'" />
                                </label>
                                <input
                                  v-model="vitalsData.temperature"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  CRT
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'Capillary Refill Time - เวลาเลือดไหลกลับ'" />
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  BP SYS
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'ความดันโลหิตค่าบน (Systolic)'" />
                                </label>
                                <input
                                  v-model="vitalsData.bpSys"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  BP DIA
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'ความดันโลหิตค่าล่าง (Diastolic)'" />
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  VAS
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'Visual Analog Scale - ระดับความเจ็บปวด'" />
                                </label>
                                <input
                                  v-model="vitalsData.vas"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  O2sat
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'ความอิ่มตัวของออกซิเจนในเลือด (%)'" />
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  HC (cm)
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'รอบศีรษะ (เซนติเมตร)'" />
                                </label>
                                <input
                                  v-model="vitalsData.headCircumference"
                                  type="number"
                                  class="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  placeholder="0"
                                />
                              </div>
                              <div class="flex items-center justify-between gap-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  CHC (cm)
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'รอบอก (เซนติเมตร)'" />
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
                                <label class="text-sm font-medium text-gray-700 flex items-center gap-1 min-w-[85px]">
                                  WC (cm)
                                  <Info class="w-3.5 h-3.5 text-gray-400" v-tooltip.right="'รอบเอว (เซนติเมตร)'" />
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
                        <!-- Alcohol & Smoking -->
                        <div class="space-y-4 border-t border-gray-200 pt-4">
                          <div class="flex items-center gap-2 mb-2">
                            <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                            <label class="text-sm font-semibold text-gray-900">ตรวจการดื่มสุรา/สูบบุหรี่</label>
                          </div>
                          
                          <!-- Alcohol -->
                          <div>
                            <label class="block text-xs text-gray-600 mb-2">ดื่มสุรา</label>
                            <div class="flex gap-4">
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.alcohol"
                                  type="radio"
                                  name="alcohol"
                                  value="none"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-xs text-gray-700">ไม่ดื่ม</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.alcohol"
                                  type="radio"
                                  name="alcohol"
                                  value="sometimes"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-xs text-gray-700">ดื่มบางครั้ง</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.alcohol"
                                  type="radio"
                                  name="alcohol"
                                  value="yes"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-xs text-gray-700">ดื่ม</span>
                              </label>
                            </div>
                          </div>

                          <!-- Smoking -->
                          <div>
                            <label class="block text-xs text-gray-600 mb-2">สูบบุหรี่</label>
                            <div class="flex gap-4">
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.smoking"
                                  type="radio"
                                  name="smoking"
                                  value="none"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-xs text-gray-700">ไม่สูบ</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.smoking"
                                  type="radio"
                                  name="smoking"
                                  value="sometimes"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-xs text-gray-700">สูบบางครั้ง</span>
                              </label>
                              <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                  v-model="vitalsData.smoking"
                                  type="radio"
                                  name="smoking"
                                  value="yes"
                                  class="w-4 h-4 text-emerald-500"
                                />
                                <span class="text-xs text-gray-700">สูบ</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <!-- Custom Fields -->
                        <div class="space-y-2 border-t border-gray-200 pt-4">
                          <div class="flex items-center gap-2 mb-2">
                            <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                            <label class="text-sm font-semibold text-gray-900">กำหนดเอง</label>
                          </div>
                          <div class="grid grid-cols-3 gap-2">
                            <input
                              v-model="vitalsData.customField1"
                              type="text"
                              class="col-span-1 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="Custom 1"
                            />
                            <input
                              v-model="vitalsData.customField2"
                              type="text"
                              class="col-span-1 px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="Custom 2"
                            />
                            <button
                              class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- อาการทางคลินิก (Clinical Symptoms) -->
                      <div v-if="activeSubTab === 'clinical'">
                        <p class="text-sm text-gray-500 text-center py-8">อาการทางคลินิก - กำลังพัฒนา...</p>
                      </div>

                      <!-- อาการบวม (Swelling) -->
                      <div v-if="activeSubTab === 'swelling'">
                        <p class="text-sm text-gray-500 text-center py-8">อาการบวม - กำลังพัฒนา...</p>
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
                      <div class="flex gap-2">
                        <input
                          v-model="diagnosisSearch"
                          type="text"
                          class="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ค้นหารายการวินิจฉัย 3 ตัวอักษร"
                        />
                        <button
                          @click="openIcd10Modal"
                          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium"
                        >
                          +
                        </button>
                      </div>

                      <!-- ICD Table -->
                      <div class="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                        <div class="bg-emerald-50 px-4 py-2 border-b border-gray-200">
                          <div class="grid grid-cols-4 gap-4 text-xs font-medium text-emerald-700">
                            <div>ICD CODE</div>
                            <div>ชื่อรายการ</div>
                            <div>ประเภท</div>
                            <div>ตัวเลือก</div>
                          </div>
                        </div>
                        <div class="p-4 text-center text-gray-500 text-sm">
                          <p>ไม่มีข้อมูล</p>
                          <p class="text-xs text-gray-400 mt-1">คลิก + เพื่อเพิ่มการวินิจฉัยโรค</p>
                        </div>
                      </div>
                    </div>

                    <!-- CC -->
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
                          <label class="text-xs font-semibold text-gray-900">CC:</label>
                        </div>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            class="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                          />
                          <span class="text-xs text-gray-600">เปิด/ปิด AI</span>
                        </label>
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
</template>

<script>
import { Dialog as HeadlessDialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { UserRound, Stethoscope, AlertTriangle, Info } from 'lucide-vue-next'

export default {
  name: 'VitalsSignModal',
  components: {
    HeadlessDialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    UserRound,
    Stethoscope,
    AlertTriangle,
    Info
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data() {
    return {
      activeMainTab: 'vitals',
      activeSubTab: 'basic',
      mainTabs: [
        { id: 'vitals', name: 'Vitals Sign' },
        { id: 'chart', name: 'Chart' }
      ],
      subTabs: [
        { id: 'basic', name: 'ข้อมูลพื้นฐาน', icon: UserRound },
        { id: 'clinical', name: 'อาการทางคลินิก', icon: Stethoscope },
        { id: 'swelling', name: 'อาการบวม', icon: AlertTriangle }
      ],
      diagnosisSearch: '',
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
        customField1: '',
        customField2: ''
      },
      formData: {
        cc: '',
        hpi: '',
        pmh: '',
        dx: '',
        ga: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    openIcd10Modal() {
      // TODO: เปิด ICD10 modal
      console.log('Open ICD10 modal')
    },
    saveData() {
      // TODO: บันทึกข้อมูล
      console.log('Save vitals data:', this.vitalsData)
      console.log('Save form data:', this.formData)
    },
    calculateBMI() {
      if (this.vitalsData.weight && this.vitalsData.height) {
        const weight = parseFloat(this.vitalsData.weight)
        const height = parseFloat(this.vitalsData.height) / 100 // แปลง cm เป็น m
        if (height > 0) {
          const bmi = (weight / (height * height)).toFixed(2)
          this.vitalsData.bmi = bmi
        }
      } else {
        this.vitalsData.bmi = ''
      }
    }
  }
}
</script>

