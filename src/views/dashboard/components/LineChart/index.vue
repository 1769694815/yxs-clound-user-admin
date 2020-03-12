<!--
 * @Author: xwen
 * @Date: 2020-03-09 10:39:21
 * @LastEditTime: 2020-03-09 15:51:56
 * @LastEditors: xwen
 * @Description:  线性图表
 -->

<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    yAxisName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      legendList: [],
      dataList: [],
      seriesList: []
    }
  },
  watch: {
    chartData: {
      handler: function(val) {
        if (val.length <= 0) {
          return
        }
        this.setOptions(val)
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setDataList(val) {
      // 初始化数据
      this.dataList = []
      this.seriesList = []
      this.chart.clear()

      this.legendList = Object.keys(val[0]).filter(item => item !== '日期')
      for (let i = 0; i < this.legendList.length; i++) {
        const obj = {
          name: this.legendList[i],
          data: []
        }
        for (let j = 0; j < val.length; j++) {
          const item = val[j][this.legendList[i]]
          obj.data.push(item)
        }
        this.dataList.push(obj)
      }
      for (let i = 0; i < this.dataList.length; i++) {
        const series = {
          name: this.dataList[i].name,
          smooth: true,
          type: 'line',
          data: this.dataList[i].data,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        this.seriesList.push(series)
      }
    },
    setOptions(val) {
      this.setDataList(val)
      this.chart.setOption({
        xAxis: {
          name: '日期',
          type: 'category',
          data: val.map(item => {
            return item['日期']
          }),
          axisLabel: {
            formatter: function(value, idx) {
              var date = new Date(value)
              return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-')
            }
          },
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          name: this.yAxisName,
          axisTick: {
            show: false
          }
        },
        legend: {
          data: this.legendList
        },
        series: this.seriesList
      })
    }
  }
}
</script>
