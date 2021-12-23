<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <q-card
      v-show="!inDetail"
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <tw-header-card
        :title="$t('assess.title')"
        :actions="actions"
        :add="{
          label: $t('assess.addAssess'),
          click: addAssess
        }"
      >
      </tw-header-card>
      <q-infinite-scroll
        :disable="noData"
        @load="loadCurrentAssess"
        :offset="250"
        ref="infiniteScroll"
      >
        <!-- 加载中loading -->
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
        <q-card-section class="q-px-xxl full-width">
          <!-- 归档列表提示 -->
          <q-banner
            v-if="isArchivedList"
            rounded
            dense
            class="bg-grey-3 text-body1 full-width q-mb-lg"
          >
            <template v-slot:avatar>
              <q-icon
                name="warning"
                color="warning"
              />
            </template>
            {{$t('assess.archivedAssessInfo')}}
          </q-banner>
          <!-- 商机评估列表 -->
          <assess-list
            v-if="assessList.length"
            :category="category"
            :objectID="objectID"
            :assessList="assessList"
          ></assess-list>
          <div
            v-if="assessList.length==0"
            style="width:300px"
            class="text-h6 text-grey-5 q-mx-auto q-mt-md"
          >
            {{$t("assess.noAssessTips_1")}}
            <ul class="text-subtitle1">
              <li>{{$t("assess.noAssessTips_2")}}</li>
            </ul>
          </div>
          <!-- 归档提示 -->
          <tw-archived-count
            v-if="!isArchivedList&&archivedCount"
            :label="$t('archive.someArchived',{count:archivedCount,something:$t('assess.title')})"
            @click="switchArchiveAssess"
          ></tw-archived-count>
        </q-card-section>
      </q-infinite-scroll>
    </q-card>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: true
    }
  },
  data () {
    return {
      inDetail: false,
      actions: ['add'],
      noData: true,
      listType: 'assess'
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    ...mapState('assess', ['search', 'archivedCount', 'isArchivedList']),
    ...mapGetters('assess', ['archivedCount']),
    assessList () {
      return this.$store.getters['assess/assessFiltered']({ category: this.category, objectID: this.objectID }) || []
    },
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: this.category === 'opportunity' ? 'OpportunityID' : 'ManufacturerID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: this.isArchivedList ? 1 : 0, Oper: 'eq' }
      ]
      return queryCondition
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        // 是否非列表页
        this.inDetail = !['myAssess', 'assess', 'myArchivedAssess', 'archivedAssess'].includes(newVal.name)
        // 列表数据更新
        this.init()
        if (this.$q.platform.is.mobile) return
        if (!newVal.path.includes('assess')) return
        // 初始化面包屑
        this.initBreadcrumb(newVal)
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapActions('assess', ['loadAssess', 'loadAssessByOpportunityID', 'loadAllAssess', 'resetAssess', 'updateAssess', 'loadArchivedCount']),
    ...mapMutations('assess', ['setCategory', 'setObjectID', 'setListType', 'setSearch']),

    /** 商机评估列表加载 */
    loadCurrentAssess (index, done) {
      this.loadAllAssess({
        query: this.queryCondition,
        byPage: true // 全部分页
      }).then((noData) => {
        this.noData = noData
        setTimeout(() => {
          if (this.$store.state.assess.page.nextPageToken === -1) {
            this.$store.state.assess.firstLoaded = true // 首次已加载
            done(true)
          } else {
            done()
          }
        }, 200)
      })
    },
    /** 切换归档列表 */
    switchArchiveAssess () {
      this.$router.push({
        name: 'archivedAssess',
        params: { category: this.category, objectID: this.objectID }
      })
      this.setListType(this.$router.currentRoute.name)
    },
    addAssess () {
      let that = this
      // 新建页面路由跳转
      that.$router.push({
        name: 'assessAdd',
        params: {
          openType: 'add',
          category: that.category,
          objectID: that.objectID,
          id: 0
        }
      })
    },
    // 初始化
    init () {
      this.setCategory(this.category)
      this.setObjectID(this.objectID)
      // 设置列表类别（列表、归档）
      this.listType = this.$router.currentRoute.name
      this.setListType(this.$router.currentRoute.name)
      // 列表重置
      this.resetList()
    },
    /** 重置商机评估列表 */
    resetList () {
      this.resetAssess() // 重设分页
      this.noData = false
      this.$refs.infiniteScroll && this.$refs.infiniteScroll.poll()
      this.$store.state.assess.firstLoaded = false // 重新首次加载
      // 获取归档数量
      this.loadArchivedCount()
    },
    // 面包屑处理
    async initBreadcrumb (route) {
      // 商机评估主页面包屑
      this.clearWidgetBreadcrumbs()
      this.setModuleBreadcrumbs()
      new RegExp(/.+assess\/.+/).test(route.path) &&
        this.pushWidgetBreadcrumb({
          id: `${this.category}${this.objectID}AssessIndex`,
          title: '评估',
          to: {
            name: this.$myinfo.auth.role.isOutsource ? 'myAssess' : 'assess',
            params: { category: this.category, objectID: +this.objectID }
          }
        })
      let assess = null
      let id = 0
      if (this.$route.name === 'assess' || this.$route.name === 'myAssess') {
        id = this.$route.params.objectID
        assess = await this.loadAssessByOpportunityID(id)
      } else if (['assessDetail', 'assessEdit', 'myAssessDetail', 'myAssessEdit'].includes(this.$route.name)) {
        id = this.$route.params.id
        assess = await this.loadAssess(id)
      }
      if (assess === null) {
        return
      }
      // 商机评估归档箱面包屑
      assess.archived
        ? this.pushWidgetBreadcrumb({
          id: 'archivedAssess',
          title: '归档箱',
          to: {
            name: this.$myinfo.auth.role.isOutsource ? 'myArchivedAssess' : 'archivedAssess',
            params: { category: this.category, objectID: +this.objectID }
          }
        })
        : this.deleteWidgetBreadcrumb('archivedAssess')

      // 当商机评估edit,delete，加入商机评估详情面包屑
      const name = _.last(route.path.split('/'))
      if (['edit'].includes(name)) {
        this.pushWidgetBreadcrumb({
          id: 'assess' + assess.id,
          title: assess.title,
          to: {
            name: this.$myinfo.auth.role.isOutsource ? 'myAssessDetail' : 'assessDetail',
            params: { category: this.category, objectID: +this.objectID, id: assess.id }
          }
        })
      } else {
        this.deleteWidgetBreadcrumb('assess' + assess.id)
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    AssessList: () => import('components/assess/AssessList'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwArchivedCount: () => import('components/base/TwArchivedCount')
  }
}
</script>

<style lang="scss" scoped>
</style>
