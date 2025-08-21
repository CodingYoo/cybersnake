<template>
  <div class="game-container">
    <!-- 背景效果 -->
    <div class="game-background">
      <!-- 正方形网格 -->
      <div class="square-grid-container">
        <div class="square-grid-layer" v-for="layer in gridLayers" :key="layer.id" :style="layer.style"></div>
      </div>

      <!-- 波浪状光影效果 -->
      <div class="wave-lights-container">
        <div class="wave-light" v-for="wave in waveLights" :key="wave.id" :style="wave.style"></div>
      </div>
    </div>

    <!-- 游戏画布 -->
    <canvas id="gameCanvas" class="game-canvas" :width="canvasWidth" :height="canvasHeight" @touchstart="onTouchStart"
      @touchmove="onTouchMove" @touchend="onTouchEnd" @mousedown="onMouseDown" @mousemove="onMouseMove"
      @mouseup="onMouseUp"></canvas>

    <!-- 游戏UI -->
    <div class="game-ui">
      <!-- 分数显示 -->
      <div class="score-section">
        <span class="score-value">{{ score }}</span>
      </div>

      <!-- 暂停按钮 -->
      <div class="pause-btn cyber-border" @click="togglePause">
        <span class="pause-icon">{{ isPaused ? '▶' : '⏸' }}</span>
      </div>
    </div>

    <!-- 暂停遮罩 -->
    <div v-if="isPaused" class="pause-overlay">
      <div class="pause-content">
        <span class="pause-title cyber-text">游戏暂停</span>
        <button class="resume-btn cyber-button cyber-pulse" @click="togglePause">继续游戏</button>
        <button class="menu-btn cyber-button" @click="backToMenu">返回主菜单</button>
      </div>
    </div>

    <!-- 游戏结束遮罩 -->
    <div v-if="gameOver" class="game-over-overlay">
      <div class="game-over-content">
        <span class="game-over-title cyber-text-secondary">游戏结束</span>
        <span class="final-score">{{ score }}</span>
        <!-- <span class="game-over-message cyber-text">NEURAL LINK TERMINATED</span> -->

        <div class="game-over-buttons">
          <button class="restart-btn cyber-button cyber-pulse" @click="restartGame">
            重新开始
          </button>
          <button class="share-btn cyber-button" @click="shareScore">
            分享得分
          </button>
          <button class="menu-btn cyber-button" @click="backToMenu">
            返回主菜单
          </button>
        </div>
      </div>
    </div>

    <!-- 虚拟方向键（可选） -->
    <div v-if="showVirtualKeys" class="virtual-controls">
      <div class="control-pad">
        <button class="control-btn up" @click="changeDirection('up')">↑</button>
        <div class="control-row">
          <button class="control-btn left" @click="changeDirection('left')">←</button>
          <button class="control-btn right" @click="changeDirection('right')">→</button>
        </div>
        <button class="control-btn down" @click="changeDirection('down')">↓</button>
      </div>
    </div>
  </div>
</template>

<script>
import audioManager from '@/utils/audio-manager.js'
import leaderboard from '@/utils/leaderboard.js'
import { navigateTo } from '@/router.js'

