import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

// Tippy.js plugin
export default {
  install(app) {
    // Tippy.js directive
    app.directive('tooltip', {
      mounted(el, binding) {
        const resolvePlacement = () => {
          if (binding.arg) return binding.arg
          if (binding.modifiers.right) return 'right'
          if (binding.modifiers.left) return 'left'
          if (binding.modifiers.bottom) return 'bottom'
          if (binding.modifiers.top) return 'top'
          return 'top'
        }

        const options = {
          content: binding.value,
          placement: resolvePlacement(),
          theme: 'custom',
          arrow: true,
          animation: 'scale',
          duration: [150, 100],
          delay: [300, 0],
          appendTo: () => document.body,
          zIndex: 9999,
          trigger: 'mouseenter',
          hideOnClick: true,
          allowHTML: false
        }

        const instance = tippy(el, options)
        el._tippy = instance

        // เปิด/ปิดตาม content ตอน mount
        if (!binding.value) {
          instance.disable()
        } else {
          instance.enable()
        }
      },
      updated(el, binding) {
        // อัปเดต content และเปิด/ปิด รวมถึง placement เมื่อ binding เปลี่ยน
        const instance = el._tippy
        if (!instance) return

        // อัปเดตเนื้อหา
        instance.setContent(binding.value)

        // เปิด/ปิดตาม content
        if (!binding.value) {
          instance.disable()
        } else {
          instance.enable()
        }

        // อัปเดตตำแหน่งเมื่อ arg/modifiers เปลี่ยน
        const resolvePlacement = () => {
          if (binding.arg) return binding.arg
          if (binding.modifiers.right) return 'right'
          if (binding.modifiers.left) return 'left'
          if (binding.modifiers.bottom) return 'bottom'
          if (binding.modifiers.top) return 'top'
          return 'top'
        }
        instance.setProps({ placement: resolvePlacement() })
      },
      unmounted(el) {
        const instance = el._tippy
        if (instance) {
          instance.destroy()
        }
      }
    })
  }
}
