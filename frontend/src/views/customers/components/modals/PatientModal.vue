<template>
  <TransitionRoot as="template" :show="modelValue">
    <HeadlessDialog as="div" class="relative z-50" @close="requestClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl w-[80vw] h-[80vh] min-h-[600px] flex flex-col z-50"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ isEdit ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้า' }}
                </h3>
                <div class="flex items-center space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    อ่านข้อมูลบัตรยังไม่ได้ทำ
                  </button>
                  <button
                    type="submit"
                    form="patient-form"
                    :disabled="loading"
                    class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
                  </button>
                  <button
                    type="button"
                    @click="requestClose"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>

              <!-- Tab Navigation -->
              <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8 px-6">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </nav>
              </div>

              <!-- Form Content -->
              <form
                id="patient-form"
                @submit.prevent="handleSubmit"
                class="px-6 py-6 flex-1 overflow-y-auto"
              >
                <!-- Personal Information Tab -->
                <div v-if="activeTab === 'personal'" class="space-y-6">
                  <div class="grid grid-cols-12 gap-6">
                    <!-- Profile Picture -->
                    <div class="col-span-3">
                      <div
                        class="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-teal-400 rounded-lg border-2 border-white shadow-lg flex items-center justify-center"
                      >
                        <div class="text-white text-center">
                          <div
                            class="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center"
                          >
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                          <div class="text-xs">รูปโปรไฟล์</div>
                        </div>
                      </div>

                      <!-- Status and Points under profile -->
                      <div class="mt-4 space-y-3">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">HN</label>
                          <input
                            v-model="form.hn"
                            type="text"
                            readonly
                            disabled
                            class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm 
        text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            placeholder="ระบบจะสร้างให้อัตโนมัติ"
                          />
                        </div>

                        <!-- แท็ก -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">แท็ก</label>
                          <TagDropdown
                            v-model="selectedTags"
                            placeholder="เลือกแท็ก..."
                            class="w-full"
                          />
                        </div>

                        <!-- กลุ่มลูกค้า -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >กลุ่มลูกค้า <span class="text-red-500">*</span></label
                          >
                          <PatientGroupDropdown
                            v-model="form.patient_group_id"
                            placeholder="เลือกกลุ่มลูกค้า..."
                            class="w-full"
                          />
                        </div>

                        <!-- สาขา -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >สาขา <span class="text-red-500">*</span></label
                          >
                          <BranchDropdown
                            v-model="form.branchId"
                            placeholder="เลือกสาขา..."
                            class="w-full"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                          <div class="flex items-center">
                            <button
                              type="button"
                              @click="form.isActive = !form.isActive"
                              :class="[
                                form.isActive ? 'bg-lime-500' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                              ]"
                            >
                              <span
                                :class="[
                                  form.isActive ? 'translate-x-5' : 'translate-x-0',
                                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                ]"
                              />
                            </button>
                            <span class="ml-3 text-sm text-gray-700">
                              {{ form.isActive ? 'ปกติ' : 'ปิดใช้งาน' }}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >แต้มสะสม</label
                          >
                          <input
                            v-model="form.points"
                            type="number"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >วงเงินคงเหลือ</label
                          >
                          <input
                            v-model="form.balance"
                            type="number"
                            step="0.01"
                            readonly
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Form Fields -->
                    <div class="col-span-9">
                      <div class="space-y-4">
                        <!-- Row 1: 4 columns -->
                        <div class="grid grid-cols-4 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >คำนำหน้า <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.prefix"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.prefix && form.prefix !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุคำนำหน้า"
                                @focus="showPrefixDropdown = true"
                                @blur="hidePrefixDropdown"
                                @input="handlePrefixInput"
                              />
                              <button
                                v-if="form.prefix && form.prefix !== ''"
                                type="button"
                                @click="clearPrefix"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showPrefixDropdown = !showPrefixDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showPrefixDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="prefix in prefixOptions"
                                  :key="prefix"
                                  @click="selectPrefix(prefix)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ prefix }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >เพศ <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.gender"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.gender && form.gender !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุเพศ"
                                @focus="showGenderDropdown = true"
                                @blur="hideGenderDropdown"
                                @input="handleGenderInput"
                              />
                              <button
                                v-if="form.gender && form.gender !== ''"
                                type="button"
                                @click="clearGender"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showGenderDropdown = !showGenderDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showGenderDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="gender in genderOptions"
                                  :key="gender"
                                  @click="selectGender(gender)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ gender }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >สัญชาติ <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.nationality"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.nationality && form.nationality !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุสัญชาติ"
                                @focus="showNationalityDropdown = true"
                                @blur="hideNationalityDropdown"
                                @input="handleNationalityInput"
                              />
                              <button
                                v-if="form.nationality && form.nationality !== ''"
                                type="button"
                                @click="clearNationality"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showNationalityDropdown = !showNationalityDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showNationalityDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="nationality in nationalityOptions"
                                  :key="nationality"
                                  @click="selectNationality(nationality)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ nationality }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ศาสนา <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.religion"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.religion && form.religion !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุศาสนา"
                                @focus="showReligionDropdown = true"
                                @blur="hideReligionDropdown"
                                @input="handleReligionInput"
                              />
                              <button
                                v-if="form.religion && form.religion !== ''"
                                type="button"
                                @click="clearReligion"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showReligionDropdown = !showReligionDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showReligionDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="religion in religionOptions"
                                  :key="religion"
                                  @click="selectReligion(religion)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ religion }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Row 2: 4 columns -->
                        <div class="grid grid-cols-4 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ระดับการศึกษา <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.education_level"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.education_level && form.education_level !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุระดับการศึกษา"
                                @focus="showEducationLevelDropdown = true"
                                @blur="hideEducationLevelDropdown"
                                @input="handleEducationLevelInput"
                              />
                              <button
                                v-if="form.education_level && form.education_level !== ''"
                                type="button"
                                @click="clearEducationLevel"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showEducationLevelDropdown = !showEducationLevelDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showEducationLevelDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="level in educationLevelOptions"
                                  :key="level"
                                  @click="selectEducationLevel(level)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ level }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >สถานะภาพสมรส <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.marital_status"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.marital_status && form.marital_status !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุสถานะภาพสมรส"
                                @focus="showMaritalStatusDropdown = true"
                                @blur="hideMaritalStatusDropdown"
                                @input="handleMaritalStatusInput"
                              />
                              <button
                                v-if="form.marital_status && form.marital_status !== ''"
                                type="button"
                                @click="clearMaritalStatus"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showMaritalStatusDropdown = !showMaritalStatusDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showMaritalStatusDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="status in maritalStatusOptions"
                                  :key="status"
                                  @click="selectMaritalStatus(status)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ status }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >กรุ๊บเลือด <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                              <input
                                v-model="form.blood_group"
                                type="text"
                                required
                                :class="[
                                  'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.blood_group && form.blood_group !== ''
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-white text-gray-700 placeholder-gray-400'
                                ]"
                                placeholder="ระบุกรุ๊บเลือด"
                                @focus="showBloodGroupDropdown = true"
                                @blur="hideBloodGroupDropdown"
                                @input="handleBloodGroupInput"
                              />
                              <button
                                v-if="form.blood_group && form.blood_group !== ''"
                                type="button"
                                @click="clearBloodGroup"
                                class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  class="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="showBloodGroupDropdown = !showBloodGroupDropdown"
                                class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown class="h-5 w-5" />
                              </button>

                              <!-- Dropdown Options -->
                              <div
                                v-if="showBloodGroupDropdown"
                                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                              >
                                <div
                                  v-for="group in bloodGroupOptions"
                                  :key="group"
                                  @click="selectBloodGroup(group)"
                                  class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                                >
                                  <span class="block truncate">{{ group }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >วันเกิด <span class="text-red-500">*</span></label
                            >
                            <VueDatePicker
                              v-model="form.birth_date"
                              :enable-time-picker="false"
                              :format="'dd/MM/yyyy'"
                              :placeholder="'เลือกวันเกิด'"
                              :max-date="new Date()"
                              :clearable="false"
                              :auto-apply="true"
                              :teleport="true"
                              :teleport-target="'body'"
                              input-class-name="dp-custom-input"
                            />
                          </div>
                        </div>

                        <!-- Row 3: 2 columns -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >เลขบัตรประชาชน</label
                            >
                            <input
                              v-model="form.national_id"
                              type="text"
                              placeholder="ระบุเลขบัตรประชาชน"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >หนังสือเดินทาง</label
                            >
                            <input
                              v-model="form.passport_no"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุหนังสือเดินทาง"
                            />
                          </div>
                        </div>

                        <!-- Row 4: 3 columns (ชื่อ, นามสกุล, ชื่อเล่น) -->
                        <div class="grid grid-cols-3 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ชื่อ <span class="text-red-500">*</span></label
                            >
                            <input
                              v-model="form.first_name"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุชื่อ"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >นามสกุล <span class="text-red-500">*</span></label
                            >
                            <input
                              v-model="form.last_name"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุนามสกุล"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ชื่อเล่น</label
                            >
                            <input
                              v-model="form.nickname"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุชื่อเล่น"
                            />
                          </div>
                        </div>

                        <!-- Row 5: 2 columns (ชื่อ EN, นามสกุล EN) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ชื่อ (EN)</label
                            >
                            <input
                              v-model="form.first_name_en"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุชื่อภาษาอังกฤษ"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >นามสกุล (EN)</label
                            >
                            <input
                              v-model="form.last_name_en"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุนามสกุลภาษาอังกฤษ"
                            />
                          </div>
                        </div>

                        <!-- Row 6: 1 column (อีเมล) -->
                        <div class="grid grid-cols-1 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >อีเมล</label
                            >
                            <input
                              v-model="form.email"
                              type="email"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุอีเมล"
                            />
                          </div>
                        </div>

                        <!-- Row 7: 2 columns (เบอร์โทร 1, เบอร์โทร 2) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >เบอร์โทร 1</label
                            >
                            <input
                              v-model="form.phone_1"
                              type="tel"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุเบอร์โทรศัพท์"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >เบอร์โทร 2</label
                            >
                            <input
                              v-model="form.phone_2"
                              type="tel"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุเบอร์โทรศัพท์"
                            />
                          </div>
                        </div>

                        <!-- Row 8: 2 columns (ที่อยู่, จังหวัด) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ที่อยู่ <span class="text-red-500">*</span></label
                            >
                            <textarea
                              v-model="form.address"
                              required
                              rows="3"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุที่อยู่"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >จังหวัด <span class="text-red-500">*</span></label
                            >
                            <Listbox
                              v-model="selectedProvince"
                              @update:modelValue="onProvinceChange"
                            >
                              <div class="relative">
                                <ListboxButton
                                  class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                  @click="showProvinceDropdown = !showProvinceDropdown"
                                >
                                  <span class="block truncate">{{
                                    selectedProvince?.name_th || 'เลือกจังหวัด'
                                  }}</span>
                                  <span
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                  >
                                    <ChevronDown
                                      class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                      :class="{ 'rotate-180': showProvinceDropdown }"
                                    />
                                  </span>
                                </ListboxButton>

                                <ListboxOptions
                                  class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                  @click-outside="showProvinceDropdown = false"
                                >
                                  <!-- Search Input -->
                                  <div class="px-3 py-2 border-b border-gray-200">
                                    <input
                                      v-model="provinceSearchQuery"
                                      type="text"
                                      placeholder="ค้นหาจังหวัด..."
                                      class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                      @click.stop
                                    />
                                  </div>

                                  <ListboxOption
                                    v-for="province in filteredProvinces"
                                    :key="province.id"
                                    :value="province"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        active
                                          ? 'bg-emerald-100 text-emerald-900'
                                          : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pr-4',
                                        selected ? 'pl-10' : 'pl-3'
                                      ]"
                                    >
                                      <span
                                        :class="[
                                          selected ? 'font-medium' : 'font-normal',
                                          'block truncate'
                                        ]"
                                      >
                                        {{ province.name_th }}
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
                              </div>
                            </Listbox>
                          </div>
                        </div>

                        <div class="grid grid-cols-3 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >อำเภอ/เขต <span class="text-red-500">*</span></label
                            >
                            <Listbox
                              v-model="selectedDistrict"
                              @update:modelValue="onDistrictChange"
                              :disabled="!form.province"
                            >
                              <div class="relative">
                                <ListboxButton
                                  :class="[
                                    'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                    form.district
                                      ? 'bg-white text-gray-700'
                                      : 'bg-white text-gray-400',
                                    !form.province
                                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                      : ''
                                  ]"
                                  @click="showDistrictDropdown = !showDistrictDropdown"
                                >
                                  <span class="block truncate">{{
                                    form.district || 'เลือกอำเภอ/เขต'
                                  }}</span>
                                  <span
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                  >
                                    <ChevronDown
                                      class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                      :class="{ 'rotate-180': showDistrictDropdown }"
                                    />
                                  </span>
                                </ListboxButton>

                                <ListboxOptions
                                  class="absolute z-[100] bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                  @click-outside="showDistrictDropdown = false"
                                >
                                  <!-- Search Input -->
                                  <div class="px-3 py-2 border-b border-gray-200">
                                    <input
                                      v-model="districtSearchQuery"
                                      type="text"
                                      placeholder="ค้นหาอำเภอ/เขต..."
                                      class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                      @click.stop
                                    />
                                  </div>

                                  <ListboxOption
                                    v-for="district in filteredDistricts"
                                    :key="district.id"
                                    :value="district"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        active
                                          ? 'bg-emerald-100 text-emerald-900'
                                          : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pr-4',
                                        selected ? 'pl-10' : 'pl-3'
                                      ]"
                                    >
                                      <span
                                        :class="[
                                          selected ? 'font-medium' : 'font-normal',
                                          'block truncate'
                                        ]"
                                      >
                                        {{ district.name_th }}
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
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >ตำบล/แขวง <span class="text-red-500">*</span></label
                            >
                            <Listbox
                              v-model="selectedSubDistrict"
                              @update:modelValue="onSubDistrictChange"
                              :disabled="!form.district"
                            >
                              <div class="relative">
                                <ListboxButton
                                  :class="[
                                    'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                    form.sub_district
                                      ? 'bg-white text-gray-700'
                                      : 'bg-white text-gray-400',
                                    !form.district
                                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                      : ''
                                  ]"
                                  @click="showSubDistrictDropdown = !showSubDistrictDropdown"
                                >
                                  <span class="block truncate">{{
                                    form.sub_district || 'เลือกตำบล/แขวง'
                                  }}</span>
                                  <span
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                  >
                                    <ChevronDown
                                      class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                      :class="{ 'rotate-180': showSubDistrictDropdown }"
                                    />
                                  </span>
                                </ListboxButton>

                                <ListboxOptions
                                  class="absolute z-[100] bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                  @click-outside="showSubDistrictDropdown = false"
                                >
                                  <!-- Search Input -->
                                  <div class="px-3 py-2 border-b border-gray-200">
                                    <input
                                      v-model="subDistrictSearchQuery"
                                      type="text"
                                      placeholder="ค้นหาตำบล/แขวง..."
                                      class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                      @click.stop
                                    />
                                  </div>

                                  <ListboxOption
                                    v-for="subDistrict in filteredSubDistricts"
                                    :key="subDistrict.id"
                                    :value="subDistrict"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        active
                                          ? 'bg-emerald-100 text-emerald-900'
                                          : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pr-4',
                                        selected ? 'pl-10' : 'pl-3'
                                      ]"
                                    >
                                      <span
                                        :class="[
                                          selected ? 'font-medium' : 'font-normal',
                                          'block truncate'
                                        ]"
                                      >
                                        {{ subDistrict.name_th }}
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
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >รหัสไปรษณีย์ <span class="text-red-500">*</span></label
                            >
                            <Listbox
                              v-model="selectedPostcode"
                              @update:modelValue="onPostalCodeChange"
                              :disabled="!form.sub_district"
                            >
                              <div class="relative">
                                <ListboxButton
                                  :class="[
                                    'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                    form.postal_code
                                      ? 'bg-white text-gray-700'
                                      : 'bg-white text-gray-400',
                                    !form.sub_district
                                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                      : ''
                                  ]"
                                  @click="showPostalCodeDropdown = !showPostalCodeDropdown"
                                >
                                  <span class="block truncate">{{
                                    form.postal_code || 'เลือกรหัสไปรษณีย์'
                                  }}</span>
                                  <span
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                  >
                                    <ChevronDown
                                      class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                      :class="{ 'rotate-180': showPostalCodeDropdown }"
                                    />
                                  </span>
                                </ListboxButton>

                                <ListboxOptions
                                  class="absolute z-[100] bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                  @click-outside="showPostalCodeDropdown = false"
                                >
                                  <!-- Search Input -->
                                  <div class="px-3 py-2 border-b border-gray-200">
                                    <input
                                      v-model="postalCodeSearchQuery"
                                      type="text"
                                      placeholder="ค้นหารหัสไปรษณีย์..."
                                      class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                      @click.stop
                                    />
                                  </div>

                                  <ListboxOption
                                    v-for="postcode in filteredPostcodes"
                                    :key="postcode.postcode"
                                    :value="postcode"
                                    v-slot="{ active, selected }"
                                  >
                                    <li
                                      :class="[
                                        active
                                          ? 'bg-emerald-100 text-emerald-900'
                                          : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pr-4',
                                        selected ? 'pl-10' : 'pl-3'
                                      ]"
                                    >
                                      <span
                                        :class="[
                                          selected ? 'font-medium' : 'font-normal',
                                          'block truncate'
                                        ]"
                                      >
                                        {{ postcode.postcode }}
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
                              </div>
                            </Listbox>
                          </div>
                        </div>

                        <!-- Row 10: 1 column (หมายเหตุ) -->
                        <div class="grid grid-cols-1 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"
                              >หมายเหตุ</label
                            >
                            <textarea
                              v-model="form.note"
                              rows="3"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              placeholder="ระบุหมายเหตุ"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Health Information Tab -->
                <div v-if="activeTab === 'health'" class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >น้ำหนัก</label
                          >
                          <input
                            v-model="form.weight"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >ส่วนสูง</label
                          >
                          <input
                            v-model="form.height"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">รอบเอว</label>
                          <input
                            v-model="form.waist"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">รอบอก</label>
                          <input
                            v-model="form.chest"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >ประเภทการรักษา <span class="text-red-500">*</span></label
                        >
                        <Listbox
                          v-model="form.treatment_type"
                          @update:modelValue="showTreatmentTypeDropdown = false"
                        >
                          <div class="relative">
                            <ListboxButton
                              class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              @click="showTreatmentTypeDropdown = !showTreatmentTypeDropdown"
                            >
                              <span class="block truncate">{{
                                form.treatment_type || 'OPD ผู้ป่วยนอก'
                              }}</span>
                              <span
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                              >
                                <ChevronDown
                                  class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                  :class="{ 'rotate-180': showTreatmentTypeDropdown }"
                                />
                              </span>
                            </ListboxButton>
                            <ListboxOptions
                              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                              @click-outside="showTreatmentTypeDropdown = false"
                            >
                              <ListboxOption
                                v-for="type in treatmentTypeOptions"
                                :key="type"
                                :value="type"
                                v-slot="{ active, selected }"
                              >
                                <li
                                  :class="[
                                    active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-10 pr-4'
                                  ]"
                                >
                                  <span
                                    :class="[
                                      selected ? 'font-medium' : 'font-normal',
                                      'block truncate'
                                    ]"
                                    >{{ type }}</span
                                  >
                                  <span
                                    v-if="selected"
                                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                                  >
                                    <Check class="h-5 w-5" />
                                  </span>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >ประเภทสิทธิ์การรักษา <span class="text-red-500">*</span></label
                        >
                        <InsuranceTypeDropdown
                          v-model="form.insurance_type_id"
                          placeholder="เลือกประเภทสิทธิ์การรักษา..."
                        />
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >ประวัติการแพ้ยา</label
                        >
                        <textarea
                          v-model="form.allergy_history"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุประวัติการแพ้ยา"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >ประวัติสุขภาพจิต</label
                        >
                        <textarea
                          v-model="form.mental_health"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุประวัติสุขภาพจิต"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >โรคประจำตัว</label
                        >
                        <textarea
                          v-model="form.underlying_disease"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุโรคประจำตัว"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                        <textarea
                          v-model="form.note"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุหมายเหตุ"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact Information Tab -->
                <div v-if="activeTab === 'contact'" class="space-y-6">
                  <div class="space-y-2">
                    <!-- Column Headers -->
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-4 text-sm font-medium text-gray-700">ชื่อ-นามสกุล</div>
                      <div class="col-span-3 text-sm font-medium text-gray-700">เบอร์โทร</div>
                      <div class="col-span-3 text-sm font-medium text-gray-700">ความสัมพันธ์</div>
                    </div>

                    <!-- Contact Input Groups -->
                    <div v-for="(contact, index) in contactPersons" :key="contact.id" class="grid grid-cols-12 gap-4 items-center">
                      <!-- ชื่อ-นามสกุล -->
                      <div class="col-span-4">
                        <input
                          v-model="contact.name"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ชื่อ-นามสกุล"
                        />
                      </div>

                      <!-- เบอร์โทร -->
                      <div class="col-span-3">
                        <input
                          v-model="contact.phone"
                          type="tel"
                          maxlength="10"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="เบอร์โทร"
                        />
                      </div>

                      <!-- ความสัมพันธ์ -->
                      <div class="col-span-3">
                        <div class="relative">
                          <input
                            v-model="contact.relationship"
                            type="text"
                            :class="[
                              'w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                              contact.relationship && contact.relationship !== ''
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-white text-gray-700 placeholder-gray-400'
                            ]"
                            placeholder="ความสัมพันธ์"
                            @focus="showRelationshipDropdown(contact.id)"
                            @blur="hideRelationshipDropdown(contact.id)"
                            @input="handleRelationshipInput(contact.id)"
                          />
                          <button
                            v-if="contact.relationship && contact.relationship !== ''"
                            type="button"
                            @click="clearRelationship(contact.id)"
                            class="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                          >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            @click="toggleRelationshipDropdown(contact.id)"
                            class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                          >
                            <ChevronDown class="h-5 w-5" />
                          </button>

                          <!-- Dropdown Options -->
                          <div
                            v-if="showRelationshipDropdowns[contact.id]"
                            class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            <div
                              v-for="relationship in relationshipOptions"
                              :key="relationship"
                              @click="selectRelationship(contact.id, relationship)"
                              class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-100 hover:text-emerald-900"
                            >
                              <span class="block truncate">{{ relationship }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ปุ่มดำเนินการ -->
                      <div class="col-span-2 flex justify-center">
                        <!-- ปุ่มเพิ่ม (แสดงเฉพาะแถวสุดท้ายและกรอกข้อมูลครบแล้ว) -->
                        <button
                          v-if="index === contactPersons.length - 1"
                          type="button"
                          @click="(!contact.name || !contact.phone || !contact.relationship) ? null : addContactPerson()"
                          :class="[
                            'px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 flex items-center justify-center',
                            (!contact.name || !contact.phone || !contact.relationship)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-auto'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'
                          ]"
                          v-tooltip.bottom="(!contact.name || !contact.phone || !contact.relationship) ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'เพิ่มผู้ติดต่อ'"
                          >
                          <Plus class="h-5 w-5" />
                        </button>

                        <!-- ปุ่มลบ (แสดงเฉพาะแถวที่มีข้อมูลแล้วและไม่ใช่แถวสุดท้าย) -->
                        <button
                          v-if="index !== contactPersons.length - 1 && (contact.name || contact.phone || contact.relationship)"
                          type="button"
                          @click="removeContactPerson(contact.id)"
                          class="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-400 rounded-lg transition-colors duration-200 flex items-center justify-center"
                          v-tooltip.bottom="'ลบผู้ติดต่อ'"
                        >
                          <Trash2 class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Company Information Tab -->
                <div v-if="activeTab === 'company'" class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >ชื่อบริษัท</label
                        >
                        <input
                          v-model="form.company_name"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุชื่อบริษัท"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >เลขประจำตัวผู้เสียภาษี</label
                        >
                        <input
                          v-model="form.company_tax_id"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุเลขประจำตัวผู้เสียภาษี"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                        <input
                          v-model="form.company_phone"
                          type="tel"
                          maxlength="10"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุเบอร์โทรบริษัท"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <input
                          v-model="form.company_email"
                          type="email"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุอีเมลบริษัท"
                        />
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                        <textarea
                          v-model="form.company_address"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                          placeholder="ระบุที่อยู่บริษัท"
                        />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >จังหวัด <span class="text-red-500">*</span></label
                          >
                          <Listbox
                            v-model="selectedCompanyProvince"
                            @update:modelValue="onCompanyProvinceChange"
                          >
                            <div class="relative">
                              <ListboxButton
                                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                @click="showCompanyProvinceDropdown = !showCompanyProvinceDropdown"
                              >
                                <span class="block truncate">{{
                                  selectedCompanyProvince?.name_th || 'เลือกจังหวัด'
                                }}</span>
                                <span
                                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                >
                                  <ChevronDown
                                    class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                    :class="{ 'rotate-180': showCompanyProvinceDropdown }"
                                  />
                                </span>
                              </ListboxButton>

                              <ListboxOptions
                                class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                @click-outside="showCompanyProvinceDropdown = false"
                              >
                                <!-- Search Input -->
                                <div class="px-3 py-2 border-b border-gray-200">
                                  <input
                                    v-model="companyProvinceSearchQuery"
                                    type="text"
                                    placeholder="ค้นหาจังหวัด..."
                                    class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                    @click.stop
                                  />
                                </div>

                                <ListboxOption
                                  v-for="province in filteredCompanyProvinces"
                                  :key="province.id"
                                  :value="province"
                                  v-slot="{ active, selected }"
                                >
                                  <li
                                    :class="[
                                      active
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pr-4',
                                      selected ? 'pl-10' : 'pl-3'
                                    ]"
                                  >
                                    <span
                                      :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate'
                                      ]"
                                    >
                                      {{ province.name_th }}
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
                            </div>
                          </Listbox>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >อำเภอ/เขต <span class="text-red-500">*</span></label
                          >
                          <Listbox
                            v-model="selectedCompanyDistrict"
                            @update:modelValue="onCompanyDistrictChange"
                            :disabled="!form.company_province"
                          >
                            <div class="relative">
                              <ListboxButton
                                :class="[
                                  'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.company_district
                                    ? 'bg-white text-gray-700'
                                    : 'bg-white text-gray-400',
                                  !form.company_province
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : ''
                                ]"
                                @click="showCompanyDistrictDropdown = !showCompanyDistrictDropdown"
                              >
                                <span class="block truncate">{{
                                  form.company_district || 'เลือกอำเภอ/เขต'
                                }}</span>
                                <span
                                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                >
                                  <ChevronDown
                                    class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                    :class="{ 'rotate-180': showCompanyDistrictDropdown }"
                                  />
                                </span>
                              </ListboxButton>

                              <ListboxOptions
                                class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                @click-outside="showCompanyDistrictDropdown = false"
                              >
                                <!-- Search Input -->
                                <div class="px-3 py-2 border-b border-gray-200">
                                  <input
                                    v-model="companyDistrictSearchQuery"
                                    type="text"
                                    placeholder="ค้นหาอำเภอ/เขต..."
                                    class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                    @click.stop
                                  />
                                </div>

                                <ListboxOption
                                  v-for="district in filteredCompanyDistricts"
                                  :key="district.id"
                                  :value="district"
                                  v-slot="{ active, selected }"
                                >
                                  <li
                                    :class="[
                                      active
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pr-4',
                                      selected ? 'pl-10' : 'pl-3'
                                    ]"
                                  >
                                    <span
                                      :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate'
                                      ]"
                                    >
                                      {{ district.name_th }}
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
                            </div>
                          </Listbox>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >ตำบล/แขวง <span class="text-red-500">*</span></label
                          >
                          <Listbox
                            v-model="selectedCompanySubDistrict"
                            @update:modelValue="onCompanySubDistrictChange"
                            :disabled="!form.company_district"
                          >
                            <div class="relative">
                              <ListboxButton
                                :class="[
                                  'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.company_subdistrict
                                    ? 'bg-white text-gray-700'
                                    : 'bg-white text-gray-400',
                                  !form.company_district
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : ''
                                ]"
                                @click="showCompanySubDistrictDropdown = !showCompanySubDistrictDropdown"
                              >
                                <span class="block truncate">{{
                                  form.company_subdistrict || 'เลือกตำบล/แขวง'
                                }}</span>
                                <span
                                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                >
                                  <ChevronDown
                                    class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                    :class="{ 'rotate-180': showCompanySubDistrictDropdown }"
                                  />
                                </span>
                              </ListboxButton>

                              <ListboxOptions
                                class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                @click-outside="showCompanySubDistrictDropdown = false"
                              >
                                <!-- Search Input -->
                                <div class="px-3 py-2 border-b border-gray-200">
                                  <input
                                    v-model="companySubDistrictSearchQuery"
                                    type="text"
                                    placeholder="ค้นหาตำบล/แขวง..."
                                    class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                    @click.stop
                                  />
                                </div>

                                <ListboxOption
                                  v-for="subDistrict in filteredCompanySubDistricts"
                                  :key="subDistrict.id"
                                  :value="subDistrict"
                                  v-slot="{ active, selected }"
                                >
                                  <li
                                    :class="[
                                      active
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pr-4',
                                      selected ? 'pl-10' : 'pl-3'
                                    ]"
                                  >
                                    <span
                                      :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate'
                                      ]"
                                    >
                                      {{ subDistrict.name_th }}
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
                            </div>
                          </Listbox>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1"
                            >รหัสไปรษณีย์ <span class="text-red-500">*</span></label
                          >
                          <Listbox
                            v-model="selectedCompanyPostcode"
                            @update:modelValue="onCompanyPostalCodeChange"
                            :disabled="!form.company_subdistrict"
                          >
                            <div class="relative">
                              <ListboxButton
                                :class="[
                                  'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400',
                                  form.company_postal_code
                                    ? 'bg-white text-gray-700'
                                    : 'bg-white text-gray-400',
                                  !form.company_subdistrict
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : ''
                                ]"
                                @click="showCompanyPostalCodeDropdown = !showCompanyPostalCodeDropdown"
                              >
                                <span class="block truncate">{{
                                  form.company_postal_code || 'เลือกรหัสไปรษณีย์'
                                }}</span>
                                <span
                                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                >
                                  <ChevronDown
                                    class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                    :class="{ 'rotate-180': showCompanyPostalCodeDropdown }"
                                  />
                                </span>
                              </ListboxButton>

                              <ListboxOptions
                                class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
                                @click-outside="showCompanyPostalCodeDropdown = false"
                              >
                                <!-- Search Input -->
                                <div class="px-3 py-2 border-b border-gray-200">
                                  <input
                                    v-model="companyPostalCodeSearchQuery"
                                    type="text"
                                    placeholder="ค้นหารหัสไปรษณีย์..."
                                    class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                    @click.stop
                                  />
                                </div>

                                <ListboxOption
                                  v-for="postcode in filteredCompanyPostcodes"
                                  :key="postcode.postcode"
                                  :value="postcode"
                                  v-slot="{ active, selected }"
                                >
                                  <li
                                    :class="[
                                      active
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pr-4',
                                      selected ? 'pl-10' : 'pl-3'
                                    ]"
                                  >
                                    <span
                                      :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate'
                                      ]"
                                    >
                                      {{ postcode.postcode }}
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
                            </div>
                          </Listbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Documents Tab -->
                <div v-if="activeTab === 'documents'" class="space-y-6">
                  <!-- Upload Section -->
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                      <h3 class="text-sm font-medium text-gray-900">อัปโหลดเอกสาร</h3>
                      <button
                        v-if="selectedFiles.length > 0"
                        type="button"
                        @click="clearSelectedFiles"
                        class="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        ล้างค่า
                      </button>
                    </div>
                    
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 transition-colors duration-200">
                      <input
                        ref="fileInput"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        @change="handleFileUpload"
                        class="hidden"
                      />
                      <div @click="$refs.fileInput.click()" class="cursor-pointer">
                        <Upload class="mx-auto h-8 w-8 text-gray-400" />
                        <p v-if="selectedFiles.length === 0" class="mt-1 text-xs text-gray-600">
                          <span class="font-medium text-teal-600">คลิกเพื่อเลือกไฟล์</span> หรือลากมาวาง
                        </p>
                        <div v-else class="mt-1">
                          <p class="text-xs text-teal-600 font-medium">เลือกไฟล์แล้ว {{ selectedFiles.length }} ไฟล์</p>
                          <div class="mt-2 space-y-1">
                            <p v-for="file in selectedFiles" :key="file.name" class="text-xs text-gray-600 truncate">
                              {{ file.name }}
                            </p>
                          </div>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC, DOCX (สูงสุด 10MB)</p>
                      </div>
                    </div>

                    <!-- Selected Files Info -->
                    <div v-if="selectedFiles.length > 0" class="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <p class="text-xs text-teal-800 mb-2">ไฟล์ที่เลือก: {{ selectedFiles.length }} ไฟล์</p>
                      <div class="space-y-2">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            คำอธิบาย <span class="text-xs text-gray-500">(ไม่บังคับ)</span> 
                          </label>
                          <input
                            v-model="fileDescription"
                            type="text"
                            placeholder="เช่น บัตรประชาชน, เอกสารทางการแพทย์"
                            class="w-full px-3 py-2 text-xs border border-gray-200 rounded shadow-sm bg-white text-gray-700 hover:border-teal-400 placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-300/80 focus:outline-none transition-colors duration-200"
                          />
                        </div>
                        

                        <div class="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            @click="cancelFileUpload"
                            class="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors duration-200"
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="button"
                            @click="confirmFileUpload"
                            class="px-3 py-1 text-xs font-medium text-white bg-teal-600 border border-transparent rounded hover:bg-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors duration-200"
                          >
                            อัปโหลด
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Files List -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-gray-900">ไฟล์แนบ</h3>
                      <span class="text-sm text-gray-500">{{ patientFiles.length }} ไฟล์</span>
                    </div>

                    <!-- Loading State -->
                    <div v-if="uploadingFiles" class="text-center py-8">
                      <div class="inline-flex items-center space-x-2">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span class="text-gray-600">กำลังอัปโหลด...</span>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="patientFiles.length === 0" class="text-center py-12">
                      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText class="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีเอกสารแนบ</h3>
                      <p class="text-gray-500">อัปโหลดเอกสารเพื่อเก็บไว้ในระบบ</p>
                    </div>

                    <!-- Files Grid -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="file in patientFiles" :key="file.id" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-start space-x-3">
                          <!-- File Icon -->
                          <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <component 
                                :is="getFileIcon(file)" 
                                :class="['h-6 w-6', getFileIconColor(file)]" 
                              />
                            </div>
                          </div>

                          <!-- File Info -->
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">{{ file.description || 'เอกสาร' }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ formatFileSize(file.size) }} • {{ formatDate(file.createdAt) }}</p>
                          </div>

                          <!-- Actions -->
                          <div class="flex items-center space-x-1">
                            <button
                              type="button"
                              @click="downloadFile(file)"
                              class="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                              v-tooltip.bottom="'ดาวน์โหลด'"
                            >
                              <Download class="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              @click="deleteFile(file)"
                              class="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                              v-tooltip.bottom="'ลบ'"                            >
                              <X class="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </TransitionRoot>

  <!-- Confirm Close Popover -->
  <ConfirmClosePopover
    v-if="showConfirmClose"
    @confirm="forceClose"
    @cancel="showConfirmClose = false"
  />
