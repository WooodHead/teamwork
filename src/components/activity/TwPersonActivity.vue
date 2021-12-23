<template>
  <!-- 时间线 -->
  <q-infinite-scroll
    @load="onLoad"
    :offset="100"
    :debounce="500"
    ref="infiniteScrollOfTimeline"
  >
    <tw-header
      :title="$t('home.widget.activity')"
      noMenu
    ></tw-header>
    <!-- 时间线 -->
    <q-timeline
      :layout="layout"
      color="dark"
    >
      <div
        v-for="date in Object.keys(activityList)"
        :key="date"
      >
        <!-- 日期 -->
        <q-timeline-entry
          heading
          tag="h6"
        >
          <div class="text-bold">
            {{date}}
          </div>
        </q-timeline-entry>
        <div
          v-for="(resKey,index) in Object.keys(activityList[date])"
          :key="date+resKey+index"
        >
          <!-- 资源名称 -->
          <q-timeline-entry :side="getSide(index)">
            <div class="text-subtitle1 text-blue-grey-6 q-py-none">
              {{activityList[date][resKey]&&
              '【'+$t(`${activityList[date][resKey][0]['objectType']}.title`)+'】 '+
              (activityList[date][resKey][0]['objectTitle']?activityList[date][resKey][0]['objectTitle']:'')}}
              <q-separator spaced />
            </div>
          </q-timeline-entry>
          <!-- 资源动态 -->
          <tw-activity-timeline
            v-for="activity in activityList[date][resKey]"
            :key="activity.id"
            :index="index"
            :activity="activity"
          />
        </div>
      </div>
    </q-timeline>
    <!-- 加载中提示 -->
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
import { LocalStorage } from 'quasar'
import mixinActivity from '@/mixins/mixins-activity.js'
export default {
  name: 'TwPersonActivity',
  mixins: [mixinActivity],
  props: {
    id: {
      type: [Number, String],
      required: false,
      default: () => {
        return LocalStorage.getItem('myself').id
      }
    }
  },
  computed: {
    query () {
      return [
        { Key: 'ActorID', Value: this.id, Oper: 'eq' }
      ]
    },
    activityList () {
      let activitys = this.$store.getters['activity/activitysOfPerson'](this.id)
      for (let date in activitys) {
        activitys[date] = _.groupBy(activitys[date], (item) => { return item.objectType + item.objectId })
      }
      return activitys
    }
  },
  watch: {
    id () {
      this.initData()
      this.initInfiniteScroll()
    }
  },
  methods: {
    onLoad (index, done) {
      this.loadActivity(index, done, 'actor', this.id)
    }
  },
  components: {
    TwHeader: () => import('components/base/TwHeader')
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
