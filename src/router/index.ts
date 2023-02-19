import HomeViewVue from '@/views/HomeView/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeViewVue,
    },
    {
      path: '/:id',
      name: 'home/id',
      component: HomeViewVue,
    },
  ],
})

export default router
