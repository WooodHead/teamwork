<template>
  <resource-layout
    category='productDev'
    :objectID='+id'
    :categoryModel="model"
    :showMenu="(model.isTemplate&&model.createByID===$myinfo.id)||!model.isTemplate"
  >
    <template
      #titleBadge
      v-if="model&&model.status"
    >
      <tw-status-badge
        :value="model.status"
        :endDate="model.predictEndDate"
      />
    </template>
    <template #subtitle>
      <div class="q-gutter-sm">
        <q-badge
          outline
          align="middle"
          color="secondary"
        >
          {{model.productDevNum}}
        </q-badge>
        <q-badge
          v-if="period"
          outline
          align="middle"
          color="secondary"
        >
          {{period}}
        </q-badge>
      </div>
    </template>
  </resource-layout>
</template>

<script>
import period from '@/utils/period'
export default {
  name: 'ProductDevDetail',
  props: {
    id: { type: [String, Number], required: true }
  },
  computed: {
    model () {
      return this.$store.getters['productDev/productDev'](+this.id)
    },
    period () {
      const { status, beginDate, endDate, predictEndDate } = this.model
      return period({ status, beginDate, endDate, predictEndDate })
    }
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout'),
    TwStatusBadge: () => import('components/base/TwStatusBadge')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px 6px;
}
</style>
