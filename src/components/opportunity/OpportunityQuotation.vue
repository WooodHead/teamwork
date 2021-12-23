<template>
  <q-card
    class="card-grow-in-page q-px-xxl"
    :flat="$q.screen.lt.sm || guide"
  >
    <q-card-section>
      <span class="text-bold text-h6 text-center">
        {{$t('opportunity.quotation.approval')}}
      </span>
      <q-banner class="bg-grey-3">
        <q-item>
          <q-item-section caption>
            <q-item-label>操作步骤：</q-item-label>
            <q-item-label>1. 上传加工件图</q-item-label>
            <q-item-label>2. 上传您的报价单</q-item-label>
            <q-item-label>3. 填写报价说明</q-item-label>
            <q-item-label>4. 填写报价总金额</q-item-label>
          </q-item-section>
        </q-item>
      </q-banner>
    </q-card-section>
    <q-card-section>
      <q-card flat>
        <q-form>
          <!-- 加工件图 -->
          <q-field
            filled
            label="加工件(上传加工件或零件图片)"
            stack-label
            class="row q-col-gutter-x-md quotation-editor "
          >
            <!-- <div class="col-12 text-caption text-grey q-mb-xs">
              上传加工件或零件图片
            </div> -->
            <template v-slot:control>
              <upload-file
                ref="partsUploadFile"
                multiple
                class="col-12 q-my-sm"
                :label="$t('opportunity.quotation.uploadPartsPic')"
                folder="opportunity"
                :files="partsDocument"
                :showRemark="false"
                :formAction="formAction"
              />
            </template>
          </q-field>
          <!-- 报价单 -->
          <q-field
            filled
            label="报价单(上传您的商务报价单,必填)"
            stack-label
            class="row q-col-gutter-x-md"
          >
            <template v-slot:control>
              <upload-file
                ref="quotationBillsUploadFile"
                multiple
                :label="$t('opportunity.quotation.uploadQuotationBills')"
                folder="opportunity"
                :files="quotationBillsDocument"
                :showRemark="false"
                :formAction="formAction"
                class="col-12 q-my-sm"
              />
            </template>
          </q-field>
          <!-- 报价申请说明 -->
          <q-field
            filled
            label="报价说明"
            stack-label
            class="row q-col-gutter-x-md quotation-editor "
          >
            <template v-slot:control>
              <q-input
                class="col-12 q-my-sm"
                v-model="initModel.notes"
                type="textarea"
                outlined
                filled
              />
            </template>
          </q-field>
          <q-field
            filled
            :label="$t('opportunity.quotation.totalAmount')"
            stack-label
            class="row q-col-gutter-x-md"
          >
            <template v-slot:control>
              <!-- 报价总金额 -->
              <q-input
                dense
                input-class="text-center"
                v-model="initModel.amount"
                type="number"
                :placeholder="$t('opportunity.quotation.totalAmount')"
                prefix="￥"
                :rules="[val => val >0 || $t('opportunity.quotation.inputAmountErrorNotes')]"
                ref="amount"
                class="col-12 q-my-sm"
                filled
              />
            </template>
          </q-field>
          <q-card-actions
            class="q-ma-none"
            align="center"
          >
            <q-btn
              v-if="workflow"
              outline
              rounded
              color="primary"
              :label="$t('opportunity.quotation.showWorkFlow')"
              @click.stop="openWorkflow"
            />
            <form-action
              align="right"
              :action="formAction"
              @submit="onSubmit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-card-section>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="min-width: 20vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-bold">
            {{(workflow&&workflow.result!== 'reject'&&fields.status !== 'done')?$t('approval.submitTitle'):$t('title.confirm')}}
          </div>
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
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
import Quotation from '../../store/quotation/model'
export default {
  name: 'OpportunityQuotation',
  props: {
    id: {
      type: [String, Number],
      required: true
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
      partsDocument: [],
      quotationBillsDocument: [],
      opportunity: {},
      initModel: new Quotation(),
      fields: [],
      showDialog: false,
      showSpinner: false,
      amount: 0,
      type: 'OPPORTUNITY_QUOTATION_APPROVAL', // 商机报价申请
      formAction: [{ label: this.$t('action.submit'), action: 'submit' }]
    }
  },
  mounted () {
    this.loadOpportunity(+this.id).then(res => {
      if (res) {
        this.opportunity = res
      }
    })
    this.loadQuotationByOpportunityID(+this.id).then(res => {
      if (res) {
        this.initModel = res
      }
    })
    // 获取零件图文档
    this.loadTagDocument({ category: 'opportunity', objectID: Number(this.id), tag: this.$store.state.quotation.partsPicTag, treeLevel: 3 }).then(res => {
      this.partsDocument = res
    })
    // 获取报价单
    this.loadTagDocument({ category: 'opportunity', objectID: Number(this.id), tag: this.$store.state.quotation.quotationBillsTag, treeLevel: 3 }).then(res => {
      this.quotationBillsDocument = res
    })
    this.loadCategoryWorkFlow({ category: 'opportunity', id: (+this.id), type: this.type })
  },
  computed: {
    workflow () {
      return this.$store.getters['workflow/workflow']({ category: `opportunity${this.id}`, type: this.type })
    },
    message () {
      return (!this.workflow || this.workflow.result === 'reject') ? this.$t('approval.firstSubmitMessage')
        : (this.fields.status === 'done' ? this.$t('approval.onlySaveMessage') : this.$t('approval.submitMessage', { type: this.$t('opportunity.approval') }))
    }
  },
  methods: {
    ...mapActions('opportunity', ['loadOpportunity', 'refreshOpportunity']),
    ...mapActions('quotation', ['loadQuotationByOpportunityID', 'addQuotation', 'updateQuotation']),
    ...mapActions('document', ['uploadTagDocument', 'loadTagDocument']),
    ...mapActions('workflow', ['loadCategoryWorkFlow', 'addWorkFlow']),
    ...mapActions('guide', ['updateGuide']),
    onSubmit () {
      // 先进行表单校验。校验通过后，才弹出确认框
      const files = this.$refs.quotationBillsUploadFile.$refs.qUploader.files
      if (files.length === 0) {
        showWarningMessage('请上传报价单')
        return
      }
      let amountValidate = this.$refs.amount.validate()
      if (amountValidate) {
        this.showDialog = true
      }
    },
    /**
     *提交报价数据
     */
    submitQuotationData () {
      this.showDialog = false
      this.initModel.opportunityID = +this.id
      // 客户信息和机构信息
      this.initModel.customerID = this.opportunity.customerID
      this.initModel.customerName = this.opportunity.customerName
      this.initModel.organizeID = this.opportunity.organizeID
      this.initModel.organizeName = this.opportunity.organizeName
      return this.initModel.id === 0 ? this.addQuotation(this.initModel) : this.updateQuotation(this.initModel)
    },
    /***
     * 上传零件图
     */
    uploadPartsPic () {
      // 如果有文档则直接存入到文档下面的文件夹中
      const files = this.$refs.partsUploadFile.$refs.qUploader.files
      if (files.length > 0) {
        return this.uploadTagDocument({ files: files, category: 'opportunity', objectID: Number(this.id), tag: this.$store.state.quotation.partsPicTag })
      }
    },
    /***
     * 上传报价单
     */
    uploadQuotationBills () {
      // 如果有文档则直接存入到文档下面的文件夹中
      const files = this.$refs.quotationBillsUploadFile.$refs.qUploader.files
      if (files.length > 0) {
        return this.uploadTagDocument({ files: files, category: 'opportunity', objectID: Number(this.id), tag: this.$store.state.quotation.quotationBillsTag })
      }
    },
    async onSave () {
      await this.uploadPartsPic()
      await this.uploadQuotationBills()
      await this.submitQuotationData()
      if (this.guide && this.lastGuide) {
        this.updateGuide({
          ObjectID: Number(this.id),
          ObjectType: 'opportunity',
          finished: 1
        }).then(res => {
          this.$router.push({
            name: 'opportunityDetail',
            params: { id: Number(this.id) }
          })
        })
      } else {
        // 路由跳转
        this.$router.push({
          name: 'opportunityDetail',
          params: { id: Number(this.id) }
        })
      }
    },
    async onWorkflow () {
      this.showSpinner = true
      // 保存+发起工作流
      // Promise.all()会影响进度条，改为await
      await this.uploadPartsPic()
      await this.uploadQuotationBills()
      await this.submitQuotationData()
      this.addWorkFlow({ objectType: 'opportunity', objectID: +this.id, type: this.type, isFirst: !this.workflow }).then(res => {
        if (res) {
          this.refreshOpportunity(+this.id)
          // 成功
          showSuccessMessage(this.$t('opportunity.quotation.applySuccess'))
        } else {
          // 失败
          showWarningMessage(this.$t('opportunity.quotation.applyFail'))
        }
        this.showSpinner = false

        if (this.guide && this.lastGuide) {
          this.updateGuide({
            ObjectID: Number(this.id),
            ObjectType: 'opportunity',
            finished: 1
          }).then(res => {
            this.$router.push({
              name: 'opportunityDetail',
              params: { id: Number(this.id) }
            })
          })
        } else {
          // 路由跳转
          this.$router.push({
            name: 'opportunityDetail',
            params: { id: Number(this.id) }
          })
        }
      })
    },
    openWorkflow () {
      let wfguid = this.workflow.wf_guid
      this.$workflow.open(wfguid)
    }
  },
  components: {
    FormAction: () => import('components/base/TwFormAction'),
    UploadFile: () => import('components/file/UploadFile')
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
/deep/.quotation-editor .editor {
  border-bottom: unset !important;
  cursor: initial !important;
}
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}
.formItem-required::after {
  content: "*";
  position: absolute;
  font-size: 18px;
  color: red;
}
</style>
