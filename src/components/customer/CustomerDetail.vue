<template>
  <resource-layout
    category='customer'
    :objectID='+id'
    :categoryModel="model"
  >
    <template
      #subtitle
      v-if="model.grade"
    >
      <div class="q-gutter-sm">
        <q-badge
          outline
          align="middle"
          color="secondary"
        >
          {{model.grade}}
        </q-badge>
      </div>
    </template>
    <template #titleBadge>
      <q-badge
        color="orange"
        align="top"
        class="q-pa-xs q-mr-md"
      >
        {{customerTypeData.find(ct=>ct.dictKey === String(model.customerType))&&
        customerTypeData.find(ct=>ct.dictKey ===String(model.customerType)).dictValue}}
      </q-badge>
    </template>
  </resource-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CustomerDetail',
  props: {
    id: { type: [String, Number], required: true }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    model: {
      get () {
        return this.$store.getters['customer/customer'](+this.id)
      }
    },
    customerTypeData () {
      return this.dictionary['customer'] ? this.dictionary['customer']['customerType'] : []
    }
  },
  created () {
    this.loadDictionarys('customer')
    this.loadCustomer(this.id || 0)
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapActions('customer', ['loadCustomer'])
  }
}
</script>

<style lang="scss" scoped>
</style>
