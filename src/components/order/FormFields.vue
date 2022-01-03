<template>
  <div class="row q-col-gutter-sm">

    <q-field
      filled
      class="col-12"
    >
      <q-radio
        keep-color
        v-model="model.classification"
        val="生产服务"
        label="生产服务"
        color="teal"
      />
      <q-radio
        keep-color
        v-model="model.classification"
        val="产品销售"
        label="产品销售"
        color="orange"
        class="q-ml-sm"
      />
    </q-field>
    <q-select
      filled
      use-input
      clearable
      emit-value
      map-options
      input-debounce="0"
      option-value="id"
      option-label="title"
      v-model="model.opportunityID"
      :options="opportunityOptionsFilter"
      class="col-12 col-md-6 order-select"
      @filter="oportunityOptionsFilterFn"
      :label="$t('order.field.label.opportunityID')"
    />
    <q-select
      filled
      use-input
      emit-value
      map-options
      input-debounce="0"
      option-value="id"
      option-label="title"
      class="col-12 col-md-6 order-select"
      :clearable="openType==='add'"
      :readonly="!!model.opportunityID"
      v-model="model.customerID"
      :options="customerOptionsFilter"
      @filter="customerOptionsFilterFn"
      :label="$t('order.customer')"
      hide-bottom-space
      lazy-rules
      :rules="[ val => val && val > 0 || '请选择客户']"
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
    <q-input
      filled
      prefix="￥"
      type="number"
      class="col-12 col-md-6"
      :clearable="openType==='add'"
      :readonly="!!model.opportunityID"
      v-model="model.amount"
      :label="$t('order.amount')"
    />
    <tw-select-person
      filled
      class="col-12 col-md-6"
      v-model="model.leaderID"
      emit-value
      placeholder=""
      :label="$t('order.leader')"
    />
    <tw-select-tree
      filled
      emit-value
      isOrganize
      node-key="id"
      label-key="name"
      position="bottom"
      class="col-12 col-md-6"
      :clearable="openType==='add'"
      :model.sync="model.organizeID"
      :nodes="selectOrganizesTree"
      :label="$t('order.organize')"
    />
    <q-input
      dense
      filled
      type="textarea"
      :value="model.notes"
      class="col-12"
      @input="val => model.notes = val"
      :label="$t('order.field.label.notes')"
    />
    <div class="col-12">
      <q-field
        filled
        :label="$t('auth.acl.acl')"
        stack-label
        color="grey-8"
      >
        <q-option-group
          :options="[
                { label: this.$t('auth.acl.public'), value: 0 },
                { label: this.$t('auth.acl.restrict'), value: 1 },
                { label: this.$t('auth.acl.secret', { category: this.$t('order.title') }), value: 2 }
              ]"
          type="radio"
          v-model="model.acl"
        />
      </q-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Order from '@/store/order/model'
export default {
  name: 'FormFields',
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    model: {
      type: Object,
      default: new Order()
    }
  },
  data () {
    return {
      showMoreInfoNotes: false,
      opportunityOptions: [],
      opportunityOptionsFilter: [],
      customerOptions: [],
      customerOptionsFilter: []
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree'])
  },
  created () {
    // 初始化可下单的商机数据
    let query = [
      { Key: 'IsLost', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'Status', Value: 602, Oper: 'ne' }// 未下单的
    ]
    this.$store.dispatch('opportunity/loadSelectOpportunitys', { query }).then(res => {
      if (res) {
        this.opportunityOptions = _.filter(res, oppor => oppor.status !== 602 && oppor.isLost === 0)
        this.opportunityOptionsFilter = this.opportunityOptions
      }
    })
    // 初始化客户数据
    this.$store.dispatch('customer/loadSelectCustomers').then(res => {
      if (res) {
        this.customerOptions = res
        this.customerOptionsFilter = this.customerOptions
      }
    })
  },
  watch: {
    'model.opportunityID': {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) {
          this.$store.dispatch('opportunity/loadOpportunity', newVal).then(res => {
            if (res) {
              this.opportunityOptions.push(..._.differenceBy([res], this.opportunityOptions, 'id'))
              this.opportunityOptionsFilter.push(..._.differenceBy([res], this.opportunityOptionsFilter, 'id'))
              if (res.classification) this.model.classification = res.classification
              if (res.leaderID) this.model.leaderID = res.leaderID
              if (res.organizeID) this.model.organizeID = res.organizeID
              if (res.customerID) this.model.customerID = res.customerID
            }
          })
          this.$store.dispatch('quotation/loadQuotationByOpportunityID', newVal).then(res => {
            if (res) {
              this.model.amount = res.amount
            }
          })
        }
      }
    },
    'model.customerID': {
      immediate: true,
      handler (newVal, oldVal) {
        newVal && this.$store.dispatch('customer/loadCustomerNoAcl', newVal).then(res => {
          if (res) {
            this.customerOptions.push(..._.differenceBy([res], this.customerOptions, 'id'))
            this.customerOptionsFilter.push(..._.differenceBy([res], this.customerOptionsFilter, 'id'))
            if (res.title) this.model.customerName = res.title
          }
        })
      }
    }
  },
  methods: {
    oportunityOptionsFilterFn (val, update) {
      update(() => {
        if (val === '') {
          this.opportunityOptionsFilter = this.opportunityOptions
        } else {
          this.opportunityOptionsFilter = this.opportunityOptions.filter(v => v.title.toLowerCase().indexOf(val.toLowerCase()) > -1)
        }
      })
    },
    customerOptionsFilterFn (val, update) {
      update(() => {
        if (val === '') {
          this.customerOptionsFilter = this.customerOptions
        } else {
          this.customerOptionsFilter = this.customerOptions.filter(v => v.title.toLowerCase().indexOf(val.toLowerCase()) > -1)
        }
      })
    }
  },
  components: {
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue')
  }
}
</script>

<style lang="scss" scoped>
.order-border {
  border: solid 1px lightgray;
  border-radius: 4px;
}
.order-select /deep/.q-field__control-container > .q-field__native {
  display: contents;
}
.order-select /deep/.q-field__control-container > .q-field__native > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