export default {
  name: 'GamePage',
  data () {
    return {
      // 画布相关
      canvas: null,
      ctx: null,
      canvasWidth: 800,
      canvasHeight: 800,

      // 游戏状态
      gameRunning: false,
      isPaused: false,
      gameOver: false,
      score: 0,

      // 游戏配置
      gridSize: 20,
      gameSpeed: 350, // ms

      // 蛇的数据
      snake: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ],
      direction: 'right',
      nextDirection: 'right',

      // 食物数据
      food: { x: 15, y: 15 },
      foodAnimationSpeed: 0.001, // 食物旋转动画速度
      foodEatAnimation: {
        active: false,
        startTime: 0,
        duration: 100, // 食物消失动画持续时间(ms)
        scale: 1,
        opacity: 1
      },

      // 控制相关
      showVirtualKeys: true,
      touchStartX: 0,
      touchStartY: 0,

      // 动画相关
      lastTime: 0,
      gameLoop: null,

      // 视觉效果
      particles: [],
      glitchEffect: false,

      // 背景效果
      gridLayers: [],
      waveLights: [],
      backgroundAnimationFrame: null
    }
  },
  computed: {
    gridWidth () {
      return Math.floor(this.canvasWidth / this.gridSize)
    },
    gridHeight () {
      return Math.floor(this.canvasHeight / this.gridSize)
    }
  },
  mounted () {
    console.log('🎮 Game page loaded')
    // 恢复音频上下文
    audioManager.resume()
    this.initGame()
    this.setupKeyboardControls()

    // 初始化背景效果
    this.initBackgroundEffects()
    this.startBackgroundAnimation()

    // 添加全局调试方法
    window.setFoodAnimationSpeed = (speed) => this.setFoodAnimationSpeed(speed)
    window.setFoodEatDuration = (duration) => this.setFoodEatDuration(duration)
    console.log('🍎 Food animation controls available:')
    console.log('  setFoodAnimationSpeed(0.001-0.02) - 调整食物旋转速度')
    console.log('  setFoodEatDuration(100-1000) - 调整食物消失动画时长(ms)')
  },

  beforeUnmount () {
    this.stopGame()
    this.removeKeyboardControls()

    // 清理背景动画
    if (this.backgroundAnimationFrame) {
      cancelAnimationFrame(this.backgroundAnimationFrame)
    }

    // 清理全局调试方法
    delete window.setFoodAnimationSpeed
    delete window.setFoodEatDuration
  },

  methods: {
    navigateTo,

    // 初始化游戏
    initGame () {
      this.$nextTick(() => {
        this.setupCanvas()
        this.resetGame()
        this.startGame()
      })
    },

    // 设置画布
    setupCanvas () {
      this.canvas = document.getElementById('gameCanvas')
      this.ctx = this.canvas.getContext('2d')

      // 动态计算画布尺寸，确保正方形
      const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.8
      this.canvasWidth = Math.min(minSize, 600)
      this.canvasHeight = this.canvasWidth

      // 设置画布尺寸
      const dpr = window.devicePixelRatio || 1
      this.canvas.width = this.canvasWidth * dpr
      this.canvas.height = this.canvasHeight * dpr
      this.canvas.style.width = this.canvasWidth + 'px'
      this.canvas.style.height = this.canvasHeight + 'px'
      this.ctx.scale(dpr, dpr)

      console.log('✅ Canvas setup completed:', this.canvasWidth + 'x' + this.canvasHeight)
    },

    // 重置游戏
    resetGame () {
      this.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ]
      this.direction = 'right'
      this.nextDirection = 'right'
      this.score = 0
      this.gameOver = false
      this.isPaused = false
      this.generateFood()
      this.particles = []

      // 重置食物动画状态
      this.foodEatAnimation.active = false
      this.foodEatAnimation.scale = 1
      this.foodEatAnimation.opacity = 1
    },

    // 开始游戏
    startGame () {
      this.gameRunning = true
      this.lastTime = Date.now()
      this.gameLoop = setInterval(this.update, this.gameSpeed)
      console.log('🎮 Game started')
    },

    // 停止游戏
    stopGame () {
      this.gameRunning = false
      if (this.gameLoop) {
        clearInterval(this.gameLoop)
        this.gameLoop = null
      }
    },

    // 游戏主循环
    update () {
      if (!this.gameRunning || this.isPaused || this.gameOver) return

      this.updateGame()
      this.render()
    },

    // 更新游戏逻辑
    updateGame () {
      // 更新方向
      this.direction = this.nextDirection

      // 移动蛇
      this.moveSnake()

      // 检查碰撞
      this.checkCollisions()

      // 更新粒子效果
      this.updateParticles()
    },

    // 移动蛇
    moveSnake () {
      const head = { ...this.snake[0] }

      // 根据方向移动头部
      switch (this.direction) {
        case 'up': head.y--; break
        case 'down': head.y++; break
        case 'left': head.x--; break
        case 'right': head.x++; break
      }

      this.snake.unshift(head)

      // 检查是否吃到食物
      if (head.x === this.food.x && head.y === this.food.y) {
        this.eatFood()
      } else {
        this.snake.pop()
      }
    },

    // 吃到食物
    eatFood () {
      this.score += 10

      // 启动食物消失动画
      this.foodEatAnimation.active = true
      this.foodEatAnimation.startTime = Date.now()
      this.foodEatAnimation.scale = 1
      this.foodEatAnimation.opacity = 1

      // 延迟生成新食物，让动画播放完
      setTimeout(() => {
        this.generateFood()
      }, this.foodEatAnimation.duration)

      this.createEatEffect()

      // 播放吃食物音效
      audioManager.playEatSound()

      // 增加游戏速度
      if (this.score % 50 === 0 && this.gameSpeed > 80) {
        this.gameSpeed -= 10
        this.stopGame()
        this.startGame()
      }

      console.log('🍎 Food eaten! Score:', this.score)
    },

    // 生成食物
    generateFood () {
      let newFood
      do {
        newFood = {
          x: Math.floor(Math.random() * this.gridWidth),
          y: Math.floor(Math.random() * this.gridHeight)
        }
      } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))

      this.food = newFood
    },

    // 检查碰撞
    checkCollisions () {
      const head = this.snake[0]

      // 检查墙壁碰撞
      if (head.x < 0 || head.x >= this.gridWidth ||
        head.y < 0 || head.y >= this.gridHeight) {
        this.endGame()
        return
      }

      // 检查自身碰撞
      for (let i = 1; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          this.endGame()
          return
        }
      }
    },

    // 游戏结束
    endGame () {
      this.gameOver = true
      this.stopGame()
      this.createGameOverEffect()

      // 播放游戏结束音效
      audioManager.playGameOverSound()

      // 添加分数到排行榜
      const rank = leaderboard.addScore(this.score)

      // 检查是否是新纪录
      if (leaderboard.isNewRecord(this.score)) {
        console.log('🏆 NEW HIGH SCORE!', this.score)
        alert('🏆 NEW HIGH SCORE!')
      } else if (rank <= 10) {
        console.log(`📊 Ranked #${rank} in leaderboard`)
      }

      console.log('💀 Game Over! Final Score:', this.score)
    },

    // 渲染游戏
    render () {
      if (!this.ctx) return

      // 清空画布
      this.ctx.fillStyle = '#001122'
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      // 绘制网格背景
      this.drawGrid()

      // 绘制食物
      this.drawFood()

      // 绘制蛇
      this.drawSnake()

      // 绘制粒子效果
      this.drawParticles()

      // 绘制故障效果
      if (this.glitchEffect) {
        this.drawGlitch()
      }
    },

    // 绘制网格
    drawGrid () {
      this.ctx.strokeStyle = 'rgba(10, 255, 255, 0.1)'
      this.ctx.lineWidth = 1

      for (let x = 0; x <= this.gridWidth; x++) {
        this.ctx.beginPath()
        this.ctx.moveTo(x * this.gridSize, 0)
        this.ctx.lineTo(x * this.gridSize, this.canvasHeight)
        this.ctx.stroke()
      }

      for (let y = 0; y <= this.gridHeight; y++) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, y * this.gridSize)
        this.ctx.lineTo(this.canvasWidth, y * this.gridSize)
        this.ctx.stroke()
      }
    },

    // 绘制蛇
    drawSnake () {
      this.snake.forEach((segment, index) => {
        const x = segment.x * this.gridSize
        const y = segment.y * this.gridSize

        if (index === 0) {
          // 蛇头 - 脉冲晶格效果
          this.ctx.fillStyle = '#0affff'
          this.ctx.shadowColor = '#0affff'
          this.ctx.shadowBlur = 15
          this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4)

          // 添加内部发光
          this.ctx.fillStyle = '#ffffff'
          this.ctx.fillRect(x + 6, y + 6, this.gridSize - 12, this.gridSize - 12)
        } else {
          // 蛇身 - 半透明霓虹光带
          const alpha = 1 - (index / this.snake.length) * 0.5
          this.ctx.fillStyle = `rgba(10, 255, 255, ${alpha})`
          this.ctx.shadowColor = '#0affff'
          this.ctx.shadowBlur = 10
          this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2)
        }
      })

      this.ctx.shadowBlur = 0
    },

    // 绘制食物
    drawFood () {
      const x = this.food.x * this.gridSize
      const y = this.food.y * this.gridSize
      const centerX = x + this.gridSize / 2
      const centerY = y + this.gridSize / 2
      const time = Date.now() * this.foodAnimationSpeed

      // 计算食物动画状态
      let scale = 1
      let opacity = 1

      if (this.foodEatAnimation.active) {
        const elapsed = Date.now() - this.foodEatAnimation.startTime
        const progress = Math.min(elapsed / this.foodEatAnimation.duration, 1)

        // 缩放动画：先放大再缩小
        if (progress < 0.3) {
          scale = 1 + (progress / 0.3) * 0.5 // 放大到1.5倍
        } else {
          scale = 1.5 - ((progress - 0.3) / 0.7) * 1.5 // 缩小到0
        }

        // 透明度动画
        opacity = 1 - progress

        // 动画结束
        if (progress >= 1) {
          this.foodEatAnimation.active = false
          return // 不绘制已消失的食物
        }
      }

      // 旋转的3D芯片效果
      this.ctx.save()
      this.ctx.translate(centerX, centerY)
      this.ctx.rotate(time)
      this.ctx.scale(scale, scale)
      this.ctx.globalAlpha = opacity

      // 外层发光
      this.ctx.fillStyle = '#ff00ff'
      this.ctx.shadowColor = '#ff00ff'
      this.ctx.shadowBlur = 20
      this.ctx.fillRect(-8, -8, 16, 16)

      // 内层芯片
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillRect(-6, -6, 12, 12)

      // 芯片线路
      this.ctx.strokeStyle = '#ff00ff'
      this.ctx.lineWidth = 2
      this.ctx.beginPath()
      this.ctx.moveTo(-4, 0)
      this.ctx.lineTo(4, 0)
      this.ctx.moveTo(0, -4)
      this.ctx.lineTo(0, 4)
      this.ctx.stroke()

      this.ctx.restore()
      this.ctx.shadowBlur = 0
    },

    // 触摸控制
    onTouchStart (e) {
      const touch = e.touches[0]
      this.touchStartX = touch.clientX
      this.touchStartY = touch.clientY
    },

    onTouchMove (e) {
      e.preventDefault()
    },

    onTouchEnd (e) {
      if (!this.gameRunning || this.isPaused || this.gameOver) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - this.touchStartX
      const deltaY = touch.clientY - this.touchStartY
      const minSwipeDistance = 30

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && this.direction !== 'left') {
            this.nextDirection = 'right'
          } else if (deltaX < 0 && this.direction !== 'right') {
            this.nextDirection = 'left'
          }
        }
      } else {
        // 垂直滑动
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0 && this.direction !== 'up') {
            this.nextDirection = 'down'
          } else if (deltaY < 0 && this.direction !== 'down') {
            this.nextDirection = 'up'
          }
        }
      }
    },

    // 鼠标事件处理（桌面端）
    onMouseDown (e) {
      this.touchStartX = e.clientX
      this.touchStartY = e.clientY
    },

    onMouseMove (e) {
      e.preventDefault()
    },

    onMouseUp (e) {
      if (!this.gameRunning || this.isPaused || this.gameOver) return

      const deltaX = e.clientX - this.touchStartX
      const deltaY = e.clientY - this.touchStartY
      const minSwipeDistance = 30

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && this.direction !== 'left') {
            this.nextDirection = 'right'
          } else if (deltaX < 0 && this.direction !== 'right') {
            this.nextDirection = 'left'
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0 && this.direction !== 'up') {
            this.nextDirection = 'down'
          } else if (deltaY < 0 && this.direction !== 'down') {
            this.nextDirection = 'up'
          }
        }
      }
    },

    // 改变方向
    changeDirection (newDirection) {
      if (!this.gameRunning || this.isPaused || this.gameOver) return

      const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
      }

      if (this.direction !== opposites[newDirection]) {
        this.nextDirection = newDirection
      }
    },

    // 切换暂停
    togglePause () {
      this.isPaused = !this.isPaused
      console.log(this.isPaused ? '⏸ Game paused' : '▶ Game resumed')
    },

    // 重新开始游戏
    restartGame () {
      this.stopGame()
      this.resetGame()
      this.startGame()
    },

    // 返回主菜单
    backToMenu () {
      this.stopGame()
      this.navigateTo('index')
    },

    // 分享分数
    shareScore () {
      const shareText = `我在CyberSnake中获得了${this.score}分！\nI AM THE SYSTEM`

      if (navigator.share) {
        navigator.share({
          title: 'CyberSnake Score',
          text: shareText,
          url: window.location.href
        }).catch(err => console.log('Share failed:', err))
      } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href)
          .then(() => alert('分数已复制到剪贴板！'))
          .catch(() => alert(`我的分数：${this.score}分`))
      }
    },

    // 创建吃食物效果
    createEatEffect () {
      const x = this.food.x * this.gridSize + this.gridSize / 2
      const y = this.food.y * this.gridSize + this.gridSize / 2

      // 创建粒子爆炸效果
      for (let i = 0; i < 8; i++) {
        this.particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          decay: 0.02,
          color: '#ff00ff',
          size: 3 + Math.random() * 3
        })
      }

      // 触发故障效果
      this.glitchEffect = true
      setTimeout(() => {
        this.glitchEffect = false
      }, 100)
    },

    // 创建游戏结束效果
    createGameOverEffect () {
      // 创建大量粒子效果
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: Math.random() * this.canvasWidth,
          y: Math.random() * this.canvasHeight,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          life: 1,
          decay: 0.01,
          color: Math.random() > 0.5 ? '#0affff' : '#ff00ff',
          size: 4 + Math.random() * 6
        })
      }
    },

    // 更新粒子
    updateParticles () {
      this.particles = this.particles.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= particle.decay
        particle.vx *= 0.98
        particle.vy *= 0.98
        return particle.life > 0
      })
    },

    // 绘制粒子
    drawParticles () {
      this.particles.forEach(particle => {
        this.ctx.save()
        this.ctx.globalAlpha = particle.life
        this.ctx.fillStyle = particle.color
        this.ctx.shadowColor = particle.color
        this.ctx.shadowBlur = 10
        this.ctx.beginPath()
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.restore()
      })
    },

    // 绘制故障效果
    drawGlitch () {
      for (let i = 0; i < 5; i++) {
        this.ctx.fillStyle = 'rgba(255, 0, 255, 0.1)'
        this.ctx.fillRect(
          Math.random() * this.canvasWidth,
          Math.random() * this.canvasHeight,
          Math.random() * 100,
          Math.random() * 20
        )
      }
    },

    // 设置键盘控制
    setupKeyboardControls () {
      this.keyboardHandler = (e) => {
        if (!this.gameRunning || this.gameOver) return

        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            e.preventDefault()
            if (this.direction !== 'down') this.nextDirection = 'up'
            break
          case 's':
          case 'arrowdown':
            e.preventDefault()
            if (this.direction !== 'up') this.nextDirection = 'down'
            break
          case 'a':
          case 'arrowleft':
            e.preventDefault()
            if (this.direction !== 'right') this.nextDirection = 'left'
            break
          case 'd':
          case 'arrowright':
            e.preventDefault()
            if (this.direction !== 'left') this.nextDirection = 'right'
            break
          case ' ':
            e.preventDefault()
            this.togglePause()
            break
        }
      }

      document.addEventListener('keydown', this.keyboardHandler)
    },

    // 移除键盘控制
    removeKeyboardControls () {
      if (this.keyboardHandler) {
        document.removeEventListener('keydown', this.keyboardHandler)
      }
    },

    // 设置食物动画速度
    setFoodAnimationSpeed (speed) {
      this.foodAnimationSpeed = speed
      console.log('🍎 Food animation speed set to:', speed)
    },

    // 设置食物消失动画时长
    setFoodEatDuration (duration) {
      this.foodEatAnimation.duration = duration
      console.log('🍎 Food eat animation duration set to:', duration + 'ms')
    },

    // 初始化背景效果
    initBackgroundEffects () {
      // 初始化正方形网格层
      this.gridLayers = []
      const layerCount = 4

      for (let i = 0; i < layerCount; i++) {
        const layer = {
          id: i,
          size: 40 + i * 20, // 40px, 60px, 80px, 100px
          opacity: 0.08 - i * 0.015, // 递减透明度
          speed: 0.3 + i * 0.2, // 不同速度
          offsetX: 0,
          offsetY: 0,
          style: {}
        }
        this.gridLayers.push(layer)
      }

      // 初始化波浪状光影
      this.waveLights = []
      const waveCount = 6

      for (let i = 0; i < waveCount; i++) {
        const wave = {
          id: i,
          direction: i % 2 === 0 ? 'horizontal' : 'vertical', // 交替方向
          position: (i / waveCount) * 100, // 分布位置
          width: 150 + Math.random() * 100, // 波浪宽度
          speed: 0.5 + Math.random() * 1.0, // 随机速度
          opacity: 0.1 + Math.random() * 0.15, // 随机透明度
          phase: Math.random() * Math.PI * 2, // 随机相位
          style: {}
        }
        this.waveLights.push(wave)
      }
    },

    // 开始背景动画
    startBackgroundAnimation () {
      const animate = () => {
        const time = Date.now() * 0.001

        // 更新网格层动画
        this.gridLayers.forEach((layer, index) => {
          // 轻微的移动
          layer.offsetX = Math.sin(time * layer.speed * 0.3) * 5
          layer.offsetY = Math.cos(time * layer.speed * 0.2) * 3

          // 透明度波动
          const opacityVariation = Math.sin(time * layer.speed + index) * 0.02
          const currentOpacity = Math.max(0, layer.opacity + opacityVariation)

          layer.style = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(10, 255, 255, ${currentOpacity}) 1px, transparent 1px),
              linear-gradient(90deg, rgba(10, 255, 255, ${currentOpacity}) 1px, transparent 1px)
            `,
            backgroundSize: `${layer.size}px ${layer.size}px`,
            transform: `translate(${layer.offsetX}px, ${layer.offsetY}px)`,
            pointerEvents: 'none'
          }
        })

        // 更新波浪光影动画
        this.waveLights.forEach((wave, index) => {
          const waveTime = time * wave.speed + wave.phase
          const intensity = (Math.sin(waveTime) + 1) * 0.5 // 0-1
          const currentOpacity = wave.opacity * intensity

          if (wave.direction === 'horizontal') {
            // 水平波浪
            const yPos = wave.position + Math.sin(waveTime * 0.5) * 20
            wave.style = {
              position: 'absolute',
              left: '0',
              top: `${yPos}%`,
              width: '100%',
              height: `${wave.width}px`,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(10, 255, 255, ${currentOpacity * 0.3}) 25%,
                rgba(10, 255, 255, ${currentOpacity}) 50%,
                rgba(10, 255, 255, ${currentOpacity * 0.3}) 75%,
                transparent 100%)`,
              transform: `translateX(${Math.sin(waveTime * 0.8) * 50}px)`,
              pointerEvents: 'none',
              filter: 'blur(2px)'
            }
          } else {
            // 垂直波浪
            const xPos = wave.position + Math.cos(waveTime * 0.4) * 15
            wave.style = {
              position: 'absolute',
              left: `${xPos}%`,
              top: '0',
              width: `${wave.width}px`,
              height: '100%',
              background: `linear-gradient(180deg,
                transparent 0%,
                rgba(10, 255, 255, ${currentOpacity * 0.3}) 25%,
                rgba(10, 255, 255, ${currentOpacity}) 50%,
                rgba(10, 255, 255, ${currentOpacity * 0.3}) 75%,
                transparent 100%)`,
              transform: `translateY(${Math.cos(waveTime * 0.6) * 30}px)`,
              pointerEvents: 'none',
              filter: 'blur(2px)'
            }
          }
        })

        this.backgroundAnimationFrame = requestAnimationFrame(animate)
      }

      animate()
    }
  }
}
</script>

