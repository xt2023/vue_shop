<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card>
      <!--警示区域-->
      <el-alert :closable="false" center show-icon title="添加商品信息" type="info"></el-alert>
      <!--进度条区域-->
      <el-steps :active="activeIndex-0" :space="200" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form ref="ruleForm" :model="addForm" :rules="addFormRules" label-position="top" label-width="100px">
        <el-tabs v-model="activeIndex" :before-leave="beforeTabLeave"
                 :tab-position="'left'" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--            渲染表单的item项-->

          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2"></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              action="http://175.27.228.178:3434/api/private/v1/upload"
              class="upload-demo"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!--            添加按钮-->
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--  图片预览对话框区域-->
    <el-dialog
      :visible.sync="previewVisible"
      title="图片预览"
      width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "Add",
  data() {
    return {
      //默认激活的索引
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        //图片数组
        pics: [],
        //介绍
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ]
      },
      //获取商品分类列表的数据
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表
      manyTabData: [],
      // 动态参数列表
      onlyTabData: [],
      //图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      //控制图片预览的对话框的显示
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品列表
    async getCateList() {
      const {data: res} = await this.$http.get(`categories`)
      this.cateList = res.data
    },
    //级联选择器变化就会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length < 1) {
        this.$message.error(`请选择商品类型`)
        return false
      }
    },
    //tab被点击时触发这个函数
    async tabClicked() {
      if (this.activeIndex === '1') {
        const {data: res} = await this.$http.get(`categories/${this.addForm.goods_cat}/attributes`, {
          params: {sel: 'many'}
        })
        if (res.meta.status !== 200) return this.$message.error('错误')
        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        const {data: res} = await this.$http.get(`categories/${this.addForm.goods_cat}/attributes`, {
          params: {sel: 'only'}
        })
        if (res.meta.status !== 200) return this.$message.error('错误')
        this.onlyTabData = res.data
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //处理移除图片的操作
    handleRemove(file) {
      //获取将要删除的图片的临时路径
      const filePath = file.response.data.tem_path
      //从pics数组中找到对应图片的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      //调用splice方法把图片信息从pics数组移除
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片的上传成功事件
    handleSuccess(response) {
      //拼接得到一个图片信息对象
      const picInfo = {pic: response.data.tmp_path}
      //将图片信息对象 push到pics数组
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    add (){
      //表单预验证
      this.$refs.ruleForm.validate( async valid=>{
        if (!valid) return this.$message.error('请填写必要的表单项')
        const form=_.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        //动态处理
        this.manyTabData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        //静态处理
        this.onlyTabData.forEach( item=>{
          const newInfo={attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs=this.addForm.attrs
        console.log(form)
        const {data:res}=await this.$http.post('goods',form)
        this.$router.push('/goods')

      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}

.el-steps {
  margin-top: 15px;
}

.el-tabs {
  margin-top: 15px;
}

.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
