import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth'
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/Auth.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      redirect: '/auth'
    },
    {
      path: '/register',
      redirect: '/auth'
    },
        {
          path: '/lobby',
          redirect: '/main/lobby'
        },
        {
          path: '/main',
          component: () => import('@/layouts/MainLayout.vue'),
          meta: { requiresAuth: true },
          children: [
            {
              path: '',
              redirect: '/main/lobby'
            },
            {
              path: 'lobby',
              name: 'Lobby',
              component: () => import('@/views/main/Lobby.vue')
            },
            {
              path: 'overview',
              name: 'Overview',
              component: () => import('@/views/main/Overview.vue'),
              meta: { requiresBranch: true, title: 'ภาพรวม' }
            },
            {
              path: 'branches',
              name: 'Branches',
              component: () => import('@/views/branches/Branches.vue'),
              meta: { requiresBranch: true, title: 'สาขา' }
            },
            {
              path: 'users',
              name: 'Users',
              component: () => import('@/views/users/Users.vue'),
              meta: { requiresBranch: true, title: 'ผู้ใช้' }
            },
            // Customer Management
            {
              path: 'customers/patient-groups',
              name: 'PatientGroups',
              component: () => import('@/views/customers/PatientGroups.vue'),
              meta: { requiresBranch: true, title: 'กลุ่มลูกค้า' }
            },
            {
              path: 'customers/tags',
              name: 'Tags',
              component: () => import('@/views/customers/Tags.vue'),
              meta: { requiresBranch: true, title: 'แท็ก' }
            },
            {
              path: 'customers/insurance-types',
              name: 'InsuranceTypes',
              component: () => import('@/views/customers/InsuranceTypes.vue'),
              meta: { requiresBranch: true, title: 'ประเภทประกัน' }
            },
            // {
            //   path: 'packages',
            //   name: 'Packages',
            //   component: () => import('@/views/main/Packages.vue')
            // },
            // {
            //   path: 'notifications',
            //   name: 'Notifications',
            //   component: () => import('@/views/main/Notifications.vue')
            // },
            // {
            //   path: 'orders',
            //   name: 'Orders',
            //   component: () => import('@/views/main/Orders.vue')
            // },
            // {
            //   path: 'users',
            //   name: 'Users',
            //   component: () => import('@/views/main/Users.vue')
            // },
            // {
            //   path: 'appointments',
            //   name: 'Appointments',
            //   component: () => import('@/views/main/Appointments.vue')
            // },
            // {
            //   path: 'security',
            //   name: 'Security',
            //   component: () => import('@/views/main/Security.vue')
            // }
          ]
        },
        {
          path: '/dashboard',
          redirect: '/lobby'
        }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if token exists
  if (authStore.token && !authStore.user) {
    try {
      await authStore.getProfile()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      authStore.logout()
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
    return
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/main/lobby')
    return
  }

  // Check if route requires branch assignment
  if (to.meta.requiresBranch && authStore.needsBranchAssignment) {
    next('/main/lobby')
    return
  }

  next()
})

export default router
