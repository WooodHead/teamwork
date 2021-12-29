<template>
  <div>
    <q-banner inline-actions>
      <span class="text-weight-bold ">
        {{SearchResultsTitle}}
      </span>
      <q-checkbox
        v-if="search!=''&& modules.type==='task'"
        v-model="matchTag"
        label="仅匹配标签"
      />
      <template
        v-slot:action
        v-if="results.length>0"
      >
        <a
          class="text-primary"
          href="javascript:void(0);"
          @click="toDetailResult()"
        >查看更多</a>
      </template>
    </q-banner>

    <div>
      <div
        v-if="loading"
        class="text-center"
      >
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
      <search-result-content
        v-else
        :results="results"
      />
    </div>
    <div
      class="text-center"
      v-if="results.length>0 &&page.nextPageToken !== -1"
    >
      <q-btn
        flat
        text-color="primary"
        label="查看更多搜索结果"
        @click="toDetailResult()"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { arrayIncludes } from '@/utils/array-includes'
export default {
  name: 'SearchResult',
  props: {
    // 资源类型
    object: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    person: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    modules: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    organize: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    searchDate: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    search: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      count: 0,
      limit: 20,
      list: [],
      matchTag: false,
      loading: true
    }
  },
  computed: {
    ...mapState('search', ['moduleOptions', 'page', 'recordLeaveList', 'recordLeaveCount']),
    SearchResultsTitle () {
      if (this.count > 0) {
        return this.$t('search.searchResults', {
          number: +this.count
        })
      } else {
        return this.$t('search.noSearchResults')
      }
    },
    selectOrganize () {
      if ('project,team,productDev'.includes(this.modules.value)) {
        return true
      } else {
        return false
      }
    },
    color () {
      if (this.matchTag) {
        return {
          bg: 'bg-primary',
          text: 'white'
        }
      } else {
        return {
          bg: 'bg-grey-3',
          text: 'dark'
        }
      }
    },
    results () {
      let results = []
      if (this.matchTag) {
        let search = this.search.replace(/，/ig, ',').split(',')
        this.list.forEach(a => {
          let flag = arrayIncludes(a.tags, search)
          if (flag) {
            results.push(a)
          }
        })
      } else {
        results = this.list
      }
      let tasks = Array.from(new Set(results))
      return _.orderBy(tasks, ['modifyTime'], ['desc'])
    }
  },
  watch: {
    'modules': {
      deep: true,
      handler (newValue, oldValue) {
        this.init()
      }
    },
    'search': {
      handler (newValue, oldValue) {
        this.init()
      }
    },
    'object': {
      handler (newValue, oldValue) {
        this.init()
      }
    },
    'person': {
      handler (newValue, oldValue) {
        this.init()
      }
    },
    'organize': {
      handler (newValue, oldValue) {
        this.init()
      }
    },
    'searchDate': {
      deep: true,
      handler (newValue, oldValue) {
        this.init()
      }
    },
    'matchTag': {
      handler (newVal, oldVal) {
        this.init()
      }
    }
  },
  components: {
    'search-result-content': () => import('components/search/SearchResultContent')
  },
  methods: {
    ...mapActions('search', ['loadSearchResultsByPage', 'loadCount']),
    toDetailResult () {
      this.$router.push({
        name: 'search',
        params: {
          query: JSON.stringify({
            object: this.object,
            person: this.person,
            modules: this.modules,
            search: this.search.replace(/\s/g, ''),
            searchDate: this.searchDate,
            organize: this.organize
          })
        }
      })
    },
    init () {
      debugger
      this.list = []
      this.count = 0
      this.loading = true
      if (this.selectOrganize) {
        this.loadSearchResultsByPage({
          person: this.person,
          modules: this.modules,
          organize: this.organize,
          search: this.search.replace(/\s/g, ''),
          searchDate: this.searchDate,
          matchTag: this.matchTag,
          limit: this.limit,
          offset: 0
        }).then(res => {
          this.loading = false
          this.list = res
        })
        this.loadCount({
          person: this.person,
          modules: this.modules,
          organize: this.organize,
          search: this.search.replace(/\s/g, ''),
          searchDate: this.searchDate,
          matchTag: this.matchTag
        }).then(res => {
          this.count = res
        })
      } else {
        if (this.object.type === 'all' && this.person.type === 'all' && this.modules.type === 'all' && this.search.trim() === '') {
          this.list = []
          this.loading = false
          this.count = 0
        } else if (['all', 'project', 'productDev', 'team'].includes(this.modules.type)) {
          this.moduleOptions.forEach(item => {
            if (!['all', 'project', 'productDev', 'team'].includes(item.value)) {
              this.loadSearchResultsByPage({
                object: this.object,
                person: this.person,
                modules: item,
                search: this.search.replace(/\s/g, ''),
                searchDate: this.searchDate,
                matchTag: this.matchTag,
                limit: this.limit,
                offset: 0
              }).then(res => {
                this.loading = false
                if (res.length >= 0) {
                  let newlist = _.differenceBy(res, this.list, ['id', 'modules'])
                  this.list.push(...newlist)
                }
              })
              this.loadCount({
                object: this.object,
                person: this.person,
                modules: item,
                search: this.search.replace(/\s/g, ''),
                searchDate: this.searchDate,
                matchTag: this.matchTag
              }).then(res => {
                this.count += res
              })
            }
          })
        } else {
          this.loadSearchResultsByPage({
            object: this.object,
            person: this.person,
            modules: this.modules,
            search: this.search.replace(/\s/g, ''),
            searchDate: this.searchDate,
            matchTag: this.matchTag,
            limit: this.limit,
            offset: 0
          }).then(res => {
            this.loading = false
            this.list = res
          })
          this.loadCount({
            object: this.object,
            person: this.person,
            modules: this.modules,
            search: this.search.replace(/\s/g, ''),
            searchDate: this.searchDate,
            matchTag: this.matchTag
          }).then(res => {
            this.count = res
          })
        }
      }
    }
  },
  mounted () {
    if (!this.recordLeaveList.length) {
      this.init()
    } else {
      this.list = this.recordLeaveList
      this.count = this.recordLeaveCount
      this.loading = false
    }

    // this.init()
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px;
  border-radius: 50%;
}
.q-banner {
  padding: 0px;
}
</style>
