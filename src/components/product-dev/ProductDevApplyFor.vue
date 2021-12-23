<template>
  <tw-form
    :primaryLabel="$t('action.submit')"
    :secondary="!!workflow"
    :secondaryLabel="$t('approval.showWorkFlow')"
    @primary="onSubmit"
    @secondary="openWorkflow"
  >
    <!-- 立项时间-->
    <q-input
      v-if="openType==='start'"
      filled
      input-class="text-center"
      v-model="beginDate"
      :label="$t('approval.approvalDate')"
      :rules="[val => !!val || $t('approval.selDateRuleNotes')]"
      mask="date"
    >
      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            ref="qBeginDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :value="beginDate"
              @input="updateDate($event,'start')"
              minimal
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <!-- 结项时间 -->
    <q-input
      v-if="openType==='done' || showEndDate"
      filled
      input-class="text-center"
      v-model="endDate"
      :label="$t('approval.finishDate')"
      :rules="[val => !!val || $t('approval.selDateRuleNotes')]"
      mask="date"
    >
      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            ref="qEndDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :value="endDate"
              :options="optionsFn"
              @input="updateDate($event,'end')"
              minimal
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <!-- 预计结束时间 -->
    <q-input
      v-if="openType==='start' && showPredictEndDate"
      filled
      input-class="text-center"
      v-model="predictEndDate"
      :label="$t('productDev.predictEndDate')"
      mask="date"
    >
      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            ref="qPreDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :value="predictEndDate"
              :options="optionsFn"
              @input="updateDate($event,'predictEnd')"
              minimal
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <upload-file
      ref="uploadFile"
      multiple
      :label="openType==='start'?$t('approval.approvalReport'):$t('approval.finishReport')"
      :files="approvalDocument"
      :showRemark="false"
    />
    <!-- 立项/结项说明 -->
    <q-input
      v-model="approvalNote"
      filled
      type="textarea"
      :placeholder="openType==='start'?$t('approval.approvalNotes'):$t('approval.finishNotes')"
    />
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="min-width: 20vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{$t('title.confirm')}}</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click.stop="showDialog=false"
          />
        </q-card-section>

        <q-card-section>
          {{message}}
        </q-card-section>
        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            :label="fields.status === 'done'?$t('action.save'):$t('approval.onlySave')"
            v-close-popup
            @click.stop="onSave"
          />
          <q-btn
            v-if="fields.status !== 'done'"
            flat
            :label="$t('approval.toWorkflow')"
            v-close-popup
            @click.stop="onWorkflow"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-spinner
      v-if="showSpinner"
      class="loading-spinner"
      color="primary"
      size="3em"
    />
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'ProductDevApplyFor',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    openType: {
      type: String,
      default: 'start'
    }
  },
  data () {
    return {
      model: {},
      fields: {},
      btnType: '',
      approvalDocument: [],
      docTag: this.openType === 'start' ? 'PRODUCT_DEV_APPROVAL' : 'PRODUCT_DEV_DONE',
      showPredictEndDate: false,
      showEndDate: false,
      approvalNote: '',
      showDialog: false,
      showSpinner: false,
      applyType: this.openType === 'start' ? 'approval' : this.openType
    }
  },
  mounted () {
    this.loadProductDev(+this.id).then(res => {
      if (res) {
        this.model = res
        this.fields = _.cloneDeep(res)
        this.approvalNote = this.openType === 'start' ? this.fields.approvalNotes.startNotes : this.fields.approvalNotes.finishNotes
        if (this.openType === 'start') {
          this.fields.beginDate ? this.btnType = 'save' : this.btnType = 'apply'
        } else {
          this.fields.endDate ? this.btnType = 'save' : this.btnType = 'apply'
        }
      }
    })
    // 获取文档的方法
    this.loadTagDocument({ category: 'productDev', objectID: Number(this.id), tag: this.docTag, treeLevel: 3 }).then(res => {
      this.approvalDocument = res
    })
    this.loadCategoryWorkFlow({ category: 'productDev', id: (+this.id), type: this.applyType })
  },
  computed: {
    workflow () {
      return this.$store.getters['workflow/workflow']({ category: `productDev${this.id}`, type: this.applyType })
    },
    beginDate: {
      get () {
        return this.fields.beginDate || date.formatDate(Date.now(), 'YYYY/MM/DD').toString()
      },
      set (val) {
        this.fields.beginDate = val
      }
    },
    endDate: {
      get () {
        return this.fields.endDate ? this.fields.endDate : date.formatDate(Date.now(), 'YYYY/MM/DD').toString()
      },
      set (val) {
        this.fields.endDate = val
      }
    },
    predictEndDate: {
      get () {
        return this.fields.predictEndDate || date.formatDate(this.addMonth(Date.now(), 2), 'YYYY/MM/DD').toString()
      },
      set (val) {
        this.fields.predictEndDate = val
      }
    },
    message () {
      return (!this.workflow || this.workflow.result === 'reject') ? this.$t('approval.firstSubmitMessage')
        : (this.fields.status === 'done' ? this.$t('approval.onlySaveMessage') : this.$t('approval.submitMessage', { type: (this.openType === 'start' ? this.$t('approval.approval') : this.$t('approval.finish')) }))
    }
  },
  methods: {
    ...mapActions('productDev', ['updateStatus', 'loadProductDev']),
    ...mapActions('document', ['uploadTagDocument', 'loadTagDocument']),
    ...mapActions('workflow', ['loadCategoryWorkFlow', 'addWorkFlow']),
    updateDate (val, type) {
      // 只有立项受限制，结项已经显示了只能选立项的时间之后，在此不作判断
      if (this.openType === 'start') {
        if (type === 'start') {
          this.fields.beginDate = date.formatDate(val, 'YYYY/MM/DD').toString()
          if (this.fields.predictEndDate) {
            date.getDateDiff(new Date(val.replace(/-/g, '/')), new Date(this.model.predictEndDate.replace(/-/g, '/')), 'days') > 0
              ? this.predictEndDateValue(val) : this.initPredictEndDateValue()
          }
          if (this.fields.endDate) {
            date.getDateDiff(new Date(val.replace(/-/g, '/')), new Date(this.model.endDate.replace(/-/g, '/')), 'days') > 0
              ? this.endDateValue(val) : this.initEndDateValue()
          }
          this.$refs.qBeginDateProxy.hide()
        } else if (type === 'predictEnd') {
          this.fields.predictEndDate = date.formatDate(val, 'YYYY/MM/DD').toString()
          this.$refs.qPreDateProxy.hide()
        } else if (type === 'end') {
          this.fields.endDate = date.formatDate(val, 'YYYY/MM/DD').toString()
          this.$refs.qEndDateProxy.hide()
        }
      } else {
        this.fields.endDate = date.formatDate(val, 'YYYY/MM/DD').toString()
        this.$refs.qEndDateProxy.hide()
      }
    },
    endDateValue (val) {
      this.showEndDate = true
      this.fields.endDate = date.formatDate(this.addMonth(val, 2), 'YYYY/MM/DD').toString()
    },
    initEndDateValue () {
      this.showEndDate = false
      this.fields.endDate = this.model.endDate
    },
    predictEndDateValue (val) {
      this.showPredictEndDate = true
      this.fields.predictEndDate = date.formatDate(this.addMonth(val, 2), 'YYYY/MM/DD').toString()
    },
    initPredictEndDateValue () {
      this.showPredictEndDate = false
      this.fields.predictEndDate = this.model.predictEndDate
    },
    optionsFn (date) {
      if (this.openType === 'done' || this.showEndDate || this.showPredictEndDate) {
        return date >= formatDate(this.fields.beginDate, 'YYYY/MM/DD')
      } else {
        return true // 立项时间不作限制
      }
    },
    addMonth (d, m) {
      var ds = d.split('/'), _d = ds[2] - 0
      var nextM = new Date(ds[0], ds[1] - 1 + m + 1, 0)
      var max = nextM.getDate()
      d = new Date(ds[0], ds[1] - 1 + m, _d > max ? max : _d)
      return d.toLocaleDateString().match(/\d+/g).join('/')
    },
    updateProductDev () {
      this.showDialog = false
      if (!this.fields.predictEndDate) {
        this.fields.predictEndDate = date.formatDate(this.addMonth(this.beginDate, 2), 'YYYY/MM/DD').toString()
      }
      let payload = {}
      if (this.openType === 'start') {
        payload = {
          Id: +this.id,
          Status: 'start',
          BeginDate: this.beginDate,
          PredictEndDate: this.fields.predictEndDate,
          EndDate: this.fields.endDate,
          ApprovalNotes: {
            StartNotes: this.approvalNote,
            FinishNotes: this.model.approvalNotes.finishNotes
          }
        }
      } else {
        payload = {
          Id: +this.id,
          Status: 'done',
          EndDate: this.endDate,
          ApprovalNotes: {
            StartNotes: this.model.approvalNotes.startNotes,
            FinishNotes: this.approvalNote
          }
        }
      }
      return this.updateStatus(payload)
    },
    uploadDocument () {
      // 如果有文档则直接存入到文档下面的文件夹中
      const files = this.$refs.uploadFile.$refs.qUploader.files
      return this.uploadTagDocument({ files: files, category: 'productDev', objectID: Number(this.id), tag: this.docTag })
    },
    onSave () {
      // 仅保存
      this.updateProductDev()
      this.uploadDocument()
      // 路由跳转
      this.$router.push({
        name: 'productDevDetail',
        params: { id: Number(this.id) }
      })
    },
    async onWorkflow () {
      this.showSpinner = true
      // 保存+发起工作流
      // Promise.all()会影响进度条，改为await
      await this.uploadDocument()
      await this.updateProductDev()
      this.addWorkFlow({ objectType: 'productDev', objectID: +this.id, type: this.applyType, isFirst: !this.workflow }).then(res => {
        if (res) {
          // 成功
          showSuccessMessage(this.openType === 'start' ? this.$t('approval.applySuccess') : this.$t('approval.doneSuccess'))
        } else {
          // 失败
          showWarningMessage(this.openType === 'start' ? this.$t('approval.applyFail') : this.$t('approval.doneFail'))
        }
        this.showSpinner = false
        // 路由跳转
        this.$router.push({
          name: 'productDevDetail',
          params: { id: Number(this.id) }
        })
      })
    },
    openWorkflow () {
      let wfguid = this.workflow.wf_guid
      this.$workflow.open(wfguid)
    },
    onSubmit () {
      this.showDialog = true
    }
  },
  components: {
    UploadFile: () => import('components/file/UploadFile'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style lang="scss" scoped>
.borderLine {
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 0.6rem;
}
/deep/.q-uploader {
  width: auto !important;
  max-height: fit-content;
}
.q-uploader /deep/ .q-uploader__list {
  padding: 16px 0 16px 0;
}
/deep/.q-item__label {
  line-height: 1.4em !important;
}
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
