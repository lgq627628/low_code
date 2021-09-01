import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import { CustomText } from './components/Editor/custom/index.js'
const app = createApp(App)
app.use(ElementPlus)
app.component('CustomText', CustomText)
app.mount('#app')
