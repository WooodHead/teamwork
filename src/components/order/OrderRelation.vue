<template>
  <div class="row q-col-gutter-md justify-center">
    <div
      class="col-12 col-md-6"
      v-if="model.customerID&&customer(model.customerID).id"
    >
      <resource-card
        style="width: 100% !important;height: 100% !important;border-radius: 4px;"
        category="customer"
        :model="customer(model.customerID)"
      />
    </div>
    <div
      class="col-12 col-md-6"
      v-if="model.opportunityID&&opportunity(model.opportunityID).id"
    >
      <opportunity-card
        style="width: 100% !important;height: 100% !important;"
        :model="opportunity(model.opportunityID)"
      />
    </div>
  </div>
</template>

<script>
import Order from '@/store/order/model'
export default {
  name: 'OrderRelation',
  props: {
    model: {
      type: Object,
      default: new Order()
    }
  },
  data () {
    return {}
  },
  computed: {
    customer: {
      get () {
        return id => {
          return this.$store.getters['customer/customer'](id)
        }
      }
    },
    opportunity: {
      get () {
        return id => {
          return this.$store.getters['opportunity/opportunity'](id)
        }
      }
    }
  },
  watch: {
    model: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.customer &&
          !this.customer.id &&
          this.model &&
          this.model.customerID &&
          this.$store.dispatch('customer/loadCustomer', this.model.customerID)
        this.opportunity &&
          !this.opportunity.id &&
          this.model &&
          this.model.opportunityID &&
          this.$store.dispatch('opportunity/loadOpportunity', this.model.opportunityID)
      }
    }
  },
  methods: {},
  components: {
    ResourceCard: () => import('components/resource/ResourceCard'),
    OpportunityCard: () => import('components/opportunity/OpportunityCard')
  }
}
</script>

<style scoped lang="scss">
</style>
