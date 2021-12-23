<template>
  <tw-form @primary="onSubmit">
    <div class="row q-col-gutter-sm">
      <q-input
        filled
        clearable
        input-class="text-center text-h5"
        debounce="500"
        class="col-12"
        lazy-rules
        :rules="[val => !!val.trim() || $t('allocation.formLabel.title')]"
        v-model="model.title"
        :placeholder="$t('allocation.formLabel.title')"
      />
      <manufacturer-select
        :value.sync="model.manufacturerID"
        :label="$t('allocation.formLabel.manufacturer')"
        @selected-event="manufacturerSelected($event)"
        :rules="[val => val && val.id > 0 || $t('rule.fieldIsRequired')]"
        lazyRules
        class="col-12 col-md-6"
        filled
      />
      <div class="col-12 col-md-6">
        <q-input
          filled
          v-model="model.expectedDeliveryDate"
          :label="$t('order.expectedDeliveryDate')"
          mask="date"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :value="model.expectedDeliveryDate"
                  @input="val=>{model.expectedDeliveryDate = val;$refs.qDateProxy.hide()}"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
  
      <quasar-editor
        :focus="false"
        folder="order"
        class="col-12"
        :value="notes"
        @input="(val)=>{model.notes=val}"
        :applied="applied"
        placeholder="请上传图纸、加工清单、填写相关加工说明。"
      ></quasar-editor>
     
      <tw-choose-notify
        :module="{category,id:+objectID}"
        :widget="{category:'allocation',id: +id}"
        :category="category"
        :objectID="+objectID"
        :always="true"
        :subscribers.sync="subscribers"
      />
    </div>
  </tw-form>
</template>

<script>
import Allocation from '@/store/allocation/model'
import { mapActions } from 'vuex'
export default {
  name: 'allocationForm',
  props: {
    openType: {
      type: String,
      default: 'add',
      required: true
    },
    id: {
      type: [String, Number],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: 'order',
      required: true
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: true
    }
  },
  data () {
    return {
      model: new Allocation(),
      subscribers: [],
      subscribersClone: [],
      notes: '',
      applied: false
    }
  },
  created () { },
  mounted () {
    if (this.openType === 'edit') {
      this.loadAllocation(this.id).then(res => {
        if (res) {
          this.notes = res.notes
          this.model = _.clone(res)
        }
      })
    } else {
      this.category === 'order' && this.$store.dispatch('order/loadOrder', this.objectID).then(res1 => {
        if (res1) {
          // 冗余订单编号
          this.model.orderNo = res1.orderNo
          // 初始化默认，订阅人为创建者和订单的客户经理
          if (res1.leaderID) {
            this.subscribers = _.uniq([this.$myinfo.id, res1.leaderID]); this.subscribersClone = _.uniq([this.$myinfo.id, res1.leaderID])
          } else { this.subscribers = [this.$myinfo.id]; this.subscribersClone = [this.$myinfo.id] }
          // 初始化商机相关内容
          res1.opportunityID && this.$store.dispatch('opportunity/loadOpportunity', res1.opportunityID).then(res2 => {
            if (res2) {
              this.notes = res2.notes
              this.model.notes = res2.notes
              this.model.title = `${res2.title}_${new Date().getTime()}`
              this.model.amount = res2.transactionPrice
            }
          })
        }
      })
    }
  },
  computed: {},
  watch: {},
  methods: {
    ...mapActions('allocation', ['loadAllocation', 'addAllocation', 'updateAllocation']),
    manufacturerSelected (manufacturer) {
      // 将生产单位负责人加入订阅者
      this.subscribers = _.uniq([...this.subscribersClone, manufacturer.leaderId])
      // 生产单位负责人赋值给生产需求负责人
      this.model.leaderID = manufacturer.leaderId
    },
    onSubmit () {
      this.applied = true
      this.model.orderID = this.objectID
      this.model.subscribers = this.subscribers
      if (this.openType === 'add') {
        this.addAllocation(this.model).then(res => {
          res && this.routerJump(res)
        })
      } else {
        this.updateAllocation(this.model).then(res => {
          res && this.routerJump(res)
        })
      }
    },
    routerJump (allocation) {
      this.$router.push({
        name: 'allocationDetail',
        params: { category: this.category, objectID: this.objectID, id: allocation.id }
      })
    }
  },
  components: {
    ManufacturerSelect: () => import('components/manufacturer/ManufacturerSelect'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped lang="scss">
/deep/.allocation-editor .editor {
  border-bottom: unset !important;
  cursor: initial !important;
}
</style>
