<template>
  <view class="leaderboard-container">
    <!-- 背景效果 -->
    <view class="bg-effects">
      <view class="grid-bg"></view>
      <view class="scan-lines"></view>
    </view>

    <!-- 标题区域 -->
    <view class="header-section">
      <text class="page-title cyber-text cyber-glow">LEADERBOARD</text>
      <text class="page-subtitle cyber-text-secondary">NEURAL NETWORK RANKINGS</text>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-label">HIGH SCORE</text>
        <text class="stat-value cyber-text">{{ stats.highScore }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">TOTAL GAMES</text>
        <text class="stat-value cyber-text">{{ stats.totalGames }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">AVERAGE</text>
        <text class="stat-value cyber-text">{{ stats.averageScore }}</text>
      </view>
    </view>

    <!-- 排行榜列表 -->
    <view class="leaderboard-list">
      <view v-if="leaderboardData.length === 0" class="empty-state">
        <text class="empty-icon">🏆</text>
        <text class="empty-title cyber-text">NO RECORDS YET</text>
        <text class="empty-message cyber-text-secondary">Start playing to set your first record!</text>
      </view>

      <view v-else class="score-list">
        <view v-for="(record, index) in leaderboardData" :key="index" class="score-item"
          :class="{ 'top-score': index < 3 }">
          <view class="rank-section">
            <text class="rank-number" :class="getRankClass(record.rank)">
              {{ record.rank }}
            </text>
            <text v-if="record.rank <= 3" class="rank-medal">
              {{ getMedal(record.rank) }}
            </text>
          </view>

          <view class="player-section">
            <text class="player-name cyber-text">{{ record.player }}</text>
            <text class="play-date">{{ record.date }}</text>
          </view>

          <view class="score-section">
            <text class="score-value cyber-text cyber-glow">{{ record.score }}</text>
            <text class="score-label">POINTS</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn cyber-button" @tap="playGame">
        START NEW GAME
      </button>

      <button class="action-btn cyber-button" @tap="clearData">
        CLEAR DATA
      </button>

      <button class="action-btn cyber-button" @tap="shareLeaderboard">
        SHARE
      </button>

      <button class="action-btn cyber-button" @tap="backToMenu">
        BACK TO MENU
      </button>
    </view>
  </view>
</template>

<script>
import leaderboard from '@/utils/leaderboard.js'
import { navigateTo } from '@/router.js'

export default {
  name: 'LeaderboardPage',
  data () {
    return {
      leaderboardData: [],
      stats: {
        highScore: 0,
        totalGames: 0,
        averageScore: 0,
        totalScore: 0
      }
    }
  },
  onLoad () {
    this.loadLeaderboardData()
  },
  onShow () {
    // 每次显示页面时刷新数据
    this.loadLeaderboardData()
  },
  methods: {
    navigateTo,

    // 加载排行榜数据
    loadLeaderboardData () {
      this.leaderboardData = leaderboard.getLeaderboard()
      this.stats = leaderboard.getStats()
      console.log('📊 Leaderboard data loaded:', this.leaderboardData.length, 'records')
    },

    // 获取排名样式类
    getRankClass (rank) {
      if (rank === 1) return 'rank-first'
      if (rank === 2) return 'rank-second'
      if (rank === 3) return 'rank-third'
      return 'rank-normal'
    },

    // 获取奖牌
    getMedal (rank) {
      const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
      return medals[rank] || ''
    },

    // 开始新游戏
    playGame () {
      this.navigateTo('game')
    },

    // 清空数据
    clearData () {
      if (confirm('This will permanently delete all leaderboard records. Continue?')) {
        leaderboard.clearLeaderboard()
        this.loadLeaderboardData()
        alert('Data cleared successfully')
      }
    },

    // 分享排行榜
    shareLeaderboard () {
      const highScore = this.stats.highScore
      const totalGames = this.stats.totalGames
      const shareText = `🐍 CyberSnake Leaderboard\n🏆 High Score: ${highScore}\n🎮 Games Played: ${totalGames}\n\nJoin the neural network!`

      if (navigator.share) {
        navigator.share({
          title: 'CyberSnake Leaderboard',
          text: shareText,
          url: window.location.href
        }).catch(err => console.log('Share failed:', err))
      } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href)
          .then(() => alert('Copied to clipboard!'))
          .catch(() => alert(shareText))
      }
    },

    // 返回主菜单
    backToMenu () {
      this.navigateTo('index')
    }
  }
}
</script>

<style lang="scss" scoped>
.leaderboard-container {
  position: relative;
  min-height: 100vh;
  background: #001122;
  padding: 40rpx;
  overflow-y: auto;
}

.bg-effects {
  position: fixed;
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
    linear-gradient(rgba(10, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50rpx 50rpx;
  animation: grid-move 30s linear infinite;
}

.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(0deg,
      transparent,
      transparent 4rpx,
      rgba(10, 255, 255, 0.02) 4rpx,
      rgba(10, 255, 255, 0.02) 8rpx);
  animation: scan-move 4s linear infinite;
}

.header-section {
  position: relative;
  text-align: center;
  margin-bottom: 60rpx;
  z-index: 10;
}

.page-title {
  display: block;
  font-size: 80rpx;
  font-weight: bold;
  letter-spacing: 6rpx;
  margin-bottom: 20rpx;
}

.page-subtitle {
  display: block;
  font-size: 32rpx;
  opacity: 0.8;
}

.stats-section {
  position: relative;
  display: flex;
  justify-content: space-around;
  margin-bottom: 60rpx;
  z-index: 10;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: #0affff;
  opacity: 0.6;
  margin-bottom: 8rpx;
}

.stat-value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
}

.leaderboard-list {
  position: relative;
  margin-bottom: 80rpx;
  z-index: 10;
}

.empty-state {
  text-align: center;
  padding: 120rpx 40rpx;
}

.empty-icon {
  display: block;
  font-size: 120rpx;
  margin-bottom: 40rpx;
}

.empty-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.empty-message {
  display: block;
  font-size: 28rpx;
  opacity: 0.8;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.score-item {
  display: flex;
  align-items: center;
  background: rgba(10, 255, 255, 0.05);
  border: 1px solid rgba(10, 255, 255, 0.2);
  border-radius: 12rpx;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.score-item.top-score {
  background: rgba(255, 0, 255, 0.1);
  border-color: rgba(255, 0, 255, 0.3);
  box-shadow: 0 0 20rpx rgba(255, 0, 255, 0.2);
}

.rank-section {
  display: flex;
  align-items: center;
  width: 120rpx;
}

.rank-number {
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 16rpx;
}

.rank-first {
  color: #ffd700;
}

.rank-second {
  color: #c0c0c0;
}

.rank-third {
  color: #cd7f32;
}

.rank-normal {
  color: #0affff;
}

.rank-medal {
  font-size: 32rpx;
}

.player-section {
  flex: 1;
  margin-left: 30rpx;
}

.player-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.play-date {
  font-size: 24rpx;
  color: #0affff;
  opacity: 0.6;
}

.score-section {
  text-align: right;
}

.score-value {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
}

.score-label {
  font-size: 20rpx;
  color: #0affff;
  opacity: 0.6;
}

.action-buttons {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
  max-width: 400px;
  margin: 0 auto;
}

.action-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  letter-spacing: 2px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(10, 255, 255, 0.4);
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(50rpx, 50rpx);
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
</style>
