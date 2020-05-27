import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Cate from '../components/Goods/Cate.vue'
import Params from '../components/Goods/Params.vue'
import GoodsList from '../components/Goods/List.vue'
import Add from '../components/Goods/Add.vue'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'




Vue.use(VueRouter)

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// http://rambuild.cn:8888/api/private/v1


// 拦截器
axios.interceptors.request.use(confige => {
    confige.headers.Authorization = window.sessionStorage.getItem('token')
    // 最后必须return confige
    return confige
})
Vue.prototype.$http = axios

// 全局时间过滤器
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal*1000)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.component('tree-table', treeTable)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        redirect: '/welcome',
        component: Home,
        children: [{
            path: '/welcome',
            name: 'welcome',
            component: Welcome,
        }, {
            path: '/users',
            name: 'users',
            component: Users,
        }, {
            path: '/rights',
            name: 'rights',
            component: Rights,
        }, {
            path: '/roles',
            name: 'roles',
            component: Roles,
        }, {
            path: '/categories',
            name: 'cate',
            component: Cate,
        }, {
            path: '/params',
            name: 'params',
            component: Params,
        }, {
            path: '/goods',
            name: 'list',
            component: GoodsList,
        }, {
            path: '/goods/add',
            name: 'add',
            component: Add,
        }]
    }
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