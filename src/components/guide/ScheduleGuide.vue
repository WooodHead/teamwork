<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pa-none"
  >
    <q-card-section class="q-pa-lg text-right guide-header">
      <guide-add-header
        :guideModule="guideModule"
      ></guide-add-header>
    </q-card-section>
    <q-card-section class="q-px-xxl q-py-lg">
      <TwCalendar
        style=" max-width: 800px;width: 100%;"
        v-bind="{category:$route.params.category,objectID:+$route.params.objectID}"
      />
    </q-card-section>
  </q-card>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { mapState } from 'vuex'
export default {
  name: 'ScheduleGuide',
  components: {
    TwCalendar: () => import('components/calendar/TwCalendar'),
    GuideAddHeader: () => import('components/guide/GuideAddHeader')
  },
  computed: {
    ...mapState('guide', ['guideModule'])
  }
}
</script>

<style scoped lang="scss">
.guide-header {
  background-color: $friend;
}
/deep/ .cancel-btn {
  display: none;
}
</style>
