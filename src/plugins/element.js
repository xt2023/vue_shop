import Vue from 'vue'
import { Button } from 'element-ui'
import {Form} from "element-ui";
import {Input} from "element-ui";
import {FormItem} from "element-ui";
//导入弹框提示组件
import {Message} from "element-ui";

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.prototype.$message=Message

