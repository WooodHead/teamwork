<template>
  <q-page>
    <q-card
      :class="tableView?'table-grow-in-page':'card-grow-in-page'"
      :flat="$q.screen.lt.sm"
    >
      <tw-header-card
        :title="title"
        noMenu
      ></tw-header-card>
      <q-card-section
        class="text-center"
        v-if="condition.person.id && condition.modules.type==='task'"
      >
        <select-task-condition @select="GetTaskSelectResults" />
      </q-card-section>

      <q-card-section :class="tableView?'q-px-xl':'q-px-xxl'">
        <div v-if="!tableView">
          <span class="text-weight-bold">
            {{SearchResults}}
          </span>
          <q-checkbox
            v-if="condition.search && condition.modules.type==='task'"
            v-model="matchTag"
            label="仅匹配标签"
          />
        </div>
        <component
          v-if="tableView"
          :is="compTable[condition.modules.type]"
          :modelList="selectResults"
          :title="SearchResults"
        ></component>
        <search-result-content
          v-else
          :results="selectResults"
        />
        <div
          class="text-center"
          v-if="selectResults.length&&page.nextPageToken !== -1"
        >
          <q-btn
            flat
            text-color="primary"
            label="查看更多搜索结果"
            @click="init(condition)"
          />
        </div>
        <div
          v-else
          class="text-center text-grey-5 q-mt-md"
        >
          已经到底了
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PageSearchResult',
  props: {
    query: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      count: 0,
      queryCondition: [],
      limit: 20,
      noData: false,
      results: [],
      selectResults: [],
      matchTag: false,
      selectOptions: '',
      compTable: {
        project: 'ProjectTable',
        productDev: 'ProductDevTable',
        team: 'TeamTable'
      }
    }
  },
  computed: {
    ...mapState('search', ['moduleOptions', 'page']),
    condition () {
      return JSON.parse(this.query)
    },
    selectOrganize () {
      return Object.keys(this.compTable).includes(this.condition.modules.value)
    },
    SearchResults () {
      if (this.count > 0) {
        return this.$t('search.searchResults', {
          number: +this.count
        })
      } else {
        return this.$t('search.noSearchResults')
      }
    },
    title () {
      let header = ''
      if (this.condition.object.value !== 'all') {
        header += '在' + this.condition.object.label + '中'
      }
      if (this.condition.person.type !== 'all') {
        header += '与' + this.condition.person.name + '相关的'
      }
      if (this.condition.modules.type === 'all') {
        header += '所有搜索结果'
      } else {
        header += '"' + this.$t(`${this.condition.modules.type}.title`) + '"模块的所有搜索结果'
      }
      if (this.condition.search !== '') {
        header += ',匹配条件： ' + this.condition.search
      }
      return header
    },
    tableView () {
      return Object.keys(this.compTable).includes(this.condition.modules.type) &&
        !this.$q.platform.is.mobile
    }
  },
  watch: {
    'matchTag': {
      handler (newVal, oldVal) {
        this.init(this.condition)
      }
    }
  },
  components: {
    SearchResultContent: () => import('components/search/SearchResultContent'),
    SelectTaskCondition: () => import('components/search/SelectTaskCondition'),
    ProjectTable: () => import('components/resource-table/ProjectTable'),
    ProductDevTable: () => import('components/resource-table/ProductDevTable'),
    TeamTable: () => import('components/resource-table/TeamTable'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  methods: {
    ...mapActions('search', ['loadSearchResultsByPage', 'loadCount']),
    init (condition) {
      this.results = []
      this.count = 0
      if (this.selectOrganize) {
        this.loadSearchResultsByPage({
          person: condition.person,
          modules: condition.modules,
          organize: condition.organize,
          search: condition.search.replace(/\s/g, ''),
          searchDate: condition.searchDate,
          matchTag: condition.matchTag,
          limit: this.limit,
          offset: 0
        }).then(res => {
          this.loading = false
          this.results = res
          this.selectResults = _.cloneDeep(this.results)
          if (this.page.nextPageToken !== -1) {
            // 下一次加载日期
            this.limit += 20
          } else {
            this.noData = true
          }
        })
        this.loadCount({
          person: condition.person,
          modules: condition.modules,
          organize: condition.organize,
          search: condition.search.replace(/\s/g, ''),
          searchDate: condition.searchDate,
          matchTag: condition.matchTag
        }).then(res => {
          this.count = res
        })
      } else if (condition.object.type === 'all' &&
        condition.person.type === 'all' &&
        condition.modules.type === 'all' &&
        condition.search.trim() === '') {
        this.results = []
        this.count = 0
      } else if (['all', 'project', 'productDev', 'team'].includes(condition.modules.type)) {
        this.moduleOptions.forEach(item => {
          if (!['all', 'project', 'productDev', 'team'].includes(item.value)) {
            this.loadSearchResultsByPage({
              object: condition.object,
              person: condition.person,
              modules: item,
              search: condition.search.replace(/\s/g, ''),
              searchDate: condition.searchDate,
              selectOptions: this.selectOptions,
              matchTag: this.matchTag,
              limit: this.limit,
              offset: 0
            }).then(res => {
              if (res.length > 0) {
                res.forEach(item => {
                  this.results.push(item)
                })
              }
              // this.results = _.orderBy(this.results, ['createTime'], ['desc'])
              this.selectResults = _.cloneDeep(this.results)
              if (this.page.nextPageToken !== -1) {
                // 下一次加载日期
                this.limit += 20
              } else {
                this.noData = true
              }
            })
            this.loadCount({
              object: condition.object,
              person: condition.person,
              modules: item,
              search: condition.search.replace(/\s/g, ''),
              searchDate: condition.searchDate,
              selectOptions: this.selectOptions,
              matchTag: this.matchTag
            }).then(res => {
              this.count += res
            })
          }
        })
      } else {
        this.loadSearchResultsByPage({
          object: condition.object,
          person: condition.person,
          modules: condition.modules,
          search: condition.search.replace(/\s/g, ''),
          searchDate: condition.searchDate,
          selectOptions: this.selectOptions,
          matchTag: this.matchTag,
          limit: this.limit,
          offset: 0
        }).then(res => {
          this.results = res
          this.selectResults = _.cloneDeep(this.results)
          if (this.page.nextPageToken !== -1) {
            // 下一次加载日期
            this.limit += 20
          } else {
            this.noData = true
          }
        })
        this.loadCount({
          object: condition.object,
          person: condition.person,
          modules: condition.modules,
          search: condition.search.replace(/\s/g, ''),
          searchDate: condition.searchDate,
          selectOptions: this.selectOptions,
          matchTag: this.matchTag
        }).then(res => {
          this.count = res
        })
      }
    },
    GetTaskSelectResults (value) {
      // 获取选中的筛选条件
      this.selectOptions = value
      this.init(this.condition)
    }
  },
  mounted () {
    if (this.condition.matchTag) {
      this.matchTag = true
    }
    this.init(this.condition)
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.init(JSON.parse(to.params.query))
    next()
  }
}
</script>

<style lang="scss" scoped>
.table-grow-in-page {
  max-width: 100vw;
  min-width: 90vw;
  width: 100%;
  flex-grow: 1;
}
</style>
