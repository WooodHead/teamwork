<template>
  <q-badge
    :color="projectStatusColor[projectStatus(value, predictEndDate)]"
    align="top"
  >
    {{$t(`state.${projectStatus(value, predictEndDate)}`)}}
  </q-badge>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ProjectStatusBadge',
  props: {
    value: {
      type: String,
      required: true
    },
    predictEndDate: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('project', ['projectStatusColor']),
    ...mapGetters('project', ['projectStatus'])
  }
}
</script>
