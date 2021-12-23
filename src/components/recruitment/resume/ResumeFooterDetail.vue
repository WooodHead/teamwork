<!-- 简历详情页底部按钮 -->
<template>
  <q-page-sticky
    class="print-hide"
    expand
    position="bottom"
  >
    <q-toolbar
      class="flex"
      :class="barClass"
    >
      <!-------------------------------- 按钮区域 -------------------------------->
      <!-- 上一份 -->
      <q-btn
        no-caps
        color="white"
        text-color="black"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="$t('resume.actions.prev')"
        @click="onNextResume(false)"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-- 复活简历 -->
      <q-btn
        v-if="showResurrectionBtn"
        no-caps
        color="primary"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="'复活'"
        @click="showResurrectionDialog = true"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-- 放入人才库 -->
      <q-btn
        v-show="showStorageBtn"
        no-caps
        color="white"
        text-color="black"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="$t('resume.actions.notMatch')"
        @click="showStorageDialog = true"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-- 添加面试记录 -->
      <q-btn
        v-show="resumeView && (+resumeView.status === 30 || +resumeView.status === 40) && (isHrOrAdmin || +resumeView.interviewerID === +myinfo.id)"
        no-caps
        color="primary"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="$t('resume.actions.addInterviewRecord')"
        @click="writeInterviewRecord"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-- 再次邀约 -->
      <q-btn
        v-show="resumeView && (+resumeView.status === 30 || +resumeView.status === 40) && (isHrOrAdmin || +resumeView.interviewerID === +myinfo.id)"
        no-caps
        color="primary"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="$t('resume.actions.nextInterview')"
        @click="showNextInterview=true"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-- 进入下一环节 -->
      <q-btn
        v-show="showNextStepBtn"
        no-caps
        color="primary"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="nextStepLabel"
        @click="onNextStep()"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-- 下一份 -->
      <q-btn
        no-caps
        color="white"
        text-color="black"
        :flat="$q.screen.lt.sm"
        :ripple="!$q.screen.lt.sm"
        :class="$q.screen.lt.sm ? 'text-weight-bold' : 'text-weight-regular'"
        :label="$t('resume.actions.next')"
        @click="onNextResume(true)"
        :padding="$q.screen.lt.sm ? '10px 5px' : '6px 16px'"
      />
      <!-------------------------------- 弹窗区域 -------------------------------->

      <q-dialog v-model="showNextInterview">
        <q-card>
          <q-card-section>
            <div
              v-if="isInterviewer && !isHrOrAdmin"
              class="text-subtitle1 text-weight-bold"
            >确定将该简历转为待邀约吗？</div>
            <div
              v-else
              class="text-subtitle1 text-weight-bold"
            >当前面试官为：{{currentInterviewer}} ，是否更换面试官?</div>
            <div class="text-right q-gutter-md q-pt-md">
              <q-btn
                outline
                color="primary"
                :label="$t('action.cancel')"
                v-close-popup
              />
              <q-btn
                v-if="isInterviewer && !isHrOrAdmin"
                color="primary"
                :label="$t('action.confirm')"
                @click="onNextInterview(false)"
              />
              <q-btn-dropdown
                v-else
                split
                color="primary"
                label="不更换"
                @click="onNextInterview(false)"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="onNextInterview(true)"
                  >
                    <q-item-section>
                      <q-item-label>更换</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- 选择面试官弹窗 -->
      <q-dialog v-model="showResumeChooseInterviewer">
        <q-card flat>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">{{$t('resume.actions.ChooseInterviewer')}}</div>
            <person-select-panel
              :flat="true"
              :isVirtualScroll="false"
              :multiple="false"
              :isSearchSort="false"
              :initPersonScope="interviewerScope"
              @select="callNextInterview"
            >
            </person-select-panel>
          </q-card-section>
        </q-card>
      </q-dialog>
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
          :resumeDeliveryID="resumeDeliveryID"
          @confirmPush="onConfirmPush()"
        />
      </q-dialog>
      <!-- 面试记录/结果弹出框 -->
      <q-dialog
        v-model="showResumeRecordForm"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <resume-record-form
          style="width: 980px; max-width: 96vw;max-height:80vh;"
          :isInterview="isInterview"
          :resumeDeliveryID="resumeDeliveryID"
          @success="onInterviewSuccess"
          @close="()=>{showResumeRecordForm=false}"
          :title="isInterview?$t('recruitment.resumeRecordForm.title.interview'):$t('recruitment.resumeRecordForm.title.pass')"
        >
        </resume-record-form>
      </q-dialog>
      <!-- 同步TW账号弹框 -->
      <q-dialog v-model="showPersonEdit">
        <person-edit
          :resumeDeliveryID="+resumeDeliveryID"
          @ok="afterSyncTwAcount"
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
              @click="afterSyncTwAcount (true)"
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
      <!-- 简历复活弹窗 -->
      <q-dialog v-model="showResurrectionDialog">
        <resume-resurrection-dialog
          :resumeID="resumeView&&resumeView.resumeID"
          :interviewee="resumeView&&resumeView.interviewee"
          :tel="resumeView&&resumeView.tel"
          @ok="showResurrectionDialog = false"
        />
      </q-dialog>
    </q-toolbar>
  </q-page-sticky>
