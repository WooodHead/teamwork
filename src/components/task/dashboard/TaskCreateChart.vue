<template>
  <div style="height:400px">
    <v-chart
      :options="option"
      theme="macarons"
      :autoresize="true"
    />
  </div>
</template>

<script>
import { date } from 'quasar'
import echarts from 'vue-echarts'
const { formatDate } = date
export default {
  name: 'TaskCreateChart',
  props: {
    // 资源类型
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 图标类型（all,task,bug）
    statustype: {
      type: String,
      required: false,
      default: 'all'
    },
    // 图表时间类型
    chartDate: {
      type: Object,
      required: false,
      default () {
        return {
          from: '',
          to: ''
        }
      }
    }
  },
  data () {
    return {
      // list: '',
      initOption: {
        title: {
          left: 'left',
          text: this.$t('task.dashboard.createChart')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (obj) {
            let str = `<div style="cursor: pointer;">`
            str += obj[0].axisValueLabel + '<br>'
            _.each(obj, function (item) {
              str += item.marker + item.seriesName + ': ' + item.value + '<br>'
            })
            str += '</div>'
            return str
          },
          position: function (point, params, dom, rect, size) {
            // 固定在顶部
            return [point[0] - 10, point[1] - 10]
          },
          enterable: true
        },
        legend: {
          show: false
        },
        grid: {
          top: '80',
          left: '15',
          right: '40',
          bottom: '40',
          containLabel: true
        },
        xAxis: {
          name: this.$t('task.dashboard.date'),
          boundaryGap: false,
          data: [],
          axisLabel: {
            rotate: -70
          }
        },
        yAxis: {
          name: this.$t('task.dashboard.createNumber'),
          type: 'value',
          nameLocation: 'end',
          splitLine: {
            show: false
          },
          max: function (value) {
            return value.max + 5
          },
          boundaryGap: [0, '20%']
        },
        dataZoom: [{
          start: 0,
          type: 'inside'
        }, {
          start: 0
        }],
        series: [
          {
            name: this.$t('task.dashboard.createNumber'),
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#588dd5'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#588dd5'
              }, {
                offset: 1,
                color: '#588dd5'
              }])
            },
            data: []
          }
        ]
      }
    }
  },
  computed: {
    createchart () {
      return this.$store.state.taskchart.taskcharts.find(a =>
        a.objectType === this.category &&
        a.objectId === +this.objectID &&
        a.type === 'create' &&
        a.statustype === this.statustype
      )
    },
    BeginDate () {
      let date = new Date()
      if (this.chartDate.from === '') {
        if (this.createchart && this.createchart.status.length > 0) {
          let list = this.createchart.status.filter(a => a.Date !== '1000-01-01')
          date = new Date(list[0].Date)
        }
      } else {
        date = formatDate(this.chartDate.from, 'YYYY-MM-DD')
      }
      return date
    },
    EndDate () {
      let date = new Date()
      if (this.chartDate.from === '') {
        if (this.createchart && this.createchart.status.length > 0) {
          let length = this.createchart.status.length
          date = new Date(this.createchart.status[length - 1].Date)
        }
      } else {
        date = formatDate(this.chartDate.to, 'YYYY-MM-DD')
      }
      return date
    },
    option () {
      let option = _.cloneDeep(this.initOption)
      let oneDay = 24 * 3600 * 1000
      let Count = (new Date(this.EndDate) - new Date(this.BeginDate)) / oneDay + 2
      let chart = []
      for (let i = 0; i <= Count; i++) {
        let count = 0
        let date = formatDate(new Date(+new Date(this.BeginDate) + oneDay * (i - 1)), 'YYYY-MM-DD')
        let model = this.createchart && this.createchart.status.find(item => item.Date === date)
        if (model) {
          count = model.Count
        }
        chart.push({
          Count: count,
          Date: date
        })
        option.xAxis.data = chart.map(a => { return a.Date })
        option.series[0].data = chart.map(a => { return a.Count })
      }
      return option
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
