<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题菜单 -->
    <tw-header-card
      :title="isArchivedList?archiveCount+'个已归档的岗位':$t('job.module')"
      :actions="actions"
      :add="{
          label: $t('job.addJob'),
          click: addJob
        }"
    >
      <template #menu>
        <resource-list-style category="job" />
      </template>
      <template v-slot:right>
        <div class="q-col-gutter-md q-pl-sm">
          <tw-select-edit
            class="col-auto"
            :style="!$q.screen.lt.sm?'':'max-width:190px;'"
            addAllOption
            rounded
            outlined
            dense
            module="job"
            field="category"
            :value="category"
            @input="filterByCategory"
          />
        </div>
      </template>
    </tw-header-card>

    <q-card-section :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'">
      <!-- 搜索组件 -->
      <tw-search-panel
        :search.sync="searchValue"
        :showPanelBtn="false"
      />
    </q-card-section>
    <div class="q-px-xl">
      <!-- 草稿提示 -->
      <div
        class="row justify-center"
        v-if="!isDraftList&&!isArchivedList&&draftCount>0"
      >
        <q-btn
          flat
          :label="$t('job.draftCountNotes',{number:draftCount})"
          color="primary"
          icon="insert_drive_file"
          @click="switchDraftJobs"
        />
      </div>
      <!-- 草稿或归档列表提示 -->
      <q-banner
        v-if="isDraftList||isArchivedList"
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
        {{isDraftList?$t('job.draftJobsInfo'):$t('job.archiveJobsInfo')}}
      </q-banner>
    </div>
    <!-- 列表 -->
    <q-infinite-scroll
      @load="loadData"
      :offset="250"
      class="q-mb-lg flex q-gutter-y-md"
      :class="$q.screen.gt.xs?'q-px-xl':'q-px-md'"
      style="overflow: auto;"
      :disable="noData"
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
      <template v-if="listStyle==='showcards'">
        <job-card
          v-for="job in jobs"
          :key="job.id"
          :model="job"
        />
      </template>
      <template v-else-if="listStyle==='showtable'">
        <job-table :modelList="jobs" />
      </template>
      <template v-else>
        <job-list :modelList="jobs" />
      </template>
      <!-- 初始化更新后，卡片列表length===0 -->
      <template v-if="!isDraftList&&!isArchivedList&&noData&&jobs.length==0">
        <tw-banner-no-result />
      </template>
    </q-infinite-scroll>
    <!-- 归档提示 -->
    <tw-archived-count
      v-if="!isDraftList&&!isArchivedList&&archiveCount>0"
      :label="$t('archive.someArchived',{count:archivedCount,something:$t('job.title')})"
      @click="switchArchiveJobs"
    ></tw-archived-count>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'TwJob',
  data () {
    return {
      noData: true,
      listType: 'job'
    }
  },
  mounted () {
    this.init()
    this.initBreadcrumb(this.$router.currentRoute)
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'pushWidgetBreadcrumb', 'clearBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('job', ['loadJobs', 'resetJobs', 'loadJobsCount', 'loadDraftCount', 'loadArchivedCount']),
    ...mapMutations('job', ['setListType', 'setCategory', 'setSearch']),
    // 新增岗位
    addJob () {
      // 新建页面路由跳转
      this.$router.push({
        name: 'jobAdd',
        params: {
          openType: 'add'
        }
      })
    },
    /** 重置列表 */
    resetList () {
      this.resetJobs()
      this.noData = false
      this.$refs.infiniteScroll.poll()
      // 获取草稿数量
      this.loadDraftCount()
      // 获取归档数量
      this.loadArchivedCount()
    },
    // 切换草稿列表
    switchDraftJobs () {
      this.$router.push({
        name: 'draftJobs'
      })
    },
    // 切换归档列表
    switchArchiveJobs () {
      this.$router.push({
        name: 'archivedJobs'
      })
    },
    // 加载列表数据
    loadData (index, done) {
      this.loadJobs({
        query: this.queryCondition,
        byPage: this.isArchivedList, // 仅归档列表分页，草稿、发布列表暂不分页
        returnData: false
      }).then((noData) => {
        this.noData = noData
        done()
      })
    },
    /** 类别筛选 */
    filterByCategory (categoryDict) {
      this.setCategory(categoryDict.dictValue === '所有' ? '' : `${categoryDict.dictValue}`)
      this.resetList()
    },
    // 初始化
    init () {
      // 设置列表类别（草稿、归档、发布）
      this.listType = this.$router.currentRoute.name
      this.setListType(this.$router.currentRoute.name)
      // 列表重置
      this.resetList()
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
      route.name === 'job' || this.pushWidgetBreadcrumb({
        id: `jobList`,
        title: this.$t('job.module'),
        to: {
          name: 'job'
        }
      })
    }
  },
  computed: {
    ...mapState('job', ['category', 'draftCount', 'archiveCount', 'isDraftList', 'isArchivedList', 'listStyle', 'search']),
    ...mapGetters('job', ['jobs']),
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: 'IsPublish', Value: this.isDraftList ? 0 : 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: this.isArchivedList ? 1 : 0, Oper: 'eq' }
      ]
      if (this.isDraftList && LocalStorage.getItem('myself')) {
        queryCondition.push('and')
        queryCondition.push({ Key: 'CreateByID', Value: LocalStorage.getItem('myself').id, Oper: 'eq' })
      }
      return queryCondition
    },
    // HR、系统管理员具有操作权限
    actions () {
      let op = _.find(LocalStorage.getItem('myself').roles, { code: 'HRSpecialist' }) || _.find(LocalStorage.getItem('myself').roles, { code: 'SystemAdministrator' })
      if (op) {
        return ['add', 'other', 'menu']
      } else {
        return ['other', 'menu']
      }
    },
    // 搜索框搜索条件
    searchValue: {
      get () {
        return this.search
      },
      set (val) {
        this.setSearch(val)
        this.resetList()
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        let newRoute = newVal
        // 列表数据更新
        if (this.listType !== newRoute.name) {
          this.init()
        }
        // 面包屑设置
        this.initBreadcrumb(newRoute)
      }
    }
  },
  components: {
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    JobCard: () => import('components/recruitment/job/JobCard'),
    JobList: () => import('components/recruitment/job/JobList'),
    JobTable: () => import('components/recruitment/job/JobTable'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  }
}
</script>

<style>
</style>
