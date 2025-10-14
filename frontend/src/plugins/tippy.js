import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

// Tippy.js directive for Vue
export const vTippy = {
  mounted(el, binding) {
    const options = {
      content: binding.value,
      theme: 'light',
      placement: 'top',
      arrow: true,
      ...binding.modifiers
    }
    
    // Handle modifiers
    if (binding.modifiers.bottom) options.placement = 'bottom'
    if (binding.modifiers.left) options.placement = 'left'
    if (binding.modifiers.right) options.placement = 'right'
    if (binding.modifiers.dark) options.theme = 'dark'
    if (binding.modifiers.noArrow) options.arrow = false
    
    el._tippy = tippy(el, options)
  },
  
  updated(el, binding) {
    if (el._tippy) {
      el._tippy.setContent(binding.value)
    }
  },
  
  unmounted(el) {
    if (el._tippy) {
      el._tippy.destroy()
    }
  }
}

// Tippy.js plugin
export default {
  install(app) {
    app.directive('tippy', vTippy)
  }
}
