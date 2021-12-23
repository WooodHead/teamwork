<template>
  <q-card
    flat
    bordered
    class="cursor-pointer base-card recruitPlan-card"
    :class="{ archived: model.archived }"
    style="height: 100%;"
    @click="openDetail"
  >
    <q-card-section class="text-subtitle2">
      <!-- 标题 -->
      <div :title="model.title" class="flex items-center">
        <span class="text-h2-g text-text1 text-weight-bold">{{
          model.title
        }}</span>
        <q-space />
        <q-badge
          align="middle"
          :color="model.closed >= 0 ? closedStatus[model.closed].color : ''"
          >{{
            model.closed >= 0 ? closedStatus[model.closed].label : ""
          }}</q-badge
        >
      </div>
      <!-- 状态 -->
      <!--起止时间-->
      <div class="row no-wrap items-center">
        <q-icon size="xs" name="watch_later" color="primary1" />
        <span class="q-ml-xs text-body-g text-text2">{{
          timeRangeFormat({
            startTime: model.startDate,
            endTime: model.endDate,
            allDay: true
          })
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'RecruitPlanCard',
  props: {
    model: { type: Object }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('recruitPlan', ['closedStatus'])
  },
  methods: {
    timeRangeFormat,
    // 打开招聘计划详情页
    openDetail () {
      this.$router.push({
        name: 'recruitPlanDetail',
        params: {
          id: this.model.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px 6px;
}
.recruitPlan-card {
  position: relative;
}
</style>
