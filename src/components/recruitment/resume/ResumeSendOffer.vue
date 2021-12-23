<!-- 单独邀约 -->
<template>
  <tw-form
    title="发放Offer"
    :primaryLabel="$t('action.submit')"
    :secondaryLabel="$t('action.cancel')"
    secondary
    @secondary="onReset"
    @primary="onSubmit"
  >
    <!-- 选择招聘计划 -->
    <div class="row">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        选择招聘计划：
      </div>
      <div class="col">
        <q-select
          :filled="$q.platform.is.mobile"
          emit-value
          map-options
          option-value="id"
          option-label="title"
          label="选择招聘计划"
          v-model="selectedPlanID"
          :options="planOptions"
          use-input
          @filter="planFilter"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                无结果
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <!-- 选择面试官 -->
    <div class="row">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        选择面试官：
      </div>
      <q-field
        class="col"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        label="选择面试官"
        stack-label
      >
        <resume-interviewer-avatar
          v-for="id in interviewerIDs"
          :key="id"
          :id="id"
          :removable="interviewerIDs.length > 1"
          @remove="onRemoveInterviewer"
        />
      </q-field>
    </div>
    <!-- 选择岗位 -->
    <div class="row">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        选择岗位：
      </div>
      <q-field
        class="col"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        label="选择岗位"
        stack-label
      >
        <q-chip
          v-for="job in jobs"
          :key="job"
          dense
          :removable="jobs.length>1"
          color="grey-3"
          text-color="grey-9"
          @remove="onRemoveJob(job)"
        >
          {{job}}
        </q-chip>
      </q-field>
    </div>
    <!-- 选择城市 -->
    <div class="row">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        选择城市：
      </div>
      <q-field
        class="col"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        label="选择城市"
        stack-label
      >
        <q-chip
          v-for="city in citys"
          :key="city"
          dense
          :removable="citys.length>1"
          color="grey-3"
          text-color="grey-9"
          @remove="onRemoveCity(city)"
        >
          {{city}}
        </q-chip>
      </q-field>
    </div>
    <!-- 发放人数 -->
    <div class="row">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        发放人数：
      </div>
      <q-input
        clearable
        class="col"
        type="number"
        :filled="$q.platform.is.mobile"
        :label="$q.platform.is.mobile? '发放人数': ''"
        :stack-label="$q.platform.is.mobile"
        v-model="model.Count"
        :rules="[val => val > 0 || (inviteResumes.length && val >= inviteResumes.length) || '请设置合理邀约人数']"
      />
    </div>
    <!-- 统计信息 -->
    <div
      class="row q-mt-none"
      v-show="inviteResumes.length"
    >
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        统计信息：
      </div>
      <q-field
        class="col"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        label="统计信息"
        stack-label
      >
        <resume-invite-statistics
          :views="inviteResumes"
          @remove="onRemoveCollege"
        />
      </q-field>
    </div>
    <!-- 发放人员 -->
    <div
      class="colunm"
      v-show="inviteResumes.length"
    >
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-start"
      >
        {{sendCount}}
      </div>
      <q-field
        class="col text-blue"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        :label="$q.platform.is.mobile? sendCount: ''"
        :stack-label="$q.platform.is.mobile"
      >
        <resume-interviewee-avatar
          v-for="resume in inviteResumes"
          :key="resume.resumeDeliveryID"
          :removable="inviteResumes.length>1"
          :resumeView="resume"
          @remove="onRemoveInterviewee"
        />
      </q-field>
    </div>
  </tw-form>
</template>

