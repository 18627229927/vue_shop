import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
