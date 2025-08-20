import { createApp } from 'vue'
import App from './App.vue'

// 创建 Vue 应用
const app = createApp(App)

// 全局配置
app.config.globalProperties.$cyberColors = {
  primary: '#0affff',
  secondary: '#ff00ff',
  background: '#001122',
  text: '#ffffff'
}

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info)
}

// 挂载应用
app.mount('#app')

console.log('🎮 CyberSnake Vue App Started!')
