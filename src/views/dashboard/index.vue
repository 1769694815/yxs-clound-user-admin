<!--
 * @Author: xwen
 * @Date: 2020-02-20 09:20:59
 * @LastEditTime: 2020-03-09 16:28:50
 * @LastEditors: xwen
 * @Description: 主页
 -->
<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ userInfo.nickName }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <div class="chart-header">
      <div class="chart-title">{{ chartTitleList[chartIndex] }}</div>
      <el-date-picker
        v-model="date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
    </div>
    <el-row style="background: #fff;padding: 16px 16px 0;">
      <line-chart :y-axis-name="yAxisName" :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup/index'
import LineChart from './components/LineChart/index'
const lineChartData = {
  newVisitis: [{
    '注册用户': 100,
    '添加用户': 120,
    '日期': '2020-03-02'
  }, {
    '注册用户': 120,
    '添加用户': 82,
    '日期': '2020-03-03'
  }, {
    '注册用户': 161,
    '添加用户': 91,
    '日期': '2020-03-04'
  }, {
    '注册用户': 105,
    '添加用户': 162,
    '日期': '2020-03-05'
  }, {
    '注册用户': 160,
    '添加用户': 140,
    '日期': '2020-03-06'
  }, {
    '注册用户': 165,
    '添加用户': 145,
    '日期': '2020-03-07'
  }],
  messages: [{
    '课程订单数': 200,
    '班级订单数': 180,
    '日期': '2020-03-02'
  }, {
    '课程订单数': 192,
    '班级订单数': 160,
    '日期': '2020-03-03'
  }, {
    '课程订单数': 120,
    '班级订单数': 151,
    '日期': '2020-03-04'
  }, {
    '课程订单数': 144,
    '班级订单数': 106,
    '日期': '2020-03-05'
  }, {
    '课程订单数': 160,
    '班级订单数': 145,
    '日期': '2020-03-06'
  }, {
    '课程订单数': 130,
    '班级订单数': 150,
    '日期': '2020-03-07'
  }, {
    '课程订单数': 140,
    '班级订单数': 130,
    '日期': '2020-03-08'
  }],
  purchases: [{
    '中药学': 80,
    '西药学': 120,
    '针灸学': 110,
    '日期': '2020-03-02'
  }, {
    '中药学': 100,
    '西药学': 90,
    '针灸学': 110,
    '日期': '2020-03-03'
  }, {
    '中药学': 121,
    '西药学': 100,
    '针灸学': 110,
    '日期': '2020-03-04'
  }, {
    '中药学': 104,
    '西药学': 138,
    '针灸学': 110,
    '日期': '2020-03-05'
  }, {
    '中药学': 105,
    '西药学': 142,
    '针灸学': 110,
    '日期': '2020-03-06'
  }, {
    '中药学': 90,
    '西药学': 130,
    '针灸学': 110,
    '日期': '2020-03-07'
  }, {
    '中药学': 100,
    '西药学': 130,
    '针灸学': 110,
    '日期': '2020-03-08'
  }],
  shoppings: [{
    '健康师班级': 130,
    '针灸师班级': 120,
    '中药师班级': 110,
    '日期': '2020-03-02'
  }, {
    '健康师班级': 140,
    '针灸师班级': 80,
    '中药师班级': 100,
    '日期': '2020-03-03'
  }, {
    '健康师班级': 141,
    '针灸师班级': 91,
    '中药师班级': 90,
    '日期': '2020-03-04'
  }, {
    '健康师班级': 142,
    '针灸师班级': 152,
    '中药师班级': 120,
    '日期': '2020-03-05'
  }, {
    '健康师班级': 145,
    '针灸师班级': 163,
    '中药师班级': 140,
    '日期': '2020-03-06'
  }, {
    '健康师班级': 150,
    '针灸师班级': 140,
    '中药师班级': 130,
    '日期': '2020-03-07'
  }, {
    '健康师班级': 160,
    '针灸师班级': 130,
    '中药师班级': 120,
    '日期': '2020-03-08'
  }]
}
export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart
  },
  // computed: {
  //   ...mapGetters([
  //     'userInfo',
  //     'roles'
  //   ])
  // },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      yAxisNameList: ['用户数（人）', '订单数（单）'],
      chartTitleList: ['累计用户统计', '订单总数统计', '课程订单总数统计', '班级订单总数统计'],
      chartIndex: 0,
      yAxisName: '用户数（人）',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      date: ''
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
      if (type === 'newVisitis') {
        this.yAxisName = this.yAxisNameList[0]
        this.chartIndex = 0
      } else if (type === 'messages') {
        this.yAxisName = this.yAxisNameList[1]
        this.chartIndex = 1
      } else if (type === 'purchases') {
        this.yAxisName = this.yAxisNameList[1]
        this.chartIndex = 2
      } else {
        this.yAxisName = this.yAxisNameList[1]
        this.chartIndex = 3
      }
      console.log('点击的类型', type)
      console.log('对应的数据', this.lineChartData)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 56px 0 16px;
      .chart-title {
        color: #333;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
