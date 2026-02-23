import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/attractions',
      name: 'attractions',
      component: () => import('../views/AttractionsView.vue')
    },
    {
      path: '/taxi',
      name: 'taxi',
      component: () => import('../views/TaxiView.vue')
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('../views/BudgetView.vue')
    },
    {
      path: '/packing',
      name: 'packing',
      component: () => import('../views/PackingView.vue')
    },
    {
      path: '/planner',
      name: 'planner',
      component: () => import('../views/PlannerView.vue')
    },
    {
      path: '/phrases',
      name: 'phrases',
      component: () => import('../views/PhrasesView.vue')
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('../views/EmergencyView.vue')
    },
    {
      path: '/restaurants',
      name: 'restaurants',
      component: () => import('../views/RestaurantsView.vue')
    },
    {
      path: '/diary',
      name: 'diary',
      component: () => import('../views/PhotoDiaryView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router
