/**
 * 赛博朋克音效管理器
 * 使用 Web Audio API 生成程序化音效
 */
class AudioManager {
  constructor() {
    this.audioContext = null
    this.masterVolume = 0.3
    this.sounds = new Map()
    this.isEnabled = true
    this.init()
  }

  // 初始化音频上下文
  init() {
    try {
      // 兼容性处理
      const AudioContext = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioContext()
      
      // 创建主音量控制
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.masterVolume
      this.masterGain.connect(this.audioContext.destination)
      
      console.log('🔊 Audio Manager initialized')
    } catch (error) {
      console.warn('Audio not supported:', error)
      this.isEnabled = false
    }
  }

  // 恢复音频上下文（用户交互后）
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // 设置主音量
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume
    }
  }

  // 切换音效开关
  toggleSound() {
    this.isEnabled = !this.isEnabled
    if (this.masterGain) {
      this.masterGain.gain.value = this.isEnabled ? this.masterVolume : 0
    }
    return this.isEnabled
  }

  // 生成赛博朋克启动音效
  playStartupSound() {
    if (!this.isEnabled || !this.audioContext) return

    const duration = 2
    const now = this.audioContext.currentTime

    // 低频脉冲
    const bassOsc = this.audioContext.createOscillator()
    const bassGain = this.audioContext.createGain()
    
    bassOsc.type = 'sawtooth'
    bassOsc.frequency.setValueAtTime(40, now)
    bassOsc.frequency.exponentialRampToValueAtTime(80, now + duration)
    
    bassGain.gain.setValueAtTime(0, now)
    bassGain.gain.linearRampToValueAtTime(0.3, now + 0.1)
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    bassOsc.connect(bassGain)
    bassGain.connect(this.masterGain)
    
    bassOsc.start(now)
    bassOsc.stop(now + duration)

    // 高频扫描音
    const sweepOsc = this.audioContext.createOscillator()
    const sweepGain = this.audioContext.createGain()
    
    sweepOsc.type = 'sine'
    sweepOsc.frequency.setValueAtTime(2000, now + 0.5)
    sweepOsc.frequency.exponentialRampToValueAtTime(4000, now + 1.5)
    
    sweepGain.gain.setValueAtTime(0, now + 0.5)
    sweepGain.gain.linearRampToValueAtTime(0.2, now + 0.6)
    sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5)
    
    sweepOsc.connect(sweepGain)
    sweepGain.connect(this.masterGain)
    
    sweepOsc.start(now + 0.5)
    sweepOsc.stop(now + 1.5)
  }

  // 吃食物音效
  playEatSound() {
    if (!this.isEnabled || !this.audioContext) return

    const now = this.audioContext.currentTime
    const duration = 0.2

    // 主音调
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + duration)
    
    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    osc.connect(gain)
    gain.connect(this.masterGain)
    
    osc.start(now)
    osc.stop(now + duration)

    // 和声
    const harmonic = this.audioContext.createOscillator()
    const harmonicGain = this.audioContext.createGain()
    
    harmonic.type = 'sine'
    harmonic.frequency.setValueAtTime(1600, now)
    harmonic.frequency.exponentialRampToValueAtTime(2400, now + duration)
    
    harmonicGain.gain.setValueAtTime(0.2, now)
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    harmonic.connect(harmonicGain)
    harmonicGain.connect(this.masterGain)
    
    harmonic.start(now)
    harmonic.stop(now + duration)
  }

  // 游戏结束音效
  playGameOverSound() {
    if (!this.isEnabled || !this.audioContext) return

    const now = this.audioContext.currentTime
    const duration = 1.5

    // 下降音调
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + duration)
    
    gain.gain.setValueAtTime(0.5, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.5)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    osc.connect(gain)
    gain.connect(this.masterGain)
    
    osc.start(now)
    osc.stop(now + duration)

    // 故障噪音
    const noise = this.createNoise()
    const noiseGain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + duration)
    
    noiseGain.gain.setValueAtTime(0, now + 0.2)
    noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.3)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    
    noise.start(now + 0.2)
    noise.stop(now + duration)
  }

  // 移动音效（轻微）
  playMoveSound() {
    if (!this.isEnabled || !this.audioContext) return

    const now = this.audioContext.currentTime
    const duration = 0.05

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, now)
    
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    osc.connect(gain)
    gain.connect(this.masterGain)
    
    osc.start(now)
    osc.stop(now + duration)
  }

  // 按钮点击音效
  playClickSound() {
    if (!this.isEnabled || !this.audioContext) return

    const now = this.audioContext.currentTime
    const duration = 0.1

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(1000, now)
    osc.frequency.exponentialRampToValueAtTime(1500, now + duration)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    osc.connect(gain)
    gain.connect(this.masterGain)
    
    osc.start(now)
    osc.stop(now + duration)
  }

  // 创建白噪音
  createNoise() {
    const bufferSize = this.audioContext.sampleRate * 0.1
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer
    return noise
  }

  // 播放环境音效（可选）
  playAmbientSound() {
    if (!this.isEnabled || !this.audioContext) return

    // 低频环境音
    const ambientOsc = this.audioContext.createOscillator()
    const ambientGain = this.audioContext.createGain()
    
    ambientOsc.type = 'sine'
    ambientOsc.frequency.setValueAtTime(60, this.audioContext.currentTime)
    
    ambientGain.gain.setValueAtTime(0.05, this.audioContext.currentTime)
    
    ambientOsc.connect(ambientGain)
    ambientGain.connect(this.masterGain)
    
    ambientOsc.start()
    
    // 保存引用以便后续停止
    this.ambientOsc = ambientOsc
    this.ambientGain = ambientGain
  }

  // 停止环境音效
  stopAmbientSound() {
    if (this.ambientOsc) {
      this.ambientOsc.stop()
      this.ambientOsc = null
      this.ambientGain = null
    }
  }
}

// 导出单例
const audioManager = new AudioManager()
export default audioManager