<style lang="scss" scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #001122 0%, #001a33 50%, #002244 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.game-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.square-grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.square-grid-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.wave-lights-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wave-light {
  position: absolute;
  pointer-events: none;
}

.game-canvas {
  display: block;
  width: min(90vw, 90vh);
  height: min(90vw, 90vh);
  max-width: 600px;
  max-height: 600px;
  background: rgba(0, 17, 34, 0.9);
  border: 2px solid #0affff;
  border-radius: 8px;
  box-shadow:
    0 0 20px rgba(10, 255, 255, 0.3),
    inset 0 0 20px rgba(10, 255, 255, 0.1);
  position: relative;
  z-index: 10;
}

.game-ui {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 100;
  pointer-events: none;
  z-index: 20;
}

.game-ui>* {
  pointer-events: auto;
}

.score-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: rgba(0, 17, 34, 0.8);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(10, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.score-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #0affff;
}

.pause-btn {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(10, 255, 255, 0.2);
  border: 1px solid rgba(10, 255, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.pause-btn:hover {
  background: rgba(10, 255, 255, 0.3);
  transform: scale(1.05);
}

.pause-icon {
  font-size: 18px;
  color: #0affff;
}

.pause-overlay,
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 17, 34, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.pause-content,
.game-over-content {
  text-align: center;
  padding: 40px;
  background: rgba(0, 17, 34, 0.8);
  border: 2px solid rgba(10, 255, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 90%;
}

.pause-title,
.game-over-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  letter-spacing: 3px;
}

.final-score {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #0affff;
  letter-spacing: 2px;
}

.game-over-message {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 32px;
}

.game-over-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-btn,
.restart-btn,
.share-btn,
.menu-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  letter-spacing: 2px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(10, 255, 255, 0.1);
  border: 2px solid #0affff;
  color: #0affff;
  cursor: pointer;
}

.resume-btn:hover,
.restart-btn:hover,
.share-btn:hover,
.menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(10, 255, 255, 0.4);
  background: rgba(10, 255, 255, 0.2);
  border-color: #0affff;
}

