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
          <el-input v-model="queryInfo.query" clearable placeholder="请输入内容" @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <!--  按钮区域-->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStsteChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!--        操作部分-->
        <el-table-column class="table-column-last" label="操作">
          <template v-slot="scope">
            <!--            修改按钮-->
            <el-button
             @click="ShowEditVisible(scope.row.id)"
              icon="el-icon-edit"
              size="small"
              type="primary">
            </el-button>
            <!--            删除按钮-->
            <el-button icon="el-icon-delete" size="small" type="danger"
            @click="removeUserById(scope.row.id)"></el-button>
            <!--            分配按钮-->
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="small" type="warning" @click="showXGDiglog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      页码区域-->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 3, 5, 9]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!--   添加用户 对话框区域-->
    <el-dialog
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
      title="提示"
      width="50%">
      <!--      内容主体区域-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改用户对话框区域-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%">
      <el-form :model="editFrom" :rules="editFromRules" ref="editRulesRef" label-width="100px" >
        <el-form-item label="用户名" >
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" >
          <el-input v-model="editFrom.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
<!--    分配用户对话框-->
    <el-dialog
      title="提示"
      :visible.sync="editRolesVisible"
      @close="setDialogVisibleClosed"
      width="50%">
     <div>
       <p>当前用户: {{userInfo.username}}</p>
       <p>当前角色: {{userInfo.role_name}}</p>
       <p>
         <el-select v-model="rolesValue" placeholder="请选择">
           <el-option
             v-for="item in rolesList"
             :key="item.id"
             :label="item.roleName"
             :value="item.id">
           </el-option>
         </el-select>
       </p>
     </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    //验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        //合法邮箱
        return cb()
      } else {
        cb(new Error('请输入合法邮箱'))
      }
    }
    var checkMoblie = (rule, value, cb) => {
      const regMoblie = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (regMoblie.test(value)) {
        //合法邮箱
        return cb()
      } else {
        cb(new Error('请输入合法手机'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      userList: [],
      total: 0,
      //控制添加用户对话框
      addDialogVisible: false,
      //控制添修改用户对话框
      editDialogVisible:false,
      //添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户表单验证规则对象
      addFormRules: {
        //表单验证规则
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在 3到 15 个字符', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {min: 7, max: 11, message: '长度在 7到 11个字符', trigger: 'blur'},
          { validator: checkMoblie, trigger: 'blur' }
        ]
      },
      //查询到的用户信息
      editFrom:{},
      //修改用户表单验证规则对象
      editFromRules:{
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在 3到 15 个字符', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {min: 7, max: 11, message: '长度在 7到 11个字符', trigger: 'blur'},
          { validator: checkMoblie, trigger: 'blur' }
        ]
      },
      //控制分配用户对话框显示与隐藏
      editRolesVisible:false,
      //每一行的用户数据
      userInfo:{},
      //角色列表数据
      rolesList:[],
      //分配角色下拉菜单的双向绑定
      rolesValue:''
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
    handleSizeChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagesize = newPage
      this.getUsersList()
    },
    // 监听页数改变
    handleCurrentChange(new1) {
      console.log(new1)
      this.queryInfo.pagenum = new1
      this.getUsersList()
    },
    //修改用户状态
    async userStsteChange(newState) {
      const {data: res} = await this.$http.put(`users/${newState.id}
      /state/${newState.mg_state}`)
      if (res.meta.status !== 200) {
        newState.mg_state = !newState.mg_state
        return this.$message.error('设置失败')
      } else {
        this.$message.success('设置成功')
      }
    },
    //对话框去掉是清空输入内容
    addDialogClose (){
      this.$refs.addFormRef.resetFields()
    },
    //添加用户
    addUser (){
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return
        //预验证成功之后就可以开始发起请求了
        const {data:res}=await this.$http.post('users',this.addForm)
        console.log(res)
        if (res.meta.status!==201) {
          this.$message.error('添加失败')
        }else {
          this.$message.success('添加成功')
          //隐藏对话框
          this.addDialogVisible=false
          //更新数据
          this.getUsersList()
        }
      })
    },
    //修改用户对话框显示
    async ShowEditVisible (id){
      const {data:res}=await this.$http.get(`users/${id}`)
      if (res.meta.status!==200){
        this.$message.error('查询用户失败')
      }else {
        this.editFrom=res.data

      }
      this.editDialogVisible=true
    },
    //修改对话框关闭后的回调函数
    editDialogClosed (){
      this.$refs.editRulesRef.resetFields()
    },
    //修改对话框点击确定后的预验证
    editUserInfo (){
      this.$refs.editRulesRef.validate(async valid=>{
        if (!valid)return
        console.log(valid)
        //发起修改数据请求
        const {data:res}=await this.$http.put(`users/${this.editFrom.id}`,
          {email:this.editFrom.email,
            mobile:this.editFrom.mobile})
        if (res.meta.status!==200) return this.$message.error('修改用户参数失败')
        //关闭对话框
        this.editDialogVisible=false
        //更新数据
        await this.getUsersList()
        //提示修改成功
        this.$message.success('修改用户成功')

      })
    },
    //根据id删除用户
    removeUserById (id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} =await this.$http.delete(`users/${id}`)
        console.log(res)
        if (res.meta.status!==200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getUsersList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    //显示分配用户对话框函数
    async showXGDiglog (userInfo){
      this.userInfo=userInfo
      //在展示对话框之前获取所有角色列表
      const {data:res}=await this.$http.get('roles')
      if (res.meta.status!==200) return this.$message.error('获取失败')
     this.rolesList=res.data
      this.editRolesVisible=true
    },
    //点击按钮，分配角色
    async saveRoleInfo () {
      const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.rolesValue})
      console.log(res)
      if (res.meta.status!==200) return this.$message.error('错误')
      this.$message.success('成功')
      this.getUsersList()
      this.editRolesVisible=false
    },
    //监听分配对话框的关闭
    setDialogVisibleClosed(){
      this.rolesValue=''
      this.userInfo=''
    }
  }



}
</script>

<style lang="less" scoped>

</style>
