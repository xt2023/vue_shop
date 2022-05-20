import Vue from 'vue'

import { Button,
        Form,
        Input,
        FormItem,
        Message,
        Container,
        Header,
        Aside,
        Main,
        Menu,
        Submenu,
        MenuItemGroup,
        MenuItem,
        Breadcrumb,
        BreadcrumbItem,
        Card,
        Select,
        Option,
        Row,
        Col,
        TableColumn,
        Table,
        Switch,
        Tooltip,
        Pagination,
        Dialog,
        MessageBox
        } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Select)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)


Vue.prototype.$message=Message
Vue.prototype.$confirm= MessageBox.confirm
