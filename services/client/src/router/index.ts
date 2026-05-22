import { createRouter, createWebHistory } from 'vue-router'
import ThoughtsPage from '@/pages/thought/IndexPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      redirect: '/thoughts'
    },
    {
      path: '/thoughts',
      name: 'thoughts',
      component: ThoughtsPage
    },
    {
      path: '/start',
      name: 'start',
      component: () => import('@/pages/StartPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue')
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
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SettingsPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'wildcard',
      component: () => import('@/pages/_.vue')
    }
  ]
})

export default router
