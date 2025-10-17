<template>
  <!-- Teleported center mini modal with its own full-screen backdrop -->
  <teleport to="body">
    <div class="fixed inset-0 z-[2000]" @click.self="$emit('cancel')">
      <div class="absolute inset-0 bg-black/25"></div>
      <div class="relative z-[2001] h-full w-full flex items-center justify-center">
        <div class="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-[340px]">
          <p class="text-sm text-gray-700">ต้องการปิดหน้าต่างและล้างข้อมูลที่กรอกหรือไม่?</p>
          <div class="mt-3 flex justify-end gap-2">
            <button
              @click.stop="$emit('cancel')"
              class="px-3 py-1.5 text-xs border border-gray-200 rounded bg-white text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              @click.stop="$emit('confirm')"
              class="px-3 py-1.5 text-xs rounded bg-red-600 text-white hover:bg-red-700"
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
export default {
  name: 'ConfirmClosePopover',
  emits: ['cancel', 'confirm'],
}
</script>

<style scoped></style>
