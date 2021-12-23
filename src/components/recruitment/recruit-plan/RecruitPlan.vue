<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pb-md"
  >
    <!-- 标题菜单 -->
    <div v-if="this.$route.path === '/recruit-plan'">
      <tw-header-card
        :title="$t('recruitPlan.title')"
        :actions="actions"
        :add="{
          label: $t('recruitPlan.addRecruitPlan'),
          click: addRecruitPlan
        }"
      >
        <template #menu>
          <resource-list-style category="recruitPlan" />
        </template>
        <template
          v-slot:right
          v-if="$q.screen.gt.sm"
        >
          <div
            class="q-col-gutter-md q-pl-sm"
            style="width:120px;"
          />
        </template>
      </tw-header-card>
    </div>
    <div v-else-if="this.$route.path === '/recruit-plan/archived'">
      <tw-header-card
        :title="archiveCount + '个' + $t('recruitPlan.archive')"
        :actions="[]"
      >
      </tw-header-card>
    </div>

    <div :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'">
      <!-- 归档列表提示 -->
      <q-banner
        v-if="isShow"
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
        {{ $t("recruitPlan.archiveRecruitPlansInfo") }}
      </q-banner>
    </div>
    <q-card-section
      class="tw-resume-header bg-white"
      :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'"
    >
      <!-- 搜索组件 -->
      <tw-search-panel
        :search.sync="search"
        :showPanelBtn="false"
      />
    </q-card-section>
    <!-- 列表 -->
    <q-infinite-scroll
      @load="loadData"
      :offset="250"
      class="flex q-gutter-y-md"
      :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'"
      :disable="noData"
      ref="infiniteScroll"
    >
      <!--卡片-->
      <template v-if="listStyle === 'showcards'">
        <recruit-plan-card
          v-for="plan in recruitPlans"
          :key="plan.id"
          :model="plan"
        />
      </template>
      <!--表格-->
      <template v-else-if="listStyle === 'showtable'">
        <recruit-plan-table :modelList="recruitPlans" />
      </template>
      <!--列表-->
      <template v-else>
        <recruit-plan-list :modelList="recruitPlans" />
      </template>
      <!-- 加载中logo -->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
      <!-- 初始化更新后，卡片列表length===0 -->
      <template v-if="!isArchivedList && noData && recruitPlans.length === 0">
        <tw-banner-no-result />
      </template>
    </q-infinite-scroll>
    <!-- 归档提示 -->
    <tw-archived-count
      v-if="!isArchivedList && archiveCount && routernName === 'recruitPlan'"
      :label="$t('archive.someArchived',{count:archivedCount,something:$t('recruitPlan.title')})"
      @click="switchArchiveRecruitPlans"
      class="q-pb-none"
    ></tw-archived-count>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'RecruitPlan',
  data () {
    return {
      noData: true,
      routernName: '', // 监听路由变化
      isShow: false
    }
  },
  mounted () {
    this.initBreadcrumb(this.$router.currentRoute)
    this.loadArchivedCount()
    this.resetState()
  },
  computed: {
    ...mapState('recruitPlan', [
      'listStyle',
      'isArchivedList',
      'archiveCount',
      'search'
    ]),
    ...mapGetters('recruitPlan', ['recruitPlans']),
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: 'Archived', Value: this.isArchivedList ? 1 : 0, Oper: 'eq' }
      ]
      return queryCondition
    },
    // 搜索框搜索条件
    search: {
      get () {
        return this.$store.getters['recruitPlan/search']
      },
      set (val) {
        val
          ? this.$store.commit('recruitPlan/setSearch', val)
          : this.$store.commit('recruitPlan/setSearch', '')
      }
    },
    // HR、系统管理员具有操作权限
    actions () {
      let op =
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      if (op) {
        return ['add', 'other', 'menu']
      } else {
        return ['other', 'menu']
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.routernName = newVal.name
        if (newVal.name === 'recruitPlan') {
          this.isShow = false
          this.loadRecruitPlans({
            query: [{ Key: 'Archived', Value: 0, Oper: 'eq' }]
          }).then(res => {
            this.updateRecruitPlans(res)
          })
        }
        if (newVal.name === 'ArchiveRecruitPlans') {
          this.isShow = true
          this.loadRecruitPlans({
            query: [{ Key: 'Archived', Value: 1, Oper: 'eq' }]
          }).then(res => {
            this.updateRecruitPlans(res)
          })
        }
        this.initBreadcrumb()
      }
    }
  },
  methods: {
    ...mapActions('recruitPlan', ['loadRecruitPlans', 'loadArchivedCount']),
    ...mapMutations('recruitPlan', [
      'setPage',
      'emptyRecruitPlans',
      'updateRecruitPlans'
    ]),
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs'
    ]),
    // 分页处理
    resetState () {
      this.emptyRecruitPlans()
      this.setPage({
        offset: 0,
        limit: 20,
        total: 0
      })
    },
    // 跳转至新增招聘计划页面
    addRecruitPlan () {
      this.$router.push({
        name: 'recruitPlanAdd',
        params: {
          openType: 'add'
        }
      })
    },
    // 切换归档列表
    switchArchiveRecruitPlans () {
      this.$router
        .push({
          name: 'ArchiveRecruitPlans'
        })
        .catch(e => { })
    },
    // 加载列表数据
    loadData (index, done) {
      this.loadRecruitPlans({
        query: this.queryCondition,
        byPage: this.isArchivedList, // 仅归档列表分页，草稿、发布列表暂不分页
        returnData: false
      }).then(noData => {
        this.noData = noData
        done()
      })
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
      if (this.routernName === 'ArchiveRecruitPlans') {
        this.pushWidgetBreadcrumb({
          id: `recruitPlan`,
          title: this.$t('recruitPlan.title'),
          to: {
            name: 'recruitPlan'
          }
        })
      }
    }
  },
  components: {
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    RecruitPlanCard: () =>
      import('components/recruitment/recruit-plan/RecruitPlanCard'),
    RecruitPlanList: () =>
      import('components/recruitment/recruit-plan/RecruitPlanList'),
    RecruitPlanTable: () =>
      import('components/recruitment/recruit-plan/RecruitPlanTable'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  }
}
</script>
