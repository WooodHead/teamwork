<!-- 单独邀约 -->
<template>
  <tw-form
    title="发起邀约"
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
    <!-- 面试轮次 -->
    <div class="row">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        面试轮次：
      </div>
      <q-field
        class="col"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        label="选择面试轮次"
        stack-label
      >
        <q-chip
          v-for="round in rounds"
          :key="round"
          dense
          :removable="rounds.length>1"
          color="grey-3"
          text-color="grey-9"
          @remove="onRemoveRound(round)"
        >
          {{round}}
        </q-chip>
      </q-field>
    </div>
    <!-- 面试地点 -->
    <div
      class="row"
      :class="{'q-mt-none': $q.platform.is.desktop}"
    >
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        面试地点：
      </div>
      <q-input
        clearable
        class="col"
        :filled="$q.platform.is.mobile"
        placeholder="请输入面试地点"
        :label="$q.platform.is.mobile? '请输入面试地点': ''"
        :stack-label="false"
        v-model="model.InterviewPlace"
        :rules="[val => val && val.length > 0 || '请输入合理面试地点']"
      />
    </div>
    <!-- 面试要求 -->
    <div class="row q-mt-none">
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-center"
      >
        面试要求：
      </div>
      <q-input
        clearable
        class="col"
        :filled="$q.platform.is.mobile"
        :label="$q.platform.is.mobile? '（非必填）': ''"
        :stack-label="$q.platform.is.mobile"
        v-model="model.InterviewExtra"
        :rules="[val => true ]"
      />
    </div>
    <!-- 线下面试时间 -->
    <div
      class="row"
      :class="$q.platform.is.mobile?'q-mt-none':''"
    >
      <resume-invite-arrange-time
        key="invite-offline"
        type='线下'
        :arrange="detailArrange"
        :invites="properInvites"
        @timeArrange="getArrange"
      />
    </div>
    <!-- 视频面试时间 -->
    <div class="row">
      <resume-invite-arrange-time
        key="invite-online"
        type='视频'
        :arrange="detailArrange"
        :invites="properInvites"
        @timeArrange="getArrange"
      />
    </div>
    <!-- 每个时间段面试人数 -->
    <div
      class="row items-center"
      :class="{'q-mt-none': $q.platform.is.desktop}"
    >
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1"
      >
        每个时间段面试人数：
      </div>
      <q-input
        class="col"
        clearable
        type="number"
        v-model.number="model.CountPerHour"
        :filled="$q.platform.is.mobile"
        :label="$q.platform.is.mobile? '每个时间段面试人数': ''"
        :stack-label="$q.platform.is.mobile"
        :rules="[val => val && val >= computedCountPerTimePoint || '请设置合理人数']"
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
    <!-- 邀约人员 -->
    <div
      class="colunm"
      v-show="inviteResumes.length"
    >
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-start"
      >
        {{inviteCount}}
      </div>
      <q-field
        class="col text-blue"
        :borderless="$q.platform.is.desktop"
        :filled="$q.platform.is.mobile"
        :label="$q.platform.is.mobile? inviteCount: ''"
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
import { date } from 'quasar'
const { formatDate } = date
import { showSuccessMessage } from '@/utils/show-message'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ResumeInvite',
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
      removedCounts: [],
      removedColleges: [],
      removedDeliveryIDs: [],
      // 已有面试时间安排
      properInvites: [],
      detailArrange: {}
    }
  },
  computed: {
    ...mapGetters('resume', ['resumeViewQuerys', 'myinfo', 'isInterviewer', 'isHrOrAdmin']),
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
            !this.removedJobTitles.includes(r.jobTitle) &&
            !this.removedCitys.includes(r.city) &&
            !this.removedCounts.includes(r.interviewCount) &&
            !this.removedDeliveryIDs.includes(r.resumeDeliveryID) &&
            _.intersection(this.removedColleges, [_.last(_.sortBy(r.educations, 'startTime')).college]).length === 0
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
    rounds () {
      return _.uniq(this.inviteResumes.map(r => r.interviewCount)).sort((a, b) => a - b)
    },
    // 选择的面试时间段
    timeCount () {
      let count = 0
      Object.keys(this.detailArrange).map(key => {
        count += this.detailArrange[key].length
      })
      return count
    },
    computedCountPerTimePoint () {
      return (this.timeCount > 0 && _.ceil(this.inviteResumes.length / this.timeCount)) || this.model.CountPerHour
    },
    inviteCount () {
      return '邀约人员：' + (this.inviteResumes.length ? '（' + this.inviteResumes.length + '）人' : '')
    }
  },
  methods: {
    ...mapActions('resume', ['loadResumeView', 'loadResumeViews', 'loadResumeInvites', 'StartInvite']),
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
      this.setSelectedStatus('waitInvite')
    },
    loadAllData () {
      this.loadResumeViews({
        query: this.resumeViewQuerys.query,
        search: this.$store.state.resume.search
      }).then(res => {
        if (res.length) {
          this.getBasicInfo(res)
        } else {
          this.setSelectedStatus('waitInvite')
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
        this.loadInvites(res)
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
    getArrangedCount (invites) {
      this.properInvites = invites.filter(plan => {
        return Object.keys(plan.detail).filter(time => {
          return formatDate(time.replace('T', ' '), 'YYYY-MM-DD') >= formatDate(new Date(), 'YYYY-MM-DD')
        }).length > 0
      })
    },
    planFilter (val, update, abort) {
      update(() => {
        this.filterdPlans = this.allPlans.filter(plan => plan.title.includes(val))
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
    onRemoveRound (round) {
      this.removedCounts.push(round)
    },
    onRemoveCollege (college) {
      this.removedColleges.push(college)
    },
    onRemoveInterviewee (resumeDeliveryID) {
      this.removedDeliveryIDs.push(resumeDeliveryID)
    },
    getBasicInfo (arr) {
      // 面试官仅可以邀约面试官为自己的简历
      if (!this.isHrOrAdmin && this.isInterviewer) {
        this.allInviteResumes = _.filter(arr, item => {
          return +item.interviewerID === +this.myinfo.id
        })
      } else {
        this.allInviteResumes = arr
      }
      this.allDeliveryIDs = arr.map(r => r.resumeDeliveryID)
      this.allInterviewerIDs = _.uniq(this.allInviteResumes.map(r => r.interviewerID))
      this.allJobTitles = _.uniq(this.allInviteResumes.map(r => r.jobTitle))
      this.allCitys = _.uniq(this.allInviteResumes.map(r => r.city))
      this.loadPlans([
        { Key: 'Id', Value: _.uniq(this.allInviteResumes.map(r => r.planID)).join(), Oper: 'in' }
      ])
    },
    // 获取面试时间安排
    getArrange (arrange) {
      this.detailArrange = arrange
      // 更新没小时面试人数
      this.model.CountPerHour = this.computedCountPerTimePoint
    },
    // 生成后台Detail参数
    getDetail () {
      let detail = {}
      let dates = Object.keys(this.detailArrange)
      dates.map(date => {
        this.detailArrange[date].map(obj => {
          let key = date + ' ' + obj.time
          detail[key] = {
            'InterviewType': obj.type,
            'RealResumeDeliveryIDs': []
          }
        })
      })
      return detail
    },
    onSubmit () {
      if (_.isEmpty(this.inviteResumes)) {
        this.$q.dialog({
          title: '无可邀请人员'
        })
      } else if (this.timeCount === 0) {
        this.$q.dialog({
          title: '请选择面试时间段'
        })
      } else {
        if (this.model.InterviewExtra === null) {
          this.model.InterviewExtra = ''
        }
        // 构造后台参数
        this.model.PlanID = this.selectedPlanID
        this.model.PlanTitle = this.allPlans.find(p => p.id === this.selectedPlanID).title
        this.model.ResumeDeliveryIDs = this.inviteResumes.map(v => v.resumeDeliveryID)
        this.model.Detail = this.getDetail()
        this.StartInvite(this.model)
          .then(res => {
            if (res) {
              this.setSelectedStatus('waitInvite')
              this.$router.push({
                name: 'resume'
              })
              showSuccessMessage(this.$t('resume.actionSucceed'))
            }
          })
      }
    },
    onReset () {
      this.removedInterviewerIDs = []
      this.removedJobTitles = []
      this.removedCitys = []
      this.removedCounts = []
      this.removedColleges = []
      this.removedDeliveryIDs = []
      this.model.CountPerHour = 5
      this.detailArrange = {}
      this.properInvites = []
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
            this.setSelectedStatus('waitInvite')
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
      this.removedCounts = []
      this.removedColleges = []
      this.removedDeliveryIDs = []
    },
    computedCountPerTimePoint (newV, oldV) {
      this.model.CountPerHour = newV
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm'),
    ResumeInviteArrangeTime: () => import('components/recruitment/resume/ResumeInviteArrangeTime'),
    ResumeInviteStatistics: () => import('components/recruitment/resume/ResumeInviteStatistics'),
    ResumeIntervieweeAvatar: () => import('components/recruitment/resume/ResumeIntervieweeAvatar'),
    ResumeInterviewerAvatar: () => import('components/recruitment/resume/ResumeInterviewerAvatar')
  }
}

</script>

<style lang='scss' scoped>
/deep/.q-field__control-container {
  flex-wrap: wrap !important;
}
</style>
