<template>
  <TransitionRoot as="template" :show="modelValue">
    <HeadlessDialog as="div" class="relative z-50" @close="$emit('update:modelValue', false)">
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
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
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
                    @click="$emit('update:modelValue', false)"
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
              <form id="patient-form" @submit.prevent="handleSubmit" class="px-6 py-6">
                <!-- Personal Information Tab -->
                <div v-if="activeTab === 'personal'" class="space-y-6">
                  <div class="grid grid-cols-12 gap-6">
                    <!-- Profile Picture -->
                    <div class="col-span-3">
                      <div class="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-teal-400 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                        <div class="text-white text-center">
                          <div class="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
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
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            placeholder="ระบบจะสร้างให้อัตโนมัติ"
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                          <div class="flex items-center">
                            <button
                              type="button"
                              @click="form.isActive = !form.isActive"
                              :class="[
                                form.isActive ? 'bg-emerald-600' : 'bg-gray-200',
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
                          <label class="block text-sm font-medium text-gray-700 mb-1">แต้มสะสม</label>
                          <input
                            v-model="form.points"
                            type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">วงเงินคงเหลือ</label>
                          <input
                            v-model="form.balance"
                            type="number"
                            step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">คำนำหน้า *</label>
                            <Listbox v-model="form.prefix">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.prefix || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="prefix in prefixOptions"
                                    :key="prefix"
                                    :value="prefix"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ prefix }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">เพศ *</label>
                            <Listbox v-model="form.gender">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.gender || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="gender in genderOptions"
                                    :key="gender"
                                    :value="gender"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ gender }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">สัญชาติ *</label>
                            <Listbox v-model="form.nationality">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.nationality || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="nationality in nationalityOptions"
                                    :key="nationality"
                                    :value="nationality"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ nationality }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ศาสนา *</label>
                            <Listbox v-model="form.religion">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.religion || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="religion in religionOptions"
                                    :key="religion"
                                    :value="religion"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ religion }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                        </div>

                        <!-- Row 2: 4 columns -->
                        <div class="grid grid-cols-4 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ระดับการศึกษา *</label>
                            <Listbox v-model="form.education_level">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.education_level || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="level in educationLevelOptions"
                                    :key="level"
                                    :value="level"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ level }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">สถานะภาพสมรส *</label>
                            <Listbox v-model="form.marital_status">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.marital_status || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="status in maritalStatusOptions"
                                    :key="status"
                                    :value="status"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ status }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">กรุ๊บเลือด *</label>
                            <Listbox v-model="form.blood_group">
                              <div class="relative">
                                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                  <span class="block truncate">{{ form.blood_group || 'ไม่ระบุ' }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown class="h-5 w-5 text-gray-400" />
                                  </span>
                                </ListboxButton>
                                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ListboxOption
                                    v-for="group in bloodGroupOptions"
                                    :key="group"
                                    :value="group"
                                    v-slot="{ active, selected }"
                                  >
                                    <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ group }}</span>
                                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check class="h-5 w-5" />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">วันเกิด *</label>
                            <input
                              v-model="form.birth_date"
                              type="date"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <!-- Row 3: 2 columns -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน</label>
                            <input
                              v-model="form.national_id"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุเลขบัตรประชาชน"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">หนังสือเดินทาง</label>
                            <input
                              v-model="form.passport_no"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุหนังสือเดินทาง"
                            />
                          </div>
                        </div>

                        <!-- Row 4: 3 columns (ชื่อ, นามสกุล, ชื่อเล่น) -->
                        <div class="grid grid-cols-3 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
                            <input
                              v-model="form.first_name"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุชื่อ"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">นามสกุล *</label>
                            <input
                              v-model="form.last_name"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุนามสกุล"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อเล่น</label>
                            <input
                              v-model="form.nickname"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุชื่อเล่น"
                            />
                          </div>
                        </div>

                        <!-- Row 5: 2 columns (ชื่อ EN, นามสกุล EN) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ (EN)</label>
                            <input
                              v-model="form.first_name_en"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุชื่อภาษาอังกฤษ"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">นามสกุล (EN)</label>
                            <input
                              v-model="form.last_name_en"
                              type="text"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุนามสกุลภาษาอังกฤษ"
                            />
                          </div>
                        </div>

                        <!-- Row 6: 2 columns (อีเมล, แท็ก) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                            <input
                              v-model="form.email"
                              type="email"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุอีเมล"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">แท็ก</label>
                            <TagSelector
                              v-model="selectedTags"
                              :available-tags="availableTags"
                              @search="handleTagSearch"
                            />
                          </div>
                        </div>

                        <!-- Row 7: 2 columns (เบอร์โทร 1, เบอร์โทร 2) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร 1</label>
                            <input
                              v-model="form.phone_1"
                              type="tel"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุเบอร์โทรศัพท์"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร 2</label>
                            <input
                              v-model="form.phone_2"
                              type="tel"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุเบอร์โทรศัพท์"
                            />
                          </div>
                        </div>

                        <!-- Row 8: 2 columns (กลุ่มลูกค้า, สาขา) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">กลุ่มลูกค้า *</label>
                            <SearchableDropdown
                              v-model="form.patient_group_id"
                              :options="patientGroups"
                              placeholder="เลือกกลุ่มลูกค้า..."
                              search-placeholder="ค้นหากลุ่มลูกค้า..."
                              display-key="name"
                              value-key="id"
                              :search-keys="['name']"
                              @search="handlePatientGroupSearch"
                            >
                              <template #display="{ selected }">
                                <div v-if="selected" class="flex items-center">
                                  <div v-if="selected.color" class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: selected.color }"></div>
                                  <span>{{ selected.name }}</span>
                                </div>
                                <span v-else>เลือกกลุ่มลูกค้า...</span>
                              </template>
                              <template #option="{ item, selected }">
                                <div class="flex items-center">
                                  <div v-if="item.color" class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: item.color }"></div>
                                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ item.name }}</span>
                                </div>
                              </template>
                            </SearchableDropdown>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
                            <SearchableDropdown
                              v-model="form.branchId"
                              :options="branches"
                              placeholder="เลือกสาขา..."
                              search-placeholder="ค้นหาสาขา..."
                              display-key="name"
                              value-key="id"
                              :search-keys="['name', 'code']"
                              @search="handleBranchSearch"
                            />
                          </div>
                        </div>

                        <!-- Row 9: 2 columns (ที่อยู่, จังหวัด) -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ *</label>
                            <textarea
                              v-model="form.address"
                              required
                              rows="3"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุที่อยู่"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">จังหวัด *</label>
                            <input
                              v-model="form.province"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุจังหวัด"
                            />
                          </div>
                        </div>

                        <!-- Row 10: 3 columns (ตำบล/แขวง, อำเภอ/เขต, รหัสไปรษณีย์) -->
                        <div class="grid grid-cols-3 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ตำบล/แขวง *</label>
                            <input
                              v-model="form.sub_district"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุตำบล/แขวง"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต *</label>
                            <input
                              v-model="form.district"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุอำเภอ/เขต"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์ *</label>
                            <input
                              v-model="form.postal_code"
                              type="text"
                              required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="ระบุรหัสไปรษณีย์"
                            />
                          </div>
                        </div>

                        <!-- Row 12: 1 column (หมายเหตุ) -->
                        <div class="grid grid-cols-1 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                            <textarea
                              v-model="form.note"
                              rows="3"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                          <label class="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก</label>
                          <input
                            v-model="form.weight"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง</label>
                          <input
                            v-model="form.height"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">รอบเอว</label>
                          <input
                            v-model="form.waist"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">รอบอก</label>
                          <input
                            v-model="form.chest"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทการรักษา *</label>
                        <Listbox v-model="form.treatment_type">
                          <div class="relative">
                            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                              <span class="block truncate">{{ form.treatment_type || 'OPD ผู้ป่วยนอก' }}</span>
                              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown class="h-5 w-5 text-gray-400" />
                              </span>
                            </ListboxButton>
                            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <ListboxOption
                                v-for="type in treatmentTypeOptions"
                                :key="type"
                                :value="type"
                                v-slot="{ active, selected }"
                              >
                                <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ type }}</span>
                                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                    <Check class="h-5 w-5" />
                                  </span>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทสิทธิ์การรักษา *</label>
                        <SearchableDropdown
                          v-model="form.insurance_type_id"
                          :options="insuranceTypes"
                          placeholder="เลือกประเภทสิทธิ์การรักษา..."
                          search-placeholder="ค้นหาประเภทสิทธิ์การรักษา..."
                          display-key="name"
                          value-key="id"
                          :search-keys="['name', 'code']"
                          @search="handleInsuranceTypeSearch"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ความสัมพันธ์ทางครอบครัว</label>
                        <div class="text-red-500 text-sm mb-2">ต้องมีรายชื่อในระบบเท่านั้น</div>
                        <div class="grid grid-cols-3 gap-2">
                          <input
                            v-model="familyMember.name"
                            type="text"
                            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ค้นหาอย่างน้อย 3 ตัวอักษร"
                          />
                          <input
                            v-model="familyMember.relationship"
                            type="text"
                            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ความสัมพันธ์"
                          />
                          <button
                            type="button"
                            class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Plus class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ประวัติการแพ้ยา</label>
                        <input
                          v-model="form.allergy_history"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="HN68001XXXX"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ประวัติสุขภาพจิต</label>
                        <textarea
                          v-model="form.mental_health"
                          rows="4"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุประวัติสุขภาพจิต"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">โรคประจำตัว</label>
                        <textarea
                          v-model="form.underlying_disease"
                          rows="4"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุโรคประจำตัว"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                        <textarea
                          v-model="form.note"
                          rows="4"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุหมายเหตุ"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">รับแจ้งเตือนเอกสารต่างๆ ทาง Email</label>
                        <div class="space-y-2">
                          <label class="flex items-center">
                            <input type="checkbox" class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <span class="ml-2 text-sm text-gray-700">แฟ้มโปรไฟล์ OPD</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <span class="ml-2 text-sm text-gray-700">ผลแล็บ</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <span class="ml-2 text-sm text-gray-700">ใบรับรองแพทย์</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact Information Tab -->
                <div v-if="activeTab === 'contact'" class="space-y-6">
                  <div class="space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <input
                          v-model="contactPerson.name"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ชื่อ-นามสกุล"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                        <input
                          v-model="contactPerson.phone"
                          type="tel"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="เบอร์โทร"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ความสัมพันธ์</label>
                        <input
                          v-model="contactPerson.relationship"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ความสัมพันธ์"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <Plus class="h-4 w-4 inline mr-1" />
                      เพิ่มผู้ติดต่อ
                    </button>
                  </div>
                </div>

                <!-- Company Information Tab -->
                <div v-if="activeTab === 'company'" class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท</label>
                        <input
                          v-model="form.company_name"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุชื่อบริษัท"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                        <input
                          v-model="form.company_tax_id"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุเลขประจำตัวผู้เสียภาษี"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                        <input
                          v-model="form.company_phone"
                          type="tel"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุเบอร์โทรบริษัท"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <input
                          v-model="form.company_email"
                          type="email"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ระบุที่อยู่บริษัท"
                        />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">ตำบล/แขวง</label>
                          <input
                            v-model="form.company_subdistrict"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ระบุตำบล/แขวง"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต</label>
                          <input
                            v-model="form.company_district"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ระบุอำเภอ/เขต"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                          <input
                            v-model="form.company_province"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ระบุจังหวัด"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                          <input
                            v-model="form.company_postal_code"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ระบุรหัสไปรษณีย์"
                          />
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
</template>

