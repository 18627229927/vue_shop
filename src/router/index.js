import Vue from 'vue'
import VueRouter from 'vue-router'


import Login from '../components/Login.vue'
// const Login = () => import( /* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
import Home from '../components/Home.vue'
// const Home = () => import( /* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
import Welcome from '../components/Welcome.vue'
// const Welcome = () => import( /* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')

import Users from '../components/User/Users.vue'
// const Users = () => import( /* webpackChunkName:"Users_rights_roles" */ '../components/Users.vue')
import Rights from '../components/Power/Rights.vue'
// const Rights = () => import( /* webpackChunkName:"Users_rights_roles" */ '../components/Rights.vue')
import Roles from '../components/Power/Roles.vue'
// const Roles = () => import( /* webpackChunkName:"Users_rights_roles" */ '../components/Roles.vue')

import Cate from '../components/Goods/Cate.vue'
// const Cate = () => import( /* webpackChunkName:"Cate_params" */ '../components/Cate.vue')
import Params from '../components/Goods/Params.vue'
// const Params = () => import( /* webpackChunkName:"Cate_params" */ '../components/Params.vue')

import GoodsList from '../components/Goods/List.vue'
// const GoodsList = () => import( /* webpackChunkName:"GoodsList_add" */ '../components/GoodsList.vue')
import Add from '../components/Goods/Add.vue'
// const Add = () => import( /* webpackChunkName:"GoodsList_add" */ '../components/Add.vue')

import Order from '../components/Order/Order.vue'
// const Order = () => import( /* webpackChunkName:"Order_report" */ '../components/Order.vue')
import Report from '../components/Report/Report.vue'
// const Report = () => import( /* webpackChunkName:"Order_report" */ '../components/Report.vue')

Vue.use(VueRouter)

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
        }, {
            path: '/orders',
            name: 'order',
            component: Order,
        }, {
            path: '/reports',
            name: 'report',
            component: Report,
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