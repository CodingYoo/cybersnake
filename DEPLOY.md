# 🚀 CyberSnake 部署指南

## 📦 GitHub Pages 部署

### 方法一：自动部署（推荐）

1. **Fork 仓库**
   - 点击右上角的 "Fork" 按钮
   - 将仓库 Fork 到您的 GitHub 账户

2. **启用 GitHub Pages**
   - 进入您 Fork 的仓库
   - 点击 "Settings" 选项卡
   - 在左侧菜单中找到 "Pages"
   - 在 "Source" 下选择 "GitHub Actions"

3. **修改仓库名称（可选）**
   - 如果您的仓库名称不是 `cybersnake`
   - 修改 `vite.config.js` 中的 base 路径：
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

4. **推送代码触发部署**
   - 推送任何代码到 main 分支
   - GitHub Actions 会自动构建和部署
   - 部署完成后访问：`https://CodingYoo.github.io/cybersnake/`

### 方法二：手动部署

1. **安装依赖**
   ```bash
   npm install
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署到 GitHub Pages**
   ```bash
   npm run deploy
   ```

## 🔧 本地预览构建结果

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 📁 构建输出

构建完成后，`dist/` 目录包含：

```
dist/
├── index.html              # 主页面
├── assets/
│   ├── css/                # 样式文件
│   │   ├── index-*.css
│   │   ├── game-*.css
│   │   └── leaderboard-*.css
│   └── js/                 # JavaScript 文件
│       ├── main-*.js       # 主入口
│       ├── vendor-*.js     # Vue 框架
│       ├── utils-*.js      # 工具类
│       ├── index-*.js      # 首页
│       ├── game-*.js       # 游戏页
│       └── leaderboard-*.js # 排行榜页
```

## 🌐 其他部署平台

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 设置构建命令：`npm run build`
3. 设置输出目录：`dist`
4. 部署完成

### Netlify 部署

1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令：`npm run build`
3. 设置发布目录：`dist`
4. 部署完成

### 自定义服务器部署

1. 构建项目：`npm run build`
2. 将 `dist/` 目录内容上传到服务器
3. 配置 Web 服务器指向 `index.html`

## ⚙️ 环境变量配置

如需自定义配置，可以创建 `.env.production` 文件：

```env
# 自定义基础路径
VITE_BASE_URL=/your-custom-path/

# 其他配置...
```

## 🔍 故障排除

### 构建失败

1. **检查 Node.js 版本**
   ```bash
   node --version  # 需要 16+
   ```

2. **清理依赖重新安装**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **检查构建日志**
   ```bash
   npm run build --verbose
   ```

### 部署后页面空白

1. **检查 base 路径配置**
   - 确保 `vite.config.js` 中的 base 路径正确

2. **检查浏览器控制台**
   - 查看是否有资源加载错误

3. **检查 GitHub Pages 设置**
   - 确保选择了正确的部署源

### 路由问题

如果使用自定义服务器，需要配置 SPA 回退：

**Nginx 配置示例：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache 配置示例：**
```apache
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]
```

## 📞 获取帮助

如果遇到问题：

1. 查看 [GitHub Issues](https://github.com/your-username/cybersnake/issues)
2. 创建新的 Issue 描述问题
3. 提供详细的错误信息和环境信息

---

**祝您部署顺利！🎮**
