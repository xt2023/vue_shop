<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card>
      <!--      搜索区域-->
      <el-row>
        <el-col :span="8">
          <el-input class="input-with-select" placeholder="请输入内容"
          v-model="queryInfo.query" clearable @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table
        :data="goodsList"
        border
        stripe
        style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px">
          <template v-slot="scope">
            {{ scope.row.add_time | dataformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 9, 13]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      //请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //请求到的数据
      goodsList: [],
      //总条数
      total: 0
    }
  },
  created() {
    this.getGoodList()
  },

  methods: {
    //获取商品列表
    async getGoodList() {
      const {data: res} = await this.$http.get(`goods`, {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //分页size发生改变后的函数
    handleSizeChange (newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodList()
    },
    //分页num发生改变后的函数
    handleCurrentChange (newNum){
      this.queryInfo.pagenum=newNum
      this.getGoodList()
    },
    //根据id删除对应的商品
    removeById(id){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        const {data:res}=await this.$http.delete(`goods/${id}`)
        if (res.meta.status!==200) return
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getGoodList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //点击添加商品
    addGoods (){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
