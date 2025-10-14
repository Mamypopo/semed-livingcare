<script setup></script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">You did it!</h1>
      <p class="text-gray-600 mb-4">
        Visit <a href="https://vuejs.org/" target="_blank" rel="noopener" class="text-blue-500 hover:text-blue-700 underline">vuejs.org</a> to read the
        documentation
      </p>
      
      <!-- ทดสอบ v-tippy directive -->
      <div class="mt-6 space-x-4">
        <button 
          v-tippy="'นี่คือ tooltip ธรรมดา'"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tooltip ธรรมดา
        </button>
        
        <button 
          v-tippy.bottom="'Tooltip ด้านล่าง'"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Tooltip ด้านล่าง
        </button>
        
        <button 
          v-tippy.left="'Tooltip ด้านซ้าย'"
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Tooltip ด้านซ้าย
        </button>
        
        <button 
          v-tippy.right="'Tooltip ด้านขวา'"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Tooltip ด้านขวา
        </button>
        
        <button 
          v-tippy.dark="'Dark theme tooltip'"
          class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Dark Theme
        </button>
        
        <button 
          v-tippy.noArrow="'ไม่มีลูกศร'"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          No Arrow
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
