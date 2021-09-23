import { createRouter, createWebHistory } from 'vue-router'
import App from './PC/App.vue'
import H5 from './H5/App.vue'

const routes = [
    { path: '/h5', component: H5 },
    { path: '/:catchAll(.*)', component: App }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router