</template>

<script>
import { showSuccessMessage } from '@/utils/show-message'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ResumeFooterDetail',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      endStatus: this.$store.state.resume.endStatus,
      showStorageDialog: false,
      showConfirm: false,
      showPersonEdit: false,
      showResumeRecordForm: false, // 是否显示记录表单
      isInterview: false, // 是否是面试记录
      showNextInterview: false, // 转为待邀约弹框
      showResumeChooseInterviewer: false, // 是否显示选择面试官弹框
      interviewerScope: [], // 面试官选择范围
      showPushDialog: false, // 推荐弹框
      showResurrectionDialog: false // 复活弹框
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('resume', ['statusCount']),
    ...mapGetters('resume', ['resumeViews', 'resumeViewQuerys', 'isInterviewer', 'isHrOrAdmin', 'myinfo']),
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    },
    showResurrectionBtn () {
      return this.isHrOrAdmin && this.resumeView && this.resumeView.inStorage === 1
    },
    showStorageBtn () {
      if (this.isHrOrAdmin) {
        return this.resumeView && this.resumeView.inStorage !== 1 && +this.resumeView.status !== 110
      } else {
        return this.resumeView && (+this.resumeView.status === 0 || ((+this.resumeView.status === 30 || +this.resumeView.status === 40) && +this.resumeView.interviewerID === +this.myinfo.id))
      }
    },
    showNextStepBtn () {
      if (this.isHrOrAdmin) {
        return this.resumeView && this.resumeView.inStorage !== 1 && +this.resumeView.status !== 110
      } else {
        return this.resumeView && (+this.resumeView.status === 0 || (+this.resumeView.status === 20 && +this.resumeView.interviewerID === +this.myinfo.id))
      }
    },
    barClass () {
      if (this.$q.screen.lt.sm) {
        return 'justify-around bg-white shadow-up-2 bg-grey-3 q-pa-none'
      } else {
        return 'justify-center q-gutter-sm'
      }
    },
    nextStepLabel () {
      switch (this.resumeView.status) {
        case 0:
          return this.$t('resume.actions.nextStep.waitScreening')
        case 10:
          return this.$t('resume.actions.nextStep.waitTest')
        case 15:
          return this.$t('resume.actions.nextStep.inTest')
        case 20:
          return this.$t('resume.actions.nextStep.waitInvite')
        case 30:
          return this.$t('resume.actions.nextStep.waitInterview')
        case 40:
          return this.$t('resume.actions.nextStep.waitInterview')
        case 90:
          return this.$t('resume.actions.nextStep.waitOffer')
        case 100:
          return this.$t('resume.actions.nextStep.waitSign')
        case 110:
          return this.$t('resume.actions.nextStep.inService')
        default:
          return ''
      }
    },
    currentInterviewer () {
      return this.resumeView.interviewerID && this.selectPersons[+this.resumeView.interviewerID] && this.selectPersons[+this.resumeView.interviewerID].name
    }
  },
  methods: {
    ...mapActions('resume', ['skipTestExam', 'UpdateResumeStatus', 'updateResumeInterviewerID', 'StorageResumes', 'loadResumeViewsByPage', 'nextInterview']),
    ...mapActions('interviewer', ['loadInterviewers']),
    ...mapActions('recommendCode', ['updateJobNumber', 'loadRecommendCodes']),
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
          showSuccessMessage(this.$t('resume.actionSucceed'))
          this.onNextResume(true)
        })
    },
    onConfirmPush () {
      this.showPushDialog = false
      if (this.isInterviewer && !this.isHrOrAdmin) {
        this.onNextResume(true)
      }
      showSuccessMessage(this.$t('resume.actionSucceed'))
    },
    // 进入下一环节
    onNextStep () {
      switch (+this.resumeView.status) {
        case 0:
          this.onWaitScreeningPass()
          break
        case 10:
        case 15:
          this.UpdateResumeStatus({
            ids: [this.resumeDeliveryID],
            status: this.resumeView.status === this.endStatus.waitTest ? this.endStatus.inTest : this.endStatus.waitInviteFirstInterview
          }).then(res => {
            showSuccessMessage(this.$t('resume.actionSucceed'))
            this.onNextResume(true)
          })
          break
        case 20:
          this.$router.push({
            name: 'resumeInvite',
            params: {
              resumeDeliveryID: this.resumeDeliveryID
            }
          })
          break
        case 30:
        case 40:
          this.isInterview = false
          this.showResumeRecordForm = true
          break
        case 90:
          this.$router.push({
            name: 'resumeSendOffer',
            params: {
              resumeDeliveryID: this.resumeDeliveryID
            }
          })
          break
        case 100:
          this.showConfirm = true
          break
        default:
          break
      }
    },
    // TW 账号同步完毕处理
    afterSyncTwAcount (isSuccess) {
      isSuccess && this.UpdateResumeStatus({
        ids: [this.resumeDeliveryID],
        status: this.endStatus.inService
      }).then(res => {
        // 更新推荐码入职人数
        if (this.resumeView.pushCode.length > 0) {
          let query = [{ 'Key': 'Code', 'Value': this.resumeView.pushCode, 'Oper': 'eq' }]
          this.loadRecommendCodes({ query }).then(
            r => {
              this.updateJobNumber({ Id: r[0].id, JobNumber: ++(r[0].jobNumber) })
            }
          )
        }
        this.routeBackToPage()
      })
    },
    // 获取上一份下一份简历
    getPrevOrNextView (isNext) {
      let index = this.resumeViews.findIndex(view => +view.resumeDeliveryID === +this.resumeDeliveryID)
      if (index !== -1) {
        return isNext ? this.resumeViews[index + 1] : this.resumeViews[index - 1]
      } else {
        return null
      }
    },
    // 点击上一份/下一份
    onNextResume (isNext) {
      let resumeDelivery = this.getPrevOrNextView(isNext)
      if (resumeDelivery) {
        this.$emit('changeResumeDetail', +resumeDelivery.resumeDeliveryID)
      } else {
        Object.assign(this.resumeViewQuerys, { byPage: true })
        this.loadResumeViewsByPage(this.resumeViewQuerys)
          .then(res => {
            if (this.resumeViews.length < 1) {
              this.$router.push({
                name: 'resume'
              })
            } else {
              let resumeDelivery = this.getPrevOrNextView(isNext)
              if (resumeDelivery) {
                this.$emit('changeResumeDetail', +resumeDelivery.resumeDeliveryID)
              } else {
                if (isNext) {
                  this.$emit('changeResumeDetail', this.resumeViews[0].resumeDeliveryID)
                } else {
                  this.$emit('changeResumeDetail', this.resumeViews[this.resumeViews.length - 1].resumeDeliveryID)
                }
              }
            }
          })
      }
    },
    // 筛选通过
    onWaitScreeningPass () {
      this.skipTestExam(this.resumeView.resumeID).then(isSkip => {
        this.UpdateResumeStatus({
          ids: [this.resumeDeliveryID],
          status: isSkip ? this.endStatus.waitInviteFirstInterview : this.endStatus.waitTest,
          oldStatus: 0
        }).then(res => {
          this.onNextResume(true)
          showSuccessMessage(this.$t('resume.actionSucceed'))
          // 更新 interviewerID = 操作者id
          this.updateInterviewerID(this.resumeView)
        })
      })
    },
    // 当前人员仅为面试官角色时，更新简历interviewerID字段
    updateInterviewerID (resumeView) {
      if (this.isInterviewer && !this.isHrOrAdmin) {
        this.updateResumeInterviewerID({
          resumeDeliveryID: resumeView.resumeDeliveryID,
          interviewerID: this.myinfo.id
        })
      }
    },
    // 填写面试记录
    writeInterviewRecord () {
      this.isInterview = true
      this.showResumeRecordForm = true
    },
    // 面试通过
    onInterviewSuccess (isInterview) {
      this.showResumeRecordForm = false
      if (isInterview) {
        this.$emit('recordSuccess')
      } else {
        this.routeBackToPage()
      }
    },
    routeBackToPage () {
      this.$store.state.resume.page.offset = 0
      this.$router.push({
        name: 'resume'
      })
      showSuccessMessage(this.$t('resume.actionSucceed'))
    },
    callNextInterview (person) {
      let fields = {
        Id: +this.resumeDeliveryID,
        Status: 20,
        InterviewCount: this.resumeView.interviewCount + 1
      }
      if (person) {
        fields.interviewerID = person.id
      }
      this.nextInterview(fields).then(() => {
        this.routeBackToPage()
      }).catch((ex) => {
        this.$q.notify({
          message: this.$t('resume.actionFail'),
          color: 'negative'
        })
      })
    },
    // 再次邀约
    onNextInterview (isChange) {
      // 当前人员仅为面试官角色时
      if (this.isInterviewer && !this.isHrOrAdmin) {
        this.callNextInterview()
      }
      // 当前人员为HR或高级管理员
      if (this.isHrOrAdmin) {
        if (isChange) {
          this.loadInterviewers({}).then(res => {
            this.showNextInterview = false
            if (res && res.length) {
              this.interviewerScope = _.keys(_.groupBy(res, 'psonID'))
              this.showResumeChooseInterviewer = true
            } else {
              this.$q.notify({
                message: '没有匹配的面试官，请先进行维护。',
                color: 'warning'
              })
            }
          })
        } else {
          this.callNextInterview()
        }
      }
    }
  },
  components: {
    ResumeRecordForm: () => import('components/recruitment/resume/ResumeRecordForm'),
    ResumeDialogStorage: () => import('components/recruitment/resume/ResumeDialogStorage'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel'),
    ResumeDialogPush: () => import('components/recruitment/resume/ResumeDialogPush'),
    PersonEdit: () => import('components/person/PersonEdit'),
    ResumeResurrectionDialog: () => import('components/recruitment/resume/ResumeResurrectionDialog')
  }
}

</script>

<style lang='scss' scoped>
</style>
