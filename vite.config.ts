import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default (mode) => defineConfig({
  plugins: [
    vue(),
    AutoImport ({
      imports: ["vue", "vue-router"], // 自动导入vue和vue-router相关函数
      dts: "src/auto-import.d.ts" // 生成 `auto-import.d.ts` 全局声明
    })
  ],
  base:mode === 'production' ? './' : '/patrioticEducation/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
    },
  },
  server: {
    port: 8081, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    host: '0.0.0.0', // IP配置，支持从IP启动
    // 设置代理，根据我们项目实际情况配置
    proxy: {
      '/api': {
        target: 'http://springblade_saber.ydy.icu/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api/', '/')
      }
    }
  }
})
