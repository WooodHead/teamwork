<template>
  <div>
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      class="row q-col-gutter-md q-gutter-y-md"
      :class="{'justify-center':listStyle==='showcards'}"
      ref="qInfiniteScroll"
    >
      <tw-search-panel
        :queryList="queryList"
        :search.sync="search"
        :query.sync="query"
      />
      <div
        v-if="listStyle==='showcards'"
        class="flex full-width q-py-none q-my-none q-gutter-y-md"
      >
        <template>
          <opportunity-card
            v-for="model in modelList"
            :key="model.id"
            :model="model"
          />
        </template>
      </div>
      <template v-else-if="listStyle==='showtable'">
        <opportunity-table :modelList="modelList" />
      </template>
      <template v-else>
        <resource-list
          category="opportunity"
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
    <template v-if="$store.state.opportunity.firstLoaded&&modelList.length===0">
      <tw-banner-no-result
        class="q-mt-md"
        :info="$t('opportunity.notes')"
      />
    </template>
  </div>
</template>

<script>
import { format } from 'quasar'
import { mapMutations } from 'vuex'
const { capitalize } = format
export default {
  name: 'opportunityGrid',
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
      description: '获取商机列表的条件，后面有了后台可以传递，params，query等条件'
    }
  },
  computed: {
    modelList () {
      return this.selectKey !== '' && this.$store.getters[`opportunity/get${capitalize(this.selectKey)}`](this.$route)
    },
    listStyle () {
      return this.$store.getters[`opportunity/listStyle`]
    },
    queryList: {
      get () { return this.$store.getters[`opportunity/queryList`] }
    },
    query: {
      get () {
        return this.$store.getters['opportunity/query']
      },
      set (val) {
        val
          ? this.$store.commit('opportunity/setQuery', val)
          : this.$store.commit('opportunity/setQuery', '')
      }
    },
    search: {
      get () {
        return this.$store.getters['opportunity/search']
      },
      set (val) {
        val
          ? this.$store.commit('opportunity/setSearch', val)
          : this.$store.commit('opportunity/setSearch', '')
      }
    }
  },
  methods: {
    ...mapMutations('opportunity', ['initPage']),
    onLoad (index, done) {
      Object.assign(this.condition, { byPage: true })
      if (index === 1) {
        // 重置分页参数
        this.initPage()
      }
      this.$store.dispatch(`opportunity/loadOpportunitys`, this.condition)
        .then(res => {
          setTimeout(() => {
            if (this.$store.state.opportunity.page.nextPageToken === -1) {
              this.$store.state.opportunity.firstLoaded = true // 首次已加载
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
        setTimeout(() => {
          if (this.$refs.qInfiniteScroll) {
            this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
            this.$refs.qInfiniteScroll.resume() // 重新开启加载
            this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
          }
          this.$store.state.opportunity.firstLoaded = false // 重新首次加载
          let listPageType = this.$store.getters[`opportunity/listPageType`]
          listPageType.key !== 'customerList' && this.$store.dispatch(`opportunity/loadArchivedCount`) // 重新加载归档的商机数
        }, 200)
      }
    }
  },
  components: {
    OpportunityCard: () => import('components/opportunity/OpportunityCard'),
    ResourceList: () => import('components/resource/ResourceList'),
    OpportunityTable: () => import('components/resource-table/OpportunityTable'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  }
}
</script>

<style lang="scss" scoped >
.q-card {
  border-radius: 0.6rem;
}
/deep/.q-infinite-scroll__loading {
  width: 100%;
}
</style>
