import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login/Login'
const Home = () => import('../views/Home/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/User/Users')
const Power = () => import('../components/Power/Power')
const Roles = () => import('../components/Roles/Roles')
const Cate = () => import('../components/Goods/Cate')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: "/home",
    name: 'Home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: "welcome",
        name: 'Welcome',
        component: Welcome
      },
      {
        path: "users",
        name: 'Users',
        component: Users
      },
      {
        path: "rights",
        name: 'Power',
        component: Power
      },
      {
        path: "roles",
        name: 'Roles',
        component: Roles
      },
      {
        path: "categories",
        name: 'Cate',
        component: Cate
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  // 访问的路径是login 不做处理
  if (to.path == '/login') return next()
  // 判断有无token
  const token = window.sessionStorage.getItem('token')
  // 没有跳登录
  if (!token) {
    return next('/login')
  }
  // 有就放行
  next()
})

export default router
