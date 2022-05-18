import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'

//导入axios
import axios from "axios";
Vue.prototype.$http=axios
axios.defaults.baseURL='http://175.27.228.178:3434/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
