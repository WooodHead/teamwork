<template>
  <q-list
    padding
    class="rounded-borders"
    style="width:100%"
  >
    <q-item
      v-for="model in modelList"
      :key="model.id"
      clickable
      v-ripple
    >
      <q-item-section @click.stop="openDetail(model.id)">
        <div class="row">
          <tw-avatar :id="model.createByID" />
          <div class="flex flex-center q-pl-md">
            <span class="text-weight-bold">{{model.title}}</span>
            <span class="q-pl-sm">{{timeRangeFormat({startTime:model.startDate,endTime:model.endDate})}}</span>
            <span class="q-pl-sm">{{model.city}}</span>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'RecruitPlanList',
  props: {
    modelList: { type: Array, required: true }
  },
  data () {
    return {
    }
  },
  methods: {
    timeRangeFormat,
    // 跳转详情页
    openDetail (id) {
      if (id) {
        this.$router.push({
          name: 'recruitPlanDetail',
          params: {
            id: id
          }
        })
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>
