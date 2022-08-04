import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaStore from './store/index'
import { Message, Spin, Modal } from 'view-ui-plus'
import { iViewModule, isValidKey } from './iView-ui'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import { judeEnv, isEmpty } from '@/utils/util'
let app = createApp(App)
app.provide('isEmpty', isEmpty) // 使用这种注册方式方便在页面调用
app.provide('$Message', Message)
app.provide('$Spin', Spin)
app.provide('$Modal', Modal)
app.provide('environment', judeEnv())
app.use(piniaStore).use(router).mount('#app')
// 引入view
Object.keys(iViewModule).forEach((key) => {
  if (isValidKey(key, iViewModule)) {
    app.component(key, iViewModule[key])
  }
})

// app.config.globalProperties.isEmpty = isEmpty
// app.config.globalProperties.environment = judeEnv()
