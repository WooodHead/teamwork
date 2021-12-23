<template>
  <resource-layout
    category="recruitPlan"
    :objectID="+id"
  >
    <template #menu>
      <tw-menu
        :menus="canOp ? menuList : '[]'"
        @edit="recruitPlanEdit"
        @delete="recruitPlanDelete"
        @archive="recruitPlanArchive"
        @recruitPlanStart="recruitPlanItem('Start')"
        @recruitPlanDone="showCloseDialog = true"
      />
    </template>

    <template #titleBadge>
      <q-badge
        align="top"
        :color="model.closed >= 0 ? closedStatus[model.closed].color : ''"
      >
        {{ model.closed >= 0 ? closedStatus[model.closed].label : "" }}
      </q-badge>
    </template>
    <template #subtitle>
      <div class="q-gutter-sm">
        <q-badge
          outline
          align="middle"
          color="secondary"
        >
          {{ model.startDate }} -- {{ model.endDate }}({{
            $t("date.totalDays", { totalDays: totalDays })
          }})
        </q-badge>
      </div>
    </template>
    <template slot="prepend">
      <!--招聘岗位和招聘人数操作-->
      <q-card-section class="q-px-xl q-pt-none">
        <div
          class="text-center q-pb-md"
          v-if="model.closed !== 2 && canOp"
        >
          <q-btn
            unelevated
            color="secondary"
            icon-right="add"
            label="招聘需求信息"
            @click="openPanel(0)"
          >
          </q-btn>
        </div>
        <!-- 招聘计划需求信息表格 -->
        <div :class="$q.screen.gt.sm ? 'q-px-xl' : ''">
          <recruit-plan-need-table
            :id="id"
            :closed="model.closed"
            :jobLists="jobLists"
            @openPanel="openPanel"
          />
        </div>
      </q-card-section>
      <q-dialog v-model="showPanel">
        <recruit-plan-need-form
          @changeStatu="changeStatu"
          :needID="needID"
          :id="id"
        />
      </q-dialog>
      <q-dialog v-model="showCloseDialog">
        <recruit-plan-dialog-close @confirm="recruitPlanItem('Done')" />
      </q-dialog>
    </template>
  </resource-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import htmlToText from '@/utils/html-to-text'
import { date, LocalStorage } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage } from '@/utils/show-message'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
export default {
  name: 'RecruitPlanDetail',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      menuList: [], // 菜单按钮
      jobLists: [], // 避免再次请求后台，先存入缓存中
      model: {},
      showPanel: false,
      showCloseDialog: false,
      needID: '' // 招聘计划需求id
    }
  },
  computed: {
    ...mapState('recruitPlan', ['closedStatus']),
    totalDays () {
      let unit = 'days'
      return date.getDateDiff(this.model.endDate, this.model.startDate, unit)
    },
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      )
    }
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout'),
    TwMenu: () => import('components/base/TwMenu'),
    RecruitPlanDialogClose: () =>
      import('components/recruitment/recruit-plan/RecruitPlanDialogClose'),
    RecruitPlanNeedForm: () =>
      import('components/recruitment/recruit-plan/RecruitPlanNeedForm'),
    RecruitPlanNeedTable: () =>
      import('components/recruitment/recruit-plan/RecruitPlanNeedTable')
  },
  methods: {
    htmlToText,
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs'
    ]),
    ...mapActions('job', ['loadJobs', 'loadJob']),
    ...mapActions('recruitPlan', [
      'loadRecruitPlan',
      'deleteRecruitPlan',
      'closeRecruitPlan',
      'startRecruitPlan',
      'archiveRecruitPlan'
    ]),
    // 打开招聘岗位和招聘人数面板
    openPanel (val) {
      this.needID = val
      // 打开招聘计划需求表单
      this.showPanel = true
    },
    changeStatu () {
      this.showPanel = false
    },
    // 打开编辑页
    recruitPlanEdit () {
      this.$router.push({
        name: 'recruitPlanEdit',
        params: {
          id: this.id
        }
      })
    },
    // 归档招聘计划
    recruitPlanArchive () {
      let that = this
      that.archiveRecruitPlan(that.model.id).then(res => {
        if (res) {
          that.model = res
          that.initBreadcrumb()
        }
      })
    },
    // 删除
    recruitPlanDelete () {
      showConfirm('确认要删除该招聘计划？', () => {
        this.deleteRecruitPlan(this.id).then(res => {
          if (res) {
            showSuccessMessage('删除成功')
          }
        })
      })
    },
    recruitPlanItem (value) {
      // 计划开始处理
      if (value === 'Start') {
        this.model.startDate = formatDate(new Date(), format)
        this.model.closed = 1
        this.startRecruitPlan(this.model.id)
        this.menuList = ['recruitPlanDone']
      } else {
        // 招聘计划结束
        this.model.endDate = formatDate(new Date(), format)
        this.model.closed = 2
        this.closeRecruitPlan(this.model.id)
        this.menuList = ['archive', 'delete']
      }
    },
    init () {
      let that = this
      that.loadRecruitPlan(+that.id).then(res => {
        // 页面数据
        that.model = res
        that.initBreadcrumb()
        this.menuList = ['archive', 'delete']
      })
    },
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
      this.pushWidgetBreadcrumb({
        id: `recruitPlan`,
        title: this.$t('recruitPlan.title'),
        to: {
          name: 'recruitPlan'
        }
      })
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.init()
      }
    }
  },
  mounted () {
    this.init()
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
      _.forEach(this.model.detail, i => {
        _.forEach(res, jobID => {
          if (i.id === jobID.id) {
            i.jobName = jobID.title
          }
        })
      })
    })
    // 初始化招聘计划
    this.loadRecruitPlan(this.id).then(res => {
      this.model = res
      // 初始化菜单按钮
      if (res.closed === 0) {
        this.menuList = ['edit', 'delete', 'recruitPlanStart']
      } else if (res.closed === 1) {
        this.menuList = ['recruitPlanDone']
      } else if (res.closed === 2) {
        this.menuList = ['archive', 'delete']
      }
      this.loadJobs({
        query: [
          { Key: 'IsPublish', Value: 1, Oper: 'eq' },
          'and',
          { Key: 'Archived', Value: 0, Oper: 'eq' }
        ],
        byPage: false
      }).then(jobs => {
        _.forEach(jobs, jobTitle => {
          for (let i = 0; i < res.detail.length; i++) {
            if (res.detail[i].id === jobTitle.id) {
              this.model.detail[i].jobName = jobTitle.title
            }
          }
        })
      })
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
