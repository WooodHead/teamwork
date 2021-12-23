<!--
 * @文件描述: 商机表单字段
 * @作者: 李建国
 * @日期: 2021年1月7日
 -->
<template>
  <div class="q-gutter-md">
    <q-input
      v-model="model.title"
      input-class="text-center text-h5"
      :placeholder="$t('opportunity.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val.trim() || $t('project.formCerifyRule.title')]"
      autofocus
      ref="title"
      debounce="500"
      class="q-col-gutter-x-md"
      filled
    />
    <div class="row q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <!-- 选择客户 -->
        <q-select
          class="opportunity-select"
          filled
          use-input
          input-debounce="500"
          option-value="id"
          option-label="title"
          emit-value
          map-options
          v-model="model.customerID"
          :options="opportunityOptionsFilter"
          @filter="filterFn"
          :label="$t('opportunity.customerName')"
          ref="selectCustomer"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("base.noResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- 期望交期 -->
      <div class="col-12 col-sm-6">
        <q-input
          v-model="model.expectedDeliveryDate"
          filled
          :label="$t('opportunity.expectedDeliveryDate')"
          mask="date"
          @focus="showDateInput"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :class="!$q.screen.gt.xs ? 'fit' : ''"
                  :value="model.expectedDeliveryDate"
                  @input="dateInput($event)"
                  mask="YYYY-MM-DD"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <tw-select-edit
          withDictKey
          filled
          module="opportunity"
          field="classification"
          :editable="!!$myinfo.auth.role.isSystemAdministrator"
          :value="model.classification"
          @input="
            payload => {
              model.classification = payload.dictValue;
            }
          "
          :label="$t('opportunity.classification')"
        />
      </div>
      <div class="col-12 col-sm-6">
        <tw-select-edit
          withDictKey
          filled
          module="opportunity"
          field="processType"
          :editable="!!$myinfo.auth.role.isSystemAdministrator"
          :value="String(model.processType)"
          @input="
            payload => {
              model.processType = payload.dictValue;
            }
          "
          :label="$t('opportunity.processType')"
        />
      </div>
    </div>
    <div class="row q-col-gutter-x-md q-my-sm">
      <quasar-editor
        :focus="false"
        folder="opportunity"
        :applied="true"
        :value="model.requirement"
        @input="
          val => {
            model.requirement = val;
          }
        "
        class="col-12 q-mx-sm"
        placeholder="可填写客户加工要求说明等信息"
      ></quasar-editor>
    </div>
    <div class="row q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <tw-select-person
          filled
          v-model="model.leaderID"
          emit-value
          :label="$t('opportunity.leaderID')"
          lazy-rules
          :rules="[val => val > 0 || $t('opportunity.formCerifyRule.leaderID')]"
        />
      </div>
      <div class="col-12 col-sm-6">
        <tw-select-tree
          filled
          emit-value
          :nodes="selectOrganizesTree"
          isOrganize
          :model.sync="model.organizeID"
          node-key="id"
          label-key="name"
          position="bottom"
          :label="$t('base.resourceOrganize')"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || $t('base.resourceCerifyOrganize')
          ]"
        />
      </div>
    </div>
    <q-field
      class="q-col-gutter-x-md q-mt-none"
      filled
      :label="$t('auth.acl.acl')"
      stack-label
      color="grey-8"
      v-if="showMoreInfoNotes"
    >
      <q-option-group :options="aclOptions" type="radio" v-model="model.acl" />
    </q-field>
    <!-- 查看更多按钮 -->
    <div class="row justify-center q-my-sm">
      <q-btn
        v-if="!showMoreInfoNotes"
        flat
        color="primary"
        icon-right="keyboard_arrow_down"
        :label="$t('customer.moreInfoNotes')"
        @click="showMoreInfoNotes = !showMoreInfoNotes"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import Opportunity from '@/store/opportunity/model'
export default {
  name: 'FormFields',
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    model: {
      type: Object,
      default: new Opportunity()
    }
  },
  data () {
    return {
      requirement: '',
      showMoreInfoNotes: false,
      selectCustomers: [],
      opportunityOptionsFilter: [],
      aclOptions: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        {
          label: this.$t('auth.acl.secret', {
            category: this.$t('project.title')
          }),
          value: 2
        }
      ],
      customerQuery: []
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree'])
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  },
  async mounted () {
    if (+this.model.Id !== 0) {
      this.requirement = this.model.requirement
    }
    await this.loadSelectCustomers().then(async res => {
      this.selectCustomers = _.clone(res)
      let isExist = _.find(this.selectCustomers, sc => sc.id === this.model.customerID)
      if (!isExist && this.model.customerID) {
        let customer = await this.loadCustomerNoAcl(this.model.customerID)
        if (customer) {
          this.selectCustomers.push(customer)
        }
      }
      this.opportunityOptionsFilter = this.selectCustomers
    })
  },
  methods: {
    ...mapMutations('customer', ['setSearch']),
    ...mapGetters('customer', ['customersFiltered']),
    ...mapActions('customer', ['loadSelectCustomers', 'loadCustomerNoAcl']),
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.opportunityOptionsFilter = this.selectCustomers
        } else {
          const needle = val.toLowerCase()
          this.opportunityOptionsFilter = this.opportunityOptionsFilter.filter(
            customer => customer.title.toLowerCase().includes(needle)
          )
        }
      })
    },
    dateInput (value) {
      this.model.expectedDeliveryDate = value
      this.$refs.qDateProxy.hide()
    },
    showDateInput () {
      this.$refs.qDateProxy.show()
    }
  },
  watch: {
    'model.customerID': {
      async handler (newVal, oldVal) {
        let isExist = _.find(this.opportunityOptionsFilter, sc => sc.id === newVal)
        if (!isExist) {
          let customer = await this.loadCustomerNoAcl(newVal)
          if (customer) {
            this.opportunityOptionsFilter.push(customer)
          }
        }
        let customer = _.find(this.opportunityOptionsFilter, c => {
          return c.id === +newVal
        })
        this.model.customerName = (customer && customer.title) || ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.opportunity-border {
  border: solid 1px lightgray;
  border-radius: 4px;
}
.marginStyle {
  margin-top: 0 !important;
}
/deep/.opportunity-editor .editor {
  border-bottom: unset !important;
  cursor: initial !important;
}
.opportunity-select /deep/.q-field__control-container > .q-field__native {
  display: contents;
}
.opportunity-select
  /deep/.q-field__control-container
  > .q-field__native
  > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
