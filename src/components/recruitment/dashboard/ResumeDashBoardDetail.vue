<!-- 简历面板详情页 -->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card :title="title + '(' + total + ')'">
      <template #menu>
        <resource-list-style
          category="resume"
          :menus="menus"
        />
      </template>
    </tw-header-card>
    <q-card-section :class="$q.screen.gt.xs?'q-px-xl q-py-none':'q-px-md'">
      <!-- 筛选条件 -->
      <resume-dashboard-condition
        :model.sync="queryModel"
        :key="title"
        class="q-mb-md"
      />
      <!-- 内容 -->
      <q-infinite-scroll
        @load="onLoad"
        :offset="250"
        class="q-mb-lg row"
        style="overflow: auto;"
        ref="infiniteScroll"
      >
        <!-- 加载中logo -->
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
        <!-- 列表 -->
        <div
          v-if="resumeViews && resumeViews.length"
          class="full-width"
        >
          <!-- 表格视图 -->
          <resume-dashboard-detail-table
            v-if="dashboardDetailListStyle==='showtable'"
            :modelList="resumeViews"
            class="full-width"
          />
          <!-- 卡片视图 -->
          <div
            v-else
            class="flex q-gutter-y-md"
          >
            <resume-dashboard-card
              v-for="view in resumeViews"
              :key="view.resumeDeliveryID"
              :resumeDeliveryID="view.resumeDeliveryID"
            />
          </div>
        </div>
        <!-- 无数据提示 -->
        <div v-else>
          <tw-banner-no-result />
        </div>
      </q-infinite-scroll>
    </q-card-section>

  </q-card>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ResumeDashBoardDetail',
  props: {
    chart: {
      type: Object,
      required: true,
      default () {
        return {}
      },
      description: '图形chart数据'
    },
    clickedChart: {
      type: Object,
      required: true,
      default () {
        return {}
      },
      description: '点击的仪表盘数据'
    }
  },
  data () {
    return {
      views: {},
      queryModel: {},
      myChart: _.cloneDeep(this.chart),
      myClickedChart: _.cloneDeep(this.clickedChart),
      menus: ['showcards', 'showtable']
    }
  },
  computed: {
    ...mapState('resume', ['dashboardDetailListStyle', 'dashboardDetailSort', 'dashboardDetailOrder']),
    title () {
      return this.myChart.title + '：' +
        (this.myClickedChart.name || (this.myClickedChart.source + ' - ' + this.myClickedChart.target) || '简历列表')
    },
    total () {
      return this.$store.state.resume.dashboardPage.total
    },
    resumeViews () {
      return _.orderBy(this.views[this.title], [this.dashboardDetailSort], [this.dashboardDetailOrder])
    }
  },
  methods: {
    ...mapActions('resume', ['loadDashboardResumeList']),
    ...mapMutations('resume', ['resetDashboardStatePage', 'setListStyle']),
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'pushWidgetBreadcrumb', 'clearBreadcrumbs']),
    // 面包屑处理
    initBreadcrumb () {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
    },
    // 加载列表数据
    onLoad (index, done) {
      if (!_.isEmpty(this.myChart)) {
        this.loadDashboardResumeList(this.getCondition())
          .then(res => {
            if (_.isEmpty(res)) {
              done(true)
              this.views[this.title] = []
            } else {
              if (this.$store.state.resume.dashboardPage.nextPageToken === -1) {
                done(true)
              } else {
                done()
              }
              if (!this.views[this.title]) {
                Vue.set(this.views, this.title, [])
              }
              // 添加 school、major 属性
              res.forEach((row, index) => {
                // 最高学历
                let edu = row.educations[0]
                edu = _.reverse(_.sortBy(row.educations, 'startTime'))[0]
                row.school = edu.college
                row.major = edu.major
              })
              let newViews = _.difference(res, this.views[this.title], 'resumeDeliveryID')
              this.views[this.title].push(...newViews)
            }
          })
      } else {
        this.$router.push({ name: 'jobHome' })
      }
    },
    // 漏斗图
    getProcessQuery () {
      let query = []
      if (this.myClickedChart.name === '筛选通过') {
        query.push([
          { Key: 'Status', Value: 0, Oper: 'ne' }
        ])
      } else if (this.myClickedChart.name === '测评通过') {
        query.push([
          { Key: 'Status', Value: [0, 10, 15].join(), Oper: 'nein' }
        ])
      } else if (this.myClickedChart.name === '面试通过') {
        query.push([
          { Key: 'Status', Value: [0, 10, 15, 20, 30, 40, 60, 70, 80].join(), Oper: 'nein' }
        ])
      } else if (this.myClickedChart.name === 'offer发放') {
        query.push([
          { Key: 'Status', Value: [0, 10, 15, 20, 30, 40, 60, 70, 80, 90].join(), Oper: 'nein' }
        ])
      } else if (this.myClickedChart.name === '签约入职') {
        query.push([
          { Key: 'Status', Value: 110, Oper: 'eq' }
        ])
      }
      return query
    },
    // 饼状图、流向图
    getFlowQuery () {
      let query = []
      // source-target
      if (this.myClickedChart.source) {
        // 院校类型 -> 学历
        if (['其他院校', '985', '211'].includes(this.myClickedChart.source)) {
          if (this.myClickedChart.source === '其他院校') {
            query.push({ Key: "Educations ->> '$[0].CollegeStyle'", Value: '985,211', Oper: 'nein' })
          } else {
            query.push({ Key: "Educations ->> '$[0].CollegeStyle'", Value: this.myClickedChart.source, Oper: 'eq' })
          }
          query.push('and')
          query.push({ Key: 'HighestEducation', Value: this.myClickedChart.target, Oper: 'eq' })
          // 学历 -> 岗位类型
        } else {
          query.push({ Key: 'HighestEducation', Value: this.myClickedChart.source, Oper: 'eq' })
          query.push('and')
          query.push({ Key: 'job.Category', Value: this.myClickedChart.target, Oper: 'eq' })
        }
      } else {
        if (['其他院校', '985', '211'].includes(this.myClickedChart.name)) {
          if (this.myClickedChart.name === '其他院校') {
            query.push({ Key: "Educations ->> '$[0].CollegeStyle'", Value: '985,211', Oper: 'nein' })
          } else {
            query.push({ Key: "Educations ->> '$[0].CollegeStyle'", Value: this.myClickedChart.name, Oper: 'eq' })
          }
        } else if (this.myClickedChart.name.includes('类')) {
          query.push({ Key: 'job.Category', Value: this.myClickedChart.name, Oper: 'eq' })
        } else {
          query.push({ Key: 'HighestEducation', Value: this.myClickedChart.name, Oper: 'eq' })
        }
      }
      return query
    },
    getFrontCondition (model) {
      return {
        planids: model.planids.length ? model.planids.split(',').map(i => +i) : [],
        jobids: model.jobids.length ? model.jobids.split(',').map(i => +i) : [],
        citys: model.citys.length ? model.citys.split(',') : [],
        startDate: model.startDate,
        endDate: model.endDate,
        schools: model.schools.length ? model.schools.split(',') : []
      }
    },
    getEndCondition (model) {
      return {
        planids: _.isEmpty(model.planids) ? '' : model.planids.join(),
        jobids: _.isEmpty(model.jobids) ? '' : model.jobids.join(),
        citys: _.isEmpty(model.citys) ? '' : model.citys.join(),
        startDate: model.startDate || '',
        endDate: model.endDate || '',
        schools: _.isEmpty(model.schools) ? '' : model.schools.join()
      }
    },
    getCondition () {
      let condition = this.getEndCondition(this.myChart.model)
      let query = []
      // 流向图
      if (this.myChart.name === 'ResumeDashboardFlow') {
        query.push(...this.getFlowQuery())
        // 漏斗图
      } else if (this.myChart.name === 'ResumeDashboardProcess') {
        query.push(...this.getProcessQuery())
        // 饼状图
      } else {
        query.push([
          { Key: 'HighestEducation', Value: this.myClickedChart.name, Oper: 'eq' }
        ])
      }
      condition.query = JSON.stringify(query)
      condition.where = '' // 这里赋空值，由条件自动生成
      return condition
    },
    onInitAndPull () {
      // 滚动组件获取简历数据
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      this.$refs.infiniteScroll.trigger()
    },
    onInitQueryModel () {
      if (_.isEmpty(this.chart)) {
        let model = this.$q.sessionStorage.getItem('resumeDashboardDetailProps')
        if (!_.isEmpty(model)) {
          this.myChart = model.chart
          this.myClickedChart = model.clickedChart
          this.queryModel = model.chart.model
        }
      } else {
        this.queryModel = this.getFrontCondition(this.myChart.model)
        this.myChart.model = this.queryModel
        let model = {
          chart: this.myChart,
          clickedChart: this.myClickedChart
        }
        this.$q.sessionStorage.set('resumeDashboardDetailProps', model)
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initBreadcrumb()
      }
    },
    queryModel: {
      deep: true,
      immediate: false,
      handler (newVal, oldVal) {
        // 更新session中的数据
        this.myChart.model = newVal
        let model = {
          chart: this.myChart,
          clickedChart: this.myClickedChart
        }
        this.$q.sessionStorage.set('resumeDashboardDetailProps', model)
        // 重置页码
        this.resetDashboardStatePage()
        if (!_.isEmpty(oldVal) && JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          this.views[this.title] = []
        }
        this.onInitAndPull()
      }
    }
  },
  created () {
    this.resetDashboardStatePage()
    this.onInitQueryModel()
    if (this.$q.platform.is.desktop) {
      this.setListStyle('showtable')
    }
  },
  mounted () {
    this.onInitAndPull()
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    ResumeDashboardCard: () => import('components/recruitment/dashboard/ResumeDashboardCard'),
    ResumeDashboardCondition: () => import('components/recruitment/dashboard/ResumeDashboardCondition'),
    ResumeDashboardDetailTable: () => import('components/recruitment/dashboard/ResumeDashboardDetailTable')
  }
}

</script>

<style lang='scss' scoped>
</style>
