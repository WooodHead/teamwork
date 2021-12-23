<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card :title="$t('allocation.header.archive')" />
    <!-- 归档的生产需求列表 -->
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      ref="qInfiniteScroll"
    >
      <q-card-section class="q-px-xxl">
        <!-- 无数据提示 -->
        <q-banner
          rounded
          dense
          class="bg-grey-3 text-body1 full-width q-mb-lg"
        >
          <template v-slot:avatar>
            <q-icon
              name="warning"
              color="warning"
            />
          </template>
          {{$t('allocation.archivedTips')}}
        </q-banner>
        <q-list class="full-width">
          <q-item
            clickable
            v-ripple
            v-for="item in allocations"
            :key="item.id"
            @click.native="()=>$router.push({name:'allocationDetail',params:{id:item.id,category,objectID}})"
          >
            <q-item-section avatar>
              <tw-avatar
                :size="'xl'"
                :id="item.leaderID"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="ellipsis text-grey-9 text-bold">{{item.title}}</q-item-label>
              <q-item-label
                caption
                class="text-left q-gutter-sm"
              >
                {{htmlToText(item.notes)}}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                align="top"
                class="q-pa-xs q-mr-md"
                :color="statusColor(item.status)"
              >{{item.status}}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
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
  </q-card>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
import { mapActions } from 'vuex'
export default {
  name: 'OrderArchived',
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    allocations () {
      return this.$store.getters['allocation/allocations']({ category: this.category, objectID: this.objectID, currentRouteName: this.$route.name })
    },
    statusColor () {
      return status => {
        return this.$store.getters['allocation/statusList'].filter(item => item.label === status)[0].color
      }
    }
  },
  watch: {
    $route: {
      immediate: false,
      deep: true,
      handler (newVal, oldVal) {
        if (newRoute.params.category !== this.category || newRoute.params.objectID !== this.objectID) {
          this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
          this.$refs.qInfiniteScroll.resume() // 重新开启加载
          this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
        }
      }
    }
  },
  methods: {
    ...mapActions('allocation', ['loadAllocations']),
    htmlToText,
    onLoad (index, done) {
      const _query = [
        { Key: this.category === 'order' ? 'OrderID' : 'ManufacturerID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'IsDelete', Value: 0, 'Oper': 'eq' }
      ]
      this.loadAllocations({ byPage: true, query: _query }).then(res => {
        setTimeout(() => {
          if (this.$store.state.allocation.page.nextPageToken === -1) {
            done(true)
          } else {
            done()
          }
        }, 200)
      })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
</style>
