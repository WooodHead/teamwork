<template>
  <div class="q-pb-lg">
    <q-timeline
      :layout="$q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')"
      color="dark"
    >
      <div
        v-for="(index,number) in Object.keys(historysList)"
        :key="index"
      >
        <q-timeline-entry
          heading
          tag="h6"
        >
          <div class="text-bold">
            {{index}}
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          v-for="history in historysList[index]"
          :key="history.id"
          :subtitle="formatDate(history.ActTime.slice(0, 19).replace(/-/g, '/').replace(/T/g, ' '), 'HH:mm')"
          :side="getSide(number)"
        >
          <template v-slot:title>
            <div class="row">
              <div class="text-caption col-auto q-pr-sm">
                <tw-avatar
                  :id="history.ActorID"
                  :name="history.Actor"
                  size="lg"
                />
              </div>
              <!-- 关闭招聘计划引起的淘汰入库 -->
              <div
                class="text-left col"
                v-if="history.Action === 'StorageResumeByPlan'"
              >
                <!-- 标题 -->
                <div class="text-body1 text-weight-bold">
                  <span>{{history.Actor}} {{$t('resume.historys.StorageResumeByPlan')}}
                    <router-link
                      class="text-primary"
                      :to="{name: 'recruitPlanDetail', params: {id: history.Extra.PlanID }}"
                    >
                      {{history.Extra.PlanTitle}}
                    </router-link>
                  </span>
                </div>
                <div class="q-ml-sm text-caption">
                  该简历淘汰入库
                </div>
              </div>
              <div
                class="text-left col"
                v-else
              >
                <!-- 标题 -->
                <div class="text-body1 text-weight-bold">
                  <span v-if="history.Extra.PlanTitle">
                    在<router-link
                      class="text-primary"
                      :to="{name: 'recruitPlanDetail', params: {id: history.Extra.PlanID }}"
                    >
                      {{history.Extra.PlanTitle}}
                    </router-link>中，
                  </span>
                  <span>{{history.Actor}}
                    {{$t(`resume.historys.${history.Action}`,{name: resume&&resume.name,InterviewerName:history.InterviewerName})}}</span>
                  <span
                    data-html2canvas-ignore
                    v-if="(history.Action==='AddInterviewRecord'||history.Action==='PassInterview')&&+myself.id===+history.ActorID"
                  >
                    <q-btn
                      dense
                      flat
                      round
                      color="grey-7"
                      icon="mode_edit"
                      size="sm"
                      @click="editRecord(history)"
                    />
                    <q-btn
                      dense
                      flat
                      round
                      color="grey-7"
                      icon="delete"
                      size="sm"
                      @click="deleteRecord(history)"
                    />
                  </span>
                </div>
                <!-- 更新时间（若有） -->
                <div
                  v-if="history.ModifyTime"
                  class="text-caption text-grey-7"
                >更新于 {{history.ModifyTime}}</div>
                <div
                  v-if="history.Extra.JobTitle"
                  class="text-caption q-pt-sm"
                >应聘岗位：<router-link
                    class="text-primary"
                    :to="{name: 'jobDetail', params: {id: history.Extra.JobID }}"
                  >
                    {{history.Extra.JobTitle}}
                  </router-link>
                </div>
                <div
                  v-if="(history.Action==='PassInterview'||history.Action==='AddInterviewRecord')&&history.Extra.Score"
                  class="text-caption q-pt-sm"
                >总分：<span class="text-red">{{history.Extra.Score}}</span></div>
                <div v-if="history.Extra.Content">
                  <div
                    class="editor__content tiptap text-body2"
                    v-html="history.Extra.Content"
                  ></div>
                </div>
              </div>
            </div>
          </template>
        </q-timeline-entry>
      </div>
    </q-timeline>
    <div
      v-if="!loaded"
      class="row justify-center q-my-md"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <div v-if="loaded&&Object.keys(historysList).length===0">
      <tw-banner-no-result />
    </div>
    <!-- 面试记录/结果弹出框 -->
    <q-dialog
      v-model="showResumeRecordForm"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <resume-record-form
        style="width: 980px; max-width: 96vw;max-height:80vh;"
        :isEdit="true"
        :resumeID="id"
        :history="currentHistory"
        @done="onRecordDone"
        title="编辑记录"
        @close="()=>{showResumeRecordForm=false}"
      >
      </resume-record-form>
    </q-dialog>
  </div>
</template>

