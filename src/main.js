import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//导入全局样式表
import './assets/css/global.css'
import './assets/download/font_3412011_zgzrn7ewy3/iconfont.css'

//导入axios
import axios from "axios";
Vue.prototype.$http=axios
axios.defaults.baseURL='http://175.27.228.178:3434/api/private/v1/'
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证Authorization
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
