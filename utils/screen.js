/**
 * 屏幕适配工具类
 * 实现逻辑分辨率 750rpx，物理像素自适应
 */
class Screen {
  constructor() {
    this.init();
  }

  init() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    
    // 设备屏幕尺寸
    this.deviceWidth = systemInfo.screenWidth;
    this.deviceHeight = systemInfo.screenHeight;
    this.pixelRatio = systemInfo.pixelRatio;
    
    // 逻辑分辨率（设计稿基准）
    this.designWidth = 750;
    this.designHeight = 1334;
    
    // 计算缩放比例
    this.scaleX = this.deviceWidth / this.designWidth;
    this.scaleY = this.deviceHeight / this.designHeight;
    this.scale = Math.min(this.scaleX, this.scaleY);
    
    // 实际游戏区域尺寸
    this.gameWidth = this.designWidth * this.scale;
    this.gameHeight = this.designHeight * this.scale;
    
    // 居中偏移
    this.offsetX = (this.deviceWidth - this.gameWidth) / 2;
    this.offsetY = (this.deviceHeight - this.gameHeight) / 2;
    
    console.log('Screen initialized:', {
      device: `${this.deviceWidth}x${this.deviceHeight}`,
      game: `${this.gameWidth}x${this.gameHeight}`,
      scale: this.scale,
      offset: `${this.offsetX},${this.offsetY}`
    });
  }

  // 将设计稿坐标转换为实际屏幕坐标
  rpx2px(rpx) {
    return rpx * this.scale;
  }

  // 将设计稿X坐标转换为实际屏幕X坐标
  x(designX) {
    return this.offsetX + designX * this.scale;
  }

  // 将设计稿Y坐标转换为实际屏幕Y坐标
  y(designY) {
    return this.offsetY + designY * this.scale;
  }

  // 获取游戏区域的实际尺寸
  getGameSize() {
    return {
      width: this.gameWidth,
      height: this.gameHeight
    };
  }

  // 获取设计稿尺寸
  getDesignSize() {
    return {
      width: this.designWidth,
      height: this.designHeight
    };
  }
}

// 导出单例
const screen = new Screen();
export default screen;
