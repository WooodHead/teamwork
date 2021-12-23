<template>
  <div :style="'height:400px;min-height:'+(option.yAxis.data&&option.yAxis.data.length*30+180)+'px;'">
    <v-chart
      :options="option"
      theme="macarons"
      :autoresize="true"
    />
  </div>
</template>
<script>
export default {
  name: 'TaskDelayChart',
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
    },
    personRelatedCharts: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      initOption: {
        title: {
          left: 'left',
          text: this.$t('task.dashboard.delayChart')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
          data: [this.$t('task.dashboard.delayNumber'), this.$t('task.dashboard.delayDays')],
          top: 'bottom'
        },
        grid: {
          top: '40',
          left: '10',
          right: '60',
          bottom: '40',
          containLabel: true
        },
        xAxis: [
          {
            name: this.$t('task.dashboard.taskNumber'),
            type: 'value',
            position: 'top',
            minInterval: 1,
            max: function (value) {
              return value.max + 5
            },
            boundaryGap: [0, '20%']
          },
          {
            name: this.$t('task.dashboard.delayDays'),
            type: 'value',
            position: 'bottom',
            max: function (value) {
              return value.max + 5
            },
            boundaryGap: [0, '20%']
          }
        ],
        yAxis: {
          name: this.$t('task.dashboard.memberName'),
          nameLocation: 'start',
          type: 'category',
          data: []
        },
        series: [
          {
            name: this.$t('task.dashboard.delayNumber'),
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'insideRight',
              distance: 2
            },
            barMaxWidth: 25,
            data: []
          },
          {
            name: this.$t('task.dashboard.delayDays'),
            type: 'line',
            stack: '2',
            smooth: false,
            color: 'red',
            xAxisIndex: 1,
            label: {
              show: true,
              position: 'insideRight',
              distance: 1
            },
            barMaxWidth: 25,
            data: []
          }
        ]
      }
    }
  },
  computed: {
    delayChart () {
      return this.$store.state.taskchart.taskcharts.find(a =>
        a.objectType === this.category &&
        a.objectId === +this.objectID &&
        a.type === 'delay' &&
        a.statustype === this.statustype
      )
    },
    option () {
      let option = _.cloneDeep(this.initOption)
      let chart = this.chartDate.from 
        ? (this.personRelatedCharts.find(r => r.type === 'delay') ? this.personRelatedCharts.find(r => r.type === 'delay').status : []) 
        : this.delayChart && _.cloneDeep(this.delayChart.status)
      chart = _.orderBy(chart, ['DelayCount', 'DelayDays'], ['asc', 'asc']) || []
      option.yAxis.data = chart.map(item => { return item.PersonName })
      option.series[0].data = chart.map(item => { return item.DelayCount })
      option.series[1].data = chart.map(item => { return item.DelayDays })
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
