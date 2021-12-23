<template>
  <q-badge
    :color="tagColor || 'primary'"
    align="top"
  >
    {{tagTitle}}
  </q-badge>
</template>

<script>
export default {
  name: 'OpportunityStatusBadge',
  props: {
    status: {
      type: [String, Number],
      required: true
    },
    isLost: {
      type: [String, Number],
      default: 0,
      required: false
    }
  },
  computed: {
    tagTitle () {
      if (this.isLost > 0) { // 输单
        return '输单'
      } else {
        return this.$store.state.opportunity.status[this.status].title
      }
    },
    tagColor () {
      if (this.isLost > 0) {
        return 'grey'
      } else {
        return this.$store.state.opportunity.status[this.status].color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px 6px;
}
</style>
