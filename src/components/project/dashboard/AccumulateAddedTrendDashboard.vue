<!--
@Name：项目累计新增趋势图
@Author：胡妞妞
@date：2021/08/03
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div style="height:400px;">
    <v-chart
      :options="option"
      theme="walden"
      :autoresize="true"
      @click="item"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import projectDashboard from './mixins-project-dashboard'
export default {
  name: 'AccumulateAddedTrendDashboard',
  mixins: [projectDashboard],
  props: {
    chart: {
      type: Object,
      required: false,
      default: () => { return {} }
    },
    uid: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    let that = this
    return {
      initOption: {
        title: {
          left: 'left',
          text: that.chart.title,
          textStyle: {
            color: 'dimgrey',
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '80',
          left: '0',
          right: '30',
          bottom: '40',
          containLabel: true
        },
        legend: {
          data: [],
          top: 20,
          right: 30,
          left: 60,
          align: 'auto'
        },
        xAxis: {
          name: that.$t('dashboard.date'),
          boundaryGap: false,
          nameRotate: -90,
          axisLabel: {
            rotate: -70
          },
          data: []
        },
        yAxis: {
          name: that.$t('dashboard.ProjectNumber'),
          type: 'value',
          nameTextStyle: {
            align: 'left'
          }
        },
        series: [],
        dataZoom: [{
          start: 0,
          type: 'inside'
        }, {
          start: 0
        }]
      }
    }
  },
  computed: {
    ...mapState('project', ['dashboardRank']),
    option () {
      let that = this
      let projectAdds = this.dashboardRank[`${this.uid}-${this.chart.name}`] || []
      if (projectAdds.length) {
        let orgShortNames = []
        // y轴
        if (that.chart.model.OrganizeRange === 'definedSelf') {
          let orgIds = that.chart.model.OrganizeIDs.split(',')
          _.forEach(orgIds, id => {
            orgShortNames.push(this.$store.state.organize.selectOrganizes[+id].shortName)
          })
        } else {
          orgShortNames = _.groupBy(projectAdds, r => { return r.OrgShortName })
        }
        // 基准日期调整（周日分割）
        let today = new Date()
        let baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        let weekDay = baseDate.getDay()
        baseDate = new Date(+baseDate + (24 * 3600 * 1000 * (7 - (weekDay === 0 ? 7 : weekDay))))
        let oneWeek = 24 * 3600 * 1000 * 7
        if (that.chart.model.OrganizeRange === 'allOrganize') {
          this.getChartData(projectAdds, that, baseDate, oneWeek, '')
        } else if (that.chart.model.OrganizeRange === 'definedSelf') {
          _.forEach(orgShortNames, org => {
            this.getChartData(projectAdds, that, baseDate, oneWeek, org)
          })
        } else {
          _.forEach(Object.keys(orgShortNames), org => {
            this.getChartData(projectAdds, that, baseDate, oneWeek, org)
          })
        }
      }
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
    getChartData (projectAdds, that, baseDate, oneWeek, org) {
      // 项目数据
      let projs = []
      if (that.chart.model.OrganizeRange === 'allOrganize') {
        projs = _.cloneDeep(projectAdds)
        org = '所有机构'
      } else {
        projs = _.filter(projectAdds, r => r.OrgShortName === org)
      }
      // 图表数据
      let weeks = []
      let weekAdds = []
      for (let i = 0; i < 53; i++) { // 一年约53周
        // 本周截止日期
        weeks.push([baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate()].join('-'))
        // 上一周截止日期
        // let lastWeek = new Date(+baseDate - oneWeek)
        // 截止上周新增项目数（从本周算起）
        let counts = _.sumBy(_.filter(projs, (p) => {
          let createDate = new Date(p.Date.replace(/-/g, '/'))
          return +createDate < +baseDate
        }), 'Count')
        weekAdds.push(counts)
        let lastWeek = new Date(+baseDate - oneWeek)
        baseDate = lastWeek
      }
      let series = {
        name: org,
        type: 'line',
        showSymbol: false,
        symbolSize: 2,
        data: _.reverse(weekAdds),
        label: {
          show: false
        },
        endLabel: {
          show: true,
          formatter: function () {
            return org
          }
        }
      }
      if (that.initOption.xAxis.data.length <= 0) {
        that.initOption.xAxis.data = _.reverse(weeks)
      }
      that.initOption.series.push(..._.differenceBy([series], that.initOption.series, 'name'))
      that.initOption.legend.data.push(org)
    }
  },
  watch: {
  }
}
</script>
