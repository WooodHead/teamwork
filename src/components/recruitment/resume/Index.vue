<template>
  <q-card
    v-if="showPage"
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pb-xl"
  >
    <div>
      <!-- 友情提示 -->
      <q-banner
        v-if="!noResumeInfo"
        dense
        class="bg-grey-4 text-primary"
      >
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        <span class="text-bold">为保证求职者及时了解应聘进度，其简历状态一旦发现变化，系统会自动通过邮件、短信等方式通知，请您谨慎操作！</span>
        <template v-slot:action>
          <q-btn
            flat
            class="text-bold"
            label="不再提示"
            @click="noMoreResumeInfo"
          />
        </template>
      </q-banner>
      <!-- header -->
      <resume-header-card />
      <q-card-section
        class="tw-resume-header bg-white"
        :class="$q.screen.gt.xs?'q-px-xl':'q-px-md'"
      >
        <!-- 状态栏 -->
        <resume-status-bar @statusChanged="onStatusChanged(arguments)" />
        <!-- 搜索组件 -->
        <tw-search-panel
          :queryList="queryList"
          :search.sync="search"
          :query.sync="query"
        />
      </q-card-section>
      <!-- 列表 -->
      <q-infinite-scroll
        @load="onLoad"
        :offset="250"
        class="tw-resume-list-container"
        :class="$q.screen.gt.xs?'q-px-xl':'q-px-md'"
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
        <!-- 无数据提示 -->
        <template v-if="resumeViews.length===0">
          <tw-banner-no-result />
        </template>
        <!-- 卡片列表 -->
        <template v-else>
          <div class="flex q-gutter-y-md">
            <resume-card
              v-for="view in resumeViews"
              :key="view.resumeDeliveryID"
              :resumeDeliveryID="view.resumeDeliveryID"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'ResumeIndex',
  provide () {
    return {
      refreshResumeList: this.onInitAndPull
    }
  },
  data () {
    return {
      // 用于切换登录账户后强制刷新页面
      showPage: false,
      noResumeInfo: LocalStorage.getItem('noResumeInfo')
    }
  },
  computed: {
    ...mapState('resume', ['selectedStatus', 'selectedResumeDeliveryIDs', 'psonID']),
    ...mapGetters('resume', ['resumeViews', 'myinfo', 'isInterviewer', 'isHrOrAdmin', 'queryList', 'resumeViewQuerys']),
    samePerson () {
      return this.psonID === this.$q.localStorage.getItem('myself').id
    },
    // 搜索框搜索条件
    search: {
      get () {
        return this.$store.getters['resume/search']
      },
      set (val) {
        val
          ? this.$store.commit('resume/setSearch', val)
          : this.$store.commit('resume/setSearch', '')
      }
    },
    // 多条件筛选
    query: {
      get () {
        return this.$store.getters['resume/query']
      },
      set (val) {
        val
          ? this.$store.commit('resume/setQuery', val)
          : this.$store.commit('resume/setQuery', '')
      }
    }
  },
  created () {
    if (!this.samePerson) {
      window.location.reload()
    } else {
      this.showPage = true
    }
  },
  mounted () {
    this.initBreadcrumb()
    // 获取简历筛选列表应聘地点
    this.getResumeFilterCitys()
    // 初始化页面数据
    this.onInitAndPull()
    // 获取推荐码
    this.loadRecommendCodes({})
  },
  methods: {
    ...mapActions('resume', ['loadResumeViewsByPage', 'loadStatusCount', 'initStatePage', 'getResumeFilterCitys']),
    ...mapMutations('resume', ['setSelectedStatus']),
    ...mapActions('recommendCode', ['loadRecommendCodes']),
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'clearBreadcrumbs', 'deleteWidgetBreadcrumb']),
    // 加载列表数据
    onLoad (index, done) {
      Object.assign(this.resumeViewQuerys, { byPage: true })
      this.loadResumeViewsByPage(this.resumeViewQuerys)
        .then(res => {
          if (_.isEmpty(res)) {
            done(true)
          } else {
            if (this.$store.state.resume.page.nextPageToken === -1) {
              done(true)
            } else {
              done()
            }
          }
        })
    },
    onInitAndPull () {
      // 重置分页信息
      this.initStatePage()
      // 获取各状态简历数量
      this.loadStatusCount()
      // 滚动组件获取简历数据
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      this.$refs.infiniteScroll.trigger()
    },
    // 状态变更
    onStatusChanged (params) {
      this.setSelectedStatus(params[0])
      this.onInitAndPull()
    },
    // 面包屑处理
    initBreadcrumb (route) {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
    },
    noMoreResumeInfo () {
      this.noResumeInfo = true
      LocalStorage.set('noResumeInfo', true)
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        // 面包屑设置
        this.initBreadcrumb()
      }
    },
    // 此getter属性处理query和search参数
    // 触发时重新获取页面数据
    resumeViewQuerys: {
      immediate: false,
      deep: true,
      handler (newVal, oldVal) {
        this.onInitAndPull()
      }
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    ResumeCard: () => import('components/recruitment/resume/ResumeCard'),
    ResumeStatusBar: () => import('components/recruitment/resume/ResumeStatusBar'),
    ResumeHeaderCard: () => import('components/recruitment/resume/ResumeHeaderCard')
  }
}
</script>

<style lang='scss' scoped>
</style>
