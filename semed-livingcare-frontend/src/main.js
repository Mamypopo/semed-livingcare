import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'


const app = createApp(App)

app.use(createPinia())

// Tippy.js directive
app.directive('tooltip', {
    mounted(el, binding) {
        const options = {
            content: binding.value,
            placement: binding.arg || 'top',
            theme: 'custom',
            arrow: true,
            animation: 'scale',
            duration: [150, 100],
            delay: [500, 0],
            appendTo: () => document.body,
            zIndex: 9999,
            trigger: 'mouseenter',
            hideOnClick: true,
            allowHTML: false,
            ...binding.modifiers
        }

        const instance = tippy(el, options)
        el._tippy = instance
    },
    updated(el, binding) {
        // อัปเดต content เมื่อ binding เปลี่ยน
        if (el._tippy) {
            el._tippy.setContent(binding.value)
        }
    },
    unmounted(el) {
        const instance = el._tippy
        if (instance) {
            instance.destroy()
        }
    }
})

app.use(router)


app.mount('#app')
