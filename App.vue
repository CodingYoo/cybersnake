<template>
  <div class="app">
    <!-- 动态路由组件 -->
    <component :is="currentComponent" v-if="currentComponent" />

    <!-- 加载状态 -->
    <div v-else class="loading-route">
      <div class="loading-text cyber-text">LOADING...</div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { currentRoute, routes } from './router.js'

export default {
  name: 'App',
  setup () {
    const currentComponent = ref(null)

    // 监听路由变化
    watch(currentRoute, async (newRoute) => {
      console.log(`Loading route: ${newRoute}`)

      try {
        const routeLoader = routes[newRoute]
        if (routeLoader) {
          const component = await routeLoader()
          currentComponent.value = component.default || component
        } else {
          console.error(`Route not found: ${newRoute}`)
          currentComponent.value = null
        }
      } catch (error) {
        console.error(`Failed to load route ${newRoute}:`, error)
        currentComponent.value = null
      }
    }, { immediate: true })

    return {
      currentComponent
    }
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #001122;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #001122 0%, #002244 100%);
}

/* 赛博朋克风格全局样式 */
.cyber-text {
  color: #0affff;
  text-shadow: 0 0 10px #0affff;
}

.cyber-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px #ff00ff;
}

.cyber-button {
  background: linear-gradient(45deg, #0affff, #ff00ff);
  border: none;
  color: #001122;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(10, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.cyber-button:hover {
  box-shadow: 0 0 30px rgba(10, 255, 255, 0.6);
  transform: translateY(-2px);
}

.cyber-border {
  border: 2px solid #0affff;
  box-shadow: 0 0 10px rgba(10, 255, 255, 0.3);
}

/* 动画效果 */
@keyframes cyber-pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

.cyber-pulse {
  animation: cyber-pulse 2s infinite;
}

@keyframes cyber-glow {
  0% {
    box-shadow: 0 0 5px #0affff;
  }

  50% {
    box-shadow: 0 0 20px #0affff, 0 0 30px #0affff;
  }

  100% {
    box-shadow: 0 0 5px #0affff;
  }
}

.cyber-glow {
  animation: cyber-glow 2s infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-button {
    padding: 14px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .cyber-button {
    padding: 12px 16px;
    font-size: 13px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .cyber-button:hover {
    transform: none;
    box-shadow: 0 0 20px rgba(10, 255, 255, 0.3);
  }

  .cyber-button:active {
    transform: scale(0.95);
    box-shadow: 0 0 30px rgba(10, 255, 255, 0.6);
  }
}
</style>
