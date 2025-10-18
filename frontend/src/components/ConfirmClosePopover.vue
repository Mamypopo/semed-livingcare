<template>
  <!-- Teleported center mini modal with its own full-screen backdrop -->
  <teleport to="body">
    <div class="fixed inset-0 z-[2000]" @click.self="$emit('cancel')">
      <div class="absolute inset-0 bg-black/25 "></div>
      <div class="relative z-[2001] h-full w-full flex items-center justify-center p-4">
        <div class="bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 ease-out">
          <!-- Icon -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full">
            <AlertTriangle class="w-6 h-6 text-red-500" />
          </div>
          
          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
            ยืนยันการปิด
          </h3>
          
          <!-- Message -->
          <p class="text-sm text-gray-600 text-center leading-relaxed mb-6">
            ต้องการปิดหน้าต่างและล้างข้อมูลที่กรอกหรือไม่?<br>
            <span class="text-red-500 font-medium">ข้อมูลที่ยังไม่ได้บันทึกจะหายไป</span>
          </p>
          
          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click.stop="$emit('cancel')"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              ยกเลิก
            </button>
            <button
              @click.stop="$emit('confirm')"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 border border-transparent rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              ปิดและล้าง
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { AlertTriangle } from 'lucide-vue-next'

export default {
  name: 'ConfirmClosePopover',
  components: {
    AlertTriangle
  },
  emits: ['cancel', 'confirm']
}
</script>

<style scoped></style>
