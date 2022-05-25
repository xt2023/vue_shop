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
        MessageBox,
        Tag,
        Tree,
        Cascader,
        Alert,
        Tabs,
        TabPane,
        Step,
        Steps,
        Upload,
        Timeline,
        TimelineItem
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


Vue.prototype.$message=Message
Vue.prototype.$confirm= MessageBox.confirm
