<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName" ></el-table-column>
        <el-table-column label="路径" prop="path" ></el-table-column>
        <el-table-column label="权限等级" prop="level" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-if=" scope.row.level==='1'">二级</el-tag>
            <el-tag type="danger" v-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      //获取到的权限列表数据
      rightsList: []
    }
  },
  created() {
    this.getRightList()
  },

  methods: {
    //获取数据列表
    async getRightList() {
      const {data: res} = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      console.log(res)
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped>

</style>
