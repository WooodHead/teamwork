<template>
  <div class="row q-col-gutter-sm">
    <q-field
      filled
      class="col-12 col-sm-6"
    >
      <q-radio
        v-model="model.isOutCustomer"
        :val="1"
        :disable="openType!=='add'"
        label="外部客户"
      />
      <q-radio
        v-model="model.isOutCustomer"
        :val="0"
        :disable="openType!=='add'"
        label="内部客户"
      />
    </q-field>
    <tw-select-tree
      v-if="!model.isOutCustomer"
      filled
      isOrganize
      emit-value
      node-key="id"
      label-key="name"
      :nodes="selectOrganizesTree"
      :model.sync="model.selfOrganizeID"
      position="bottom"
      class="col-12 col-md-6"
      :label="$t('customer.label.selfOrganize')"
    />
    <q-input
      v-if="model.isOutCustomer"
      filled
      ref="inputSearch"
      class="col-12 col-sm-6"
      v-model="model.title"
      :placeholder="$t('customer.label.title')"
      debounce="1000"
    >
      <template v-slot:append>
        <q-avatar>
          <q-btn
            round
            dense
            flat
            icon="img:icons/qcc.ico"
            class="text-primary"
            @click.stop="showCustomerSearchDialog = true"
          />
        </q-avatar>
      </template>
      <q-popup-proxy v-if="search.length > 0">
        <q-list
          style="width: 650px; max-width: 65vw;"
          v-if="sysCustomers.length"
          separator
        >
          <q-item>
            <q-item-section class="q-pa-none">
              <q-item-label caption>当前系统，共搜索到<strong class="q-mx-xs text-orange">{{sysCustomers.length}}</strong>个客户
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            v-for="customer in sysCustomers"
            :key="customer.id"
            @click="gotoDetails(customer.id)"
          >
            <q-item-section>
              <q-item-label>{{customer && customer.title}}</q-item-label>
              <q-item-label caption>{{ customer && customer.notes}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else>
          <div
            class="q-ma-md"
            style="width: 650px; max-width: 65vw;"
          >
            <div class="row">
              <div class="col-12 q-my-sm">
                <q-item-section>
                  <q-item-label caption>当前系统，共搜索到<strong class="q-mx-xs">{{sysCustomers.length}}</strong>个客户
                  </q-item-label>
                </q-item-section>
              </div>
              <div class="col-12">您可以使用
                <q-btn
                  dense
                  flat
                  icon="img:icons/qcc.ico"
                  class="text-primary"
                  @click.stop="showCustomerSearchDialog = true"
                  label="企查查"
                />
                工具，搜索并添加新客户。
              </div>
            </div>
          </div>
        </div>
      </q-popup-proxy>
    </q-input>
    <q-input
      v-model="model.notes"
      type="textarea"
      filled
      class="col-12"
      :placeholder="$t('customer.label.notes')"
    />
    <tw-select-edit
      v-if="model.isOutCustomer"
      filled
      module="customer"
      field="customerType"
      class="col-12 col-md-6"
      :label="$t('customer.label.customerType')"
      :editable="!!$myinfo.auth.role.isSystemAdministrator"
      :value="String(model.customerType)"
      @input="payload=>{model.customerType = payload.dictKey}"
    />
    <tw-select-edit
      v-if="model.isOutCustomer"
      filled
      module="customer"
      field="grade"
      class="col-12 col-md-6"
      :label="$t('customer.label.grade')"
      :editable="!!$myinfo.auth.role.isSystemAdministrator"
      :value="String(model.grade)"
      @input="(payload)=>{model.grade= payload.dictValue}"
    />
    <tw-select-edit
      v-if="model.isOutCustomer"
      filled
      module="customer"
      field="applyIndustry"
      class="col-12 col-md-6"
      :label="$t('customer.label.applyIndustry')"
      :editable="!!$myinfo.auth.role.isSystemAdministrator"
      :value="String(model.applyIndustry)"
      @input="(payload)=>{model.applyIndustry= payload.dictValue}"
    />
    <tw-select-edit
      v-if="model.isOutCustomer"
      filled
      module="customer"
      field="infoSource"
      class="col-12 col-md-6"
      :label="$t('customer.label.infoSource')"
      :editable="!!$myinfo.auth.role.isSystemAdministrator"
      :value="String(model.infoSource)"
      @input="(payload)=>{model.infoSource= payload.dictValue}"
    />
    <tw-select-person
      filled
      class="col-12 col-md-6"
      emit-value
      v-model="model.leaderID"
      :label="$t('customer.leader')"
      hide-bottom-space
      lazy-rules
      :rules="[val => val>0 || $t('customer.rules.leader')]"
    />
    <tw-select-tree
      filled
      isOrganize
      emit-value
      node-key="id"
      label-key="name"
      :nodes="selectOrganizesTree"
      :model.sync="model.organizeID"
      class="col-12 col-md-6"
      :label="$t('customer.label.organize')"
      position="bottom"
      hide-bottom-space
      lazy-rules
      :rules="[val => val && val.length > 0 || $t('customer.rules.organize')]"
    />
    <!-- 更多的内容 -->
    <q-input
      v-if="showMoreInfoNotes&&model.isOutCustomer&&Number(model.customerType)===5"
      filled
      v-model="model.chieftain"
      input-class="text-subtitle1"
      class="col-12 col-md-6"
      :label="$t('customer.label.chieftain')"
      @input="$emit('update:title', $event)"
    />
    <q-input
      v-if="showMoreInfoNotes&&model.isOutCustomer&&Number(model.customerType)===5"
      v-model="model.foundDate"
      filled
      mask="date"
      class="col-12 col-md-6"
      :label="$t('customer.label.foundDate')"
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
              :value="model.foundDate"
              @input="dateInput($event)"
              minimal
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-if="showMoreInfoNotes&&model.isOutCustomer&&Number(model.customerType)===5"
      filled
      v-model="model.licenceNo"
      class="col-12 col-md-6"
      :label="$t('customer.label.licenceNo')"
    />
    <q-input
      v-if="showMoreInfoNotes&&model.isOutCustomer&&Number(model.customerType)===5"
      outlined
      type="number"
      filled
      class="col-12 col-md-6"
      input-class="text-subtitle1"
      :label="$t('customer.label.bankRoll')"
      v-model="model.bankRoll"
      @input="$emit('update:title', $event)"
    />
    <q-input
      v-if="showMoreInfoNotes&&model.isOutCustomer ==='1'&&Number(model.customerType)===5"
      filled
      type="number"
      input-class="text-subtitle1"
      class="col-12 col-md-6"
      :label="$t('customer.label.turnOver')"
      v-model="model.turnOver"
      @input="$emit('update:title', $event)"
    />
    <tw-select-edit
      v-if="model.isOutCustomer&&showMoreInfoNotes&&Number(model.customerType)===5"
      filled
      module="customer"
      field="companySize"
      class="col-12 col-md-6"
      :editable="!!$myinfo.auth.role.isSystemAdministrator"
      :value="String(model.companySize)"
      @input="(payload)=>{model.companySize= payload.dictValue}"
      :label="$t('customer.label.companySize')"
    />
    <q-input
      filled
      v-if="showMoreInfoNotes&&model.isOutCustomer"
      class="col-12 col-md-6"
      v-model="model.address"
      :label="$t('customer.label.address')"
    />
    <q-field
      filled
      v-if="showMoreInfoNotes"
      :label="$t('auth.acl.acl')"
      stack-label
      class="col-12"
    >
      <template v-slot:control>
        <q-option-group
          :options="options"
          type="radio"
          v-model="model.acl"
        />
      </template>
    </q-field>
    <!-- 查看更多按钮 -->
    <div class="row full-width justify-center">
      <q-btn
        v-if="!showMoreInfoNotes"
        flat
        color="primary"
        icon-right="keyboard_arrow_down"
        :label="$t('customer.moreInfoNotes')"
        @click="showMoreInfoNotes=!showMoreInfoNotes"
      />
    </div>
    <q-dialog
      v-model="showCustomerSearchDialog"
      v-if="model.isOutCustomer"
      persistent
    >
      <customer-search
        style="width: 700px; max-width: 95vw;"
        :search="model.title || ''"
        @selectEvent="onSelectedCustomer"
      />
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'FormFields',
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    model: {
      type: Object
    }
  },
  data () {
    return {
      formAction: [{ label: this.$t('action.save'), action: 'save' }],
      showMoreInfoNotes: false,
      options: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        { label: this.$t('auth.acl.secret', { category: this.$t('customer.title') }), value: 2 }
      ],
      showCustomerSearchDialog: false
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('organize', ['selectOrganizesTree']),
    search: {
      get () {
        return this.$store.getters['customer/search']
      },
      set (val) {
        val
          ? this.$store.commit('customer/setSearch', val)
          : this.$store.commit('customer/setSearch', '')
      }
    },
    sysCustomers () {
      if (this.openType === 'add') {
        return this.$store.getters['customer/getAllList'](this.$route)
      } else { // 编辑，过滤排除其自身
        let currCustomers = this.$store.getters['customer/getAllList'](this.$route)
        return _.filter(currCustomers, (customer) => customer.id !== this.model.id)
      }
    },
    customerTypeData () {
      return this.dictionary['customer'] ? this.dictionary['customer']['customerType'] : []
    }
  },
  created () {
    this.search = ''
    // 初始化编辑页
    if (this.openType === 'edit') {
      this.showMoreInfoNotes = true
    }
    this.loadDictionarys('customer')
    this.loadCustomers({ byPage: false })
  },
  components: {
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    CustomerSearch: () => import('components/customer/CustomerSearch')
  },
  methods: {
    ...mapActions('customer', ['loadCustomers']),
    ...mapActions('dictionary', ['loadDictionarys']),
    dateInput (value) {
      this.model.foundDate = value
      this.$refs.qDateProxy.hide()
    },
    showCustomerSearch () {
      showCustomerSearchDialog = true
    },
    gotoDetails (id) {
      this.$router.push({
        name: 'customerDetail',
        params: { id }
      })
    },
    onSelectedCustomer (qccCustomer) {
      if (qccCustomer) {
        this.model.title = qccCustomer.Name
        this.model.chieftain = qccCustomer.OperName // 企业法人
        this.model.foundDate = qccCustomer.StartDate // 成立日期
        this.model.licenceNo = qccCustomer.CreditCode // 营业执照
        this.model.bankRoll = qccCustomer.RegistCapi && qccCustomer.RegistCapi.split('万')[0] // 注册资金
        this.model.province = qccCustomer.Area.Province // 省
        this.model.city = qccCustomer.Area.City // 市
        this.model.district = qccCustomer.Area.County // 区
        this.model.address = qccCustomer.Address // 详细地址
        this.model.extra = qccCustomer // 工商原始数据
      }
      this.search = ''
      this.showCustomerSearchDialog = false
    }
  },
  watch: {
    'model.title': {
      deep: true,
      handler (newVal, oldVal) {
        if (!_.isEmpty(newVal) && newVal !== oldVal) {
          this.search = newVal
          this.$refs.inputSearch && this.$refs.inputSearch.$el.click()
        } else {
          this.search = ''
        }
      }
    }
  }
}
</script>

<style scoped  lang="scss">
</style>
