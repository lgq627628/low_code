import { createApp } from 'vue'
import Home from './Home.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import { CustomText } from './components/Editor/custom/index.js'

const app = createApp(Home)
app.use(ElementPlus)
app.use(router)
app.component('CustomText', CustomText)
app.mount('#app')
