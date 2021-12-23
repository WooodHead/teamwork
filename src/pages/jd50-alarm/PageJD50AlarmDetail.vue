<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!--报警信息详情-->
      <q-card-section class="q-pb-none">
        <div class="fit row  justify-center  items-center">
          <div class="col fit row justify-center items-center q-py-sm text-body2 text-weight-medium text-primary">
            【{{alarm.alarmTypeName}}】{{alarm.alarmCode}}
          </div>
          <q-space />
        </div>
      </q-card-section>

      <q-card-section
        class="q-py-none scroll"
        style="height: 60vh;max-height: 60vh"
      >
        <div class="text-body2 q-py-sm text-grey-10 text-weight-regular">
          {{$t('jd50Alarm.description')}}
        </div>
        <div
          dense
          class="text-grey-6 q-pb-sm"
          v-html="alarm.alarmDesc"
        >
        </div>

        <div class="text-body2 q-py-sm text-grey-10 text-weight-regular">
          {{$t('jd50Alarm.theReasonOfAlarm')}}
        </div>
        <div
          dense
          class="text-grey-6 q-pb-sm alart-content-detail"
          v-html="alarm.solutionName"
        >
        </div>
        <div class="text-body2 q-py-sm text-grey-10 text-weight-regular">{{$t('jd50Alarm.theSolutionsOfAlarm')}}</div>
        <div
          class="text-grey-6 q-pb-xl alart-content-detail"
          v-html="alarm.solutionDetail"
        >
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    alarmCode: {
      type: String,
      required: false,
      default: null
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('jd50Alarm', ['alarm'])
  },
  methods: {
    ...mapActions('jd50Alarm', ['loadAlarmByCode']),
    init () {
      this.loadAlarmByCode(this.alarmCode)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
