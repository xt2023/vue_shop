<template>

  <el-container class="home-container">
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/1.webp">
        <span>原批电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    侧边栏区域-->
    <el-container>
      <el-aside :width="isCllapse? '64px' :'200px'">
          <div class="toggleCollapse" @click="toggleCollapse">|||</div>
        <el-menu
          :router="true"
          :collapse="isCllapse"
          :collapse-transition="false"
          :default-active="activePath"
          unique-opened
          active-text-color="#ffd04b"
          background-color="#373d41"
          text-color="#fff" >

          <!--  一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveActivePath('/'+subItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      主体区域-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "Home",
  data (){
    return {
      //左侧菜单数据
      menulist:[],
      iconsObj:{
        '125':'iconfont icon-bussiness-man',
        '103':'iconfont icon-similar-product',
        '101':'iconfont icon-bags',
        '102':'iconfont icon-calculator',
        '145':'iconfont icon-feeds'
      },
      isCllapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    //退出登录函数
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    //获取所有菜单
    async getMenuList () {
     const {data:res}=await this.$http.get('menus')
      if (res.meta.status!==200) return this.$message.error('获取数据失败')
      this.menulist=res.data
    },
    //侧边栏的折叠与展开
    toggleCollapse (){
      this.isCllapse=!this.isCllapse
    },
    //保存激活路径
    saveActivePath (activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;

  div {
    display: flex;
    align-items: center;

    img {
      width: 57px;
      height: 57px;
    }

    span {
      color: #ffffff;
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 15px;
}
.toggleCollapse {
  background-color: #4A5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #ffffff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
