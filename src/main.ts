import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import 'element-plus/dist/index.css'
import pinia from './stores'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(router)
app.mount('#app')
