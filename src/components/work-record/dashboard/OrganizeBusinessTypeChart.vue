<template>
  <div>
    <v-chart
      v-show="showChart"
      :style="'height:100%;width:100%;min-height:300px;'"
      :options="option"
      theme="macarons"
      :autoresize="true"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrganizeBusinessTypeChart',
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
          text: this.$t('workRecord.dashboard.organizeBusinessTypeSumHour', { orgName: this.$t('workRecord.dashboard.group') })
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: '{b}:{c}({d}%)'
        },
        legend: {
          top: 'bottom'
        },
        grid: {
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        series: [
          {
            type: 'pie',
            radius: this.$q.screen.lt.sm ? '25%' : '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              position: 'outer',
              alignTo: this.$q.screen.lt.sm ? 'none' : 'labelLine',
              formatter: this.$q.screen.lt.sm ? '{b}:{d}%' : '{b}: {c} ({d}%)',
              minMargin: 5
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.loadDictionarys('workRecord')
    this.init()
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapState('taskchart', ['organizeTaskCharts']),
    ...mapGetters('taskchart', ['taskchartFilterByDate', 'taskchartFilterByOrganize']),
    workClassify () {
      return this.dictionary['workRecord'] ? this.dictionary['workRecord']['classify'] : []
    },
    option () {
      let that = this, initData = [], data = [], dicValues = [], pickList = {}, pickSumHours = 0
      let chart = that.taskchartFilterByDate(that.organizeTaskCharts, that.querys.date)
      // 机构过滤
      if (that.querys.organize) {
        chart = that.taskchartFilterByOrganize(chart, that.querys.organize)
        that.initOption.title.text = that.$t('workRecord.dashboard.organizeBusinessTypeSumHour', { orgName: '' })
      } else {
        chart = chart.filter(r => r.objectId === 1)
      }

      if (chart.length) {
        that.showChart = true
        initData = chart.map(r => { return r.status.BusinessTypeHours })
      }
      if (initData.length && that.workClassify && that.workClassify.length) {
        _.forEach(that.workClassify, r => {
          pickSumHours = 0
          dicValues = r.dictValue.split(',')
          _.forEach(initData, n => {
            if (dicValues.includes('W')) {
              pickSumHours += _.sumBy(_.values(n), m => { return m[1] })
            } else {
              pickList = _.pick(n, dicValues)
              if (pickList && Object.keys(pickList).length) {
                pickSumHours += _.sumBy(_.values(pickList), m => { return m[0] })
              }
            }
          })
          data.push({
            'name': r.dictKey,
            'value': Math.abs(pickSumHours.toFixed(2))
          })
        })
      }
      that.initOption.series[0].data = data
      return _.cloneDeep(that.initOption)
    }
  },
  watch: {
    querys: {
      deep: true,
      handler: function (newV, oldV) {
        if (Object.keys(newV).length && Object.keys(oldV).length) {
          if (newV.date !== oldV.date) {
            if (!_.filter(this.organizeTaskCharts, r => r.statustype === newV.date).length) this.init()
          }
          if (newV.organize) {
            let oldOrgIds = this.organizeTaskCharts.map(r => { return r.objectId })
            if (!oldV.organize || _.difference(newV.organize, oldOrgIds).length) this.init()
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('taskchart', ['loadWorkRecordOrganizeTaskCharts']),
    ...mapActions('dictionary', ['loadDictionarys']),
    init () {
      let query = [
        { Key: 'Type', Value: 'workRecord', Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'organize', Oper: 'eq' },
        'and',
        { Key: 'StatusType', Value: this.querys.date, Oper: 'eq' }
      ]
      if (this.querys.organize && this.querys.organize.length) {
        query.push('and', { Key: 'ObjectID', Value: this.querys.organize.join(','), Oper: 'in' })
      } else {
        query.push('and', { Key: 'ObjectID', Value: 1, Oper: 'eq' })
      }
      this.loadWorkRecordOrganizeTaskCharts({ query: query })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
