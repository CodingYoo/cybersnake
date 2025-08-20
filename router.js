import { ref } from 'vue'

// 简单的路由系统
export const currentRoute = ref('index')
export const routeParams = ref({})

// 路由组件映射
export const routes = {
  'index': () => import('./pages/index/index.vue'),
  'game': () => import('./pages/game/game.vue'),
  'leaderboard': () => import('./pages/leaderboard/leaderboard.vue')
}

// 导航函数
export function navigateTo(route, params = {}) {
  console.log(`🧭 Navigating to: ${route}`, params)
  currentRoute.value = route
  routeParams.value = params
}

export function navigateBack() {
  console.log('🔙 Navigating back')
  // 简单的返回逻辑
  if (currentRoute.value === 'game' || currentRoute.value === 'leaderboard') {
    currentRoute.value = 'index'
  }
}

// 路由守卫
export function beforeRouteChange(to, from) {
  console.log(`Route change: ${from} → ${to}`)
  return true
}
