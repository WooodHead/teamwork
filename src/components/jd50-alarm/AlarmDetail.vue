<template>
  <q-card style="border-top-right-radius: 15px;  border-top-left-radius: 15px; width: 80%;">
    <q-card-section class="q-pb-none">
      <div class="fit row  justify-center  items-center">
        <div
          class="col fit row justify-center items-center q-py-sm text-body2 text-weight-medium text-primary"
    >【{{alarm.alarmTypeName}}】{{alarm.alarmCode}}
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          color="grey-5"
        />
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
</template>

<script>
export default {
  name: 'AlarmDetail',
  props: {
    alarm: {
      type: Object,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar-search {
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  z-index: 999;
}
.alart-content-detail {
  font-family: roboto-font;
}
/deep/.q-field--outlined .q-field__control:before {
  border: 1px solid #6699c7;
}
</style>
