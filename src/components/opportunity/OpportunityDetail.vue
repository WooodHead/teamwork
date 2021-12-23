<template>
  <resource-layout
    category="opportunity"
    :objectID="+id"
    :categoryModel="model"
  >
    <template #subtitle>
      <div class="q-gutter-sm">
        <q-badge
          v-if="model.opportunityNo"
          outline
          align="middle"
          :title="dicKey(model.processType)"
          color="secondary"
        >
          {{ model.opportunityNo }}
        </q-badge>
        <q-badge
          v-if="model.processType"
          outline
          align="middle"
          color="secondary"
        >
          {{ dicKey(model.processType) }}
        </q-badge>
        <q-badge
          v-if="model.expectedDeliveryDate"
          :title="$t('opportunity.expectedDeliveryDate')"
          outline
          align="middle"
          color="secondary"
        >
          {{formatDate(
            model.expectedDeliveryDate && model.expectedDeliveryDate.replace(/-/g, "/"),
            "YYYY-MM-DD"
          )}}
        </q-badge>
        <q-badge
          v-if="model.transactionPrice"
          outline
          :title="$t('order.amount')"
          align="middle"
          color="secondary"
        >
          {{ model.transactionPrice }}元
        </q-badge>
      </div>
    </template>
    <template #titleBadge v-if="model && model.status">
      <opportunity-status-badge :status="model.status" :isLost="model.isLost" />
    </template>
    <template slot="prepend">
      <div :class="$q.screen.gt.xs ? 'q-px-xxl' : 'q-px-md'">
        <opportunity-stepper :model="model"/>
        <opportunity-relation :model="model"/>
      </div>
    </template>
  </resource-layout>
</template>
<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'OpportunityDetail',
  props: {
    id: { type: [String, Number], required: true }
  },
  computed: {
    model: {
      get () {
        return this.$store.getters['opportunity/opportunity'](+this.id)
      }
    }
  },
  methods: {
    ...mapActions('opportunity', ['loadOpportunity']),
    formatDate,
    dicKey (value) {
      return value && value.split(':').length >= 2
        ? value.split(':')[1]
        : value
    }
  },
  mounted () {
    this.loadOpportunity(+this.id)
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout'),
    OpportunityStatusBadge: () =>
      import('components/opportunity/OpportunityStatusBadge'),
    OpportunityStepper: () =>
      import('components/opportunity/OpportunityStepper'),
    OpportunityRelation: () =>
      import('components/opportunity/OpportunityRelation')
  }
}
</script>

<style lang="scss" scoped></style>
