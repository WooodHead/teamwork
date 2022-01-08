
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <!-- 卡片头部 -->
    <!-- :title=" '['+ customer.notes+']'+ $t(`followup.title`)" -->
    <tw-header-card
      title='跟进'
      :actions="actions"
      :add="{label:$t(`followup.addLabel`),click:()=>addFollowup()}"
    >
      <template v-slot:right>
        <q-select
          :value="sort"
          @input="sortUpdate"
          :options="options"
          dense
          emit-value
          map-options
          options-dense
          outlined
          rounded
        >
        </q-select>
        <q-btn-group
          rounded
          outline
          class="q-ml-sm"
        >
          <q-btn
            v-for="(view,index) in viewTypes"
            :key="view.value"
            outline
            :title="view.title"
            @click="setListType(view.value)"
            color="grey-5"
            :class="{'q-pl-sm':index===0,'q-pr-sm':index===viewTypes.length-1}"
          >
            <q-icon
              :name="view.icon"
              :color="listType===view.value?'primary':''"
            />
          </q-btn>
        </q-btn-group>
      </template>
    </tw-header-card>
    <q-card-section
      class="tw-resume-header bg-white"
      :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'"
    >
      <!-- 搜索组件 -->
      <tw-search-panel
        :queryList="queryList"
        :search.sync="search"
        :query.sync="query"
        label="搜索标题/内容"
      />
    </q-card-section>
    <!-- 跟进记录 -->
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      ref="qInfiniteScroll"
    >
      <q-card-section
        class="q-px-xl q-pt-none row q-col-gutter-x-sm"
        v-if="listType==='card'"
      >
        <div
          id="div-followup-card"
          :class="modelList.length>1?'col-6':'col-12 full-width'"
          v-for="followup in modelList"
          :key="followup.id"
        >
          <followup-card
            class="q-mt-sm"
            :model="followup"
          />
        </div>
      </q-card-section>
      <q-card-section
        class="q-px-xl q-pt-none"
        v-else
      >
        <followup-table
          :list="modelList"
          :category="category"
          :objectID="+objectID"
        />
      </q-card-section>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <q-card-section class="q-px-xl q-pt-none">
      <template v-if="$store.state.followup.firstLoaded&&modelList.length===0">
        <tw-banner-no-result
          class="q-mt-md"
          info="暂无相关跟进"
        />
      </template>
    </q-card-section>
  </q-card>

</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { LocalStorage, date, Platform } from 'quasar'
// import Customer from '@/store/customer/model'
import followupIndex from '@/components/wiki/mixins-followup-index'
const { formatDate } = date
export default {
  name: 'FollowupIndex',
  mixins: [followupIndex],
  props: {
    // 资源类型
    category: {
      type: String,
      required: false,
      default: 'customer'
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      required: false,
      default: () => {
        return LocalStorage.getItem('myself').id
      }
    }
  },
  components: {
    // 'tw-menu': ()=> import('components/base/TwMenu'),
    'tw-header-card': () => import('components/base/TwHeaderCard'),
    // FollowupList: () => import('components/followup/FollowupList'),
    FollowupCard: () => import('components/followup/FollowupCard'),
    FollowupTable: () => import('components/followup/FollowupTable'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  },
  data () {
    return {
      actions: ['add'],
      // customer: new Customer(),
      sortOptions: [
        {
          value: 'card',
          label: this.$t(`task.view.card`)
        },
        {
          value: 'list',
          label: this.$t(`task.view.list`)
        }
      ],
      id: 0, // 新建和编辑清单Form时使用
      myself: LocalStorage.getItem('myself')
    }
  },
  methods: {
    formatDate,
    ...mapMutations('followup', ['setAddingEvent', 'setListType', 'setSort']),
    ...mapActions('followup', ['loadFollowups']),
    ...mapActions('customer', ['loadCustomer']),
    // 切换卡片和列表
    // 更新排序
    sortUpdate (value) {
      this.setSort(value)
      this.resetInfiniteScroll()
    },
    addFollowup () {
      this.$router.push({
        name: 'followupAdd',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: 0
        }
      })
    },
    onLoad (index, done) {
      if (index === 1) {
        this.$store.commit('followup/updatePage', { nextPageToken: -1 })
      }
      Object.assign(this.condition, { byPage: true })
      this.loadFollowups(this.condition).then((res) => {
        setTimeout(() => {
          if (this.$store.state.followup.page.nextPageToken === -1) {
            this.$store.state.followup.firstLoaded = true // 首次已加载
            done(true)
          } else {
            done()
          }
        }, 200)
      })
    },
    clearFilter () {
      this.setFilterType('')
    },
    exportPdf () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(
          this.$t('exportFile.weChatDoesNotCurrentlySupportExports')
        )
        return false
      }
      this.exportPDF = true
    }
    // followupCount () {
    //   return this.$store.state.followup.followups.filter(item => this.category === item.objectType && this.objectID === item.objectID && !item.deleted).length || 0
    // }
  },
  computed: {
    ...mapState('followup', ['search', 'listType', 'sort']),
    ...mapGetters('followup', ['followups', 'listStyle', 'listPageType']),
    menuLists () {
      return [{ group: ['exportPDF', 'exportExcel'] }]
    },
    modelList () {
      return this.followups({})
    },
    modelTitleList () {
      return this.followups({}).map((a) => a.title)
    },
    conditionAndSearch () {
      return {
        condition: this.condition,
        search: this.search
      }
    },
    condition () {
      const baseQuery = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' },
        'and',
        { Key: 'IsDelete', Value: 0, Oper: 'eq' }
      ]
      let queryAll = []
      queryAll.push(...baseQuery)
      if (this.listPageType.selectCondition.query.length > 0) {
        queryAll.push(...this.listPageType.selectCondition.query)
      }
      return {
        query: queryAll,
        returnData: false
      }
    },
    queryList: {
      get () {
        return this.$store.getters[`followup/queryList`]
      }
    },
    query: {
      get () {
        return this.$store.getters['followup/query']
      },
      set (val) {
        val
          ? this.$store.commit('followup/setQuery', val)
          : this.$store.commit('followup/setQuery', '')
      }
    },
    // 搜索框搜索条件
    search: {
      get () {
        return this.$store.getters['followup/search']
      },
      set (val) {
        val
          ? this.$store.commit('followup/setSearch', val)
          : this.$store.commit('followup/setSearch', '')
      }
    },
    filterType: {
      get () {
        return this.$store.state.followup.filterType
      },
      set (value) {
        this.setFilterType(value)
      }
    }
  },
  mounted () {
    // this.loadFollowups(this.condition)
    // this.loadCustomer(+this.objectID).then((res) => {
    //   this.customer = res
    // })
  },
  watch: {
    conditionAndSearch: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        // 清空数据，重新加载
        this.$store.state.followup.followups = []
        this.$store.state.followup.page = {
          offset: 0,
          limit: 10,
          nextPageToken: 0
        }
        // 重新显示加载图标
        this.$store.state.followup.firstLoaded = false

        if (this.$refs.qInfiniteScroll) {
          this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
          this.$refs.qInfiniteScroll.resume() // 重新开启加载
          this.$refs.qInfiniteScroll.trigger() // 不管滚动位置如何，重新调用onload
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@media screen and (max-width: $breakpoint-xs-max) {
  .tw-resume-header {
    margin-left: 30px;
    margin-right: 30px;
  }
}
@media screen and (max-width: $breakpoint-sm-max) {
  #div-followup-card {
    width: 100%;
  }
}
@media screen and (min-width: $breakpoint-sm-max) {
  #div-followup-card {
    width: 50%;
  }
}
</style>
