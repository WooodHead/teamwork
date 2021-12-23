<!-- 简历卡片（列表页展示） -->
<template>
  <q-card
    flat
    bordered
    class="cursor-pointer base-card resume-card"
    style="overflow:hidden"
    @click="openDetail"
  >
    <q-card-section class="position-relative q-pa-sm full-height">
      <div class="flex q-gutter-x-sm full-height">
        <!-- 头像、姓名 -->
        <div
          class="col-auto column flex-center full-height"
          style="width: 90px;"
        >
          <q-img
            :src="resumeView.photo?getUrl(resumeView.photo):'icons/default-profile.png'"
            contain
            spinner-color="primary"
            spinner-size="82px"
          />
          <div class="text-primary1 text-weight-bold q-mt-xs">{{resumeView.interviewee}}</div>
        </div>
        <div class="col column">
          <!-- 投递岗位, 分数 -->
          <div class="relative-position q-mr-xl text-text1">
            <p class="q-mt-none q-mb-xs text-body-g text-weight-bold">
              {{resumeView.jobTitle}}
            </p>
            <p class="q-my-none text-body-g text-weight-bold">
              <span>
                地点：
              </span>
              <span>
                {{resumeView.city}}
              </span>
            </p>
            <p
              class="q-my-none text-body-g text-weight-bold"
              v-if="selectedStatus === 'waitTest' && resumeView.status === 15"
            >
              <span>
                状态：
              </span>
              <span class="text-primary1">
                {{waitTestStatus}}
              </span>
            </p>
          </div>
          <q-separator class="q-my-xs" />
          <!-- 学历、学校、工作经验、期望薪资 -->
          <div class="text-text2 relative-position">
            <p
              v-show="highestEducation"
              class="flex q-my-none text-body-g  q-mb-xs"
            >
              <span>毕业院校</span>：
              <span class="">{{highestEducation.college}}</span>
            </p>
            <p class="flex q-my-none text-body-g  q-mb-xs">
              <span>专业</span>：
              <span class="">{{highestEducation.major}}</span>
            </p>
            <p class="flex q-my-none text-body-g  q-mb-xs">
              <span>学历</span>：
              <span class="">{{resumeView.highestEducation}}</span>
            </p>
            <p class="flex q-my-none text-body-g q-mb-xs">
              <span>期望薪资</span>：
              <span class="">{{resumeView.expectedSalary}}</span>
            </p>
            <p
              class="flex q-my-none text-body-g q-mb-xs"
              v-if="selectedStatus === 'waitInvite'||selectedStatus === 'waitInterview'"
            >
              <span>面试轮次</span>：
              <span class="">{{resumeView.interviewCount}}</span>
            </p>
            <!-- 分数 -->
            <div
              v-show="showResult"
              class="result-num"
            >
              <span
                class="text-auxiliary1 text-weight-bold"
                :class="$q.platform.is.mobile?'text-h5':'text-h4'"
              >
                {{result}}
              </span>
              <span class="text-text3">
                分
              </span>
            </div>
          </div>
          <!-- 额外信息 -->
          <div
            class="q-gutter-x-xs"
            v-if="selectedStatus === 'waitInterview'"
          >
            <!-- 内推码 -->
            <span
              v-show="resumeView.pushCode"
              class="q-mr-sm"
            >
              <q-badge
                color="auxiliary1"
                :label="pushCode"
              />
            </span>
            <!-- 面试类型 -->
            <span
              v-if="selectedStatus === 'waitInterview'"
              @click.capture.stop="onEditInterviewTime()"
            >
              <q-icon
                v-if="computedInterviewTime !== '2000-01-01 00:00' && resumeView.interviewType === '视频'"
                name="videocam"
                color="green"
                size="sm"
              />
              <q-icon
                v-if="computedInterviewTime !== '2000-01-01 00:00' && resumeView.interviewType !== '视频'"
                name="schedule"
                color="auxiliary5"
                size="xs"
              />
              <q-badge
                v-if="computedInterviewTime !== '2000-01-01 00:00'"
                color="auxiliary5"
                :label="computedInterviewTime"
              />
              <q-badge
                v-else
                color="grey"
                label="暂无面试时间"
              />
              <q-icon
                name="edit"
                :color="computedInterviewTime !== '2000-01-01 00:00' ? 'auxiliary5' : 'grey'"
                size="xs"
                style="padding-right:10px;"
              />
              <!-- 修改面试时间 -->
              <q-popup-edit
                persistent
                class="q-gutter-xs"
                ref="popupInterviewTime"
                v-model="computedInterviewTime"
                @save="updateInvite(computedInterviewTime)"
              >
                <q-select
                  filled
                  style="padding-bottom:20px;"
                  label="请选择面试类型"
                  v-model="selectedInterviewType"
                  :options="interviewTypeOptions"
                />
                <q-input
                  style="padding-bottom:20px;"
                  label="请选择面试日期"
                  v-model="interviewDate"
                  filled
                  type="date"
                />
                <q-input
                  filled
                  label="请输入面试时间（24小时）"
                  v-model="interviewHour"
                  :rules="[val => val && val.length > 0]"
                />
                <q-input
                  filled
                  label="请输入面试地点"
                  v-model="interviewPlace"
                  :rules="[val => val && val.length > 0]"
                />
                <div class="q-gutter-xs text-center">
                  <q-btn
                    label="确认"
                    color="primary"
                    @click="updateInvite"
                    v-close-popup
                  />
                  <q-btn
                    label="取消"
                    @click="cancelUpdateInterviewTime"
                    v-close-popup
                  />
                </div>
              </q-popup-edit>
            </span>
          </div>
          <div
            class="q-gutter-x-xs"
            v-else
          >
            <!-- 内推码 -->
            <span v-show="resumeView.pushCode">
              <q-badge
                color="auxiliary1"
                :label="pushCode"
              />
            </span>
          </div>
          <div class="text-text2 col column justify-end">
            <q-separator class="q-my-xs" />
            <div class="flex text-body-g q-mb-xs">
              <span>上次修改</span>：
              <span class="">{{resumeView.modifyTime}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 卡片右侧区域 -->
      <div class="absolute-top-right">
        <!-- 星标 -->
        <q-icon
          v-if="isStared"
          name="star"
          color="yellow-8"
          style="font-size: 2em;"
          @click.capture.stop="noStarResume"
        />
        <q-icon
          v-else
          name="star_border"
          color="blue-grey-3"
          style="font-size: 2em;"
          @click.capture.stop="starResume"
        />
        <!-- 更多 -->
        <q-btn
          round
          flat
          dense
          v-show="showActionBtns"
          icon="more_horiz"
          @click.capture.stop="isShowMenu=true"
        >
          <q-menu
            auto-close
            v-model="isShowMenu"
            transition-show="scale"
            transition-hide="scale"
          >
            <div class="column">
              <q-btn
                flat
                :label="nextStepLabel"
                @click="onNextStep()"
              />
              <q-btn
                flat
                :label="$t('resume.actions.notMatch')"
                @click="showStorageDialog = true"
              />
            </div>
          </q-menu>
        </q-btn>
      </div>
    </q-card-section>
    <!-- 淘汰入库弹窗 -->
    <q-dialog v-model="showStorageDialog">
      <resume-dialog-storage
        :resumeDeliveryID="resumeDeliveryID"
        @confirmStorage="onNotMatch()"
        @onPushInterviewer="showPushDialog = true"
      />
    </q-dialog>
    <!-- 推荐面试官弹窗 -->
    <q-dialog v-model="showPushDialog">
      <resume-dialog-push
        :resumeDeliveryID="+resumeDeliveryID"
        @confirmPush="onConfirmPush"
      />
    </q-dialog>
    <!-- 同步TW账号弹框 -->
    <q-dialog v-model="showPersonEdit">
      <person-edit
        :resumeDeliveryID="+resumeDeliveryID"
        @ok="(isSuccess)=>{isSuccess&&updateResumeStatusTo(endStatus.inService)}"
      />
    </q-dialog>
    <!-- 入职签约提示 -->
    <q-dialog
      v-model="showConfirm"
      persistent
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">提示</div>
        </q-card-section>
        <q-card-section class="q-pt-none">{{$t('resume.actions.signSucceed')}}</q-card-section>
        <q-card-actions align="right">
          <q-btn
            dense
            flat
            label="取消"
            color="primary"
            v-close-popup
          />
          <q-btn
            dense
            outline
            label="仅入职"
            color="primary"
            @click="updateResumeStatusTo(endStatus.inService)"
            v-close-popup
          />
          <q-btn
            dense
            label="创建"
            color="primary"
            @click="showPersonEdit = true"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { date, LocalStorage } from 'quasar'
const { formatDate } = date
import { getUrl } from '@/boot/file'
import { showSuccessMessage } from '@/utils/show-message'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ResumeCard',
  inject: ['refreshResumeList'],
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0,
      description: '简历投递ID'
    },
    enableActions: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否展示更多按钮'
    }
  },
  data () {
    return {
      endStatus: this.$store.state.resume.endStatus,
      showStorageDialog: false,
      showConfirm: false,
      showPersonEdit: false,
      showPushDialog: false,
      isShowMenu: false,
      // 修改面试时间用
      isEditInterviewTime: false,
      interviewDate: '',
      interviewHour: '',
      interviewPlace: '',
      selectedInterviewType: '',
      interviewTypeOptions: ['线下', '视频'],
      staredResumes: LocalStorage.getItem('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id)) || []
    }
  },
  computed: {
    ...mapState('resume', ['selectedStatus']),
    ...mapState('recommendCode', ['recommendCodes']),
    ...mapGetters('resume', ['getNextStatus', 'myinfo', 'isInterviewer', 'isHrOrAdmin']),
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    },
    pushCode () {
      let recommendCode = _.find(this.recommendCodes, r => {
        return this.resumeView.pushCode && r.code === this.resumeView.pushCode
      })
      return recommendCode ? recommendCode.recommendType || this.resumeView.pushCode : this.resumeView.pushCode
    },
    highestEducation () {
      return _.last(_.sortBy(this.resumeView.educations, 'startTime')) || false
    },
    computedInterviewTime: {
      get () {
        return this.interviewDate + ' ' + this.interviewHour
      },
      set (val) {
        this.interviewDate = formatDate(val, 'YYYY-MM-DD')
        this.interviewHour = formatDate(val, 'HH:mm')
      }
    },
    // 显示操作按钮
    showActionBtns () {
      if (this.enableActions) {
        if (this.isHrOrAdmin) {
          return [
            'waitScreening',
            'waitTest',
            'waitSign'
          ].includes(this.selectedStatus)
        } else if (this.isInterviewer) {
          return [
            'waitScreening'
          ].includes(this.selectedStatus)
        } else {
          return false
        }
      } else {
        return false
      }
    },
    result () {
      if (this.resumeView.result === 0) {
        return ''
      } else {
        return this.resumeView.result
      }
    },
    showResult () {
      if (['waitInvite', 'waitOffer', 'waitSign', 'inStorage'].includes(this.selectedStatus)) {
        return this.result
      } else {
        return false
      }
    },
    nextStepLabel () {
      switch (this.resumeView.status) {
        case 10:
          return this.$t('resume.actions.nextStep.' + this.selectedStatus)
        case 15:
          return this.$t('resume.actions.nextStep.inTest')
        default:
          return this.$t('resume.actions.nextStep.' + this.selectedStatus)
      }
    },
    waitTestStatus () {
      if (this.resumeView.status === this.endStatus.waitTest) {
        return '待测评'
      } else {
        return '测评中'
      }
    },
    // 星标状态
    isStared () {
      return this.staredResumes && this.staredResumes.indexOf(+this.resumeDeliveryID) !== -1
    }
  },
  methods: {
    getUrl,
    ...mapActions('resume', ['skipTestExam', 'UpdateResumeStatus', 'StorageResumes', 'updateResumeInterviewerID', 'UpdateInvite']),
    ...mapActions('recommendCode', ['updateJobNumber', 'loadRecommendCodes']),
    openDetail () {
      this.$router.push({
        name: 'resumeDetail',
        params: {
          resumeDeliveryID: this.resumeDeliveryID
        }
      })
    },
    updateResumeStatusTo (status) {
      this.UpdateResumeStatus({
        ids: [this.resumeDeliveryID],
        status: status
      }).then(res => {
        this.refreshResumeList()
        showSuccessMessage(this.$t('resume.actionSucceed'))
        this.updateInterviewerID(this.resumeView)
        // 如果入职，修改对应内推码的入职人数
        if (status === 110) {
          if (this.resumeView.pushCode.length > 0) {
            let query = [{ 'Key': 'Code', 'Value': this.resumeView.pushCode, 'Oper': 'eq' }]
            this.loadRecommendCodes({ query }).then(
              r => {
                this.updateJobNumber({ Id: r[0].id, JobNumber: ++(r[0].jobNumber) })
              }
            )
          }
        }
      })
    },
    // 当前人员仅为面试官角色时，更新简历interviewerID字段
    updateInterviewerID (resumeView) {
      if (!this.isHrOrAdmin && this.isInterviewer) {
        this.updateResumeInterviewerID({
          resumeDeliveryID: resumeView.resumeDeliveryID,
          interviewerID: this.myinfo.id
        })
      }
    },
    // 进入下一环节
    onNextStep () {
      switch (this.selectedStatus) {
        case 'waitScreening':
          this.skipTestExam(this.resumeView.resumeID).then(isSkip => {
            this.UpdateResumeStatus({
              ids: [this.resumeDeliveryID],
              status: isSkip ? this.endStatus.waitInviteFirstInterview : this.endStatus.waitTest,
              oldStatus: 0
            }).then(res => {
              this.refreshResumeList()
              showSuccessMessage(this.$t('resume.actionSucceed'))
              // 更新 interviewerID = 操作者id
              this.updateInterviewerID(this.resumeView)
            })
          })
          break
        case 'waitTest':
          this.updateResumeStatusTo(this.getNextStatus(this.resumeView.status))
          break
        case 'waitSign':
          // 入职
          this.showConfirm = true
          break
        default:
          break
      }
    },
    // 淘汰
    onNotMatch () {
      let params = {
        query: []
      }
      params.query.push({
        Key: 'ResumeDeliveryID',
        Value: +this.resumeDeliveryID,
        Oper: 'eq'
      })
      params.onlyInterviewerID = !(+this.resumeView.status === 0)
      this.StorageResumes(params)
        .then(res => {
          this.refreshResumeList()
          showSuccessMessage(this.$t('resume.actionSucceed'))
        })
    },
    onEditInterviewTime () {
      this.isEditInterviewTime = true
      this.$refs.popupInterviewTime.show()
    },
    // 改约
    updateInvite () {
      this.UpdateInvite({
        Id: this.resumeView.resumeDeliveryID,
        InterviewTime: formatDate(this.computedInterviewTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'),
        InterviewType: this.selectedInterviewType,
        InterviewPlace: this.interviewPlace
      }).then(res => {
        if (res) {
          this.interviewDate = formatDate(res.interviewTime.replace(/-/g, '/'), 'YYYY-MM-DD')
          this.interviewHour = formatDate(res.interviewTime.replace(/-/g, '/'), 'HH:mm')
          this.selectedInterviewType = res.interviewType
          showSuccessMessage(this.$t('resume.actionSucceed'))
        }
        this.refreshResumeList()
      })
    },
    cancelUpdateInterviewTime () {
      this.isEditInterviewTime = false
      this.interviewDate = formatDate(this.resumeView.interviewTime.replace(/-/g, '/'), 'YYYY-MM-DD')
      this.interviewHour = formatDate(this.resumeView.interviewTime.replace(/-/g, '/'), 'HH:mm')
      this.selectedInterviewType = this.resumeView.interviewType
    },
    // 星标简历
    starResume () {
      this.staredResumes = LocalStorage.getItem('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id)) || []
      if (this.staredResumes && this.staredResumes.indexOf(+this.resumeDeliveryID) === -1) {
        this.staredResumes.push(+this.resumeDeliveryID)
        LocalStorage.set('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id), this.staredResumes)
      }
    },
    // 解除星标简历
    noStarResume () {
      this.staredResumes = LocalStorage.getItem('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id)) || []
      if (this.staredResumes && this.staredResumes.indexOf(+this.resumeDeliveryID) !== -1) {
        this.staredResumes = _.difference(this.staredResumes, [+this.resumeDeliveryID])
        LocalStorage.set('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id), this.staredResumes)
      }
    },
    // 推荐给
    onConfirmPush () {
      this.showPushDialog = false
      this.refreshResumeList()
      showSuccessMessage(this.$t('resume.actionSucceed'))
    }
  },
  mounted () {
    this.interviewDate = formatDate(this.resumeView.interviewTime.replace(/-/g, '/'), 'YYYY-MM-DD')
    this.interviewHour = formatDate(this.resumeView.interviewTime.replace(/-/g, '/'), 'HH:mm')
    this.interviewPlace = this.resumeView.interviewPlace
    this.selectedInterviewType = this.resumeView.interviewType
  },
  components: {
    ResumeDialogStorage: () => import('components/recruitment/resume/ResumeDialogStorage'),
    ResumeDialogPush: () => import('components/recruitment/resume/ResumeDialogPush'),
    PersonEdit: () => import('components/person/PersonEdit')
  },
  watch: {
    'isEditInterviewTime': {
      handler: function (newV, oldV) {
        if (newV) {
          if (this.interviewDate === '2000-01-01') {
            this.interviewDate = formatDate(new Date().setDate(new Date().getDate() + 1), 'YYYY-MM-DD')
          }
        }
      }
    }
  }
}

</script>

<style lang='scss' scoped>
p > span:first-child {
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
  min-width: 55px;
}
.result-num {
  position: absolute;
  top: 0;
  right: 0;
  span {
    line-height: 1;
  }
}
.q-badge {
  padding: 3px 6px;
}
</style>
