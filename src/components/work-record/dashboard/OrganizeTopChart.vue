<template>
  <div>
    <v-chart
      v-show="showChart"
      :style="'height:100%;min-height:'+(option.yAxis.data.length*40+150)+'px;'"
      :options="option"
      theme="macarons"
      :autoresize="true"
      @click="item"
    />
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'OrganizeRankChart',
  props: {
    querys: {
      type: Object,
      required: true,
      default: () => { return { date: 0, source: [], workType: [], organize: [], hourType: [], average: [] } },
      description: '查询条件'
    }
  },
  data () {
    return {
      showChart: false,
      initOption: {
        title: {
          left: 'left',
          text: this.$t('workRecord.dashboard.organizeTop10')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            let str = `<div style="cursor: pointer;">`
            str += params[0].axisValueLabel + '<br>'
            _.each(params, function (item) {
              str += item.marker + item.seriesName + ': ' + item.value + '<br>'
            })
            str += '</div>'
            return str
          },
          position: function (point, params, dom, rect, size) {
            return [point[0] + 30, point[1]]
          },
          enterable: true
        },
        legend: {
          data: [this.$t('workRecord.dashboard.sumWorkHours'), this.$t('workRecord.dashboard.sumRoadHours')],
          top: 'bottom'
        },
        grid: {
          top: '40',
          left: '0',
          right: '40',
          bottom: '50',
          containLabel: true
        },
        xAxis: {
          name: this.$t('workRecord.dashboard.hour'),
          type: 'value',
          position: 'top',
          minInterval: 1
        },
        yAxis: {
          name: this.$t('workRecord.dashboard.organizeName'),
          nameLocation: 'start',
          type: 'category',
          data: []
        },
        series: [
          {
            name: this.$t('workRecord.dashboard.sumWorkHours'),
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'inside'
              //   distance: 2
            },
            barMaxWidth: 25,
            data: []
          },
          {
            name: this.$t('workRecord.dashboard.sumRoadHours'),
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'inside'
              //   distance: 1
            },
            barMaxWidth: 25,
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('organize', ['selectOrganizes']),
    ...mapState('taskchart', ['organizeTopTaskCharts']),
    ...mapGetters('taskchart', ['taskchartFilterByDate']),
    option () {
      let that = this
      if (that.organizeTopTaskCharts && that.organizeTopTaskCharts.length > 0) that.showChart = true
      let initChart = that.taskchartFilterByDate(that.organizeTopTaskCharts, that.querys.date)
      let chart = _.cloneDeep(initChart)
      // 来源或工作类型或人均数过滤
      if ((that.querys.source && that.querys.source.length) || (that.querys.workType && that.querys.workType.length) ||
        (that.querys.average && that.querys.average.includes('PsonAverage'))) {
        if ((that.querys.source && that.querys.source.length) || (that.querys.workType && that.querys.workType.length)) {
          chart = chart.map(item => { return Object.assign(item, { filterAllHours: item.filterWorkHours + item.filterRoadHours }) })
          if (that.querys.average && that.querys.average.includes('PsonAverage')) {
            chart = chart.map(r => {
              return Object.assign(r, {
                filterAllHours: Math.abs((r.filterAllHours / r.status.AssignedToCount).toFixed(1)),
                filterRoadHours: Math.abs((r.filterRoadHours / r.status.AssignedToCount).toFixed(1)),
                filterWorkHours: Math.abs((r.filterWorkHours / r.status.AssignedToCount).toFixed(1))
              })
            })
          }
          if (that.querys.hourType && !that.querys.hourType.includes('WorkHour')) {
            chart = _.orderBy(chart, ['filterRoadHours'], ['asc'])
          } else if (that.querys.hourType && !that.querys.hourType.includes('OnRoadHour')) {
            chart = _.orderBy(chart, ['filterWorkHours'], ['asc'])
          } else {
            chart = _.orderBy(chart, ['filterAllHours'], ['asc'])
          }
          that.initOption.series[0].data = chart.map(item => { return item.filterWorkHours })
          that.initOption.series[1].data = chart.map(item => { return item.filterRoadHours })
        } else {
          if (that.querys.average && that.querys.average.includes('PsonAverage')) {
            _.forEach(chart, r => {
              r.status.SumHours = Math.abs((r.status.SumHours / r.status.AssignedToCount).toFixed(1))
              r.status.SumWorkHours = Math.abs((r.status.SumWorkHours / r.status.AssignedToCount).toFixed(1))
              r.status.SumOnRoadHours = Math.abs((r.status.SumOnRoadHours / r.status.AssignedToCount).toFixed(1))
            })
          }
          chart = _.orderBy(chart, ['status.SumHours'], ['asc'])
          that.initOption.series[0].data = chart.map(item => { return item.status.SumWorkHours })
          that.initOption.series[1].data = chart.map(item => { return item.status.SumOnRoadHours })
        }
      } else {
        chart = _.orderBy(chart, ['status.SumHours'], ['asc'])
        that.initOption.series[0].data = chart.map(item => { return item.status.SumWorkHours })
        that.initOption.series[1].data = chart.map(item => { return item.status.SumOnRoadHours })
      }
      // 工时类型
      if (that.querys.hourType && !that.querys.hourType.includes('WorkHour')) {
        if (chart.length && !_.keys(chart[0]).includes('filterAllHours')) {
          chart = _.orderBy(chart, ['status.SumOnRoadHours'], ['asc'])
          that.initOption.series[1].data = chart.map(item => { return item.status.SumOnRoadHours })
        }
        that.initOption.series[0].data = 0
      }
      if (that.querys.hourType && !that.querys.hourType.includes('OnRoadHour')) {
        if (chart.length && !_.keys(chart[0]).includes('filterAllHours')) {
          chart = _.orderBy(chart, ['status.SumWorkHours'], ['asc'])
          that.initOption.series[0].data = chart.map(item => { return item.status.SumWorkHours })
        }
        that.initOption.series[1].data = 0
      }
      that.initOption.yAxis.data = chart.map(item => { return that.selectOrganizes[+item.objectId] && that.selectOrganizes[+item.objectId].shortName })
      return _.cloneDeep(that.initOption)
    }
  },
  watch: {
    querys: {
      deep: true,
      handler: function (newV, oldV) {
        if (Object.keys(newV).length && Object.keys(oldV).length) {
          if (!_.difference(Object.keys(newV), ['date']).length && !_.difference(Object.keys(oldV), ['date']).length) {
            if (newV.date !== oldV.date) {
              if (!_.filter(this.organizeTopTaskCharts, r => r.statustype === newV.date).length) {
                this.init()
              }
            }
          } else {
            this.setEmptyOrganizeTopTaskCharts()
            this.init()
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations('task', ['setEmptyTasks', 'initPage', 'setOrganize', 'setFromToDate', 'setPerson']),
    ...mapMutations('taskchart', ['setEmptyOrganizeTopTaskCharts']),
    ...mapActions('taskchart', ['loadWorkRecordOrganizeTopTaskCharts']),
    init () {
      let query = [
        { Key: 'Type', Value: 'workRecord', Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'organize', Oper: 'eq' },
        'and',
        { Key: 'StatusType', Value: this.querys.date, Oper: 'eq' }
      ]
      this.loadWorkRecordOrganizeTopTaskCharts({ query: query, otherQuery: this.querys })
    },
    item (params) {
      if (params.name) {
        let selectOrganize = _.values(this.selectOrganizes).find(item => item.shortName === params.name)
        if (selectOrganize) {
          // 判断选择的机构是否支持跳转，如果没有权限看，不能跳转
          if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
            this.viewDetail(selectOrganize)
          } else {
            let childPathList = this.$myinfo.organizeIds.split(',').map(r => { return this.selectOrganizes[r] && this.selectOrganizes[r].childPath })
            let childPaths = _.uniq(childPathList.join(',').split(',')).map(r => { return _.toNumber(r) })
            if (childPaths.indexOf(selectOrganize.id) >= 0) {
              this.viewDetail(selectOrganize)
            }
          }
        }
      }
    },
    viewDetail (selectOrganize) {
      // 查询月的开始时间、结束时间
      let date = new Date(this.querys.date)
      let start = formatDate(new Date(date.getFullYear(), date.getMonth(), 1), 'YYYY-MM-DD')
      let end = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'YYYY-MM-DD')
      this.setEmptyTasks()
      this.initPage()
      this.setPerson({
        id: null,
        name: '',
        type: 'all'
      })
      this.setOrganize(selectOrganize.id)
      this.setFromToDate({ from: start, to: end })
      this.$router.push({ name: 'workRecordList' })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>
