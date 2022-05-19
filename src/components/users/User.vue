<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>

    <!--      卡片区域-->
    <el-card class="box-card">
      <!--      搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <!--  按钮区域-->
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!--  表格区域    -->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="用户名" prop="username" width="180"></el-table-column>
        <el-table-column label="手机号码" prop="mobile" width="180"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              @change="userStsteChange(scope.row)"
              v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <!--        操作部分-->
        <el-table-column class="table-column-last" label="操作">
          <template slot-scope="scope">
            <!--            修改按钮-->
            <el-button icon="el-icon-edit" size="small" type="primary"></el-button>
            <!--            删除按钮-->
            <el-button icon="el-icon-delete" size="small" type="danger"></el-button>
            <!--            分配按钮-->
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="small" type="warning"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      页码区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    //获取用户列表数据
    async getUsersList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听pagesize改变事件
    handleSizeChange (newPage){
      console.log(newPage)
      this.queryInfo.pagesize=newPage
      this.getUsersList()
    },
    // 监听页数改变
    handleCurrentChange (new1){
      console.log(new1)
      this.queryInfo.pagenum=new1
      this.getUsersList()
    },
    //修改用户状态
    async userStsteChange (newState){
      const {data:res}=await this.$http.put(`users/${newState.id}
      /state/${newState.mg_state}`)
      if (res.meta.status!==200){
        newState.mg_state=!newState.mg_state
        return this.$message.error('设置失败')
      }else {
        this.$message.success('设置成功')
      }

    }
  }
}
</script>

<style lang="less" scoped>

</style>
