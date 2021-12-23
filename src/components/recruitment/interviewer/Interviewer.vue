<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pb-md"
  >
    <!-- 标题菜单 -->
    <tw-header-card
      :title="$t('interviewer.interviewerManage')"
      :actions="actions"
      :add="{
        label: $t('interviewer.addInterviewer'),
        click: addInterviewer
      }"
    >
      <template #menu>
        <tw-menu
          :menus="menuLists"
          @deleteAllInterviewers="deleteAllInterviewers()"
        />
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
      :offset="250"
      class="q-mb-lg row"
      :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'"
      :disable="noData"
      ref="infiniteScroll"
    >
      <!-- 加载中logo -->
      <div
        class="text-center"
        v-if="isLoading"
      >
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
      <!-- 无结果提示 -->
      <div v-if="!isLoading && interviewers.length == 0">
        <tw-banner-no-result />
      </div>
      <!--卡片-->
      <template v-if="listStyle === 'showcards'">
        <interviewer-card
          v-for="model in interviewers"
          :key="model.psonID"
          :jobLists="jobLists"
          :model="model"
        >
        </interviewer-card>
      </template>
    </q-infinite-scroll>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'interviewer',
  data () {
    return {
      noData: true,
      isLoading: false,
      jobLists: [],
      menuLists: ['deleteAllInterviewers']
    }
  },
  computed: {
    ...mapState('interviewer', ['listStyle', 'search']),
    ...mapGetters('interviewer', ['interviewers']),
    // 搜索框搜索条件
    search: {
      get () {
        return this.$store.getters['interviewer/search']
      },
      set (val) {
        val
          ? this.$store.commit('interviewer/setSearch', val)
          : this.$store.commit('interviewer/setSearch', '')
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
        return ['menu', 'add']
      } else {
        return []
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
    }
  },
  mounted () {
    this.isLoading = true
    // 初始化,获取面试官列表数据
    this.loadInterviewers({
      query: [{ Key: 'IsDelete', Value: 0, Oper: 'eq' }]
    }).then(res => {
      this.isLoading = false
    })
    // 获取岗位名称
    this.loadJobs({
      query: [
        { Key: 'IsPublish', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ],
      byPage: false
    }).then(res => {
      this.jobLists = res
    })
  },
  methods: {
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'clearBreadcrumbs'
    ]),
    ...mapActions('interviewer', [
      'loadInterviewers',
      'byIdDeleteInterviewer',
      'syncInterviewerRoleByPsonID'
    ]),
    ...mapActions('job', ['loadJobs']),
    // 跳转至添加表单
    addInterviewer () {
      this.$router.push({
        name: 'interviewerAdd'
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
    },
    // 删除全部面试官
    deleteAllInterviewers () {
      showConfirm('确认要删除全部面试官？', () => {
        let psonIDs = _.map(this.interviewers, 'psonID')
        _.forEach(psonIDs, psonID => {
          this.byIdDeleteInterviewer(psonID).then(res => {
            if (res) {
              // 删除成功后更新面试官角色成员
              this.syncInterviewerRoleByPsonID({
                psonId: +psonID,
                type: 'remove'
              })
            }
          })
        })
      })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    InterviewerCard: () =>
      import('components/recruitment/interviewer/InterviewerCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    TwMenu: () => import('components/base/TwMenu')
  }
}
</script>

<style lang="scss" scoped></style>
