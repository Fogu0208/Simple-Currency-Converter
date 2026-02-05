import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// 创建应用实例
const app = createApp(App)
// 创建 Pinia 实例
const pinia = createPinia()

// 注册 Pinia
app.use(pinia)
// 挂载应用
app.mount('#app')
