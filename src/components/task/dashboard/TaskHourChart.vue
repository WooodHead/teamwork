<template>
  <div :style="'height:400px;min-height:'+(option.yAxis.data&&option.yAxis.data.length*30+180)+'px'">
    <v-chart
      :options="option"
      theme="macarons"
      :autoresize="true"
    />
  </div>
</template>
<script>
export default {
  name: 'TaskHourChart',
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
    // 图标类型(all,task,bug)
    statustype: {
      type: String,
      required: false,
      default: 'all'
    },
    // 图表时间
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
          text: this.$t('task.dashboard.workHourChart')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (obj) {
            let str = `<div style="cursor:pointer;">`
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
          data: [this.$t('task.dashboard.predictHour'), this.$t('task.dashboard.actualWorkHour')],
          top: 'bottom'
        },
        grid: {
          top: '40',
          left: '10',
          right: '60',
          bottom: '40',
          containLabel: true
        },
        xAxis: {
          name: this.$t('task.dashboard.workHours'),
          type: 'value',
          position: 'top',
          minInterval: 0.1
        },
        yAxis: {
          name: this.$t('task.dashboard.memberName'),
          nameLocation: 'start',
          type: 'category',
          data: []
        },
        series: [
          {
            name: this.$t('task.dashboard.predictHour'),
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'insideRight',
              distance: 1
            },
            barMaxWidth: 25,
            data: []
          },
          {
            name: this.$t('task.dashboard.actualWorkHour'),
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'insideRight',
              distance: 2
            },
            barMaxWidth: 25,
            data: []

          }
        ]
      }
    }
  },
  computed: {
    workHourChart () {
      return this.$store.state.taskchart.taskcharts.find(a =>
        a.objectType === this.category &&
        a.objectId === +this.objectID &&
        a.type === 'workHour' &&
        a.statustype === this.statustype
      )
    },
    option () { 
      let option = _.cloneDeep(this.initOption)
      let chart = this.chartDate.from 
        ? (this.personRelatedCharts.find(r => r.type === 'workHour') ? this.personRelatedCharts.find(r => r.type === 'workHour').status : []) 
        : this.workHourChart && _.cloneDeep(this.workHourChart.status)
      chart = _.orderBy(chart, ['PredictHours', 'ActualHours'], ['asc', 'asc']) || []
      option.yAxis.data = chart.map(item => { return item.PersonName })
      option.series[0].data = chart.map(item => { return item.PredictHours })
      option.series[1].data = chart.map(item => { return item.ActualHours })
      return option
    }
  }
}
</script>