</template>

<script>
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check, Plus, Trash2, Upload, FileText, Download, X, Image as ImageIcon, File } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import TagDropdown from '@/components/dropdown/TagDropdown.vue'
import BranchDropdown from '@/components/dropdown/BranchDropdown.vue'
import PatientGroupDropdown from '@/components/dropdown/PatientGroupDropdown.vue'
import InsuranceTypeDropdown from '@/components/dropdown/InsuranceTypeDropdown.vue'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { addressService } from '@/services/external/address.service'

export default {
  name: 'PatientModal',
  components: {
    HeadlessDialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ChevronDown,
    Check,
    Plus,
    Trash2,
    Upload,
    FileText,
    ImageIcon,
    File,
    Download,
    X,
    TagDropdown,
    VueDatePicker,
    BranchDropdown,
    PatientGroupDropdown,
    InsuranceTypeDropdown,
    ConfirmClosePopover
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    initialData: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      activeTab: 'personal',
      familyMember: {
        name: '',
        relationship: ''
      },
      contactPersons: [
        {
          id: 1,
          name: '',
          phone: '',
          relationship: ''
        }
      ],
      nextContactId: 2,
      form: {
        hn: '',
        prefix: '',
        first_name: '',
        last_name: '',
        nickname: '',
        first_name_en: '',
        last_name_en: '',
        gender: '',
        birth_date: '',
        national_id: '',
        passport_no: '',
        nationality: '',
        religion: '',
        marital_status: '',
        education_level: '',
        blood_group: '',
        phone_1: '',
        phone_2: '',
        email: '',
        address: '',
        sub_district: '',
        district: '',
        province: '',
        postal_code: '',
        company_name: '',
        company_tax_id: '',
        company_phone: '',
        company_email: '',
        company_address: '',
        company_subdistrict: '',
        company_district: '',
        company_province: '',
        company_postal_code: '',
        weight: '',
        height: '',
        waist: '',
        chest: '',
        allergy_history: '',
        mental_health: '',
        underlying_disease: '',
        health_note: '',
        treatment_type: '',
        insurance_type_id: null,
        patient_group_id: null,
        branchId: null,
        points: 0,
        balance: 0.0,
        isActive: true,
        note: '',
        tagIds: []
      },
      selectedTags: [],
      showPrefixDropdown: false,
      showConfirmClose: false,
      originalSnapshot: null,
      showGenderDropdown: false,
      showNationalityDropdown: false,
      showReligionDropdown: false,
      showEducationLevelDropdown: false,
      showMaritalStatusDropdown: false,
      showBloodGroupDropdown: false,
      showRelationshipDropdowns: {},
      tabs: [
        { id: 'personal', name: 'ข้อมูลส่วนตัว' },
        { id: 'health', name: 'ข้อมูลสุขภาพ' },
        { id: 'contact', name: 'ข้อมูลติดต่อ' },
        { id: 'company', name: 'ข้อมูลบริษัท' },
        { id: 'documents', name: 'ไฟล์' }
      ],
      statusOptions: [
        { label: 'ปกติ', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],
      prefixOptions: [
        'ไม่ระบุ',
        // บุคคลทั่วไป
        'นาย',
        'นาง',
        'นางสาว',
        'เด็กชาย',
        'เด็กหญิง',
        // ศาสนา
        'พระ',
        'พระครู',
        'พระมหา',
        'พระอาจารย์',
        'พระสมุห์',
        'พระปลัด',
        'แม่ชี',
        'บาทหลวง',
        'ซิสเตอร์',
        'อิหม่าม',
        'ซัยยิด',
        // ราชวงศ์ / ชนชั้นสูง
        'หม่อมเจ้า',
        'หม่อมราชวงศ์',
        'หม่อมหลวง',
        'หม่อม',
        'คุณชาย',
        'คุณหญิง',
        'ศาสตราจารย์',
        'รศ.ดร.',
        'ผศ.ดร.',
        'ดร.',
        'พลเอก',
        'พลตำรวจเอก'
      ],
      genderOptions: ['ไม่ระบุ', 'ชาย', 'หญิง'],
      nationalityOptions: [
        'ไม่ระบุ',
        'ไทย',
        'ต่างชาติ',
        'ลาว',
        'กัมพูชา',
        'เมียนมา',
        'เวียดนาม',
        'จีน',
        'ญี่ปุ่น',
        'เกาหลี',
        'ฟิลิปปินส์',
        'อินโดนีเซีย',
        'มาเลเซีย',
        'สิงคโปร์',
        'อินเดีย',
        'ปากีสถาน',
        'บังกลาเทศ',
        'ศรีลังกา',
        'อังกฤษ',
        'ฝรั่งเศส',
        'เยอรมัน',
        'สหรัฐอเมริกา',
        'แคนาดา',
        'ออสเตรเลีย',
        'รัสเซีย'
      ],
      religionOptions: ['ไม่ระบุ', 'พุทธ', 'คริสต์', 'อิสลาม', 'ฮินดู', 'ซิกข์'],
      educationLevelOptions: [
        'ไม่ระบุ',
        'ประถมศึกษา',
        'มัธยมศึกษาตอนต้น',
        'มัธยมศึกษาตอนปลาย',
        'ประกาศนียบัตรวิชาชีพ',
        'ประกาศนียบัตรวิชาชีพชั้นสูง',
        'ปริญญาตรี',
        'ปริญญาโท',
        'ปริญญาเอก'
      ],
      maritalStatusOptions: ['ไม่ระบุ', 'โสด', 'สมรส', 'หย่า', 'หม้าย'],
      bloodGroupOptions: ['ไม่ระบุ', 'A', 'B', 'AB', 'O'],
      treatmentTypeOptions: ['OPD ผู้ป่วยนอก', 'IPD ผู้ป่วยใน'],
      relationshipOptions: [
        'ไม่ระบุ',
        'พ่อ',
        'แม่',
        'ลูกชาย',
        'ลูกสาว',
        'พี่ชาย',
        'พี่สาว',
        'น้องชาย',
        'น้องสาว',
        'ปู่',
        'ย่า',
        'ตา',
        'ยาย',
        'ลุง',
        'ป้า',
        'น้า',
        'อา',
        'ญาติ',
        'เพื่อน',
        'เพื่อนร่วมงาน',
        'เพื่อนบ้าน',
      ],

      // Address dropdown states
      showProvinceDropdown: false,
      showDistrictDropdown: false,
      showSubDistrictDropdown: false,
      showPostalCodeDropdown: false,

      // Company Address dropdown states
      showCompanyProvinceDropdown: false,
      showCompanyDistrictDropdown: false,
      showCompanySubDistrictDropdown: false,
      showCompanyPostalCodeDropdown: false,

      // Address data
      provinces: [],
      districts: [],
      subDistricts: [],
      postcodes: [],

      // Company Address data
      companyProvinces: [],
      companyDistricts: [],
      companySubDistricts: [],
      companyPostcodes: [],

      // Selected values for Listbox
      selectedProvince: null,
      selectedDistrict: null,
      selectedSubDistrict: null,
      selectedPostcode: null,

      // Selected values for Company Listbox
      selectedCompanyProvince: null,
      selectedCompanyDistrict: null,
      selectedCompanySubDistrict: null,
      selectedCompanyPostcode: null,

      // Search queries
      provinceSearchQuery: '',
      districtSearchQuery: '',
      subDistrictSearchQuery: '',
      postalCodeSearchQuery: '',

      // Company Search queries
      companyProvinceSearchQuery: '',
      companyDistrictSearchQuery: '',
      companySubDistrictSearchQuery: '',
      companyPostalCodeSearchQuery: '',

      // Dropdown states for animation
      showTreatmentTypeDropdown: false,

      // File management
      patientFiles: [],
      uploadingFiles: false,
      selectedFiles: [],
      fileDescription: ''
    }
  },
  computed: {
    isEdit() {
      return !!this.initialData
    },

    filteredProvinces() {
      if (!this.provinceSearchQuery) return this.provinces
      return this.provinces.filter(province =>
        province.name_th.toLowerCase().includes(this.provinceSearchQuery.toLowerCase())
      )
    },

    filteredDistricts() {
      if (!this.districtSearchQuery) return this.districts
      return this.districts.filter(district =>
        district.name_th.toLowerCase().includes(this.districtSearchQuery.toLowerCase())
      )
    },

    filteredSubDistricts() {
      if (!this.subDistrictSearchQuery) return this.subDistricts
      return this.subDistricts.filter(subDistrict =>
        subDistrict.name_th.toLowerCase().includes(this.subDistrictSearchQuery.toLowerCase())
      )
    },

    filteredPostcodes() {
      if (!this.postalCodeSearchQuery) return this.postcodes
      return this.postcodes.filter(postcode =>
        postcode.postcode.includes(this.postalCodeSearchQuery)
      )
    },

    // Company Address computed properties
    filteredCompanyProvinces() {
      if (!this.companyProvinceSearchQuery) return this.companyProvinces
      return this.companyProvinces.filter(province =>
        province.name_th.toLowerCase().includes(this.companyProvinceSearchQuery.toLowerCase())
      )
    },

    filteredCompanyDistricts() {
      if (!this.companyDistrictSearchQuery) return this.companyDistricts
      return this.companyDistricts.filter(district =>
        district.name_th.toLowerCase().includes(this.companyDistrictSearchQuery.toLowerCase())
      )
    },

    filteredCompanySubDistricts() {
      if (!this.companySubDistrictSearchQuery) return this.companySubDistricts
      return this.companySubDistricts.filter(subDistrict =>
        subDistrict.name_th.toLowerCase().includes(this.companySubDistrictSearchQuery.toLowerCase())
      )
    },

    filteredCompanyPostcodes() {
      if (!this.companyPostalCodeSearchQuery) return this.companyPostcodes
      return this.companyPostcodes.filter(postcode =>
        postcode.postcode.includes(this.companyPostalCodeSearchQuery)
      )
    }
  },
  mounted() {
    this.loadProvinces()
    this.loadCompanyProvinces()
  },
  methods: {
    isTagSelected(tagId) {
      return this.selectedTags.some(t => t.id === tagId)
    },
    async handleSubmit() {
      try {
        const formData = {
          ...this.form,
          tagIds: this.selectedTags.map(tag => tag.id)
        }

        await this.$emit('save', formData)
      } catch (error) {
        console.error('Error saving patient:', error)
      }
    },
    onClose() {
      const isDirty = JSON.stringify(this.form) !== this.originalSnapshot
      if (isDirty) {
        this.showConfirmClose = true
        return
      }
      this.resetForm()
      this.$emit('update:modelValue', false)
    },
    requestClose() {
      this.onClose()
    },
    forceClose() {
      this.resetForm()
      this.showConfirmClose = false
      this.$emit('update:modelValue', false)
    },
    selectPrefix(prefix) {
      this.form.prefix = prefix
      this.showPrefixDropdown = false
    },
    hidePrefixDropdown() {
      setTimeout(() => {
        this.showPrefixDropdown = false
      }, 200)
    },
    handlePrefixInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.prefixOptions.some(
        option => option.toLowerCase() === this.form.prefix.toLowerCase()
      )

      if (!isMatching && this.form.prefix.length > 0) {
        this.showPrefixDropdown = false
      } else if (this.form.prefix.length === 0) {
        this.showPrefixDropdown = true
      }
    },
    clearPrefix() {
      this.form.prefix = ''
      this.showPrefixDropdown = true
    },
    selectGender(gender) {
      this.form.gender = gender
      this.showGenderDropdown = false
    },
    hideGenderDropdown() {
      setTimeout(() => {
        this.showGenderDropdown = false
      }, 200)
    },
    handleGenderInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.genderOptions.some(
        option => option.toLowerCase() === this.form.gender.toLowerCase()
      )

      if (!isMatching && this.form.gender.length > 0) {
        this.showGenderDropdown = false
      } else if (this.form.gender.length === 0) {
        this.showGenderDropdown = true
      }
    },
    clearGender() {
      this.form.gender = ''
      this.showGenderDropdown = true
    },
    selectNationality(nationality) {
      this.form.nationality = nationality
      this.showNationalityDropdown = false
    },
    hideNationalityDropdown() {
      setTimeout(() => {
        this.showNationalityDropdown = false
      }, 200)
    },
    handleNationalityInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.nationalityOptions.some(
        option => option.toLowerCase() === this.form.nationality.toLowerCase()
      )

      if (!isMatching && this.form.nationality.length > 0) {
        this.showNationalityDropdown = false
      } else if (this.form.nationality.length === 0) {
        this.showNationalityDropdown = true
      }
    },
    clearNationality() {
      this.form.nationality = ''
      this.showNationalityDropdown = true
    },
    selectReligion(religion) {
      this.form.religion = religion
      this.showReligionDropdown = false
    },
    hideReligionDropdown() {
      setTimeout(() => {
        this.showReligionDropdown = false
      }, 200)
    },
    handleReligionInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.religionOptions.some(
        option => option.toLowerCase() === this.form.religion.toLowerCase()
      )

      if (!isMatching && this.form.religion.length > 0) {
        this.showReligionDropdown = false
      } else if (this.form.religion.length === 0) {
        this.showReligionDropdown = true
      }
    },
    clearReligion() {
      this.form.religion = ''
      this.showReligionDropdown = true
    },
    selectEducationLevel(level) {
      this.form.education_level = level
      this.showEducationLevelDropdown = false
    },
    hideEducationLevelDropdown() {
      setTimeout(() => {
        this.showEducationLevelDropdown = false
      }, 200)
    },
    handleEducationLevelInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.educationLevelOptions.some(
        option => option.toLowerCase() === this.form.education_level.toLowerCase()
      )

      if (!isMatching && this.form.education_level.length > 0) {
        this.showEducationLevelDropdown = false
      } else if (this.form.education_level.length === 0) {
        this.showEducationLevelDropdown = true
      }
    },
    clearEducationLevel() {
      this.form.education_level = ''
      this.showEducationLevelDropdown = true
    },
    selectMaritalStatus(status) {
      this.form.marital_status = status
      this.showMaritalStatusDropdown = false
    },
    hideMaritalStatusDropdown() {
      setTimeout(() => {
        this.showMaritalStatusDropdown = false
      }, 200)
    },
    handleMaritalStatusInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.maritalStatusOptions.some(
        option => option.toLowerCase() === this.form.marital_status.toLowerCase()
      )

      if (!isMatching && this.form.marital_status.length > 0) {
        this.showMaritalStatusDropdown = false
      } else if (this.form.marital_status.length === 0) {
        this.showMaritalStatusDropdown = true
      }
    },
    clearMaritalStatus() {
      this.form.marital_status = ''
      this.showMaritalStatusDropdown = true
    },
    selectBloodGroup(group) {
      this.form.blood_group = group
      this.showBloodGroupDropdown = false
    },
    hideBloodGroupDropdown() {
      setTimeout(() => {
        this.showBloodGroupDropdown = false
      }, 200)
    },
    handleBloodGroupInput() {
      // ถ้าพิมพ์คำที่ไม่ตรงกับรายการ ให้ปิด dropdown
      const isMatching = this.bloodGroupOptions.some(
        option => option.toLowerCase() === this.form.blood_group.toLowerCase()
      )

      if (!isMatching && this.form.blood_group.length > 0) {
        this.showBloodGroupDropdown = false
      } else if (this.form.blood_group.length === 0) {
        this.showBloodGroupDropdown = true
      }
    },
    clearBloodGroup() {
      this.form.blood_group = ''
      this.showBloodGroupDropdown = true
    },
    resetForm() {
      this.form = {
        hn: '',
        prefix: 'ไม่ระบุ',
        first_name: '',
        last_name: '',
        nickname: '',
        first_name_en: '',
        last_name_en: '',
        gender: 'ไม่ระบุ',
        birth_date: '',
        national_id: '',
        passport_no: '',
        nationality: 'ไม่ระบุ',
        religion: 'ไม่ระบุ',
        marital_status: 'ไม่ระบุ',
        education_level: 'ไม่ระบุ',
        blood_group: 'ไม่ระบุ',
        phone_1: '',
        phone_2: '',
        email: '',
        address: '',
        sub_district: '',
        district: '',
        province: '',
        postal_code: '',
        company_name: '',
        company_tax_id: '',
        company_phone: '',
        company_email: '',
        company_address: '',
        company_subdistrict: '',
        company_district: '',
        company_province: '',
        company_postal_code: '',
        weight: '',
        height: '',
        waist: '',
        chest: '',
        allergy_history: '',
        mental_health: '',
        underlying_disease: '',
        health_note: '',
        treatment_type: '',
        insurance_type_id: null,
        patient_group_id: null,
        branchId: null,
        points: 0,
        balance: 0.0,
        isActive: true,
        note: '',
        tagIds: []
      }
      this.selectedTags = []
      this.activeTab = 'personal'
      this.contactPersons = [
        {
          id: 1,
          name: '',
          phone: '',
          relationship: ''
        }
      ]
      this.nextContactId = 2
      this.showRelationshipDropdowns = {}
      
      // Reset Company Address
      this.selectedCompanyProvince = null
      this.selectedCompanyDistrict = null
      this.selectedCompanySubDistrict = null
      this.selectedCompanyPostcode = null
      this.companyDistricts = []
      this.companySubDistricts = []
      this.companyPostcodes = []
      this.companyProvinceSearchQuery = ''
      this.companyDistrictSearchQuery = ''
      this.companySubDistrictSearchQuery = ''
      this.companyPostalCodeSearchQuery = ''
      
      this.originalSnapshot = JSON.stringify(this.form)
    },

    // Address methods
    async loadProvinces() {
      try {
        const result = await addressService.getProvinces()
        if (result.success) {
          this.provinces = result.data
        }
      } catch (error) {
        console.error('Error loading provinces:', error)
      }
    },

    async loadDistricts(provinceName) {
      try {
        const result = await addressService.getDistricts(provinceName)
        if (result.success) {
          this.districts = result.data
        }
      } catch (error) {
        console.error('Error loading districts:', error)
      }
    },

    async loadSubDistricts(districtName) {
      try {
        const result = await addressService.getSubDistricts(districtName)
        if (result.success) {
          this.subDistricts = result.data
        }
      } catch (error) {
        console.error('Error loading sub-districts:', error)
      }
    },

    async loadPostcodes(subDistrictName) {
      try {
        const result = await addressService.getPostcodes(subDistrictName)
        if (result.success) {
          this.postcodes = result.data
        }
      } catch (error) {
        console.error('Error loading postcodes:', error)
      }
    },

    // Province methods
    onProvinceChange(province) {
      if (province) {
        this.form.province = province.name_th
        this.showProvinceDropdown = false

        // Clear dependent fields
        this.form.district = ''
        this.form.sub_district = ''
        this.form.postal_code = ''
        this.selectedDistrict = null
        this.selectedSubDistrict = null
        this.selectedPostcode = null
        this.districts = []
        this.subDistricts = []
        this.postcodes = []

        // Load districts for selected province
        this.loadDistricts(province.name_th)
      }
    },

    selectProvince(province) {
      this.form.province = province.name_th
      this.showProvinceDropdown = false

      // Clear dependent fields
      this.form.district = ''
      this.form.sub_district = ''
      this.form.postal_code = ''
      this.districts = []
      this.subDistricts = []
      this.postcodes = []

      // Load districts for selected province
      this.loadDistricts(province.name_th)
    },

    hideProvinceDropdown() {
      setTimeout(() => {
        this.showProvinceDropdown = false
      }, 200)
    },

    clearProvince() {
      this.form.province = ''
      this.form.district = ''
      this.form.sub_district = ''
      this.form.postal_code = ''
      this.districts = []
      this.subDistricts = []
      this.postcodes = []
      this.showProvinceDropdown = true
    },

    // District methods
    onDistrictChange(district) {
      if (district) {
        this.form.district = district.name_th
        this.showDistrictDropdown = false

        // Clear dependent fields
        this.form.sub_district = ''
        this.form.postal_code = ''
        this.selectedSubDistrict = null
        this.selectedPostcode = null
        this.subDistricts = []
        this.postcodes = []

        // Load sub-districts for selected district
        this.loadSubDistricts(district.name_th)
      }
    },

    selectDistrict(district) {
      this.form.district = district.name_th
      this.showDistrictDropdown = false

      // Clear dependent fields
      this.form.sub_district = ''
      this.form.postal_code = ''
      this.subDistricts = []
      this.postcodes = []

      // Load sub-districts for selected district
      this.loadSubDistricts(district.name_th)
    },

    hideDistrictDropdown() {
      setTimeout(() => {
        this.showDistrictDropdown = false
      }, 200)
    },

    clearDistrict() {
      this.form.district = ''
      this.form.sub_district = ''
      this.form.postal_code = ''
      this.subDistricts = []
      this.postcodes = []
      this.showDistrictDropdown = true
    },

    // Sub-district methods
    onSubDistrictChange(subDistrict) {
      if (subDistrict) {
        this.form.sub_district = subDistrict.name_th
        this.showSubDistrictDropdown = false

        // Clear dependent fields
        this.form.postal_code = ''
        this.selectedPostcode = null
        this.postcodes = []

        // Load postcodes for selected sub-district
        this.loadPostcodes(subDistrict.name_th)
      }
    },

    selectSubDistrict(subDistrict) {
      this.form.sub_district = subDistrict.name_th
      this.showSubDistrictDropdown = false

      // Clear dependent fields
      this.form.postal_code = ''
      this.postcodes = []

      // Load postcodes for selected sub-district
      this.loadPostcodes(subDistrict.name_th)
    },

    hideSubDistrictDropdown() {
      setTimeout(() => {
        this.showSubDistrictDropdown = false
      }, 200)
    },

    clearSubDistrict() {
      this.form.sub_district = ''
      this.form.postal_code = ''
      this.postcodes = []
      this.showSubDistrictDropdown = true
    },

    // Postal code methods
    onPostalCodeChange(postcode) {
      if (postcode) {
        this.form.postal_code = postcode.postcode
        this.showPostalCodeDropdown = false
      }
    },

    selectPostalCode(postcode) {
      this.form.postal_code = postcode.postcode
      this.showPostalCodeDropdown = false
    },

    hidePostalCodeDropdown() {
      setTimeout(() => {
        this.showPostalCodeDropdown = false
      }, 200)
    },

    clearPostalCode() {
      this.form.postal_code = ''
      this.showPostalCodeDropdown = true
    },

    // Company Address methods
    async loadCompanyProvinces() {
      try {
        const result = await addressService.getProvinces()
        if (result.success) {
          this.companyProvinces = result.data
        }
      } catch (error) {
        console.error('Error loading company provinces:', error)
      }
    },

    async loadCompanyDistricts(provinceName) {
      try {
        const result = await addressService.getDistricts(provinceName)
        if (result.success) {
          this.companyDistricts = result.data
        }
      } catch (error) {
        console.error('Error loading company districts:', error)
      }
    },

    async loadCompanySubDistricts(districtName) {
      try {
        const result = await addressService.getSubDistricts(districtName)
        if (result.success) {
          this.companySubDistricts = result.data
        }
      } catch (error) {
        console.error('Error loading company sub-districts:', error)
      }
    },

    async loadCompanyPostcodes(subDistrictName) {
      try {
        const result = await addressService.getPostcodes(subDistrictName)
        if (result.success) {
          this.companyPostcodes = result.data
        }
      } catch (error) {
        console.error('Error loading company postcodes:', error)
      }
    },

    // Company Province methods
    onCompanyProvinceChange(province) {
      if (province) {
        this.form.company_province = province.name_th
        this.showCompanyProvinceDropdown = false

        // Clear dependent fields
        this.form.company_district = ''
        this.form.company_subdistrict = ''
        this.form.company_postal_code = ''
        this.selectedCompanyDistrict = null
        this.selectedCompanySubDistrict = null
        this.selectedCompanyPostcode = null
        this.companyDistricts = []
        this.companySubDistricts = []
        this.companyPostcodes = []

        // Load districts for selected province
        this.loadCompanyDistricts(province.name_th)
      }
    },

    // Company District methods
    onCompanyDistrictChange(district) {
      if (district) {
        this.form.company_district = district.name_th
        this.showCompanyDistrictDropdown = false

        // Clear dependent fields
        this.form.company_subdistrict = ''
        this.form.company_postal_code = ''
        this.selectedCompanySubDistrict = null
        this.selectedCompanyPostcode = null
        this.companySubDistricts = []
        this.companyPostcodes = []

        // Load sub-districts for selected district
        this.loadCompanySubDistricts(district.name_th)
      }
    },

    // Company Sub-district methods
    onCompanySubDistrictChange(subDistrict) {
      if (subDistrict) {
        this.form.company_subdistrict = subDistrict.name_th
        this.showCompanySubDistrictDropdown = false

        // Clear dependent fields
        this.form.company_postal_code = ''
        this.selectedCompanyPostcode = null
        this.companyPostcodes = []

        // Load postcodes for selected sub-district
        this.loadCompanyPostcodes(subDistrict.name_th)
      }
    },

    // Company Postal code methods
    onCompanyPostalCodeChange(postcode) {
      if (postcode) {
        this.form.company_postal_code = postcode.postcode
        this.showCompanyPostalCodeDropdown = false
      }
    },

    // Contact Person Methods
    addContactPerson() {
      this.contactPersons.push({
        id: this.nextContactId,
        name: '',
        phone: '',
        relationship: ''
      })
      this.nextContactId++
    },

    removeContactPerson(contactId) {
      const index = this.contactPersons.findIndex(contact => contact.id === contactId)
      if (index > -1) {
        this.contactPersons.splice(index, 1)
        // ลบ dropdown state ของ contact ที่ถูกลบ
        delete this.showRelationshipDropdowns[contactId]
      }
    },

    // Relationship Dropdown Methods
    showRelationshipDropdown(contactId) {
      this.showRelationshipDropdowns[contactId] = true
    },

    hideRelationshipDropdown(contactId) {
      setTimeout(() => {
        this.showRelationshipDropdowns[contactId] = false
      }, 200)
    },

    toggleRelationshipDropdown(contactId) {
      this.showRelationshipDropdowns[contactId] = !this.showRelationshipDropdowns[contactId]
    },

    selectRelationship(contactId, relationship) {
      const contact = this.contactPersons.find(c => c.id === contactId)
      if (contact) {
        contact.relationship = relationship
      }
      this.showRelationshipDropdowns[contactId] = false
    },

    handleRelationshipInput(contactId) {
      const contact = this.contactPersons.find(c => c.id === contactId)
      if (contact) {
        const isMatching = this.relationshipOptions.some(
          option => option.toLowerCase() === contact.relationship.toLowerCase()
        )

        if (!isMatching && contact.relationship.length > 0) {
          this.showRelationshipDropdowns[contactId] = false
        } else if (contact.relationship.length === 0) {
          this.showRelationshipDropdowns[contactId] = true
        }
      }
    },

    clearRelationship(contactId) {
      const contact = this.contactPersons.find(c => c.id === contactId)
      if (contact) {
        contact.relationship = ''
      }
      this.showRelationshipDropdowns[contactId] = true
    },

    // File management methods
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      this.selectedFiles = files
      // TODO: Implement file upload logic
    },


    cancelFileUpload() {
      this.selectedFiles = []
      this.fileDescription = ''
      this.$refs.fileInput.value = ''
    },

    clearSelectedFiles() {
      if (this.selectedFiles.length === 0) return
      
      this.selectedFiles = []
      this.fileDescription = ''
      this.$refs.fileInput.value = ''
      
      // แสดง Swal toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'ล้างค่าไฟล์เรียบร้อยแล้ว'
      })
    },

    async confirmFileUpload() {
      if (this.selectedFiles.length === 0) return
      
      // แสดง SweetAlert ยืนยันการอัปโหลด
      const result = await Swal.fire({
        title: 'ยืนยันการอัปโหลดไฟล์',
        text: `ต้องการอัปโหลด ${this.selectedFiles.length} ไฟล์${this.fileDescription ? ` (${this.fileDescription})` : ''} หรือไม่?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#14b8a6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'อัปโหลด',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      
      if (!result.isConfirmed) return
      
      this.uploadingFiles = true
      
      // แสดง loading
      Swal.fire({
        title: 'กำลังอัปโหลด...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      try {
      
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Add mock files for demonstration
        const mockFiles = this.selectedFiles.map((file, index) => ({
          id: Date.now() + index,
          url: URL.createObjectURL(file),
          name: file.name, // เพิ่ม name field
          description: this.fileDescription || file.name,
          size: file.size,
          createdAt: new Date().toISOString()
        }))
        
        this.patientFiles.push(...mockFiles)
        
        // เก็บจำนวนไฟล์ก่อนล้างค่า
        const fileCount = this.selectedFiles.length
        this.cancelFileUpload()
        
        // แสดง Swal toast
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: `อัปโหลด ${fileCount} ไฟล์เรียบร้อยแล้ว`
        })
      } catch (error) {
        console.error('Error uploading files:', error)
        
        // แสดง error message
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถอัปโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        })
      } finally {
        this.uploadingFiles = false
      }
    },

    getFileTypeFromExtension(filename) {
      const extension = filename.split('.').pop().toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image'
      if (extension === 'pdf') return 'pdf'
      if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'document'
      return 'other'
    },

    getFileIcon(file) {
      const extension = file.name ? file.name.split('.').pop().toLowerCase() : ''
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'ImageIcon'
      }
      if (extension === 'pdf') {
        return 'FileText' // ใช้ FileText สำหรับ PDF
      }
      if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        return 'FileText'
      }
      return 'File'
    },

    getFileIconColor(file) {
      const extension = file.name ? file.name.split('.').pop().toLowerCase() : ''
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'text-green-400'
      }
      if (extension === 'pdf') {
        return 'text-rose-400'
      }
      if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        return 'text-sky-400'
      }
      return 'text-teal-400'
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    downloadFile(file) {
      console.log('Download file:', file)
      // TODO: Implement file download logic
      
      // แสดง SweetAlert สำหรับการดาวน์โหลด
      Swal.fire({
        title: 'กำลังดาวน์โหลด...',
        text: `กำลังดาวน์โหลดไฟล์ ${file.description || 'เอกสาร'}`,
        icon: 'info',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      })
      
      // For now, open in new tab
      setTimeout(() => {
        window.open(file.url, '_blank')
      }, 500)
    },

    async deleteFile(file) {
      // แสดง SweetAlert ยืนยันการลบ
      const result = await Swal.fire({
        title: 'ยืนยันการลบไฟล์',
        text: `ต้องการลบไฟล์ "${file.description || 'เอกสาร'}" หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'ลบไฟล์',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      
      if (!result.isConfirmed) return
      
      try {
        // TODO: Implement file delete API
        
        // ลบไฟล์จากรายการ
        const index = this.patientFiles.findIndex(f => f.id === file.id)
        if (index > -1) {
          this.patientFiles.splice(index, 1)
        }
        
        // แสดง Swal toast
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: 'ลบไฟล์เรียบร้อยแล้ว'
        })
      } catch (error) {
        console.error('Error deleting file:', error)
        
        // แสดง error message
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถลบไฟล์ได้ กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        })
      }
    },

    async loadPatientFiles() {
      if (this.activeTab === 'documents' && this.initialData?.id) {
        try {
          // TODO: Implement API call to load patient files
          
          // Mock data for demonstration
          this.patientFiles = [
            {
              id: 1,
              url: '#',
              name: 'id_card.jpg',
              description: 'บัตรประชาชน',
              size: 1024000,
              createdAt: '2024-01-15T10:30:00Z'
            },
            {
              id: 2,
              url: '#',
              name: 'lab_result.pdf',
              description: 'ผลแล็บเลือด',
              size: 2048000,
              createdAt: '2024-01-14T14:20:00Z'
            },
            {
              id: 3,
              url: '#',
              name: 'medical_cert.docx',
              description: 'ใบรับรองแพทย์',
              size: 512000,
              createdAt: '2024-01-13T09:15:00Z'
            }
          ]
        } catch (error) {
          console.error('Error loading patient files:', error)
        }
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (newVal) {
          if (this.initialData) {
            this.form = { ...this.initialData }
            this.selectedTags = this.initialData.patientTags
              ? this.initialData.patientTags.map(pt => pt.tag)
              : []

            // Set selected values for Listbox
            if (this.form.province) {
              this.selectedProvince =
                this.provinces.find(p => p.name_th === this.form.province) || null
            }
          } else {
            this.resetForm()
          }
          // บันทึก originalSnapshot เพื่อเปรียบเทียบการเปลี่ยนแปลง
          this.originalSnapshot = JSON.stringify(this.form)
        }
      },
      immediate: false
    },

    activeTab: {
      handler(newTab) {
        if (newTab === 'documents') {
          this.loadPatientFiles()
        }
      }
    }
  }
}
</script>

<style scoped>
:deep(.dp-custom-input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  height: 42px;
}

:deep(.dp-custom-input:hover) {
  border-color: #10b981;
}

:deep(.dp-custom-input:focus) {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

:deep(.dp__input_wrap) {
  height: 42px;
}

:deep(.dp__input) {
  height: 42px;
  padding: 0.5rem 0.75rem;
  padding-left: 2.5rem;
}

:deep(.dp__input_icon) {
  left: 0.5rem;
  right: auto;
}

:deep(.dp__input_icon_pad) {
  padding-left: 2.5rem;
}
</style>
