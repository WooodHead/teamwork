<!-- 招聘流程漏斗图 -->
<template>
  <div style="height:400px;">
    <v-chart
      :options="option"
      theme="macarons"
      :autoresize="true"
      @click="item"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ResumeDashboardProcess',
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
            fontSize: 16
          }
        },
        legend: {
          top: 'bottom'
        },
        tooltip: {
          trigger: 'item',
          formatter (item) {
            let str = `<div style="cursor: pointer;">`
            str += item.data.name + '<br>'
            str += '数量：' + item.data.value + '<br>'
            str += '转化率：' + item.data.rate
            str += '</div>'
            return str
          }
        },
        grid: {
          top: '50',
          left: '0',
          right: '0',
          bottom: '50',
          containLabel: true
        },
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            labelLine: {
              length: 25,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            left: 10,
            right: 100,
            label: {
              formatter (item) {
                return item.data.name + ':' + item.data.value + ' (' + item.data.rate + ')'
              },
              position: 'rightBottom',
              fontSize: 13
            },
            minSize: '1%',
            data: [
              { value: 0, name: '简历投递', rate: '0%' },
              { value: 0, name: '筛选通过', rate: '0%' },
              { value: 0, name: '测评通过', rate: '0%' },
              { value: 0, name: '面试通过', rate: '0%' },
              { value: 0, name: 'offer发放', rate: '0%' },
              { value: 0, name: '签约入职', rate: '0%' }
            ]
          }
        ]
      },
      legendselect: 0 // 0 所有项目 1 重点项目 -1 无
    }
  },
  computed: {
    sourceData () {
      return this.$store.getters['resume/dashProcessData'](this.uid) || {}
    },
    option () {
      let that = this
      that.initOption.series[0].data = [
        { value: that.sourceData.hasDelivery, name: '简历投递', rate: that.sourceData.hasDelivery ? '100%' : '0%' },
        { value: that.sourceData.passScreening, name: '筛选通过', rate: (that.sourceData.hasDelivery ? ((that.sourceData.passScreening / that.sourceData.hasDelivery) * 100).toFixed(2) : 0) + '%' },
        { value: that.sourceData.passTest, name: '测评通过', rate: (that.sourceData.passScreening ? ((that.sourceData.passTest / that.sourceData.passScreening) * 100).toFixed(2) : 0) + '%' },
        { value: that.sourceData.passInterview, name: '面试通过', rate: (that.sourceData.passTest ? ((that.sourceData.passInterview / that.sourceData.passTest) * 100).toFixed(2) : 0) + '%' },
        { value: that.sourceData.sendOffer, name: 'offer发放', rate: (that.sourceData.passInterview ? ((that.sourceData.sendOffer / that.sourceData.passInterview) * 100).toFixed(2) : 0) + '%' },
        { value: that.sourceData.inService, name: '签约入职', rate: (that.sourceData.sendOffer ? ((that.sourceData.inService / that.sourceData.sendOffer) * 100).toFixed(2) : 0) + '%' }
      ]
      that.initOption.title.text = that.chart.title
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
    ...mapActions('resume', ['loadDashProcessData']),
    item (params) {
      if (params.data.value !== 0) {
        this.$router.push({
          name: 'dashboardDetail',
          params: {
            chart: this.chart,
            clickedChart: params.data
          }
        })
      }
    },
    loadData () {
      this.loadDashProcessData({
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