.resume-btn:active,
.restart-btn:active,
.share-btn:active,
.menu-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(10, 255, 255, 0.6);
  background: rgba(10, 255, 255, 0.3);
}

/* 重新开始按钮特殊样式 */
.restart-btn {
  background: rgba(10, 255, 255, 0.15);
  border-color: #0affff;
  animation: cyber-pulse 2s infinite;
}

.restart-btn:hover {
  background: rgba(10, 255, 255, 0.25);
  animation: cyber-pulse 1s infinite;
}

/* 继续游戏按钮特殊样式 */
.resume-btn {
  background: rgba(10, 255, 255, 0.15);
  border-color: #0affff;
  animation: cyber-pulse 2s infinite;
}

.resume-btn:hover {
  background: rgba(10, 255, 255, 0.25);
  animation: cyber-pulse 1s infinite;
}

.virtual-controls {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.virtual-controls:hover {
  opacity: 1;
}

.control-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.control-row {
  display: flex;
  gap: 48px;
}

.control-btn {
  width: 48px;
  height: 48px;
  background: rgba(10, 255, 255, 0.2);
  border: 2px solid rgba(10, 255, 255, 0.5);
  border-radius: 50%;
  color: #0affff;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  user-select: none;
}

.control-btn:hover {
  background: rgba(10, 255, 255, 0.3);
  transform: scale(1.1);
  border-color: #0affff;
}

.control-btn:active {
  background: rgba(10, 255, 255, 0.5);
  transform: scale(0.95);
}

/* 移动端显示虚拟控制键 */
@media (max-width: 768px) {
  .virtual-controls {
    display: block;
  }
}

/* 桌面端隐藏虚拟控制键 */
@media (min-width: 769px) {
  .virtual-controls {
    display: none;
  }
}
</style>
