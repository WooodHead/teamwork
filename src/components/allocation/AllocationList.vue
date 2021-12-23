<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card
      :title="$t('allocation.title')"
      :actions="category==='order'?['add']:[]"
      :add="{ label: $t('allocation.add'), click: ()=> $router.push({name:'allocationAdd',params:{category,objectID}}) }"
    >
    </tw-header-card>
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      ref="qInfiniteScroll"
    >

      <div
        v-if="loaded&&allocations.length==0"
        style="width:300px"
        class="text-h6 text-grey-5 q-mx-auto q-mt-md"
      >
        {{$t("allocation.noAllocationTips_1")}}
        <ul class="text-subtitle1">
          <li>{{$t("allocation.noAllocationTips_2")}}</li>
        </ul>
      </div>

      <q-card-section class="q-px-xxl">
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
              <q-item-label
                lines="1"
                class="ellipsis text-grey-9 text-bold"
              >{{item.manufacturerName}}</q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-left q-gutter-sm"
              >
                <span class="text-weight-bold">{{item.title}}</span>
                -- {{htmlToText(item.notes)}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
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
    <!-- 归档说明区 -->
    <q-card-section v-if="archivedCount>0">
      <tw-archived-count
        :label="$t('archive.someArchived',{count:archivedCount,something:$t('allocation.title')})"
        @click="$router.push({name: 'archivedAllocations',params:{category,objectID}})"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'AllocationList',
  props: {
    category: {
      type: String,
      default: 'order',
      required: true
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: true
    }
  },
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters('allocation', ['archivedCount']),
    allocations () {
      return this.$store.getters['allocation/allocations']({ category: this.category, objectID: this.objectID, currentRouteName: this.$route.name })
    },
    statusColor () {
      return status => {
        let statusModel = this.$store.getters['allocation/statusList'].filter(item => item.label === status)[0]
        return statusModel && statusModel.color
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
    ...mapActions('allocation', ['loadAllocations', 'loadArchivedCount']),
    htmlToText,
    onLoad (index, done) {
      if (index === 1) {
        this.loaded = false
        const _queryArchivedCount = [
          { Key: this.category === 'order' ? 'OrderID' : 'ManufacturerID', Value: +this.objectID, Oper: 'eq' },
          'and',
          { Key: 'Archived', Value: 1, Oper: 'eq' }]
        this.loadArchivedCount({ query: _queryArchivedCount })
      }
      const _queryList = [
        { Key: this.category === 'order' ? 'OrderID' : 'ManufacturerID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }]
      this.loadAllocations({ byPage: true, query: _queryList }).then(res => {
        if (this.$store.state.allocation.page.nextPageToken === -1) {
          this.loaded = true
          done(true)
        } else {
          done()
        }
      })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwArchivedCount: () => import('components/base/TwArchivedCount')
  }
}
</script>

<style scoped lang="scss">
</style>