<script>
import { showSuccessMessage } from '@/utils/show-message'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ResumeSendOffer',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0,
      description: '简历投递ID'
    }
  },
  data () {
    return {
      endStatus: this.$store.state.resume.endStatus,
      model: {
        // 邀约表
        PlanID: 0,
        PlanTitle: '',
        JobID: 0, // 不传参
        JobTitle: '',
        Count: 40,
        CountPerHour: 5,
        ResumeDeliveryIDs: [],
        Detail: {},
        // 投递表
        Status: 20, // TODO 需要调整后台，接口不需要此参数
        InterviewRound: 1, // TODO 需要调整后台，接口不需要此参数
        // 模板参数
        InterviewPlace: '',
        InterviewExtra: '您投递的岗位需要现场笔试，请携带笔、绘图工具（彩色笔、电子画板均可）。'
      },
      // 待邀约列表数据
      allInviteResumes: [],
      allInterviewerIDs: [],
      allDeliveryIDs: [],
      allJobTitles: [],
      allCitys: [],
      allPlans: [],
      // 选中的招聘计划
      selectedPlanID: 0,
      filterdPlans: [],
      // 删除的集合
      removedInterviewerIDs: [],
      removedJobTitles: [],
      removedCitys: [],
      removedColleges: [],
      removedDeliveryIDs: []
    }
  },
  computed: {
    ...mapGetters('resume', ['resumeViewQuerys']),
    planOptions: {
      get () {
        return this.filterdPlans
      },
      set (val) {
        this.filterdPlans = val
      }
    },
    inviteResumes () {
      if (this.allInviteResumes.length && this.selectedPlanID !== 0) {
        return this.allInviteResumes.filter(r => {
          return r.planID === this.selectedPlanID &&
            !this.removedInterviewerIDs.includes(r.interviewerID) &&
            !this.removedDeliveryIDs.includes(r.resumeDeliveryID) &&
            !this.removedJobTitles.includes(r.jobTitle) &&
            !this.removedCitys.includes(r.city) &&
            _.intersection(this.removedColleges, r.educations.map(edu => edu.college)).length === 0
        })
      } else {
        return []
      }
    },
    interviewerIDs () {
      return _.uniq(this.inviteResumes.map(r => r.interviewerID))
    },
    jobs () {
      return _.uniq(this.inviteResumes.map(r => r.jobTitle))
    },
    citys () {
      return _.uniq(this.inviteResumes.map(r => r.city))
    },
    sendCount () {
      return '发放人员：' + (this.inviteResumes.length ? '（' + this.inviteResumes.length + '）人' : '')
    }
  },
  methods: {
    ...mapActions('resume', ['loadResumeView', 'loadResumeViews', 'loadResumeViewsByPage', 'loadResumeInvites', 'UpdateResumeStatus']),
    ...mapActions('recruitPlan', ['loadRecruitPlans']),
    ...mapActions('person', ['loadPerson']),
    ...mapMutations('resume', ['setSelectedStatus']),
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
      this.pushWidgetBreadcrumb({
        id: `resume`,
        title: this.$t('recruitment.modules.resumeManage'),
        to: {
          name: 'resume'
        }
      })
      this.setSelectedStatus('waitOffer')
    },
    loadAllData () {
      this.loadResumeViews({
        query: this.resumeViewQuerys.query,
        search: this.$store.state.resume.search
      }).then(res => {
        if (res.length) {
          this.getBasicInfo(res)
        } else {
          this.setSelectedStatus('waitOffer')
          this.$router.push({
            name: 'resume'
          })
        }
      })
    },
    loadPlans (query) {
      this.loadRecruitPlans({
        query: query
      }).then(res => {
        this.allPlans = res
        this.planOptions = res
        // 默认选中第一个招聘计划
        this.selectedPlanID = res[0].id
      })
    },
    planFilter (val, update, abort) {
      update(() => {
        this.filterdPlans = this.allPlans.filter(plan => plan.title.includes(val))
      })
    },
    loadInvites (plans) {
      this.loadResumeInvites({
        query: [
          { Key: 'PlanID', Value: plans.map(p => p.id).join(), Oper: 'in' }
        ]
      }).then(res => {
        this.getArrangedCount(res)
      })
    },
    onRemoveInterviewer (interviewerID) {
      this.removedInterviewerIDs.push(interviewerID)
    },
    onRemoveJob (jobTitle) {
      this.removedJobTitles.push(jobTitle)
    },
    onRemoveCity (city) {
      this.removedCitys.push(city)
    },
    onRemoveCollege (college) {
      this.removedColleges.push(college)
    },
    onRemoveInterviewee (resumeDeliveryID) {
      this.removedDeliveryIDs.push(resumeDeliveryID)
    },
    getBasicInfo (arr) {
      this.allInviteResumes = arr
      this.allDeliveryIDs = arr.map(r => r.resumeDeliveryID)
      this.allInterviewerIDs = _.uniq(this.allInviteResumes.map(r => r.interviewerID))
      this.allJobTitles = _.uniq(this.allInviteResumes.map(r => r.jobTitle))
      this.allCitys = _.uniq(this.allInviteResumes.map(r => r.city))
      this.loadPlans([
        { Key: 'Id', Value: this.allInviteResumes.map(r => r.planID).join(), Oper: 'in' }
      ])
    },
    onSubmit () {
      if (_.isEmpty(this.inviteResumes)) {
        this.$q.dialog({
          title: '无发放人员'
        })
      } else {
        this.model.ResumeDeliveryIDs = this.inviteResumes.map(v => v.resumeDeliveryID)
        this.UpdateResumeStatus({
          ids: this.model.ResumeDeliveryIDs,
          status: this.endStatus.waitSign
        }).then(res => {
          this.setSelectedStatus('waitOffer')
          this.$router.push({
            name: 'resume'
          })
          showSuccessMessage(this.$t('resume.actionSucceed'))
        })
      }
    },
    onReset () {
      this.removedInterviewerIDs = []
      this.removedJobTitles = []
      this.removedCitys = []
      this.removedColleges = []
      this.removedDeliveryIDs = []
      this.model.Count = 40
    }
  },
  mounted () {
    if (this.resumeDeliveryID === 'all') {
      this.loadAllData()
    } else {
      this.loadResumeView(this.resumeDeliveryID)
        .then(res => {
          if (res) {
            this.getBasicInfo([res])
          } else {
            this.setSelectedStatus('waitOffer')
            this.$router.push({
              name: 'resume'
            })
          }
        })
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
    selectedPlanID (newV, oldV) {
      this.removedInterviewerIDs = []
      this.removedJobTitles = []
      this.removedCitys = []
      this.removedColleges = []
      this.removedDeliveryIDs = []
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm'),
    ResumeInviteStatistics: () => import('components/recruitment/resume/ResumeInviteStatistics'),
    ResumeIntervieweeAvatar: () => import('components/recruitment/resume/ResumeIntervieweeAvatar'),
    ResumeInterviewerAvatar: () => import('components/recruitment/resume/ResumeInterviewerAvatar')
  }
}

</script>

<style lang='scss' scoped>
/deep/.count-per-hour .q-field__native {
  text-align: center;
}
/deep/.q-chip {
  margin-left: 0;
}
/deep/.q-field__control-container {
  flex-wrap: wrap;
}
</style>
