<template>
  <q-badge
    :color="color[statusFilter(value, endDate)]"
    :align="align"
    class="text-tip-g"
  >
    {{$t(`state.${statusFilter(value, endDate)}`)}}
  </q-badge>
</template>

<script>
import { statusFilter } from '@/utils/status-filter'
export default {
  name: 'TwStatusBadge',
  props: {
    value: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    align: {
      type: String,
      required: false,
      default: 'middle'
    }
  },
  data () {
    return {
      color: {
        wait: 'auxiliary4',
        doing: 'auxiliary1',
        suspended: 'auxiliary3',
        done: 'auxiliary5',
        putoff: 'negative',
        activate: 'primary1'
      }
    }
  },
  methods: {
    statusFilter
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px 6px;
}
</style>
