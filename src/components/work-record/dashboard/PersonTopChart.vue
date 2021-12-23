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
  name: 'PersonTopChart',
  props: {
    querys: {
      type: Object,
      required: true,
      default: () => { return { date: 0, source: [], workType: [], organize: [], hourType: [] } },
      description: '查询条件'
    }
  },
  data () {
    return {
      showChart: false,
      initOption: {
        title: {
          left: 'left',
          text: this.$t('workRecord.dashboard.personTop20')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            let str = `<div style="cursor: pointer;">`
            str += params[0].axisValueLabel.split('&nbsp;')[0] + ' ' + params[0].axisValueLabel.split('&nbsp;')[1] + '<br>'
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
          name: this.$t('workRecord.dashboard.personName'),
          nameLocation: 'start',
          type: 'category',
          axisLabel: {
            formatter: function (value, index) {
              return (value.split('&nbsp;') && value.split('&nbsp;')[0]) || value
            }
          },
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
            },
            barMaxWidth: 25,
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('organize', ['selectOrganizes']),
    ...mapState('taskchart', ['personTopTaskCharts']),
    ...mapGetters('taskchart', ['taskchartFilterByDate']),
    option () {
      let that = this
      let newCharts = that.personTopTaskCharts.filter(item => that.selectPersons[+item.objectId])
      if (that.personTopTaskCharts && newCharts.length > 0) that.showChart = true
      let chart = that.taskchartFilterByDate(newCharts, that.querys.date)
      if ((that.querys.source && that.querys.source.length) || (that.querys.workType && that.querys.workType.length)) {
        chart = chart.map(item => { return Object.assign(item, { filterAllHours: item.filterWorkHours + item.filterRoadHours }) })
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
      that.initOption.yAxis.data = chart.map(item => {
        return that.selectPersons[+item.objectId] && (that.selectPersons[+item.objectId].name + '&nbsp;' + that.selectPersons[+item.objectId].orgShortName) + '&nbsp;' + item.objectId
      })
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
              if (!_.filter(this.personTopTaskCharts, r => r.statustype === newV.date).length) this.init()
            }
          } else {
            this.setEmptyPersonTopTaskCharts()
            this.init()
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations('taskchart', ['setEmptyPersonTopTaskCharts']),
    ...mapMutations('task', ['setEmptyTasks', 'initPage', 'setPerson', 'setFromToDate', 'setOrganize']),
    ...mapActions('taskchart', ['loadWorkRecordPersonTopTaskCharts']),
    init () {
      let query = [
        { Key: 'Type', Value: 'workRecord', Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'StatusType', Value: this.querys.date, Oper: 'eq' }
      ]
      this.loadWorkRecordPersonTopTaskCharts({ query: query, otherQuery: this.querys })
    },
    item (params) {
      let psonId = params.name && params.name.split('&nbsp;') && params.name.split('&nbsp;')[2]
      if (psonId) {
        let selectPerson = this.selectPersons[psonId]
        if (selectPerson) {
          // 判断选择的人员是否支持跳转，如果没有权限看，不能跳转
          if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
            this.viewDetail(selectPerson)
          } else {
            let childPathList = this.$myinfo.organizeIds.split(',').map(r => { return this.selectOrganizes[r] && this.selectOrganizes[r].childPath })
            let childPaths = _.uniq(childPathList.join(',').split(',')).map(r => { return _.toNumber(r) })
            let has = _.intersection(selectPerson.organizeIds.split(',').map(r => { return _.toNumber(r) }), childPaths)
            if (has && has.length) {
              this.viewDetail(selectPerson)
            }
          }
        }
      }
    },
    viewDetail (selectPerson) {
      // 查询月的开始时间、结束时间
      let date = new Date(this.querys.date)
      let start = formatDate(new Date(date.getFullYear(), date.getMonth(), 1), 'YYYY-MM-DD')
      let end = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'YYYY-MM-DD')
      this.setEmptyTasks()
      this.initPage()
      this.setOrganize(0)
      this.setPerson(selectPerson)
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
