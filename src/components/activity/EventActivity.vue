<!-- 日程事项动态 -->
<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span>
        {{$t('activity.schedule.On')}}
      </span>
      <router-link
        class="text-primary"
        :to="{name:'schedule',params:{category:activity.widget.on.type,objectID:activity.widget.on.id}}"
      >
        {{$t('schedule.title')}}
      </router-link>
      <span>
        {{$t('activity.schedule.Among')}}
      </span>
      <span>
        {{activity.actor}}{{$t(`activity.${activity.description}`)}}
      </span>
    </div>
    <!-- 列表 -->
    <div class="q-ml-sm text-weight-regular">
      <div
        v-for="event in events"
        :key="event.id"
        @click.capture.stop="toDetail(event)"
        class="cursor-pointer"
      >
        <div class="text-subtitle2">{{event.title}}</div>
        <div class="text-caption">
          <q-icon
            class="text-light-green q-pr-xs"
            name="today"
            style="font-size: 1.4em;"
          />
          {{timeRangeFormat({startTime:event.startTime,endTime:event.endTime,allDay:event.allDay,charMonth:true})}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Event from '@/store/schedule/model'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'EventActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    events () {
      return _.map(this.activity.widgets, wg => {
        return wg.detail === '' ? []
          : Event.from(JSON.parse(wg.detail))
      })
    }
  },
  methods: {
    toDetail (event) {
      this.$router.push({
        name: 'eventDetail',
        params: {
          category: event.resourceCategory,
          objectID: +event.resourceId,
          id: +event.id
        }
      })
    },
    timeRangeFormat
  }
}

</script>

<style lang='scss' scoped>
</style>
