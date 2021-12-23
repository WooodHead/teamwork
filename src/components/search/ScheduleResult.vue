<template>
  <div>
    <div>
      <a
        class="text-primary text-weight-bold "
        href="javascript:void(0);"
        @click="toDetail(schedule)"
        v-html="title"
      ></a>
      <div class="q-mt-sm">
        <q-icon
          name='event'
          color="green"
          size="sm"
        ></q-icon>
        <span class="text-body1 text-orange-10 text-weight-bold">
          {{range}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import timeAgo from '@/utils/time-ago'
import { date } from 'quasar'
const { formatDate } = date
export default {
  props: {
    schedule: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    title () {
      return '日程: "' + this.schedule.title + '"'
    },
    range () {
      if (this.schedule.startDay === this.schedule.endDay) {
        return this.schedule.startTime + '-' + formatDate(this.schedule.endTime.replace(/-/g, '/'), 'HH:mm')
      } else if (this.schedule.startTime === this.schedule.endTime) {
        return this.schedule.startTime
      } else {
        return this.schedule.startTime + '-' + this.schedule.endTime
      }
    }
  },
  components: {
  },
  methods: {
    timeAgo,
    toDetail (model) {
      this.$router.push({
        name: 'eventDetail',
        params: {
          category: model.resourceCategory,
          objectID: +model.resourceId,
          id: +model.id
        }
      })
    }
  },
  mounted () {
  }
}

</script>

<style>
</style>
