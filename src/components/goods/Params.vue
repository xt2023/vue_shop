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
      <el-alert
        :closable="false"
        show-icon
        title="注意：只允许为第三级分类设置相关参数"
        type="warning">
      </el-alert>
      <el-row class="cat-opt">
        <el-col :span="6">
          <!-- 级联选择器-->
          <el-cascader></el-cascader>
        </el-col>
      </el-row>

      <!--      tab叶标签区-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="only">
          <!-- 添加参数的按钮 -->
          <el-button :disabled="isBtnAbled" type="primary" @click="adddDialogVisible=true">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="many">
          <!-- 添加属性的按钮 -->
          <el-button :disabled="isBtnAbled" type="primary" @click="adddDialogVisible=true">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--    对话框区域-->
    <el-dialog
      @close="addDialogclosed"
      :title=" '添加'+ DialogCate"
      :visible.sync="adddDialogVisible"
      width="50%">
      <!-- 表单验证区域-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="DialogCate" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="adddDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  //获取到的商品分类列表
  data() {
    return {
      //获取到数据
      cateList: {},
      //级联选择器的绑定数据

      //被激活的标签名称
      activeName: 'only',
      //控制对话框的显示与隐藏
      adddDialogVisible: false,
      // 添加区域的表单对象
      addForm:{},
      //表单验证规则
      addFormRules:{
        attr_name:[
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('错误')
      this.cateList = res.data
    },
    //这是tab页签点击事件的处理函数
    async handleTabClick() {
      console.log(this.activeName)
      //根据所选 id和当前所处的面板获得对应的参数
      const {data: res} = await this.$http.get(`categories/${22}/attributes`, {params: this.activeName})

    },
    //监听对话框的关闭事件
    addDialogclosed (){
      this.$refs.addFormRef.resetFields()
    },
    //点击添加参数
    addParams (){
      this.adddDialogVisible=false
      //预校验
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return
          const {data:res}=await this.$http.post(`categories/:id/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if (res.meta.status!==201) return
      })
    }
  },
  computed: {
    //如果按钮需要被禁用，则返回true，否则返回false
    isBtnAbled() {
      if (!this.cateList) {
        return true
      } else {
        return false
      }
    },
    //控制显示什么类型的对话框
    DialogCate() {
      if (this.activeName === 'only') {
        return '动态参数'
      }
      return '静态参数'

    }
  }
}
</script>

<style lang="less" scoped>
.cat-opt {
  margin: 15px 0;
}
</style>
