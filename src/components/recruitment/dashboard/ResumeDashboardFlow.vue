<!-- 院校、学历、岗位类别流向图 -->
<template>
  <div style="height:400px;">
    <q-checkbox
      style="z-index:100;font-size: 12px;color:#333333;height:33.59px;top:33px;right:15px;"
      class="absolute"
      v-model="inService"
      :label="$t('recruitment.dashboard.inService')"
      color="secondary"
      keep-color
    />
    <v-chart
      :options="option"
      theme="walden"
      :autoresize="true"
      @click="item"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ResumeDashboardFlow',
  props: {
    uid: {
      type: String,
      default: '',
      required: false,
      description: '图表数据的唯一标识'
    },
    chart: {
      type: Object,
      required: true,
      default () {
        return {}
      },
      description: '图形chart数据'
    }
  },
  data () {
    return {
      initOption: {
        title: {
          left: 'left',
          text: this.chart.title,
          textStyle: {
            color: 'dimgrey',
            fontWeight: 'normal',
            fontSize: 16,
            overflow: 'truncate',
            ellipsis: '..'
          }
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        animation: false,
        grid: {
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        series: [
          {
            type: 'sankey',
            layout: 'none',
            zlevel: 1000,
            nodeAlign: 'left',
            data: [],
            links: [],
            top: '50px',
            left: '80px',
            right: '10px',
            bottom: '20px',
            nodeGap: 12,
            draggable: false,
            label: {
              position: 'left',
              overflow: 'truncate'
            }
          }
        ]
      },
      inService: false
    }
  },
  computed: {
    sourceData () {
      return this.$store.getters['resume/dashFlowData'](this.uid) || {}
    },
    option () {
      let that = this
      let nodes = []
      let sourceData = that.inService ? _.filter(that.sourceData, { 'status': 110 }) : that.sourceData
      // 获取所有院校类型
      let collegeStyles = _.uniq(_.flatMap(sourceData, function (item) {
        return item.CollegeStyle
      }))
      // that.height = collegeStyles.length * 14 + 70 + 'px'
      nodes.push(..._.map(collegeStyles, (item) => { return { 'name': item } }))
      // 岗位类别
      let jobCategorys = _.uniq(_.flatMap(sourceData, function (item) {
        return item.JobCategory
      }))
      nodes.push(..._.map(jobCategorys, (item) => { return { 'name': item } }))
      // 获取所有学历
      let backgrounds = _.uniq(_.flatMap(sourceData, function (item) {
        return item.Background
      }))
      nodes.push(..._.map(backgrounds, (item) => { return { 'name': item } }))

      let links = []
      // 院校类型=>学历
      let CollegeStyleToBackground = _.groupBy(sourceData, (item) => { return item.CollegeStyle + '+' + item.Background })
      _.forEach(CollegeStyleToBackground, function (item, key) {
        let keys = key.split('+')
        links.push({
          'source': keys[0],
          'target': keys[1],
          'value': _.sumBy(item, 'num')
        })
      })
      // 学历=>岗位类别
      let JobCategoryToBackground = _.groupBy(sourceData, (item) => { return item.JobCategory + '+' + item.Background })
      _.forEach(JobCategoryToBackground, function (item, key) {
        let keys = key.split('+')
        links.push({
          'source': keys[1],
          'target': keys[0],
          'value': _.sumBy(item, 'num')
        })
      })
      that.initOption.series[0].links = links
      that.initOption.series[0].data = nodes
      that.initOption.title.text = that.chart.title
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
    ...mapActions('resume', ['loadDashFlowData']),
    item (params) {
      this.$router.push({
        name: 'dashboardDetail',
        params: {
          chart: this.chart,
          clickedChart: params.data
        }
      })
    },
    loadData () {
      this.loadDashFlowData({
        uid: this.uid,
        where: this.chart.where
      })
    }
  },
  watch: {
    chart (newVal, oldVal) {
      this.loadData()
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style>
</style>
