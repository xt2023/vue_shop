<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- tab列表区域-->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单介个" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status==='1'" type="success">已付款</el-tag>
            <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | dataformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="addressShow"></el-button>
            <el-button icon="el-icon-location" size="mini" type="success" @click="progressShow"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 5, 9, 13]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!--    修改地址对话框-->
    <el-dialog
      @close="addressDialogClosed"
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="详细地址">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
           ></el-cascader>
        </el-form-item>
        <el-form-item label="省市区/县" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
<!--    物流进度的对话框-->
    <el-dialog
      title="物流进度（接口错误，无法演示进度）"
      :visible.sync="progressVisible"
      width="50%">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
//引入各地区数据文件
import citydata from "@/components/order/citydata";
export default {
  name: "order",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
    // 控制修改对话框的显示与隐藏
      addressVisible:false,
      //表单的验证对象
      addressForm:{
        address1:[],
        address2:''
      },
      //验证规则
      addressFormRules:{
        address1:[
          { required: true, message: '请选择地区', trigger: 'blur' },
        ],
        address2:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ]
      },
      cityData:citydata,
      //物流进度对话框的显示与隐藏
      progressVisible:false,
      //timeLine数据
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取商品订单列表函数
    async getOrderList() {
      const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取订单成功')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    //分页区域的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    //点击打开对话框
    addressShow (){
      this.addressVisible=true
    },
    //关闭对话框之后清空表单
    addressDialogClosed (){
      this.$refs.addressFormRef.resetFields()
    },
    //点击打开物流进度对话框
    async progressShow (){
      //接口有问题
      // const {data:res}=await this.$http.get('/kuaidi/1106975712662')
      // console.log(res)
      this.progressVisible=true
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
