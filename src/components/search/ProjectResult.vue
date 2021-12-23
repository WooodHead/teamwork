<template>
  <div>
    <div style="white-space: normal;">
      <router-link
        class="text-subtitle1 q-mr-xs"
        :to="{
        name: 'projectDetail',
        params: { id: Number(project.id) }
      }"
      >
        {{`【${dicKey(project.projLevel)}】${project.title}`}}
      </router-link>
      <tw-status-badge
        :value="project.status"
        :endDate="project.predictEndDate"
      />
    </div>
    <div class="text-caption text-grey-7 q-pb-xs">
      <span>{{project.orgShortName}}</span>
      <span>{{dateInfo}}</span>
    </div>
    <div
      style="white-space: normal;"
      v-html="htmlToText(project.notes)"
    >
    </div>
  </div>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'ProjectResult',
  props: {
    project: {
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
        startTime: this.project.beginDate,
        endTime: this.project.status === 'done' ? this.project.endDate : this.project.predictEndDate,
        allDay: true
      })
    }
  },
  methods: {
    htmlToText,
    dicKey (value) {
      return (value && value.split(':').length >= 2) ? value.split(':')[1] : value
    },
    toDetail (projectId) {
      this.$router.push({
        name: 'projectDetail',
        params: { id: Number(projectId) }
      })
    }
  }
}
</script>

<style scoped>
</style>
