import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/member',
    name: 'MemberDashboard',
    component: () => import('../views/member/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'member' }
  },
  {
    path: '/member/workouts',
    name: 'MemberWorkouts',
    component: () => import('../views/member/Workouts.vue'),
    meta: { requiresAuth: true, role: 'member' }
  },
  {
    path: '/member/workout/:id',
    name: 'WorkoutDetail',
    component: () => import('../views/member/WorkoutDetail.vue'),
    meta: { requiresAuth: true, role: 'member' }
  },
  {
    path: '/trainer',
    name: 'TrainerDashboard',
    component: () => import('../views/trainer/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  {
    path: '/trainer/plans',
    name: 'TrainerPlans',
    component: () => import('../views/trainer/WorkoutPlans.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  {
    path: '/trainer/members',
    name: 'TrainerMembers',
    component: () => import('../views/trainer/Members.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/Users.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/memberships',
    name: 'AdminMemberships',
    component: () => import('../views/admin/Memberships.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect based on role
    if (authStore.isAdmin) next('/admin')
    else if (authStore.isTrainer) next('/trainer')
    else next('/member')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect to correct dashboard if role doesn't match
    if (authStore.isAdmin) next('/admin')
    else if (authStore.isTrainer) next('/trainer')
    else next('/member')
  } else {
    next()
  }
})

export default router
