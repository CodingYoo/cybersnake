<template>
  <view class="splash-container" @tap="skipAnimation">
    <!-- 背景网格 -->
    <view class="grid-background"></view>

    <!-- 扫描线 -->
    <view v-for="(line, index) in scanLines" :key="index" class="scan-line" :style="{
      top: line.y + 'px',
      opacity: line.opacity,
      height: line.width + 'px',
      animationDelay: line.delay + 'ms'
    }"></view>

    <!-- Logo区域 -->
    <view class="logo-section">
      <text class="logo-text cyber-text" :style="{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`
      }">
        CYBERSNAKE
      </text>

      <text v-if="progress > 0.3" class="sub-text cyber-text-secondary" :style="{ opacity: subTextOpacity }">
        SYSTEM INITIALIZING...
      </text>
    </view>

    <!-- 进度条 -->
    <view v-if="progress > 0.5" class="progress-section">
      <view class="progress-bar">
        <view class="progress-bg"></view>
        <view class="progress-fill cyber-glow" :style="{ width: progress * 100 + '%' }"></view>
      </view>
      <text class="progress-text cyber-text">{{ Math.floor(progress * 100) }}%</text>
    </view>

    <!-- 故障效果 -->
    <view v-if="progress > 0.8 && showGlitch" class="glitch-effect" :style="{
      left: glitchX + 'px',
      top: glitchY + 'px',
      width: glitchWidth + 'px',
      height: glitchHeight + 'px'
    }"></view>
  </view>
</template>

<script>
export default {
  name: 'SplashScreen',
  emits: ['complete'],
  data () {
    return {
      progress: 0,
      startTime: 0,
      duration: 3000, // 3秒
      scanLines: [],
      showGlitch: false,
      glitchX: 0,
      glitchY: 0,
      glitchWidth: 0,
      glitchHeight: 0,
      animationFrame: null
    }
  },
  computed: {
    logoOpacity () {
      return Math.min(this.progress * 2, 1)
    },
    logoScale () {
      return 0.5 + (this.progress * 0.5)
    },
    subTextOpacity () {
      return Math.min((this.progress - 0.3) * 2, 1)
    }
  },
  mounted () {
    this.initScanLines()
    this.startAnimation()
  },
  beforeUnmount () {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  },
  methods: {
    initScanLines () {
      const lineCount = 8

      for (let i = 0; i < lineCount; i++) {
        this.scanLines.push({
          y: -50,
          speed: 200 + Math.random() * 300,
          opacity: 0.3 + Math.random() * 0.4,
          width: 2 + Math.random() * 3,
          delay: i * 200
        })
      }
    },

    startAnimation () {
      this.startTime = Date.now()
      this.animate()
    },

    animate () {
      const currentTime = Date.now()
      const elapsed = currentTime - this.startTime
      this.progress = Math.min(elapsed / this.duration, 1)

      // 更新扫描线
      this.updateScanLines()

      // 故障效果
      if (this.progress > 0.8 && Math.random() < 0.1) {
        this.triggerGlitch()
      }

      if (this.progress >= 1) {
        this.completeAnimation()
      } else {
        this.animationFrame = requestAnimationFrame(this.animate)
      }
    },

    updateScanLines () {
      const deltaTime = 16 // 假设60fps
      const screenHeight = window.innerHeight

      this.scanLines.forEach(line => {
        if (Date.now() - this.startTime > line.delay) {
          line.y += line.speed * deltaTime / 1000

          if (line.y > screenHeight + 50) {
            line.y = -50
          }
        }
      })
    },

    triggerGlitch () {
      this.showGlitch = true
      this.glitchX = Math.random() * window.innerWidth
      this.glitchY = Math.random() * window.innerHeight
      this.glitchWidth = Math.random() * 100
      this.glitchHeight = Math.random() * 20

      setTimeout(() => {
        this.showGlitch = false
      }, 100)
    },

    completeAnimation () {
      console.log('✅ Splash animation completed')
      this.$emit('complete')
    },

    skipAnimation () {
      if (this.progress < 1) {
        console.log('⏭️ Skipping splash animation')
        this.completeAnimation()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.splash-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #001122;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  background-size: 50rpx 50rpx;
  z-index: 1;
}

.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(10, 255, 255, 0.8),
      transparent);
  box-shadow: 0 0 10px #0affff;
  z-index: 2;
}

.logo-section {
  position: relative;
  text-align: center;
  z-index: 10;
  margin-bottom: 200rpx;
}

.logo-text {
  display: block;
  font-size: 100rpx;
  font-weight: bold;
  letter-spacing: 8rpx;
  margin-bottom: 40rpx;
  text-align: center;
}

.sub-text {
  display: block;
  font-size: 36rpx;
  letter-spacing: 3rpx;
  text-align: center;
}

.progress-section {
  position: absolute;
  bottom: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.progress-bar {
  position: relative;
  width: 400rpx;
  height: 8rpx;
  margin-bottom: 40rpx;
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #0affff, #ff00ff);
  border-radius: 4rpx;
  transition: width 0.1s ease;
}

.progress-text {
  font-size: 28rpx;
  letter-spacing: 1rpx;
}

.glitch-effect {
  position: absolute;
  background: rgba(255, 0, 255, 0.3);
  z-index: 15;
  animation: glitch-flicker 0.1s infinite;
}

@keyframes glitch-flicker {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 0.3;
  }
}
</style>
