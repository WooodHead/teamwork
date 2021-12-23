<template>
  <q-card :flat="$q.screen.lt.sm">
    <q-form>
      <!-- 总分 -->
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col text-h6 text-bold text-grey-7 q-pl-md q-pt-sm">{{title}}</div>
          <div class="col text-right">
            <q-btn
              v-if="!isEdit"
              dense
              flat
              size="lg"
              color="primary"
              icon="save"
              @click="closeOnTemp"
            />
          </div>
        </div>
      </q-card-section>
      <!-- 总分 -->
      <q-card-section class="q-pt-none">
        <q-input
          v-model="model.totalScore"
          clearable
          type="number"
          :label="$t('recruitment.resumeRecordForm.inputScore')"
        >
        </q-input>
      </q-card-section>
      <!-- 评分详情/备注 -->
      <q-card-section>
        <quasar-editor
          @input="(val)=>{model.content=val}"
          :value="oldContent"
          :focus="false"
          :placeholder="$t('recruitment.resumeRecordForm.note')"
          :applied="isApplied"
          folder="resume"
        >
        </quasar-editor>
      </q-card-section>
      <!-- 提交 -->
      <q-card-section class="q-gutter-sm">
        <q-btn
          :label="!isInterview||isEdit?$t('action.submit'):'仅记录'"
          color="primary"
          class="text-bold q-px-md"
          @click="onSubmit"
        />
        <q-btn
          v-if="isInterview&&!isEdit"
          :label="'记录并淘汰/推荐'"
          color="primary"
          class="text-bold q-px-md"
          @click="showStorageDialog = true"
        />
        <q-btn
          :label="$t('recruitment.resumeRecordForm.cancel')"
          color="primary"
          outline
          class="text-bold q-px-md"
          @click="onCancel"
        />
      </q-card-section>
    </q-form>
    <!-- 淘汰入库弹窗 -->
    <q-dialog v-model="showStorageDialog">
      <resume-dialog-storage
        :resumeDeliveryID="+resumeDeliveryID"
        @confirmStorage="onSubmit('noMatch')"
        @onPushInterviewer="showPushDialog = true"
      />
    </q-dialog>
    <!-- 推荐面试官弹窗 -->
    <q-dialog v-model="showPushDialog">
      <resume-dialog-push
        :resumeDeliveryID="+resumeDeliveryID"
        @confirmPush="onSubmit('noMatchPush')"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { debounce, LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'ResumeRecordForm',
  props: {
    isInterview: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否是面试记录'
    },
    resumeDeliveryID: {
      type: [Number, String],
      required: false,
      default: 0,
      description: '简历投递ID'
    },
    title: {
      type: [String],
      required: false,
      default: '',
      description: '标题'
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否编辑'
    },
    resumeID: {
      type: [Number, String],
      required: false,
      default: 0,
      description: '简历ID'
    },
    history: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
      description: '编辑前旧内容'
    }
  },
  data () {
    return {
      isApplied: false,
      oldContent: '',
      model: {
        totalScore: '',
        content: ''
      },
      showStorageDialog: false,
      showPushDialog: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('resume', ['hrInterviewTemplate', 'techInterviewTemplate'])

  },
  methods: {
    ...mapActions('resume', ['UpdateInterviewStatus', 'editHistory', 'StorageResumes']),
    // 页面初始化
    async init () {
      // 编辑
      if (this.isEdit) {
        this.oldContent = this.history.Extra.Content
        this.model.content = this.history.Extra.Content
        this.model.totalScore = this.history.Extra.Score
      } else { // 新增
        // 从session缓存中获取数据
        let model = this.$q.sessionStorage.getItem('resumeRecord' + this.resumeDeliveryID)
        if (!this.isInterview || !LocalStorage.getItem('myself')) {
          this.oldContent = model ? model.content : ''
          this.model.content = model ? model.content : ''
          this.model.totalScore = model ? model.totalScore : ''
        } else if (_.find(LocalStorage.getItem('myself').roles, { code: 'Interviewer' })) {
          this.oldContent = model ? model.content : this.techInterviewTemplate
          this.model.content = model ? model.content : this.techInterviewTemplate
          this.model.totalScore = model ? model.totalScore : ''
        } else if (_.find(LocalStorage.getItem('myself').roles, { code: 'HRSpecialist' })) {
          this.oldContent = model ? model.content : this.hrInterviewTemplate
          this.model.content = model ? model.content : this.hrInterviewTemplate
          this.model.totalScore = model ? model.totalScore : ''
        } else {
          this.oldContent = model ? model.content : ''
          this.model.content = model ? model.content : ''
          this.model.totalScore = model ? model.totalScore : ''
        }
      }
    },
    // 表单提交(通过防抖函数防止表单短时间内重复提交)
    onSubmit: debounce(function (type = '') {
      this.isApplied = true
      // 编辑
      if (this.isEdit) {
        let newHistory = _.cloneDeep(this.history)
        newHistory.Extra.Content = this.model.content
        newHistory.Extra.Score = this.model.totalScore
        this.editHistory({
          resumeID: this.resumeID,
          history: newHistory
        }).then(res => {
          this.$emit('done', res)
          if (res === 'none') {
            this.$q.notify({
              message: this.$t('recruitment.resumeRecordForm.editFail'),
              color: 'negative'
            })
          } else {
            showSuccessMessage(this.$t('recruitment.resumeRecordForm.editSuccess'))
          }
        })
      } else { // 新增
        // 计算简历面试通过后下一状态
        let fields = {
          Id: +this.resumeDeliveryID
        }
        // 如果添加了面试记录，则变更为面试中
        if (this.isInterview) {
          fields.Status = 40
        } else {
          // 如果面试通过，则进入待发offer
          fields.Status = 90
        }
        fields.Result = +this.model.totalScore
        fields.Content = JSON.stringify(this.model.content)
        fields.Content = _.trimEnd(_.trimStart(fields.Content, '"'), '"')
        this.UpdateInterviewStatus(fields)
          .then((posts) => {
            // 如果是新增面试记录，则清空session缓存数据
            this.$q.sessionStorage.remove('resumeRecord' + this.resumeDeliveryID)
            // 记录并淘汰入库
            if (type === 'noMatch') {
              this.StorageResumes({
                query: [
                  { Key: 'ResumeDeliveryID', Value: +this.resumeDeliveryID, Oper: 'eq' }
                ]
              }).then(res => {
                this.$emit('success', false)
              })
            } else if (type === 'noMatchPush') {
              this.$emit('success', false)
            } else {
              this.isInterview && showSuccessMessage(this.$t('recruitment.resumeRecordForm.addSuccess'))
              this.$emit('success', this.isInterview)
            }
          }).catch((ex) => {
            this.$q.notify({
              message: this.$t('recruitment.resumeRecordForm.addFail'),
              color: 'negative'
            })
          })
      }
    }, 3000, true),
    // 取消
    onCancel () {
      // 如果是新增面试记录，则清空session缓存数据
      this.$q.sessionStorage.remove('resumeRecord' + this.resumeDeliveryID)
      this.$emit('close')
    },
    // 顶部保存按钮事件处理
    closeOnTemp () {
      // 如果是新增面试记录，则缓存数据于session中
      this.$q.sessionStorage.set('resumeRecord' + this.resumeDeliveryID, this.model)
      this.$emit('close')
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    ResumeDialogStorage: () => import('components/recruitment/resume/ResumeDialogStorage'),
    ResumeDialogPush: () => import('components/recruitment/resume/ResumeDialogPush')
  }
}
</script>

<style>
</style>
