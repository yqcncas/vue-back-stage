import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
Vue.use(ElementUI);
Vue.config.productionTip = false

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间
import 'dayjs/locale/zh-cn' // 引入中文
dayjs.locale('zh-cn') // 引入中文
dayjs.extend(relativeTime)
Vue.prototype.$dayjs = dayjs // 放入原型中

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import axios from 'axios'
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"

//请求拦截器
axios.interceptors.request.use(config =>{
    NProgress.start();
    if (window.sessionStorage.getItem('token')) {
        config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config
})
//响应拦截器
axios.interceptors.response.use(response =>{
    NProgress.done();
    return response
},error =>{
    const { status } = error.response;
    if (status == 401) {
        alert('登录信息过期, 请重新登录')
        window.sessionStorage.removeItem('token')
        router.push('/login')
    }
})


Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
