<template>
  <div class="row q-col-gutter-md justify-center q-pb-md">
    <div class="col-12 col-md-6">
      <resource-card
          class="opportunity-relation-card"
          :category="'customer'"
          :model="customerModel"
        />
    </div>
    <div class="col-12 col-md-6">
      <assess-card
        class="opportunity-relation-card"
        :model="model"
      />
    </div>
  </div>
</template>

<script>
import Opportunity from '@/store/opportunity/model'
import { mapActions } from 'vuex'
export default {
  name: 'OpportunityRelation',
  props: {
    model: {
      type: Object,
      default: new Opportunity()
    }
  },
  data () {
    return {
      customerModel: {}
    }
  },
  mounted () {
    this.loadCustomer(this.model.customerID || 0).then(res => {
      this.customerModel = res
    })
  },
  methods: {
    ...mapActions('customer', ['loadCustomer'])
  },
  components: {
    ResourceCard: () => import('components/resource/ResourceCard'),
    AssessCard: () => import('components/assess/AssessCard')
  }
}
</script>

<style scoped lang="scss">
.opportunity-relation-card {
  width: 100% !important;
  height: 100% !important;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
