<!--
@Name：项目仪表盘图表点击详情页
@Author：陆欢
@date：2021/09/18
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pb-xl"
  >
    <tw-header-card :title="title" />
    <q-card-section :class="$q.screen.gt.xs?'q-px-xl q-pt-none':'q-px-md'">
      <!-- 初始化未更新，正在加载中 -->
      <div
        class="row justify-center q-py-md"
        v-if="modelList === null"
      >
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
      <!-- 卡片列表length===0时展示没有数据 -->
      <tw-banner-no-result
        class="q-mb-md"
        :info="`总共有数据【${myClickedChart.data.value||myClickedChart.data}】条，其中权限范围内可查看详细信息【${myAuthTotal}】条，无权限查看【${(myClickedChart.data.value||myClickedChart.data)-myAuthTotal}】条`"
      />
      <!-- 初始化更新后，卡片列表length>0 -->
      <q-infinite-scroll
        @load="onLoadData"
        :offset="250"
        class="q-mb-lg row q-gutter-y-md"
        ref="infiniteScroll"
      >
        <Project-table
          :modelList="modelList"
          @sortButtonClick="sortButtonClick"
        ></Project-table>
        <template
          v-slot:loading
          v-if="modelList.length > 0 && showLoading"
        >
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { date } from 'quasar'
export default {
  name: 'ProjectDashBoardDetail',
  props: {
    chart: {
      type: Object,
      required: false,
      default () {
        return {}
      },
      description: '图形chart数据'
    },
    clickedChart: {
      type: Object,
      required: false,
      default () {
        return {}
      },
      description: '点击的仪表盘数据'
    }
  },
  data () {
    return {
      myAuthTotal: 0,
      myChart: {},
      myClickedChart: {}
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapState('project', ['page', 'sort', 'order']),
    ...mapGetters('project', ['getAllList']),
    title () {
      const startDate = date.formatDate(date.addToDate(new Date(Date.parse(this.myClickedChart.name.replace(/-/g, '/'))), { days: -7 }), 'YYYY-MM-DD')
      if (startDate) {
        return this.myChart.title + '：' + startDate + ' - ' + this.myClickedChart.name
      } else {
        return this.myChart.title + '：' + this.myClickedChart.name
      }
    },
    modelList () {
      let list = this.getAllList(this.$route.name)
      let page = this.page
      if (list.length !== page.offset) {
        this.updatePage(Object.assign(page, { offset: list.length }))
      }
      return list
    },
    showLoading () {
      const pagePayload = this.page
      return !(pagePayload['nextPageToken'] === -1)
    }
  },
  methods: {
    ...mapMutations('project', ['emptyProjects', 'updatePage']),
    ...mapActions('project', ['loadDetailProjectDashboardData']),
    onLoadData (index, done) {
      this.getPageData(() => {
        setTimeout(() => {
          if (!this.showLoading) {
            done(true)
          } else {
            done()
          }
        }, 1000)
      })
    },
    getPageData (callBack) {
      const startDate = this.myClickedChart.data.startDate || date.formatDate(date.addToDate(new Date(Date.parse(this.myClickedChart.name.replace(/-/g, '/'))), { days: -7 }), 'YYYY-MM-DD')
      let that = this
      let order = 'ProjectID Desc'
      if (this.sort !== 'myFocus') {
        order = `${this.sort} ${this.order}`
      }
      this.loadDetailProjectDashboardData({ chart: this.myChart, startDate, endDate: this.myClickedChart.data.endDate || this.myClickedChart.name, status: this.myClickedChart.status, order })
        .then(res => {
          that.myAuthTotal += res
          callBack && callBack()
        })
    },
    sortButtonClick () {
      this.init()
      this.$refs.infiniteScroll && this.$refs.infiniteScroll.poll()
    },
    init () {
      this.emptyProjects()
      this.updatePage(
        {
          offset: 0,
          limit: 20,
          nextPageToken: 0
        }
      )
      if (_.isEmpty(this.chart)) {
        let model = this.$q.sessionStorage.getItem('projectDashboardDetailProps')
        if (!_.isEmpty(model)) {
          this.myChart = model.chart
          this.myClickedChart = model.clickedChart
        }
      } else {
        let model = {
          chart: this.chart,
          clickedChart: this.clickedChart
        }
        this.$q.sessionStorage.set('projectDashboardDetailProps', model)
        this.myChart = this.chart
        this.myClickedChart = this.clickedChart
      }
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    ProjectTable: () => import('components/resource-table/ProjectTable')
  }
}
</script>

<style scoped>
</style>
