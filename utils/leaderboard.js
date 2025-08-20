/**
 * 排行榜管理器
 * 本地存储最高分记录
 */
class Leaderboard {
  constructor() {
    this.storageKey = 'cybersnake_leaderboard'
    this.maxRecords = 10
    this.scores = this.loadScores()
  }

  // 从本地存储加载分数
  loadScores() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const scores = JSON.parse(stored)
        return Array.isArray(scores) ? scores : []
      }
    } catch (error) {
      console.warn('Failed to load scores:', error)
    }
    return []
  }

  // 保存分数到本地存储
  saveScores() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores))
    } catch (error) {
      console.warn('Failed to save scores:', error)
    }
  }

  // 添加新分数
  addScore(score, playerName = 'Anonymous') {
    const newRecord = {
      score: score,
      player: playerName,
      date: new Date().toISOString(),
      timestamp: Date.now()
    }

    this.scores.push(newRecord)
    
    // 按分数降序排序
    this.scores.sort((a, b) => b.score - a.score)
    
    // 只保留前N名
    this.scores = this.scores.slice(0, this.maxRecords)
    
    this.saveScores()
    
    // 返回排名（1-based）
    const rank = this.scores.findIndex(record => 
      record.timestamp === newRecord.timestamp
    ) + 1
    
    return rank
  }

  // 获取最高分
  getHighScore() {
    return this.scores.length > 0 ? this.scores[0].score : 0
  }

  // 获取排行榜
  getLeaderboard() {
    return this.scores.map((record, index) => ({
      rank: index + 1,
      score: record.score,
      player: record.player,
      date: this.formatDate(record.date)
    }))
  }

  // 检查是否是新纪录
  isNewRecord(score) {
    return score > this.getHighScore()
  }

  // 检查是否进入排行榜
  isTopScore(score) {
    return this.scores.length < this.maxRecords || 
           score > this.scores[this.scores.length - 1].score
  }

  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // 清空排行榜
  clearLeaderboard() {
    this.scores = []
    this.saveScores()
  }

  // 获取统计信息
  getStats() {
    if (this.scores.length === 0) {
      return {
        totalGames: 0,
        averageScore: 0,
        highScore: 0,
        totalScore: 0
      }
    }

    const totalScore = this.scores.reduce((sum, record) => sum + record.score, 0)
    
    return {
      totalGames: this.scores.length,
      averageScore: Math.round(totalScore / this.scores.length),
      highScore: this.getHighScore(),
      totalScore: totalScore
    }
  }

  // 导出数据
  exportData() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      scores: this.scores
    }
  }

  // 导入数据
  importData(data) {
    try {
      if (data.version && data.scores && Array.isArray(data.scores)) {
        this.scores = data.scores
        this.saveScores()
        return true
      }
    } catch (error) {
      console.warn('Failed to import data:', error)
    }
    return false
  }
}

// 导出单例
const leaderboard = new Leaderboard()
export default leaderboard
