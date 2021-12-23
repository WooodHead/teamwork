<template>
  <div class="q-py-md">
    <tw-stepper
      class="stepper-nocontent"
      :step="currStatus"
      :alternativeLabels="!$q.screen.gt.sm"
      :stepList="stepList"
    />
    <!--指派、评估、报价、输单、激活-->
    <div class="flex justify-center">
      <div class="q-pt-md q-gutter-sm">
        <!--指派负责人。条件：未输单+已认领+非已下单-->
        <q-btn
          v-if="notLost && notOrdered"
          outline
          rounded
          color="primary"
          label="指派"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
            ref="qConnectorProxy"
          >
            <customer-manager-select-panel
              :customerManagerID="model.leaderID"
              @onAssignCallback="onAssignCallback"
            />
          </q-popup-proxy>
        </q-btn>
        <!-- 评估。条件：未输单+未下单 -->
        <q-btn
          v-if="notLost && notOrdered "
          outline
          rounded
          color="indigo"
          label="评估"
          @click.native="gotoAssess"
        />
        <!--报价。条件：未输单+未下单-->
        <q-btn
          v-if="notLost && notOrdered "
          outline
          rounded
          color="secondary"
          :label="quotaionBtnLabel"
          @click.native="gotoQuotation"
        />
        <!--下单。条件：未输单+未下单---->
        <q-btn
          v-if="notLost && notOrdered"
          outline
          rounded
          color="primary"
          label="下单"
          @click.native="generateOrder"
        />
        <!--输单。条件：非输单+未下单-->
        <q-btn
          v-if="notLost && notOrdered"
          outline
          rounded
          color="negative"
          label="输单"
          @click.native="changeNote = true"
        />
        <!--激活。条件：输单-->
        <q-btn
          v-if="!notLost"
          outline
          rounded
          color="primary"
          label="激活"
          @click.native="showActiveDialog = true"
        />
      </div>
    </div>
    <!--激活弹框-->
    <q-dialog
      v-model="showActiveDialog"
      persistent
    >
      <q-card style="min-width: 20vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-bold">激活商机</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click.stop="showActiveDialog=false"
          />
        </q-card-section>

        <q-card-section>
          可根据实际情况，选择不同的操作按钮进行激活
        </q-card-section>
        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            label="重新开始"
            v-close-popup
            @click.stop="active('ReStart')"
          />
          <q-btn
            outline
            label="恢复到关闭前"
            v-close-popup
            @click.stop="active('PrvStep')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--输单弹框-->
    <q-dialog
      v-model="changeNote"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">输单说明
          </div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click.stop="changeNote=false"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            type="textarea"
            dense
            v-model="lostReason"
            autofocus
            :rules="[val => !!val.trim() || $t('opportunity.pleaseGiveCloseLostNotes')]"
            ref="lostReason"
          />
        </q-card-section>
        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            outline
            :label="$q.lang.label.cancel"
            color="primary"
            class="q-ml-md"
            v-close-popup
          />
          <q-btn
            :label="$q.lang.label.ok"
            color="primary"
            @click="closeLost"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'OpportunityStepper',
  props: {
    id: {
      type: [String, Number],
      required: false
    },
    model: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      step: 0,
      stepList: [],
      myself: LocalStorage.getItem('myself'),
      changeNote: false,
      showActiveDialog: false,
      lostReason: '',
      query:
        [
          { Key: 'ObjectType', Value: 'opportunity', Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: Number(+this.model.id), Oper: 'eq' }
        ],
      limit: 10,
      type: 'OPPORTUNITY_QUOTATION_APPROVAL' // 商机报价申请
    }
  },
  mounted () {
    this.initStepList()
    this.loadCategoryWorkFlow({ category: 'opportunity', id: +this.model.id, type: this.type })
  },
  computed: {
    ...mapState('opportunity', ['status']),
    loadAssess () {
      return this.$store.getters['assess/allAssess']({ category: 'opportunity', objectID: +this.model.id }) || []
    },
    currStatus () {
      return (this.model && this.model.status) || 100
    },
    currSatusFlow () {
      return (this.model && this.model.statusFlow && JSON.parse(this.model.statusFlow)) || []
    },
    /**
     * 未输单
     */
    notLost () {
      return (this.model && +this.model.isLost === 0)
    },
    /** 未下单 */
    notOrdered () {
      return this.currStatus !== 602
    },
    workflow () {
      return this.$store.getters['workflow/workflow']({ category: `opportunity${this.model.id}`, type: this.type })
    },
    quotaionBtnLabel () {
      return this.workflow ? '重新报价' : '报价'
    }
  },
  watch: {
    currStatus: function (newVal, oldVal) {
      if (newVal) {
        this.initStepList()
      }
    }
  },
  methods: {
    ...mapActions('activity', ['loadLatestTimeActivity']),
    ...mapActions('opportunity', ['closeLostOrActive', 'assignCustomerManager']),
    ...mapActions('workflow', ['loadCategoryWorkFlow']),
    initStepList () {
      this.stepList = this.$store.getters['opportunity/steps']({ arrStatusFlow: this.currSatusFlow, currStatus: this.currStatus })
    },
    /**
     *评估
     */
    gotoAssess () {
      if (this.loadAssess.length > 0) {
        this.$router.push({
          name: 'assess',
          params: {
            category: 'opportunity',
            objectID: +this.model.id
          }
        })
      } else {
        this.$router.push({
          name: 'assessAdd',
          params: {
            openType: 'add',
            category: 'opportunity',
            objectID: +this.model.id
          }
        })
      }
    },
    /**
     *去报价
     */
    gotoQuotation () {
      this.$router.push({
        name: 'opportunityQuotation',
        params: { id: +this.model.id }
      })
    },
    /**
     *下单
     */
    generateOrder () {
      this.$router.push({
        name: 'orderEdit',
        params: { id: 0, openType: 'add' },
        query: { opportunityID: +this.model.id }
      })
    },
    /**
     *激活
     */
    active (activeType) {
      this.closeLostOrActive({ id: +this.model.id, active: 'active', activeType: activeType }).then(res => {
        if (res) {
          this.loadLatestTimeActivity({
            objectType: 'opportunity',
            objectID: Number(this.model.id)
          })
          showSuccessMessage('已激活')
        } else {
          showWarningMessage('操作失败')
        }
      })
    },
    // 关闭输单
    closeLost () {
      let reasonValidate = this.$refs.lostReason.validate()
      if (reasonValidate) {
        this.closeLostOrActive({ id: +this.model.id, active: 'closedLost', activeType: '', notes: this.lostReason }).then(res => {
          this.changeNote = false
          if (res) {
            showSuccessMessage('已输单')
            this.loadLatestTimeActivity({
              objectType: 'opportunity',
              objectID: Number(this.model.id)
            })
          } else {
            showWarningMessage('操作失败')
          }
        })
      }
    },
    /**
     * 指派
     * @param0 leaderID 客户经理ID
     */
    onAssignCallback (leaderID) {
      if (+leaderID > 0) {
        let updateFields = {
          Id: this.model.id,
          LeaderID: leaderID
        }
        this.assignCustomerManager(updateFields).then(res => {
          this.$refs.qConnectorProxy.hide()
          showSuccessMessage('操作成功')
          res && Object.assign(this.model, res)
        })
      }
    }
  },
  components: {
    CustomerManagerSelectPanel: () => import('components/opportunity/CustomerManagerSelectPanel'),
    TwStepper: () => import('components/base/TwStepper')
  }
}
</script>

<style scoped lang="scss">
/deep/.q-stepper__header--alternative-labels .q-stepper__tab,
/deep/.q-stepper__tab {
  min-height: 0;
  padding: 0;
}
</style>
