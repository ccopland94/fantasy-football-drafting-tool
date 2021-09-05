import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DraftTool from '@/views/DraftTool.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tool',
    name: 'Tool',
    component: DraftTool
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router
