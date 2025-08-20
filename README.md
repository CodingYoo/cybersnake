# CyberSnake 🐍

一个赛博朋克风格的贪吃蛇游戏，使用 Vue 3 + Vite 构建。

## 🎮 游戏特色

- 🌟 **赛博朋克视觉风格** - 霓虹色彩和未来科技感
- 🎵 **沉浸式音效** - Web Audio API 音效系统
- 📱 **多端适配** - 支持桌面和移动端
- 🎯 **多种控制方式** - 键盘、鼠标、触摸控制
- 💾 **本地排行榜** - 分数记录和统计
- ✨ **炫酷动画** - 粒子效果和动态背景

## 🚀 在线体验

访问 [GitHub Pages 部署地址](https://your-username.github.io/cybersnake/) 立即开始游戏！

## 🛠️ 本地开发

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 开始开发。

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📦 部署到 GitHub Pages

### 自动部署（推荐）

1. Fork 这个仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为源
4. 推送代码到 main 分支，GitHub Actions 会自动构建和部署

### 手动部署

```bash
# 安装 gh-pages
npm install -g gh-pages

# 构建并部署
npm run deploy
```

## 🎯 控制方式

### 桌面端
- **WASD** 或 **方向键** - 控制蛇的移动方向
- **空格键** - 暂停/恢复游戏
- **鼠标拖拽** - 在画布上拖拽改变方向

### 移动端
- **滑动屏幕** - 改变蛇的移动方向
- **虚拟方向键** - 屏幕右下角的方向控制

## 🔧 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 4.x
- **样式预处理**: SCSS
- **音效**: Web Audio API
- **存储**: localStorage
- **部署**: GitHub Pages + GitHub Actions

## 📁 项目结构

```
├── index.html              # 主入口 HTML
├── main.js                 # Vue 应用入口
├── App.vue                 # 主应用组件
├── router.js               # 路由系统
├── vite.config.js          # Vite 配置
├── components/             # 组件目录
│   └── SplashScreen.vue   # 启动动画组件
├── pages/                  # 页面目录
│   ├── index/             # 首页
│   ├── game/              # 游戏页
│   └── leaderboard/       # 排行榜页
├── utils/                  # 工具类
│   ├── audio-manager.js   # 音效管理
│   └── leaderboard.js     # 排行榜管理
└── .github/workflows/      # GitHub Actions
    └── deploy.yml         # 自动部署配置
```

## 🎨 自定义配置

### 修改仓库名称

如果您的仓库名称不是 `cybersnake`，请修改 `vite.config.js` 中的 base 路径：

```javascript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### 游戏参数调整

在游戏页面的控制台中可以使用以下命令调整游戏参数：

```javascript
// 调整食物旋转速度
setFoodAnimationSpeed(0.015)

// 调整食物消失动画时长
setFoodEatDuration(500)
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**享受游戏！🎮**
