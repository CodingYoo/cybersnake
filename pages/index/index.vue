<template>
  <view class="container">
    <!-- 背景效果 -->
    <view class="background-effects">
      <view class="grid-background"></view>
      <view class="floating-particles"></view>
      <view class="circuit-lines"></view>
      <view class="scan-lines"></view>
    </view>

    <!-- 启动动画遮罩 -->
    <view v-if="showSplash" class="splash-screen">
      <SplashScreen @complete="onSplashComplete" />
    </view>

    <!-- 主菜单 -->
    <view v-else class="main-menu">
      <view class="title-section">
        <text class="main-title cyber-text">CYBERSNAKE</text>
        <text class="sub-title cyber-text-secondary">NEURAL NETWORK ACTIVATED</text>
      </view>

      <view class="menu-section">
        <button class="menu-btn cyber-button cyber-pulse" @click="startGame">
          开始游戏
        </button>

        <!-- <button class="menu-btn cyber-button" @click="showLeaderboard">
          排行榜
        </button> -->

        <!-- <button class="menu-btn cyber-button" @click="shareGame">
          分享分数
        </button> -->
      </view>
    </view>

    <!-- 背景效果 -->
    <view class="bg-effects">
      <view class="grid-bg"></view>
      <view class="scan-lines"></view>
    </view>
  </view>
</template>

<script>
import SplashScreen from '@/components/SplashScreen.vue'
import { navigateTo } from '@/router.js'

export default {
  name: 'IndexPage',
  components: {
    SplashScreen
  },
  data () {
    return {
      showSplash: true
    }
  },
  onLoad () {
    console.log('🎮 Index page loaded')
  },
  methods: {
    navigateTo,

    onSplashComplete () {
      this.showSplash = false
      console.log('✅ Splash animation completed')
    },

    startGame () {
      console.log('🎮 Starting game...')
      this.navigateTo('game')
    },

    showLeaderboard () {
      console.log('📊 Showing leaderboard...')
      this.navigateTo('leaderboard')
    },

    shareGame () {
      console.log('📤 Sharing game...')

      const shareText = 'CyberSnake - 赛博朋克贪吃蛇游戏\nI AM THE SYSTEM'

      if (navigator.share) {
        navigator.share({
          title: 'CyberSnake',
          text: shareText,
          url: window.location.href
        }).catch(err => console.log('Share failed:', err))
      } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText + '\n' + window.location.href)
          .then(() => alert('已复制到剪贴板！'))
          .catch(() => alert('分享功能需要在支持的浏览器中使用'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #001122 0%, #001a33 50%, #002244 100%);
  overflow: hidden;
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(10, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(10, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 0, 255, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(10, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 0, 255, 0.4), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(10, 255, 255, 0.3), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: particles-float 15s ease-in-out infinite;
}

.circuit-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(90deg, transparent 0%, rgba(10, 255, 255, 0.2) 50%, transparent 100%),
    linear-gradient(0deg, transparent 0%, rgba(255, 0, 255, 0.1) 50%, transparent 100%);
  background-size: 300px 200px, 200px 300px;
  animation: circuit-pulse 8s ease-in-out infinite;
}

.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(10, 255, 255, 0.03) 2px,
      rgba(10, 255, 255, 0.03) 4px);
  animation: scan-move 3s linear infinite;
}

.splash-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.main-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  z-index: 10;
  backdrop-filter: blur(1px);
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  display: block;
  font-size: 70px;
  font-weight: bold;
  margin-bottom: 16px;
  letter-spacing: 7px;
  line-height: 1.0;
  text-align: center;
  text-shadow: 0 0 20px rgba(10, 255, 255, 0.5);
}

.sub-title {
  display: block;
  font-size: 16px;
  opacity: 0.8;
  letter-spacing: 1.5px;
  text-align: center;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 160px;
  max-width: 160px;
  min-width: 160px;
  align-items: center;
  justify-content: center;
}

.menu-btn {
  width: 160px !important;
  height: 40px;
  font-size: 14px;
  letter-spacing: 1.5px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 160px !important;
  max-width: 160px !important;
  flex-shrink: 0;
  flex-grow: 0;
  box-sizing: border-box;
}

.menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(10, 255, 255, 0.4);
}

.info-section {
  margin-top: 30px;
  text-align: center;
}

.info-text {
  font-size: 12px;
  opacity: 0.6;
  text-align: center;
}

/* 背景效果 */
.bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(10, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50rpx 50rpx;
  animation: grid-move 20s linear infinite;
}

.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(10, 255, 255, 0.03) 2px,
      rgba(10, 255, 255, 0.03) 4px);
  animation: scan-move 3s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes particles-float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.7;
  }
}

@keyframes circuit-pulse {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes scan-move {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(100vh);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 60px;
    letter-spacing: 5px;
  }

  .sub-title {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .menu-btn {
    width: 150px !important;
    min-width: 150px !important;
    max-width: 150px !important;
    height: 36px;
    font-size: 13px;
  }

  .menu-section {
    width: 150px;
    max-width: 150px;
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .main-menu {
    padding: 16px;
  }

  .main-title {
    font-size: 50px;
    letter-spacing: 4px;
  }

  .sub-title {
    font-size: 12px;
  }

  .menu-btn {
    width: 140px !important;
    min-width: 140px !important;
    max-width: 140px !important;
    height: 32px;
    font-size: 12px;
  }

  .menu-section {
    width: 140px;
    max-width: 140px;
    min-width: 140px;
  }

  .title-section {
    margin-bottom: 30px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 600px) {
  .main-menu {
    justify-content: space-around;
    padding: 10px;
  }

  .title-section {
    margin-bottom: 20px;
  }

  .main-title {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .sub-title {
    font-size: 10px;
  }

  .menu-section {
    gap: 8px;
  }

  .menu-btn {
    width: 130px !important;
    min-width: 130px !important;
    max-width: 130px !important;
    height: 28px;
    font-size: 11px;
  }

  .menu-section {
    width: 130px;
    max-width: 130px;
    min-width: 130px;
  }

  .info-section {
    margin-top: 15px;
  }
}
</style>
