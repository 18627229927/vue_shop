import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

// 全局样式
import './assets/css/global.css'
// 字体图标
import './assets/fonts/iconfont.css'
// 树形表格
import treeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

// 导入 NProgress 进度条包对应的js和css
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 评论区大佬的接口地址
// http://timemeetyou.com:8889/api/private/v1/
// http://rambuild.cn:8888/api/private/v1/


// 老师的接口地址
// https://www.liulongbin.top:8888/api/private/v1/


// 拦截器   在request拦截器中展示进度条  NProgress.start()
axios.interceptors.request.use(confige => {
    NProgress.start()
    confige.headers.Authorization = window.sessionStorage.getItem('token')
    // 最后必须return confige
    return confige
})
// 在response拦截器中隐藏进度条  NProgress.done()
axios.interceptors.response.use(confige => {
    NProgress.done()
    // 最后必须return confige
    return confige
})

Vue.prototype.$http = axios

// 全局时间过滤器
Vue.filter('dataFormat', function (originVal) {
    const dt = new Date(originVal * 1000)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.component('tree-table', treeTable)


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')