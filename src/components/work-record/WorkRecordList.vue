<template>
  <div>
    <!-- 初始化未更新，正在加载中 -->
    <template v-if="tasksList===null">
      <div class="row justify-center q-py-md">
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
    </template>
    <template v-show="tasksList.length>0">
      <q-infinite-scroll
        @load="onLoadData"
        :offset="250"
        ref="infiniteScroll"
      >
        <!-- 草稿提示 -->
        <div
          class="row justify-center q-mb-sm"
          v-if="!$q.screen.lt.sm&&noCompleteTask&&Object.keys(noCompleteTask).length"
        >
          <q-btn
            flat
            :label="$t('workRecord.draftNotes')"
            color="primary"
            icon="insert_drive_file"
            @click="toWorkRecordEdit()"
          />
        </div>
        <q-list
          v-if="tasksList.length"
          separator
        >
          <div
            v-for="item in tasksList"
            :key="item.date"
          >
            <div class="bg-grey-3 text-grey-8 q-py-xxs q-pl-md">
              {{item.date}}
              <!-- 超过8小时：红色，小于8小时：蓝色 -->
              <span
                v-if="item.totalHour !== 8"
                :class="classObject(item)"
                :title="titleObject(item)"
              >
                {{excWorkHourMsg(item)}}
              </span>
            </div>
            <work-record-item
              v-for="task in item.tasklist"
              :key="task.id"
              :task="task"
            />
          </div>
        </q-list>
        <!-- 加载中 -->
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </template>
    <!-- 没有数据显示 -->
    <template v-if="loaded&&!tasksList.length&&(!noCompleteTask||!Object.keys(noCompleteTask).length)">
      <div
        v-if="$q.screen.lt.sm&&!search&&!fromToDate"
        class="text-h6 text-grey-5 q-mt-md q-px-md"
      >
        {{$t("workRecord.noResultTips")}}
      </div>
      <template v-else>
        <tw-banner-no-result :info="(search
        ||fromToDate)?$t('toolbar.noSearchResults'):$t('workRecord.noResultTips')" />
      </template>
    </template>
    <!-- 移动端只有一条数据显示 -->
    <template v-if="$q.screen.lt.sm&&!search&&!fromToDate">
      <!-- 只有一条正在进行中的数据 -->
      <div
        v-if="!tasksList.length&&noCompleteTask&&Object.keys(noCompleteTask).length"
        class="text-h6 text-grey-5 text-center q-mt-md"
      >
        {{$t("workRecord.oneNoCompletedResultTip")}}
      </div>
      <!-- 有一条已完成数据 -->
      <div
        v-if="completeTask.length===1"
        class="text-h6 text-grey-5 text-center q-mt-md"
      >
        {{$t("workRecord.oneCompletedResultTip")}}
      </div>
    </template>
  </div>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'WorkRecordList',
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapState('task', ['search', 'fromToDate', 'tasks']),
    tasksList () {
      return this.$store.getters['task/workRecordTaskList'](+this.$myinfo.id)
    },
    noCompleteTask () {
      return _.find(this.tasks, p =>
        p.objectType === 'person' && p.objectId === +this.$myinfo.id && p.type === 'item' && !p.finished
      )
    },
    completeTask () {
      return _.filter(this.tasks, p =>
        p.objectType === 'person' && p.objectId === +this.$myinfo.id && p.type === 'item' && p.finished
      )
    },
    classObject () {
      return function (item) {
        if (item.totalHour !== 8) {
          return item.totalHour > 8 ? 'text-red' : 'text-blue'
        }
      }
    },
    titleObject () {
      return function (item) {
        if (item.totalHour !== 8) {
          return item.totalHour > 8 ? '当天总工时超过8小时' : '当天总工时少于8小时'
        }
      }
    },
    excWorkHourMsg () {
      return function (item) {
        return '(' + item.totalWorkHour + 'h + ' + item.totalOnRoadHour + 'h = ' + item.totalHour + 'h)'
      }
    }
  },
  methods: {
    ...mapActions('task', ['loadWorkRecordTaskPageList']),
    onLoadData (index, done) {
      if (index === 1) {
        this.loaded = false
      }
      this.init(() => {
        this.loaded = true
        setTimeout(() => {
          if (this.$store.state['task'].page.nextPageToken === -1) {
            done(true)
          } else {
            done()
          }
        }, 1000)
      })
    },
    init (callBack) {
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.$myinfo.id, Oper: 'eq' },
        'and',
        { Key: 'Type', Value: 'item', Oper: 'eq' }
      ]
      if (this.fromToDate) {
        query.push('and')
        query.push({ Key: 'BeginTime', Value: date.formatDate(date.addToDate(this.fromToDate.to, { days: 1 }), 'YYYY-MM-DD') + ' 00:00:00', Oper: 'lt' })
        query.push('and')
        query.push({ Key: 'BeginTime', Value: date.formatDate(this.fromToDate.from, 'YYYY-MM-DD') + ' 00:00:00', Oper: 'ge' })
      }
      this.loadWorkRecordTaskPageList({ query: query }).then(res => {
        callBack && callBack()
      })
    },
    toWorkRecordEdit () {
      this.$router.push({
        name: 'workRecordEdit',
        params: { id: +this.noCompleteTask.id }
      })
    }
  },
  watch: {
    search: {
      deep: true,
      handler (newVal, oldVal) {
        this.$refs.infiniteScroll.reset() // 设置滚动索引为0
        this.$refs.infiniteScroll.resume() // 重新开启加载
        this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      }
    },
    fromToDate: {
      deep: true,
      handler (newVal, oldVal) {
        this.$refs.infiniteScroll.reset() // 设置滚动索引为0
        this.$refs.infiniteScroll.resume() // 重新开启加载
        this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      }
    }
  },
  components: {
    WorkRecordItem: () => import('components/work-record/WorkRecordItem'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style lang="scss" scoped>
</style>
