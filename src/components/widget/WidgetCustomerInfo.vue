<template>
  <widget-layout
    :isEmpty="!model.isOutCustomer||!modelList.length"
    widget="customerInfo"
    :cardClick="!!model.isOutCustomer"
    :category="category"
    :id="objectID"
  >
    <template
      slot="content"
    >
      <q-card-section v-if="model.isOutCustomer&&modelList.length" >
        <q-list separator style="background-color: #eef7fe;">
          <q-item v-for="(info,index) in modelList" :key="index">
            <q-item-section class="col-auto">
              <q-item-label class="text-grey" v-html="info.label" />
            </q-item-section>
            <q-item-section side class="full-width">
              <q-item-label class="text-weight-bold text-right" v-html="info.value" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </template>
  </widget-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Checkins',
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: Number,
      required: false
    }
  },
  computed: {
    ...mapGetters('customer', ['customer']),
    model () {
      return this.customer(this.objectID)
    },
    modelList () {
      return [
        {
          label: '客户名称',
          value: this.model.title
        },
        {
          label: '客户类型',
          value: this.dictValue({ field: 'customerType', dictKey: this.model.customerType })
        },
        {
          label: '所属人&emsp;',
          value: this.$store.state.person.selectPersons[this.model.leaderID] ? this.$store.state.person.selectPersons[this.model.leaderID].name : '' },
        {
          label: '行业类型',
          value: this.dictValue({ field: 'applyIndustry', dictKey: this.model.applyIndustry })
        },
        {
          label: '客户级别',
          value: this.dictValue({ field: 'grade', dictKey: this.model.grade })
        },
        { label: '客户地址',
          value: (this.model.province + '' + this.model.city + '' + this.model.district + '' + this.model.address) || ''
        }
      ]
    }
  },
  mounted () {
    if (_.isEmpty(this.model)) {
      this.$store.dispatch('customer/loadCustomer', this.objectID)
    }
    this.$store.dispatch(`dictionary/loadDictionarys`, this.category)
  },
  methods: {
    dictValue ({ field, dictKey }) {
      let dict = this.$store.state.dictionary.dictionary[this.category]
      if (dict) {
        return _.find(dict[field], f => f.dictKey === String(dictKey)) ? _.find(dict[field], f => f.dictKey === String(dictKey)).dictValue : ''
      } else {
        return ''
      }
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout')
  }
}
</script>

<style scoped>
</style>
