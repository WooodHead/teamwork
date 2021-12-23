<template>
  <!-- 时间线 -->
  <q-infinite-scroll
    @load="onLoad"
    :offset="100"
    :debounce="500"
    ref="infiniteScrollOfTimeline"
  >
    <q-timeline
      :layout="layout"
      color="dark"
    >
      <div
        v-for="(date,index) in Object.keys(activityList)"
        :key="date"
      >
        <q-timeline-entry
          heading
          tag="h6"
          class="text-bold"
        >
          {{date}}
        </q-timeline-entry>
        <tw-activity-timeline
          v-for="activity in activityList[date]"
          :key="activity.id"
          :index="index"
          :activity="activity"
        />
      </div>
    </q-timeline>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
    </template>
    <tw-banner-no-result
      v-if="noMore&&!Object.keys(activityList).length"
      info="暂没有动态信息"
    />
    <div
      v-if="noMore&&Object.keys(activityList).length"
      class="q-py-xl text-center text-caption text-grey-7"
    >
      没有更多动态信息
    </div>
  </q-infinite-scroll>
</template>
<script>
import mixinActivity from '@/mixins/mixins-activity.js'
export default {
  name: 'TwActivity',
  mixins: [mixinActivity],
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },

  computed: {
    resource () {
      return { category: this.category, objectID: this.objectID }
    },
    query () {
      return [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' }
      ]
    },
    activityList () {
      return this.$store.getters['activity/activitysOfModule']({
        objectID: +this.objectID,
        objectType: this.category
      })
    }
  },
  watch: {
    resource: {
      deep: true,
      handler: function (newV, oldV) {
        this.initData()
        this.initInfiniteScroll()
      }
    }
  },
  methods: {
    onLoad (index, done) {
      this.loadActivity(index, done, this.category, this.objectID)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.q-timeline__dot:before {
  display: none;
}
/deep/.q-timeline__dot:after {
  top: 0;
  left: 7px;
  bottom: 0;
  width: 1px;
  opacity: 1;
  content: "" !important;
  background-color: rgba(0, 0, 0, 0.1);
}
/deep/.q-timeline__subtitle {
  opacity: 1;
  color: #283c46;
  font-weight: normal;
}
/deep/.content {
  overflow: hidden;
  font-size: 0.85rem;
}
/deep/.content img {
  transition: all 0.6s;
  -moz-transition: all 0.6s;
  -webkit-transition: all 0.6s;
  -ms-transition: all 0.6s;
}
/deep/.content img.scale {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
}
</style>