<script>
import { Dialog as HeadlessDialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check, Plus } from 'lucide-vue-next'
import patientGroupService from '@/services/patient-group.js'
import insuranceTypeService from '@/services/insurance-type.js'
import tagService from '@/services/tag.js'
import { branchService } from '@/services/branch.js'
import SearchableDropdown from '@/components/SearchableDropdown.vue'
import TagSelector from '@/components/TagSelector.vue'

export default {
  name: 'PatientModal',
  components: {
    HeadlessDialog, DialogPanel, TransitionRoot, TransitionChild,
    Listbox, ListboxButton, ListboxOptions, ListboxOption,
    ChevronDown, Check, Plus,
    SearchableDropdown, TagSelector
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
      contactPerson: {
        name: '',
        phone: '',
        relationship: ''
      },
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
      availableTags: [],
      patientGroups: [],
      insuranceTypes: [],
      branches: [],
      tabs: [
        { id: 'personal', name: 'ข้อมูลส่วนตัว' },
        { id: 'health', name: 'ข้อมูลสุขภาพ' },
        { id: 'contact', name: 'ข้อมูลติดต่อ' },
        { id: 'company', name: 'ข้อมูลบริษัท' }
      ],
      statusOptions: [
        { label: 'ปกติ', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],
      prefixOptions: ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'],
      genderOptions: ['ชาย', 'หญิง'],
      nationalityOptions: ['ไทย', 'ต่างชาติ'],
      religionOptions: ['พุทธ', 'คริสต์', 'อิสลาม', 'ฮินดู', 'ซิกข์', 'อื่นๆ'],
      educationLevelOptions: ['ประถมศึกษา', 'มัธยมศึกษาตอนต้น', 'มัธยมศึกษาตอนปลาย', 'ประกาศนียบัตรวิชาชีพ', 'ประกาศนียบัตรวิชาชีพชั้นสูง', 'ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก', 'อื่นๆ'],
      maritalStatusOptions: ['โสด', 'สมรส', 'หย่า', 'หม้าย'],
      bloodGroupOptions: ['A', 'B', 'AB', 'O'],
      treatmentTypeOptions: ['OPD ผู้ป่วยนอก', 'IPD ผู้ป่วยใน', 'ผู้ป่วยฉุกเฉิน']
    }
  },
  computed: {
    isEdit() {
      return !!this.initialData
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [patientGroupsRes, insuranceTypesRes, tagsRes, branchesRes] = await Promise.all([
          patientGroupService.getAll({ limit: 1000 }),
          insuranceTypeService.getAll({ limit: 1000 }),
          tagService.getAll({ limit: 1000 }),
          branchService.getAll({ limit: 1000 })
        ])
        
        this.patientGroups = patientGroupsRes.data || []
        this.insuranceTypes = insuranceTypesRes.data || []
        this.availableTags = tagsRes.data || []
        this.branches = branchesRes.data || []
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },
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
    async handlePatientGroupSearch(query) {
      try {
        const response = await patientGroupService.getAll({ 
          search: query, 
          limit: 1000 
        })
        this.patientGroups = response.data || []
      } catch (error) {
        console.error('Error searching patient groups:', error)
      }
    },
    async handleBranchSearch(query) {
      try {
        const response = await branchService.getAll({ 
          search: query, 
          limit: 1000 
        })
        this.branches = response.data || []
      } catch (error) {
        console.error('Error searching branches:', error)
      }
    },
    async handleInsuranceTypeSearch(query) {
      try {
        const response = await insuranceTypeService.getAll({ 
          search: query, 
          limit: 1000 
        })
        this.insuranceTypes = response.data || []
      } catch (error) {
        console.error('Error searching insurance types:', error)
      }
    },
    async handleTagSearch(query) {
      try {
        const response = await tagService.getAll({ 
          search: query, 
          limit: 1000 
        })
        this.availableTags = response.data || []
      } catch (error) {
        console.error('Error searching tags:', error)
      }
    },
    resetForm() {
      this.form = {
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
      }
      this.selectedTags = []
      this.activeTab = 'personal'
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (newVal) {
          if (this.initialData) {
            this.form = { ...this.initialData }
            this.selectedTags = this.initialData.patientTags ? this.initialData.patientTags.map(pt => pt.tag) : []
          } else {
            this.resetForm()
          }
        }
      },
      immediate: false
    }
  }
}
</script>