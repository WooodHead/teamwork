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
    <template>
      <q-infinite-scroll
        @load="onLoadData"
        :offset="250"
        ref="infiniteScroll"
      >
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
            </div>
            <work-record-item
              v-for="task in item.tasklist"
              :key="task.id"
              :task="task"
            >
              <template #avatarIcon>
                <div avatar>
                  <tw-avatar
                    size="lg"
                    :id="task.createByID"
                  >
                  </tw-avatar>
                </div>
              </template>
              <template #typeIcon>
                <q-btn
                  size="6px"
                  class="type-icon"
                  :label="task && task.businessType && task.businessType.split('—') ? task.businessType.split('—')[0].trim() : 'sort_by_alpha'"
                  color="grey-9"
                  round
                  outline
                  :title="task && task.businessType && task.businessType.split('—') ? task.businessType.split('—')[1].trim() : '工作类别'"
                >
                </q-btn>
              </template>
            </work-record-item>
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
    <template v-if="loaded&&!tasksList.length">
      <tw-banner-no-result />
    </template>
  </div>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ViewDetailList',
  data () {
    return {
      orgId: 0,
      psonId: +this.$myinfo.id,
      loaded: false
    }
  },
  props: {
    person: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    organizeId: {
      type: Number,
      required: false,
      default: 0
    },
    fromToDate: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapState('task', ['tasks']),
    tasksList () {
      return this.$store.getters['task/workRecordTaskList']()
    }
  },
  methods: {
    ...mapActions('task', ['loadWorkRecordTaskPageList']),
    onLoadData (index, done) {
      if (index === 1) {
        this.loaded = false
      }
      this.init(() => {
        setTimeout(() => {
          if (this.$store.state['task'].page.nextPageToken === -1) {
            this.loaded = true
            done(true)
          } else {
            done()
          }
        }, 1000)
      })
    },
    init (callBack) {
      if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
        this.orgId = 1
        this.psonId = 0
      } else {
        this.orgId = 0
        this.psonId = +this.$myinfo.id
      }
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'Type', Value: 'item', Oper: 'eq' }
      ]
      if (this.person && this.person.id) {
        query.push('and', { Key: 'ObjectID', value: +this.person.id, oper: 'eq' })
      }
      if (this.organizeId) {
        this.orgId = +this.organizeId
      }
      if (this.fromToDate && this.fromToDate.from) {
        query.push('and', { Key: 'BeginTime', Value: this.fromToDate.from, oper: 'ge' })
        query.push('and', { Key: 'FinishedTime', Value: date.formatDate(date.addToDate(new Date(this.fromToDate.to), { days: 1 }), 'YYYY-MM-DD'), oper: 'lt' })
      }
      this.loadWorkRecordTaskPageList({ query: query, orgId: this.orgId, psonId: this.psonId }).then(res => {
        callBack && callBack()
      })
    },
    reloadScroll () {
      this.$refs.infiniteScroll.reset() // 设置滚动索引为0
      this.$refs.infiniteScroll.resume() // 重新开启加载
      this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
    }
  },
  watch: {
    person: {
      deep: true,
      handler (newValue, oldValue) {
        this.reloadScroll()
      }
    },
    organizeId: {
      deep: true,
      handler (newValue, oldValue) {
        this.reloadScroll()
      }
    },
    fromToDate: {
      deep: true,
      handler (newValue, oldValue) {
        this.reloadScroll()
      }
    }
  },
  components: {
    WorkRecordItem: () => import('components/work-record/WorkRecordItem'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
.type-icon /deep/.q-btn__content {
  font-size: 12px;
}
</style>
