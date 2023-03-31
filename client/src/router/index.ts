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
      path: '/thoughts',
      name: 'thoughts',
      component: () => import('@/pages/thought/IndexPage.vue')
    },
    {
      path: '/users/:id',
      name: 'users-id',
      component: () => import('@/pages/user/_UserPage.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/user/IndexPage.vue')
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/pages/auth/RegistrationPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'wildcard',
      component: () => import('@/pages/_.vue')
    }
  ]
})

export default router
