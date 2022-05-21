import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import User from "@/components/users/User";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";

Vue.use(VueRouter)

const routes = [
  //  路由重定向
  {path: '/',redirect:'/login'},
  {path:'/login',component:Login},
  {path: '/home',component: Home ,children:[
      {path: '/home',redirect:'/welcome'},
      {path:'/welcome',component:Welcome},
      {path: '/users',component: User},
      {path: '/rights',component: Rights},
      {path: '/roles',component: Roles}
    ]}
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转过来
  //next是一个函数，表示放行：next（）放行，next('login')表示强制转换
  if (to.path==='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if (tokenStr) return next()
  next('/login')
})

export default router
