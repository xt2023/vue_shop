<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域-->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
  name: "Report",
  data(){
    return{
        //需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  //此时页面上的元素已经被渲染完毕了
  async mounted() {
    //基于准备好的dom初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

     const {data:res}=await this.$http.get('reports/type/1')
    if (res.meta.status!==200) return this.$message.error('获取数据错误')


    //准备数据和配置项
    const result =_.merge(res.data,this.options)

    //展示数据
    myChart.setOption(result);
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
