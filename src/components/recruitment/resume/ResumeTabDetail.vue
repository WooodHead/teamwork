<template>
  <q-card
    class="card-grow-in-page"
    :style="{'position:relative':!$q.screen.lt.sm}"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-none' : ''">
      <!-- 菜单 -->
      <tw-header-detail
        v-if="$q.screen.lt.sm"
        :title="'简历详情'"
        :noMenu="true"
      ></tw-header-detail>
      <!-- 选项卡 -->
      <q-tabs
        v-model="tab"
        dense
        active-color="white"
        active-bg-color="blue-7"
        indicator-color="blue-7"
        align="justify"
        content-class="my-tab"
        class="text-blue-9"
      >
        <q-tab
          name="resumeDetail"
          :label="$t('recruitment.resumeDetail')"
        />
        <q-tab
          name="resumeRecord"
          :label="$t('recruitment.resumeRecord')"
          :alert="hasRecordHistory"
          alert-icon="chat"
        >
        </q-tab>
      </q-tabs>
      <q-separator
        color="blue-7"
        size="2px"
      />
      <!-- 选项卡面板 -->
      <q-tab-panels v-model="tab">
        <q-tab-panel
          name="resumeDetail"
          class="q-pa-none"
        >
          <!-- 简历 -->
          <resume-detail :resumeDeliveryID="+resumeDeliveryID" />
        </q-tab-panel>
        <q-tab-panel
          name="resumeRecord"
          class="q-pa-none"
        >
          <!-- 应聘记录 -->
          <resume-history
            :id="+resumeView.resumeID"
            :key="resumeView.resumeID+'activity'+myKey"
          />
        </q-tab-panel>
      </q-tab-panels>
      <!-- 操作按钮 -->
      <resume-footer-detail
        data-html2canvas-ignore
        v-show="showFooter"
        :class="{'q-mb-sm':!$q.screen.lt.sm}"
        :resumeDeliveryID="resumeDeliveryID"
        @changeResumeDetail="updateDetailRoute(arguments)"
        @recordSuccess="recordSuccess"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ResumeTabDetail',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      tab: 'resumeDetail',
      myKey: 0
    }
  },
  computed: {
    ...mapGetters('resume', ['isInterviewer', 'isHrOrAdmin']),
    resumeView () {
      let resumeView = this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
      let history = []
      if (resumeView && resumeView.history) {
        let list = resumeView.history instanceof Array ? resumeView.history : JSON.parse(resumeView.history)
        for (let i = 0; i < list.length; i++) {
          if (list[i] instanceof Object) {
            history.push(list[i])
          } else {
            history.push(JSON.parse(list[i]))
          }
        }
      }
      resumeView.history = history
      return resumeView
    },
    selectedStatus () {
      return this.$store.state.resume.selectedStatus
    },
    showFooter () {
      let rightRole = false
      if (this.isHrOrAdmin) {
        rightRole = true
      } else if (this.isInterviewer) {
        rightRole = true
      } else {
        rightRole = false
      } return rightRole
    },
    hasRecordHistory () {
      return this.resumeView && _.findIndex(this.resumeView.history, { 'Action': 'AddInterviewRecord' }) !== -1 ? 'orange' : false
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'pushWidgetBreadcrumb', 'clearBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('resume', ['loadResume', 'loadResumeView', 'loadStatusCount', 'updateResumeInterviewerID']),
    ...mapMutations('resume', ['setSelectedStatus']),
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
        id: `resume`,
        title: this.$t('recruitment.modules.resumeManage'),
        to: {
          name: 'resume'
        }
      })
    },
    updateDetailRoute (params) {
      this.$router.push({
        name: 'resumeDetail',
        params: {
          resumeDeliveryID: params[0]
        }
      }).catch(err => { this.err = err })
      this.loadData(params[0])
    },
    loadData (resumeDeliveryID) {
      // 在这里统一获取数据
      if (_.isEmpty(this.resumeView) || this.resumeView.resumeDeliveryID !== resumeDeliveryID) {
        this.loadResumeView(resumeDeliveryID)
          .then(res => {
            this.setCurrentStatus()
            this.loadResume(+res.resumeID)
          })
      } else {
        this.setCurrentStatus()
        this.loadResume(this.resumeView.resumeID)
      }
      if (_.isEmpty(this.statusCount)) {
        this.loadStatusCount()
      }
    },
    setCurrentStatus () {
      let frontStatusKey = this.$store.getters['resume/getFrontStatusKey'](+this.resumeDeliveryID)
      this.setSelectedStatus(frontStatusKey || 'waitScreening')
    },
    recordSuccess () {
      this.myKey += 1
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initBreadcrumb()
        // 简历详情页-默认返回顶部
        if (newVal.name === 'resumeDetail') {
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }
      }
    }
  },
  components: {
    ResumeDetail: () => import('components/recruitment/resume/resume-detail/ResumeDetail'),
    ResumeFooterDetail: () => import('components/recruitment/resume/ResumeFooterDetail'),
    ResumeHistory: () => import('components/recruitment/resume/ResumeHistory'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  }
}
</script>

<style>
.my-tab .q-tab__label {
  font-size: 1rem !important;
  font-weight: 500 !important;
  line-height: 1.1rem !important;
  letter-spacing: 0.0125em !important;
}
</style>
