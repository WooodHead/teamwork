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
  name: 'TaskPersonChart',
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
          text: this.$t('task.dashboard.personChart')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (obj) {
            let str = `<div style="cursor: pointer;" onclick="countByDepartmentsMore('${obj[0].axisValueLabel}');">`
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
          data: [this.$t('task.dashboard.finishedNumber'), this.$t('task.dashboard.unfinishedNumber')],
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
          name: this.$t('task.dashboard.taskNumber'),
          type: 'value',
          position: 'top',
          minInterval: 1
        },
        yAxis: {
          name: this.$t('task.dashboard.memberName'),
          nameLocation: 'start',
          type: 'category',
          data: []
        },
        series: [
          {
            name: this.$t('task.dashboard.finishedNumber'),
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
            name: this.$t('task.dashboard.unfinishedNumber'),
            type: 'bar',
            stack: '1',
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
    personChart () {
      return this.$store.state.taskchart.taskcharts.find(a =>
        a.objectType === this.category &&
        a.objectId === +this.objectID &&
        a.type === 'person' &&
        a.statustype === this.statustype
      )
    },
    option () {
      let option = _.cloneDeep(this.initOption)
      let chart = this.chartDate.from 
        ? (this.personRelatedCharts.find(r => r.type === 'person') ? this.personRelatedCharts.find(r => r.type === 'person').status : []) 
        : this.personChart && _.cloneDeep(this.personChart.status)
      chart = _.orderBy(chart, ['FinishedCount', 'UnfinishedCount'], ['asc', 'asc']) || []
      option.yAxis.data = chart.map(item => { return item.PersonName })
      option.series[0].data = chart.map(item => { return item.FinishedCount })
      option.series[1].data = chart.map(item => { return item.UnfinishedCount })
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
