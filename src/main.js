import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//导入全局样式表
import './assets/css/global.css'
import './assets/download/font_3412011_zgzrn7ewy3/iconfont.css'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导如富文本编辑器使用的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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
//将富文本编辑器注册成为全局可用的组件
Vue.use(VueQuillEditor)
//定义全局过滤器
Vue.filter('dataformat',function (originVal){
  const dt=new Date(originVal)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
