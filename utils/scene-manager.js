/**
 * 场景管理器
 * 管理游戏的不同场景切换：启动页 → 主菜单 → 游戏 → 结算
 */
class SceneManager {
  constructor() {
    this.currentScene = null;
    this.scenes = new Map();
    this.canvas = null;
    this.ctx = null;
  }

  // 初始化场景管理器
  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    console.log('SceneManager initialized');
  }

  // 注册场景
  registerScene(name, sceneClass) {
    this.scenes.set(name, sceneClass);
    console.log(`Scene registered: ${name}`);
  }

  // 切换到指定场景
  switchTo(sceneName, ...args) {
    console.log(`Switching to scene: ${sceneName}`);
    
    // 销毁当前场景
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }

    // 获取场景类
    const SceneClass = this.scenes.get(sceneName);
    if (!SceneClass) {
      console.error(`Scene not found: ${sceneName}`);
      return;
    }

    // 创建新场景实例
    this.currentScene = new SceneClass(this.canvas, this.ctx, ...args);
    
    // 初始化场景
    if (this.currentScene.init) {
      this.currentScene.init();
    }

    return this.currentScene;
  }

  // 更新当前场景
  update(deltaTime) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }
  }

  // 渲染当前场景
  render() {
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render();
    }
  }

  // 处理触摸事件
  onTouchStart(e) {
    if (this.currentScene && this.currentScene.onTouchStart) {
      this.currentScene.onTouchStart(e);
    }
  }

  onTouchMove(e) {
    if (this.currentScene && this.currentScene.onTouchMove) {
      this.currentScene.onTouchMove(e);
    }
  }

  onTouchEnd(e) {
    if (this.currentScene && this.currentScene.onTouchEnd) {
      this.currentScene.onTouchEnd(e);
    }
  }

  // 获取当前场景
  getCurrentScene() {
    return this.currentScene;
  }

  // 获取当前场景名称
  getCurrentSceneName() {
    for (let [name, SceneClass] of this.scenes) {
      if (this.currentScene instanceof SceneClass) {
        return name;
      }
    }
    return null;
  }
}

// 导出单例
const sceneManager = new SceneManager();
export default sceneManager;
