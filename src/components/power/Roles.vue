<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      添加角色按钮区域-->
      <el-row>
        <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
      </el-row>

      <!--      添加角色对话框区域-->
      <el-dialog
        :visible.sync="addRolesDialogVisible"
        title="提示"
        width="50%"
        @close="addRolesClose">
        <!--      内容主体区域-->
        <el-form ref="addRolesRef" :model="addRolesForm" :rules="addFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
      </el-dialog>

      <!--      角色列表区域-->
      <el-table :data="rolesList" border stripe style="width: 100%">
        <!--        展开项-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item,i) in scope.row.children" :key="item.id" class="el-row-expand vcenter">
              <!--   渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeTagById(scope.row,item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限-->
              <el-col :span="19">
                <el-row v-for="item1 in item.children" :key="item1.id" class="el-row-expand1 vcenter">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeTagById(scope.row,item1.id)">{{ item1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item2 in item1.children" :key="item2.id"
                            closable type="warning" @close="removeTagById(scope.row,item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column class="<el-table-column-btn-last" label="操作">
          <template v-slot="scope">
            <el-row>
              <!-- 角色编辑区域 -->
              <el-button icon="el-icon-edit" size="small" type="primary" @click="showEDitDialog(scope.row.id)">编辑
              </el-button>
              <!--对话框区域       -->
              <el-dialog
                :visible.sync="editDialogVisible"
                title="提示"
                width="30%">
                <el-form ref="editRolesRef" :model="editRoles" label-width="80px">
                  <el-form-item label="角色名称">
                    <el-input v-model="editRoles.roleName"></el-input>
                  </el-form-item>
                  <el-form-item label="角色描述">
                    <el-input v-model="editRoles.roleDesc"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesPut">确 定</el-button>
                 </span>
              </el-dialog>

              <el-button icon="el-icon-delete" size="small" type="warning">删除</el-button>
              <el-button icon="el-icon-setting" size="small" type="danger " @click="showSetdialog(scope.row)">分配权限</el-button>
              <!--    分配权限对话框          -->
              <el-dialog
                title="提示"
                :visible.sync="setDialogVisible"
                @close="dialogClosed"
                width="50%">
                <el-tree ref="terrRef" :data="allRightsList" :props="treeProps" show-checkbox
                         default-expand-all node-key="id" :default-checked-keys="defKey"></el-tree>
                <span slot="footer" class="dialog-footer">
                <el-button @click="setDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
              </el-dialog>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //获取到的角色列表
      rolesList: [],
      addRolesDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          {required: true, message: '请输入名称', trigger: 'blur'},
        ],
        roleDesc: [
          {required: true, message: '请输入', trigger: 'blur'},
        ]
      },
      //编辑对话框的显示状态
      editDialogVisible: false,
      //编辑对话框表单数据
      editRoles: {},
      //控制分配权限对话框的显示与隐藏
      setDialogVisible:false,
      //获取到的全部权限列表
      allRightsList:{},
      //树形控件属性的绑定对象
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      //默认选中的节点的ID数
      defKey:[],
      //当前即将分配权限的id
      rolesID:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesList = res.data
    },
    //添加角色
    async addRoles() {
      const {data: res} = await this.$http.post('roles', this.addRolesForm)
      if (res.meta.status !== 201) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      this.addRolesDialogVisible = false
      this.getRolesList()
    },
    //修改角色对话框的显示
    async showEDitDialog(id) {
      this.editDialogVisible = true
      const {data: res} = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('失败')
      this.editRoles = res.data

    },
    //修改角色信息
    async editRolesPut() {
      const {data: res} = await this.$http.put('roles/' + this.editRoles.roleId, {
        roleName: this.editRoles.roleName,
        roleDesc: this.editRoles.roleDesc
      })
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.getRolesList()
    },
    //清空表单内容
    addRolesClose() {
      this.$refs.addRolesRef.resetFields()
    },
    //根据id移除对应的权限
    removeTagById(roles, rightsID) {
      //弹框提示用户是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await this.$http.delete(`roles/${roles.id}/rights/${rightsID}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        //这是防止整个列表的重新绘制
        roles.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    //点击展示分配权限对话框函数
    async showSetdialog(roles) {
      this.rolesID=roles.id
      const {data:res} = await this.$http.get('rights/tree')
      if (res.meta.status!==200) return this.$message.error('失败')
      this.allRightsList=res.data
      this.getLeafKey(roles,this.defKey)
      this.setDialogVisible=true
    },
    //通过递归的方式获取以下三级权限的id，并保存到defkey数组中
    getLeafKey (node,arr){
      if (!node.children) return arr.push(node.id)
      node.children.forEach((item=>{
        this.getLeafKey(item,arr)
      }))
    },
    //关闭分配权限对话框的时候清空defKey
    dialogClosed (){
      this.defKey=[]
    },
    //点击为角色分配权限
    async allotRights (){
      const keys=[
        ...this.$refs.terrRef.getCheckedKeys(),
        ...this.$refs.terrRef.getHalfCheckedKeys()
      ]
      const rids=keys.join(',')
       const {data:res}=await this.$http.post(`roles/${this.rolesID}/rights`,{
        rids:rids
      })
      if (res.meta.status!==200) return this.$message.error('失败')
      this.$message.success('成功')
      this.getRolesList()
      this.setDialogVisible=false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-top: 7px;
  margin-left: 7px;
}

.el-row-expand {
  border-top: 1px solid #eeeeee;
}

.el-row-expand:nth-last-child(1) {
  border-bottom: 1px solid #eeeeee;
}

.el-row-expand1 {
  border-top: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}

</style>
