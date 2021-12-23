<template>
  <tw-form
    :primaryLabel="$t('action.submit')"
    :secondary="!!workflow"
    :secondaryLabel="$t('approval.showWorkFlow')"
    @primary="onSubmit"
    @secondary="openWorkflow"
  >
    <template v-if="$custom.isJDXAStyleOfProjectManage && openType === 'start'">

      <!-- 是否研发类项目 -->
      <tw-select-edit
        filled
        withDictKey
        module="project"
        field="ProjClassify"
        :label="$t('approval.isScientificProject')"
        :editable="$myinfo.auth.role.isSystemAdministrator"
        :value="newClassify||fields.classify"
        @input="(payload)=>{newClassify= payload.dictValue}"
        :rules="[val => val&&val.trim().length>0 || $t('approval.selectScientificProject')]"
      />
      <!-- 是否形成销售 -->
      <q-checkbox
        class="q-mt-none"
        style="margin-left: -7px;"
        v-model="fields.saled"
        :label="$t('approval.isSaled')"
      />
      <!-- 关联产品 -->
      <div class="row items-center">
        <q-btn
          outline
          rounded
          color="primary"
          :label="$t('productDev.relate')"
          @click.stop="showSelect=true"
        />
        <q-chip
          v-for="obj in relatedProductDev"
          :key="obj.id"
          color="grey-3"
          text-color="grey-9"
        >
          {{obj.title}}
        </q-chip>
      </div>
    </template>
    <!-- 立项时间-->
    <q-input
      v-if="openType==='start'"
      filled
      input-class="text-center"
      :label="$t('approval.approvalDate')"
      v-model="beginDate"
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
      :label="$t('project.predictEndDate')"
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

    <!-- 上传文件 -->
    <upload-file
      ref="uploadFile"
      multiple
      :label="openType==='start'?$t('approval.approvalReport'):$t('approval.finishReport')"
      :files="document"
      :showRemark="false"
    />
    <!-- 立项/结项说明 -->
    <q-input
      v-model="approvalNote"
      filled
      type="textarea"
      :placeholder="openType==='start'?$t('approval.approvalNotes'):$t('approval.finishNotes')"
    />

    <!-- 提交立项提示信息 -->
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="min-width: 20vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-bold">{{(workflow&&workflow.result!== 'reject'&&fields.status !== 'done')?$t('approval.submitTitle'):$t('title.confirm')}}</div>
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
    <!-- 产品资源选择弹窗 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <resource-select-panel
        :objectID="+id"
        category="productDev"
        normalCategory="project"
        flat
        multiple
        :initSelectedResourceIDs="relatedIds"
        @multiSelect="multiSelect"
        style="width: 600px; max-width: 90vw;"
      />
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
import { mapState, mapGetters, mapActions } from 'vuex'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
const config = require('app/app.config.js')
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'ProjectApplyFor',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    openType: {
      type: String,
      default: 'start' // start、done
    },
    guide: {
      type: Boolean,
      default: false
    },
    lastGuide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      document: [],
      docTag: this.openType === 'start' ? 'PROJECT_APPROVAL' : 'PROJECT_DONE',
      showPredictEndDate: false,
      showEndDate: false,
      initModel: { initBeginDate: '', initPreEndDate: '', initEndDate: '', initApprovalNotes: { initStartNotes: '', initFinsihNotes: '' } },
      fields: [],
      approvalNote: '',
      showDialog: false,
      showSpinner: false,
      showSelect: false,
      newClassify: '',
      applyType: this.openType === 'start' ? 'approval' : this.openType,
      extranet: config.extranet
    }
  },
  mounted () {
    this.loadProject(+this.id).then(res => {
      if (res) {
        this.initModel.initBeginDate = _.cloneDeep(res.beginDate)
        this.initModel.initPreEndDate = _.cloneDeep(res.predictEndDate)
        this.initModel.initEndDate = _.cloneDeep(res.endDate)
        this.initModel.initApprovalNotes = (res.approvalNotes && {
          initStartNotes: _.cloneDeep(res.approvalNotes.startNotes),
          initFinsihNotes: _.cloneDeep(res.approvalNotes.finishNotes)
        }) || {}
        this.fields = _.cloneDeep(res)
        this.approvalNote = this.openType === 'start' ? this.fields.approvalNotes.startNotes : this.fields.approvalNotes.finishNotes
      }
    })
    // treeLevel设定为-1（后台不会再取level条件），此处是解决文件移动后的层级变化，找不到该附件的问题
    this.loadTagDocument({ category: 'project', objectID: Number(this.id), tag: this.docTag, treeLevel: 3 }).then(res => {
      this.document = res
    })
    this.loadCategoryWorkFlow({ category: 'project', id: (+this.id), type: this.applyType })
    this.loadResourceRelations({ category1: 'project', id1: +this.id, category2: 'productDev', type: this.relationType['project']['productDev'], fields: 'Select' })
  },
  computed: {
    ...mapState('resource', ['relationType']),
    ...mapGetters('resource', ['resourceRelations', 'categoryRelations']),
    workflow () {
      return this.$store.getters['workflow/workflow']({ category: `project${this.id}`, type: this.applyType })
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
    },
    relatedIds () {
      let realtions = this.resourceRelations({ category1: 'project', id1: +this.id, category2: 'productDev', type: this.relationType['project']['productDev'] })
      return realtions && realtions.map(r => r.selectId)
    },
    relatedProductDev () {
      return this.categoryRelations({ category: 'productDev', ids: this.relatedIds })
    }
  },
  methods: {
    ...mapActions('project', ['loadProject', 'updateStartOrDone']),
    ...mapActions('document', ['uploadTagDocument', 'loadTagDocument']),
    ...mapActions('workflow', ['loadCategoryWorkFlow', 'addWorkFlow']),
    ...mapActions('guide', ['updateGuide']),
    ...mapActions('resource', ['addResourceRelations', 'deleteResourceRelations', 'loadResourceRelations']),
    // 更新时间方法。val:时间，dateType:时间类型（立项、预计结项、结项）
    updateDate (val, dateType) {
      // 只有立项受限制，结项已经显示了只能选立项的时间之后，在此不作判断
      if (this.openType === 'start') {
        if (dateType === 'start') {
          this.fields.beginDate = date.formatDate(val, 'YYYY/MM/DD').toString()
          if (this.fields.predictEndDate) {
            // 选择的立项时间如果大于预计结束时间，则显示预计时间框，且预计时间为两个月后
            date.getDateDiff(new Date(val.replace(/-/g, '/')), new Date(this.initModel.initPreEndDate.replace(/-/g, '/')), 'days') > 0
              ? this.predictEndDateValue(val) : this.initPredictEndDateValue()
          }

          if (this.fields.endDate) {
            // 开始时间如果大于结束时间，显示结束时间框，且结束时间为两个月后
            date.getDateDiff(new Date(val.replace(/-/g, '/')), new Date(this.initModel.initEndDate.replace(/-/g, '/')), 'days') > 0
              ? this.endDateValue(val) : this.initEndDateValue()
          }
          this.$refs.qBeginDateProxy.hide()
        } else if (dateType === 'predictEnd') {
          this.fields.predictEndDate = date.formatDate(val, 'YYYY/MM/DD').toString()
          this.$refs.qPreDateProxy.hide()
        } else if (dateType === 'end') {
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
      this.fields.endDate = this.initModel.initEndDate
    },
    predictEndDateValue (val) {
      this.showPredictEndDate = true
      this.fields.predictEndDate = date.formatDate(this.addMonth(val, 2), 'YYYY/MM/DD').toString()
    },
    initPredictEndDateValue () {
      this.showPredictEndDate = false
      this.fields.predictEndDate = this.initModel.initPreEndDate
    },
    optionsFn (date) {
      if (this.openType === 'done' || this.showEndDate || this.showPredictEndDate) {
        return date >= formatDate(this.fields.beginDate, 'YYYY/MM/DD')
      } else {
        return true // 立项时间不作限制，可任意选择立项时间
      }
    },
    addMonth (d, m) {
      var ds = d.split('/'), _d = ds[2] - 0
      var nextM = new Date(ds[0], ds[1] - 1 + m + 1, 0)
      var max = nextM.getDate()
      d = new Date(ds[0], ds[1] - 1 + m, _d > max ? max : _d)
      return d.toLocaleDateString().match(/\d+/g).join('/')
    },
    updateProject () {
      this.showDialog = false
      if (!this.fields.predictEndDate) {
        this.fields.predictEndDate = date.formatDate(this.addMonth(this.beginDate, 2), 'YYYY/MM/DD').toString()
      }
      let payload = {}
      if (this.openType === 'start') {
        payload = {
          id: +this.id,
          beginDate: this.beginDate,
          predictEndDate: this.fields.predictEndDate,
          endDate: this.fields.endDate,
          openType: this.openType,
          approvalNotes: {
            StartNotes: this.approvalNote,
            FinishNotes: this.initModel.initApprovalNotes.initFinsihNotes
          },
          classify: this.newClassify,
          saled: this.fields.saled
        }
      } else {
        payload = {
          id: +this.id,
          endDate: this.endDate,
          openType: this.openType,
          approvalNotes: {
            StartNotes: this.initModel.initApprovalNotes.initStartNotes,
            FinishNotes: this.approvalNote
          }
        }
      }
      return this.updateStartOrDone(payload)
    },
    uploadDocument () {
      // 如果有文档则直接存入到文档下面的文件夹中
      const files = this.$refs.uploadFile.$refs.qUploader.files
      return this.uploadTagDocument({ files: files, category: 'project', objectID: Number(this.id), tag: this.docTag })
    },
    onSave () {
      // 仅保存
      this.updateProject()
      this.uploadDocument()

      if (this.guide && this.lastGuide) {
        this.updateGuide({
          ObjectID: Number(this.id),
          ObjectType: 'project',
          finished: 1
        }).then(res => {
          this.$router.push({
            name: 'projectDetail',
            params: { id: Number(this.id) }
          })
        })
      } else {
        // 路由跳转
        this.$router.push({
          name: 'projectDetail',
          params: { id: Number(this.id) }
        })
      }
    },
    async onWorkflow () {
      this.showSpinner = true
      let payload = { objectType: 'project', objectID: +this.id, type: this.applyType, isFirst: !this.workflow }
      if (this.openType === 'start') {
        // 关联的产品传至后台，后台不用重新获取
        let relatedProductDevTitle = this.relatedProductDev.map(r => r.title).join(',')
        payload.relatedProductDev = relatedProductDevTitle
      }

      // 保存+发起工作流
      // Promise.all()会影响进度条，改为await
      await this.uploadDocument()
      await this.updateProject()
      this.addWorkFlow(payload).then(res => {
        if (res) {
          // 成功
          showSuccessMessage(this.openType === 'start' ? this.$t('approval.applySuccess') : this.$t('approval.doneSuccess'))
        } else {
          // 失败
          showWarningMessage(this.openType === 'start' ? this.$t('approval.applyFail') : this.$t('approval.doneFail'))
        }
        this.showSpinner = false

        if (this.guide && this.lastGuide) {
          this.updateGuide({
            ObjectID: Number(this.id),
            ObjectType: 'project',
            finished: 1
          }).then(res => {
            this.$router.push({
              name: 'projectDetail',
              params: { id: Number(this.id) }
            })
          })
        } else {
          // 路由跳转
          this.$router.push({
            name: 'projectDetail',
            params: { id: Number(this.id) }
          })
        }
      })
    },
    openWorkflow () {
      let wfguid = this.workflow.wf_guid
      this.$workflow.open(wfguid)
    },
    multiSelect (selectedResources) {
      this.showSelect = false
      let relates = [], ids = selectedResources.map(r => r.id), resType = this.relationType['project']['productDev']
      _.map(ids, m => {
        relates.push(Object.assign({}, {
          category1: 'project',
          id1: +this.id,
          category2: 'productDev',
          id2: m,
          type: resType || 'correlation',
          path: _.concat(+this.id, m).join(',')
        }))
      })
      // 更新关联关系
      if (selectedResources && selectedResources.length > 0) {
        this.addResourceRelations(relates)
        // 清空关联关系
      } else {
        this.relatedIds && this.relatedIds.length && this.deleteResourceRelations({ category1: 'project', objectId: +this.id, category2: 'productDev', type: resType || 'correlation' })
      }
    },
    onSubmit () {
      this.showDialog = true
    }
  },
  components: {
    UploadFile: () => import('components/file/UploadFile'),
    ResourceSelectPanel: () => import('components/resource/ResourceSelectPanel'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
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
/deep/.q-checkbox__label {
  font-weight: bold;
  line-height: 1.75rem;
  font-size: 1rem;
}
/deep/.q-field__native span {
  position: absolute;
  left: 50%;
}
</style>
