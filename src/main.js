import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false
import axios from 'axios'
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"

//请求拦截器
axios.interceptors.request.use(config =>{
    if (window.sessionStorage.getItem('token')) {
        config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config
})
//响应拦截器
axios.interceptors.response.use(response =>{
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
