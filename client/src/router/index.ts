import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/UsersPage.vue')
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('@/pages/DownloadPage.vue')
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/pages/auth/RegistrationPage.vue')
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'wildcard',
      component: () => import('@/pages/_.vue')
    }
  ]
})

export default router
