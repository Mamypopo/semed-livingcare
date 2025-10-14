<template>
  <div id="app">
    <router-view />
  </div>
</template>


<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    
    return {
      authStore
    }
  },
  mounted() {
    // Initialize auth when app starts
    this.authStore.initializeAuth()
  }
}
</script>
<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  min-height: 100vh;
}
</style>
