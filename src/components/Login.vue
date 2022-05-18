<template>
  <div class="container-login">
    <div class="login_box">
<!--      图片logo区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
<!--      表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_from">
<!--        账号密码区域-->

<!--        账号区域-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
<!--        密码区域-->
        <el-form-item prop="password" >
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-s-goods"></el-input>
        </el-form-item>

<!--       按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" >登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      //登录数据的绑定对象
      loginForm:{
        username:'admin',
        password:'123456'
      },
      //这是验证表单的规则对象
      loginFormRules:{
        //验证用户名的
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        //验证密码的
        password:[
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods :{
    //重置表单的方法
    loginFormReset (){
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    //表单的登录验证
    login (){
      this.$refs.loginFormRef.validate( async (valid)=>{
        if (!valid) return
       const {data:result}= await this.$http.post('login',this.loginForm)
        console.log(result)
        if (result.meta.status!==200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //将登录成功之后的token保存到客户端sessionStorage中
        //项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //token只应在当前网站打开期间生效，所以讲token保存在sessionStorage中
        window.sessionStorage.setItem("token",result.data.token)
        //通过编程式导航跳转到后台主页
        this.$router.push("/home")
      })
    }
  }
}
</script>

<style scoped lang="less">
  .container-login {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eeeeee;
      box-shadow: 0 0 10px #eeeeee;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
      }
    }
  }

  .btns {
    display: flex;
    justify-content: right;
  }

  .login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
