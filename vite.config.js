import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  // GitHub Pages 部署配置
  base: process.env.NODE_ENV === 'production' ? '/cybersnake/' : '/',

  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },

  // 预览服务器配置
  preview: {
    port: 3000,
    host: true,
    open: true
  },

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@components': resolve(__dirname, 'components'),
      '@pages': resolve(__dirname, 'pages'),
      '@utils': resolve(__dirname, 'utils')
    }
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['vue'],
          utils: ['./utils/audio-manager.js', './utils/leaderboard.js']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          $cyber-primary: #0affff;
          $cyber-secondary: #ff00ff;
          $cyber-background: #001122;
          $cyber-text: #ffffff;
        `
      }
    }
  }
})
