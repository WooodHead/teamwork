<template>
  <div>
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      class="row q-col-gutter-md"
      :class="{'justify-center':listStyle==='showcards'}"
      ref="qInfiniteScroll"
    >
      <tw-search-panel
        :label="'搜索编号/客户名称/负责人'"
        :queryList="queryList"
        :search.sync="search"
        :query.sync="query"
        class="q-mt-md"
      />
      <div v-if="listStyle==='showcards'" class="row full-width q-gutter-y-md">
        <order-card
          v-for="model in modelList"
          :key="model.id"
          :model="model"
        />
      </div>
      <template v-else-if="listStyle==='showtable'">
        <order-table
          class="q-mt-md"
          :modelList="modelList"
        />
      </template>
      <template v-else>
        <resource-list
          category="order"
          :modelList="modelList"
        />
      </template>
      <template v-slot:loading>
        <div class="row justify-center">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <template v-if="$store.state.order.firstLoaded&&modelList.length===0">
      <tw-banner-no-result class="q-mt-md" :info="$t('order.noOrders')" />
    </template>
  </div>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'OrderGrid',
  props: {
    selectKey: {
      type: String,
      default: ''
    },
    condition: {
      type: Object,
      default: () => {
        return { isArchive: false }
      },
      description: '获取订单列表的条件，后面有了后台可以传递，params，query等条件'
    }
  },
  computed: {
    modelList () {
      return this.$store.getters[`order/get${capitalize(this.selectKey)}`](this.$route)
    },
    listStyle () {
      return this.$store.getters[`order/listStyle`]
    },
    queryList: {
      get () {
        return this.$store.getters[`order/queryList`]
      }
    },
    query: {
      get () {
        return this.$store.getters['order/query']
      },
      set (val) {
        val
          ? this.$store.commit('order/setQuery', val)
          : this.$store.commit('order/setQuery', [])
      }
    },
    search: {
      get () {
        return this.$store.getters['order/search']
      },
      set (val) {
        val
          ? this.$store.commit('order/setSearch', val)
          : this.$store.commit('order/setSearch', '')
      }
    }
  },
  methods: {
    onLoad (index, done) {
      if (index === 1) {
        this.$store.commit('order/setPage', { nextPageToken: -1 })
      }
      Object.assign(this.condition, { byPage: true })
      this.$store.dispatch(`order/loadOrders`, this.condition)
        .then(res => {
          setTimeout(() => {
            if (this.$store.state.order.page.nextPageToken === -1) {
              this.$store.state.order.firstLoaded = true // 首次已加载
              done(true)
            } else {
              done()
            }
          }, 200)
        })
    }
  },
  watch: {
    condition: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (this.$refs.qInfiniteScroll) {
          this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
          this.$refs.qInfiniteScroll.resume() // 重新开启加载
          this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
        }
        // 清空数据，重新加载
        this.$store.state.order.orders = []
        this.$store.state.order.page = { offset: 0, limit: 20, nextPageToken: 0 }
        // 重新显示加载图标
        this.$store.state.order.firstLoaded = false
        // 重新加载归档的订单数
        this.$store.getters[`order/listPageType`].key !== 'customerList' &&
         this.$store.dispatch(`order/loadArchivedCount`)
      }
    }
  },
  components: {
    OrderCard: () => import('components/order/OrderCard'),
    ResourceList: () => import('components/resource/ResourceList'),
    OrderTable: () => import('components/resource-table/OrderTable'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  }
}
</script>

<style lang="scss" scoped >
/deep/.q-infinite-scroll__loading {
  width: 100%;
}
</style>
