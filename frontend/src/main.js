import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import tooltipPlugin from './plugins/tippy.js'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(tooltipPlugin)

// Initialize auth store
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
