<template>
  <div>
    <div style="white-space: normal;">
      <router-link
        class="text-subtitle1 q-mr-xs"
        :to="{
        name: 'productDevDetail',
        params: { id: Number(productDev.id) }
      }"
      >
        {{productDev.title}}
      </router-link>
      <tw-status-badge
        :value="productDev.status"
        :endDate="productDev.predictEndDate"
      />
    </div>
    <div class="text-caption text-grey-7 q-pb-xs">
      <span>{{productDev.orgShortName}}</span>
      <span>{{dateInfo}}</span>
    </div>
    <div
      style="white-space: normal;"
      v-html="htmlToText(productDev.notes)"
    >
    </div>
  </div>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'ProductDevResult',
  props: {
    productDev: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  components: {
    TwStatusBadge: () => import('components/base/TwStatusBadge')
  },
  computed: {
    dateInfo () {
      return timeRangeFormat({
        startTime: this.productDev.beginDate,
        endTime: this.productDev.status === 'done' ? this.productDev.endDate : this.productDev.predictEndDate,
        allDay: true
      })
    }
  },
  methods: {
    htmlToText,
    dicKey (value) {
      return (value && value.split(':').length >= 2) ? value.split(':')[1] : value
    },
    toDetail (productDevId) {
      this.$router.push({
        name: 'productDevDetail',
        params: { id: Number(productDevId) }
      })
    }
  }
}
</script>

<style scoped>
</style>
