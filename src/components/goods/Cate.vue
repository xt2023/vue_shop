<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--      卡片区域-->
    <el-card class="box-card">
      <el-row class="cate-margin">
        <el-co>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-co>
      </el-row>
      <!--  表格-->
      <tree-table :columns="columns" :data="cateList" :expand-type="false"
                  :selection-type="false" border index-text="#" show-index>
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted===false" class="el-icon-circle-check icon-size"
             style="color: lightgreen"></i>
          <i v-else class="el-icon-circle-close icon-size"
             style="color: coral"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1" size="mini" type="info">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2" size="mini" type="danger">三级</el-tag>
        </template>
        <!--  操作-->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
        </template>
      </tree-table>
      <!--分页区 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="100"
        :page-sizes="[3, 5, 9, 13]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!--    添加对话框区域-->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <el-form :model="addCateForm" :rules="addCateRules" ref="ruleFormRef" label-width="100px" >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectKeys"
            :options="ParetCateList"
            :props="cascaderProps"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      //商品种类请求的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //请求到的商品列表
      cateList: [],
      //总数据条数
      total: '',
      //为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        //表示当前列定义为自定义模板
        type: 'template',
        //表示自定义模板的名字
        template: 'isok'
      },
        {
          label: '排序',
          //表示当前列定义为自定义模板
          type: 'template',
          //表示自定义模板的名字
          template: 'order'
        }, {
          label: '操作',
          type: "template",
          template: 'opt'
        }],
      //添加对话框的显示与隐藏
      addCateDialogVisible:false,
      //添加表单的验证数据
      addCateForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      //添加表单的验证规则
      addCateRules :{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      //添加cate时获取的列表
      ParetCateList:{},
      //指定联机选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //选中父级分类中的id数组
      selectKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //请求商品列表函数
    async getCateList() {
      const {data: res} = await this.$http.get(`categories`, {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.cateList = res.data.result
      this.total = res.data.total

    },
    //监听到了pagesize
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCateList()
    },
    // 监听到了pagenum事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCateList()
    },
    //点击显示对话框
    showAddCate (){
      //点击是就调用获取函数
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    //获取商品列表
    async getParentCateList (){
      const {data:res}= await this.$http.get('categories',{params:{type:2}})
      if (res.meta.status!==200) return this.$message.error('获取失败')
      this.ParetCateList=res.data
    },


  }
}
</script>

<style lang="less" scoped>
.icon-size {
  font-size: 20px;
}

.cate-margin {
  margin-bottom: 15px;
}


</style>
