/**
 * 基础场景类
 * 所有场景的基类，定义场景的基本接口
 */
export default class BaseScene {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.isInitialized = false;
  }

  // 初始化场景
  init() {
    this.isInitialized = true;
    console.log(`${this.constructor.name} initialized`);
  }

  // 更新场景逻辑
  update(deltaTime) {
    // 子类实现具体逻辑
  }

  // 渲染场景
  render() {
    // 子类实现具体渲染
  }

  // 触摸开始事件
  onTouchStart(e) {
    // 子类实现具体处理
  }

  // 触摸移动事件
  onTouchMove(e) {
    // 子类实现具体处理
  }

  // 触摸结束事件
  onTouchEnd(e) {
    // 子类实现具体处理
  }

  // 销毁场景
  destroy() {
    this.isInitialized = false;
    console.log(`${this.constructor.name} destroyed`);
  }

  // 清空画布
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 绘制背景色
  drawBackground(color = '#001122') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 绘制文本（居中）
  drawText(text, x, y, fontSize = 32, color = '#0affff', font = 'Arial') {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px ${font}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  // 绘制矩形
  drawRect(x, y, width, height, color = '#0affff', filled = true) {
    this.ctx.save();
    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x, y, width, height);
    }
    this.ctx.restore();
  }

  // 绘制圆形
  drawCircle(x, y, radius, color = '#0affff', filled = true) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
}
