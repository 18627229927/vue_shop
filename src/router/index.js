import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'




Vue.use(VueRouter)

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 拦截器
axios.interceptors.request.use(confige => {
    confige.headers.Authorization = window.sessionStorage.getItem('token')
    // 最后必须return confige
    return confige
})
Vue.prototype.$http = axios

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/home', name: 'home', component: Home }
]

const router = new VueRouter({
    routes
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
    // to 代表讲要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，代表放行
    //        next () 放行      next ('/login')  强制跳转   
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})



export default router