<script>
import { LocalStorage, date } from 'quasar'
const { formatDate } = date
import { mapActions } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'ResumeHistory',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      historys: [],
      loaded: false,
      myself: LocalStorage.getItem('myself') || {},
      showResumeRecordForm: false,
      currentHistory: {}
    }
  },
  created () {
    // 加载历史记录
    this.id && this.$store.dispatch(`resume/loadResumeHistory`, +this.id).then(historys => {
      this.historys = historys
      this.loaded = true
    })
  },
  methods: {
    ...mapActions('resume', ['DeleteHistory', 'updateResumeScore']),
    formatDate,
    // 左右布局
    getSide (index) {
      if (index % 2 === 0) {
        return 'left'
      } else {
        return 'right'
      }
    },
    // 编辑面试记录
    editRecord (history) {
      this.currentHistory = history
      this.showResumeRecordForm = true
    },
    // 编辑面试记录完毕
    onRecordDone (res) {
      if (res !== 'none') {
        // 更新页面内容
        let history = JSON.parse(res)
        let oldHistory = _.find(this.historys, (h) => {
          return history.ActTime === h.ActTime
        })
        _.assign(oldHistory, history)
        // 获取最新的记录，若编辑为最新记录则变更分数
        let recordHistorys = _.filter(this.historys, (h) => {
          return h.IsDelete !== 1 && (h.Action === 'AddInterviewRecord' || h.Action === 'PassInterview') && +h.Extra.DeliveryID === +history.Extra.DeliveryID
        })
        let lastRecordHistory = recordHistorys.length ? recordHistorys[recordHistorys.length - 1] : undefined
        if (lastRecordHistory && history.ActTime === lastRecordHistory.ActTime) {
          this.updateResumeScore({
            id: +lastRecordHistory.Extra.DeliveryID,
            result: lastRecordHistory.Extra.Score
          })
        }
        // 关闭弹框
        this.showResumeRecordForm = false
      }
    },
    // 删除面试记录
    deleteRecord (history) {
      this.$q.dialog({
        title: this.$t('recruitment.sure'),
        message: this.$t('recruitment.sureDelete'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.DeleteHistory({
          resumeID: this.id,
          history: history
        }).then(res => {
          if (res === 'none') {
            this.$q.notify({
              message: this.$t('recruitment.resumeRecordForm.deleteFail'),
              color: 'negative'
            })
          } else {
            // 获取最新的记录，若删除为最新记录则变更分数
            let recordHistorys = _.filter(this.historys, (h) => {
              return h.IsDelete !== 1 && (h.Action === 'AddInterviewRecord' || h.Action === 'PassInterview') && +h.Extra.DeliveryID === +history.Extra.DeliveryID
            })
            let lastRecordHistory = recordHistorys.length ? recordHistorys[recordHistorys.length - 1] : undefined
            if (lastRecordHistory && history.ActTime === lastRecordHistory.ActTime) {
              this.updateResumeScore({
                id: +lastRecordHistory.Extra.DeliveryID,
                result: recordHistorys.length > 1 ? recordHistorys[recordHistorys.length - 2].Extra.Score : ''
              })
            }
            // 更新页面内容
            this.historys = _.without(this.historys, history)
            showSuccessMessage(this.$t('recruitment.resumeRecordForm.deleteSuccess'))
          }
        })
      })
    }
  },
  computed: {
    resume () {
      return this.$store.getters['resume/resume'](+this.id)
    },
    historysList () {
      let historysGroupByDate = {}
      // 过滤掉删除的记录
      let historys = _.filter(this.historys, h => {
        return !(h.IsDelete && +h.IsDelete === 1)
      })
      let historysOrderBy = _.orderBy(historys, ['ActTime'], ['desc'])
      historysGroupByDate = _.groupBy(historysOrderBy, (item) => {
        return this.formatDate(new Date(item.ActTime.slice(0, 19).replace(/-/g, '/').replace(/T/g, ' ')), 'YYYY-MM-DD')
      })
      return historysGroupByDate
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    ResumeRecordForm: () => import('components/recruitment/resume/ResumeRecordForm')
  }
}
</script>
<style lang="scss" scoped>
/deep/.q-timeline__dot:before {
  display: none;
}
/deep/.q-timeline__dot:after {
  top: 0;
  left: 7px;
  bottom: 0;
  width: 1px;
  opacity: 1;
  content: "" !important;
  background-color: rgba(0, 0, 0, 0.1);
}
/deep/.q-timeline__subtitle {
  opacity: 1;
  color: #283c46;
  font-weight: normal;
}
/deep/.content {
  overflow: hidden;
  font-size: 0.85rem;
}
/deep/.content img {
  transition: all 0.6s;
  -moz-transition: all 0.6s;
  -webkit-transition: all 0.6s;
  -ms-transition: all 0.6s;
}
/deep/.content img.scale {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
}
</style>
