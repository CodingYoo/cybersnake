<template>
  <view class="container">
    <!-- 背景效果 -->
    <view class="background-effects">
      <!-- 动态网格 -->
      <view class="dynamic-grid-container">
        <view class="dynamic-grid-layer" v-for="layer in gridLayers" :key="layer.id" :style="layer.style"></view>
      </view>

      <!-- 光柱效果 -->
      <view class="light-beams">
        <view class="light-beam" v-for="beam in lightBeams" :key="beam.id" :style="beam.style"></view>
      </view>

      <!-- 对角线波浪效果 -->
      <view class="diagonal-waves">
        <view class="diagonal-wave" v-for="wave in diagonalWaves" :key="wave.id" :style="wave.style"></view>
      </view>

      <!-- 爆炸粒子效果 -->
      <view class="explosion-particles">
        <view class="particle" v-for="particle in explosionParticles" :key="particle.id" :style="particle.style"></view>
      </view>

      <view class="floating-particles"></view>
      <view class="circuit-lines"></view>
    </view>

    <!-- 启动动画遮罩 -->
    <view v-if="showSplash" class="splash-screen">
      <SplashScreen @complete="onSplashComplete" />
    </view>

    <!-- 主菜单 -->
    <view v-else class="main-menu">
      <!-- 正方形游戏区域预览 -->
      <view class="game-area-preview">
        <view class="game-border"></view>
      </view>

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

        <button class="menu-btn cyber-button" @click="shareGame">
          分享游戏
        </button>
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
      showSplash: true,
      gridLayers: [],
      lightBeams: [],
      diagonalWaves: [],
      explosionParticles: [],
      animationFrame: null
    }
  },
  onLoad () {
    console.log('🎮 Index page loaded')
    this.initDynamicGrid()
    this.initLightBeams()
    this.initDiagonalWaves()
    this.initExplosionParticles()
    this.startAllAnimations()
  },

  onUnload () {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
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
    },

    initDynamicGrid () {
      // 创建多层网格，从大到小
      this.gridLayers = []
      const layerCount = 10

      for (let i = 0; i < layerCount; i++) {
        const layer = {
          id: i,
          baseSize: 150 - i * 12, // 从150px递减到30px
          opacity: 0.2 - i * 0.015, // 更高的透明度
          speed: 0.8 + i * 0.4, // 更快的速度
          rotationSpeed: 0.1 + i * 0.05, // 旋转速度
          scaleSpeed: 0.5 + i * 0.2, // 缩放速度
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
          scale: 1,
          style: {}
        }
        this.gridLayers.push(layer)
      }
    },

    initLightBeams () {
      // 创建光柱效果
      this.lightBeams = []
      const beamCount = 12

      for (let i = 0; i < beamCount; i++) {
        const beam = {
          id: i,
          x: Math.random() * 100, // 随机位置
          width: 3 + Math.random() * 8, // 3-11px宽度
          height: 100,
          opacity: 0.4 + Math.random() * 0.6, // 0.4-1.0透明度
          speed: 1.0 + Math.random() * 2.5, // 更快的速度
          pulseSpeed: 0.8 + Math.random() * 1.2, // 脉冲速度
          delay: i * 0.3, // 延迟启动
          angle: Math.random() * 20 - 10, // 随机倾斜角度
          style: {}
        }
        this.lightBeams.push(beam)
      }
    },

    initDiagonalWaves () {
      // 创建对角线波浪效果
      this.diagonalWaves = []
      const waveCount = 8

      for (let i = 0; i < waveCount; i++) {
        const wave = {
          id: i,
          angle: 30 + i * 20, // 更多角度变化
          width: 150 + i * 80, // 更大的宽度变化
          opacity: 0.08 + i * 0.03, // 更高的透明度
          speed: 1.2 + i * 0.6, // 更快的速度
          pulseSpeed: 0.6 + i * 0.3, // 脉冲速度
          offset: 0,
          scale: 1,
          style: {}
        }
        this.diagonalWaves.push(wave)
      }
    },

    initExplosionParticles () {
      // 创建爆炸粒子效果
      this.explosionParticles = []
      const particleCount = 20

      for (let i = 0; i < particleCount; i++) {
        const particle = {
          id: i,
          x: Math.random() * 100, // 随机位置
          y: Math.random() * 100,
          size: 2 + Math.random() * 6, // 2-8px大小
          speed: 0.8 + Math.random() * 1.5, // 随机速度
          direction: Math.random() * Math.PI * 2, // 随机方向
          life: Math.random(), // 生命周期
          opacity: 0.6 + Math.random() * 0.4,
          color: Math.random() > 0.5 ? 'cyan' : 'magenta',
          style: {}
        }
        this.explosionParticles.push(particle)
      }
    },

    updateGridStyles () {
      this.gridLayers.forEach(layer => {
        const size = layer.baseSize
        layer.style = {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(10, 255, 255, ${layer.opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 255, 255, ${layer.opacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${size}px ${size}px`,
          transform: `translate(${layer.offsetX}px, ${layer.offsetY}px)`,
          pointerEvents: 'none'
        }
      })
    },

    startAllAnimations () {
      const animate = () => {
        const time = Date.now() * 0.001 // 转换为秒

        // 更新网格动画 - 震撼效果
        this.gridLayers.forEach((layer, index) => {
          // 大幅度的移动
          layer.offsetX = Math.sin(time * layer.speed * 0.8) * 40
          layer.offsetY = Math.cos(time * layer.speed * 0.6) * 30

          // 旋转效果
          layer.rotation = time * layer.rotationSpeed * 10

          // 缩放效果
          const scaleVariation = Math.sin(time * layer.scaleSpeed + index) * 0.3
          layer.scale = 1 + scaleVariation

          // 网格大小的剧烈变化
          const sizeVariation = Math.sin(time * layer.speed + index) * 15
          const currentSize = layer.baseSize + sizeVariation

          // 透明度的剧烈变化
          const opacityVariation = Math.sin(time * layer.speed * 1.2 + index * 0.8) * 0.1
          const currentOpacity = Math.max(0, layer.opacity + opacityVariation)

          layer.style = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundSize: `${currentSize}px ${currentSize}px`,
            backgroundImage: `
              linear-gradient(rgba(10, 255, 255, ${currentOpacity}) 2px, transparent 2px),
              linear-gradient(90deg, rgba(10, 255, 255, ${currentOpacity}) 2px, transparent 2px)
            `,
            transform: `translate(${layer.offsetX}px, ${layer.offsetY}px) rotate(${layer.rotation}deg) scale(${layer.scale})`,
            pointerEvents: 'none',
            filter: `brightness(${1 + opacityVariation * 2}) contrast(${1 + opacityVariation})`
          }
        })

        // 更新光柱动画 - 震撼效果
        this.lightBeams.forEach((beam) => {
          const beamTime = time - beam.delay
          if (beamTime > 0) {
            const intensity = Math.sin(beamTime * beam.speed) * 0.5 + 0.5
            const pulseIntensity = Math.sin(beamTime * beam.pulseSpeed) * 0.5 + 0.5
            const currentOpacity = beam.opacity * intensity * pulseIntensity

            // 动态位置变化
            const dynamicX = beam.x + Math.sin(beamTime * 0.5) * 10
            const currentWidth = beam.width * (1 + pulseIntensity * 0.5)

            beam.style = {
              position: 'absolute',
              left: `${dynamicX}%`,
              top: '0',
              width: `${currentWidth}px`,
              height: '100%',
              background: `linear-gradient(180deg,
                rgba(10, 255, 255, 0) 0%,
                rgba(255, 0, 255, ${currentOpacity * 0.3}) 20%,
                rgba(10, 255, 255, ${currentOpacity}) 50%,
                rgba(255, 0, 255, ${currentOpacity * 0.3}) 80%,
                rgba(10, 255, 255, 0) 100%)`,
              boxShadow: `
                0 0 ${currentWidth * 3}px rgba(10, 255, 255, ${currentOpacity * 0.8}),
                0 0 ${currentWidth * 6}px rgba(255, 0, 255, ${currentOpacity * 0.4})
              `,
              transform: `rotate(${beam.angle}deg) scaleY(${1 + pulseIntensity * 0.3})`,
              pointerEvents: 'none',
              filter: `brightness(${1 + pulseIntensity}) hue-rotate(${beamTime * 30}deg)`
            }
          }
        })

        // 更新对角线波浪动画 - 震撼效果
        this.diagonalWaves.forEach((wave, index) => {
          wave.offset = (time * wave.speed * 80) % (wave.width + 200)
          const waveOpacity = Math.sin(time * wave.speed + index) * 0.5 + 0.5
          const pulseOpacity = Math.sin(time * wave.pulseSpeed + index * 0.7) * 0.5 + 0.5
          const currentOpacity = wave.opacity * waveOpacity * pulseOpacity

          // 动态缩放
          wave.scale = 1 + Math.sin(time * wave.pulseSpeed * 0.8 + index) * 0.4

          // 动态角度变化
          const dynamicAngle = wave.angle + Math.sin(time * 0.3 + index) * 15

          wave.style = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: `repeating-linear-gradient(
              ${dynamicAngle}deg,
              transparent 0px,
              rgba(10, 255, 255, ${currentOpacity * 0.6}) ${wave.width / 6}px,
              rgba(255, 0, 255, ${currentOpacity * 0.8}) ${wave.width / 4}px,
              rgba(10, 255, 255, ${currentOpacity}) ${wave.width / 3}px,
              rgba(255, 0, 255, ${currentOpacity * 0.6}) ${wave.width / 2}px,
              transparent ${wave.width / 1.5}px
            )`,
            transform: `
              translateX(${wave.offset - wave.width}px)
              scale(${wave.scale})
              rotate(${Math.sin(time * 0.2 + index) * 5}deg)
            `,
            pointerEvents: 'none',
            filter: `
              brightness(${1 + pulseOpacity * 0.5})
              contrast(${1 + pulseOpacity * 0.3})
              hue-rotate(${time * 20 + index * 30}deg)
            `
          }
        })

        // 更新爆炸粒子动画
        this.explosionParticles.forEach((particle) => {
          // 更新粒子生命周期
          particle.life += 0.01
          if (particle.life > 1) {
            particle.life = 0
            particle.x = Math.random() * 100
            particle.y = Math.random() * 100
            particle.direction = Math.random() * Math.PI * 2
          }

          // 粒子移动
          const moveDistance = particle.speed * 2
          particle.x += Math.cos(particle.direction) * moveDistance
          particle.y += Math.sin(particle.direction) * moveDistance

          // 边界检查
          if (particle.x < 0 || particle.x > 100 || particle.y < 0 || particle.y > 100) {
            particle.life = 1 // 重置粒子
          }

          // 动态大小和透明度
          const lifeProgress = particle.life
          const currentSize = particle.size * (1 - lifeProgress * 0.5)
          const currentOpacity = particle.opacity * (1 - lifeProgress)

          const colorValue = particle.color === 'cyan' ? '10, 255, 255' : '255, 0, 255'

          particle.style = {
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            background: `rgba(${colorValue}, ${currentOpacity})`,
            borderRadius: '50%',
            boxShadow: `0 0 ${currentSize * 2}px rgba(${colorValue}, ${currentOpacity * 0.8})`,
            pointerEvents: 'none',
            transform: `scale(${1 + Math.sin(time * 5 + particle.id) * 0.3})`,
            filter: `brightness(${1.5 + Math.sin(time * 3 + particle.id) * 0.5})`
          }
        })

        this.animationFrame = requestAnimationFrame(animate)
      }

      animate()
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

.dynamic-grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dynamic-grid-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.light-beams {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.light-beam {
  position: absolute;
  pointer-events: none;
}

.diagonal-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.diagonal-wave {
  position: absolute;
  pointer-events: none;
}

.explosion-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 5;
}

.particle {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
}

.game-area-preview {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(80vw, 80vh);
  height: min(80vw, 80vh);
  max-width: 500px;
  max-height: 500px;
  z-index: 2;
  pointer-events: none;
}

.game-border {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(10, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(0, 17, 34, 0.1);
  box-shadow:
    0 0 20px rgba(10, 255, 255, 0.2),
    inset 0 0 20px rgba(10, 255, 255, 0.1);
  animation: border-pulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes border-pulse {

  0%,
  100% {
    border-color: rgba(10, 255, 255, 0.3);
    box-shadow:
      0 0 20px rgba(10, 255, 255, 0.2),
      inset 0 0 20px rgba(10, 255, 255, 0.1);
  }

  50% {
    border-color: rgba(10, 255, 255, 0.6);
    box-shadow:
      0 0 30px rgba(10, 255, 255, 0.4),
      inset 0 0 30px rgba(10, 255, 255, 0.2);
  }
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
  z-index: 100;
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
  text-shadow:
    0 0 20px rgba(10, 255, 255, 0.8),
    0 0 40px rgba(255, 0, 255, 0.6),
    0 0 60px rgba(10, 255, 255, 0.4),
    0 0 80px rgba(255, 0, 255, 0.3);
  animation: title-pulse 2s ease-in-out infinite;
}

@keyframes title-pulse {

  0%,
  100% {
    transform: scale(1);
    text-shadow:
      0 0 20px rgba(10, 255, 255, 0.8),
      0 0 40px rgba(255, 0, 255, 0.6),
      0 0 60px rgba(10, 255, 255, 0.4);
  }

  50% {
    transform: scale(1.05);
    text-shadow:
      0 0 30px rgba(10, 255, 255, 1),
      0 0 60px rgba(255, 0, 255, 0.8),
      0 0 90px rgba(10, 255, 255, 0.6),
      0 0 120px rgba(255, 0, 255, 0.4);
  }
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
  position: relative;
  z-index: 101;
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
  position: relative;
  z-index: 102;
  cursor: pointer;
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
