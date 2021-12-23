<template>
  <div>
    <!-- 初始化未更新，正在加载中 -->
    <div
      class="row justify-center q-py-md"
      v-if="modelList === null"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <!-- 初始化更新后，卡片列表length>0 -->
    <q-infinite-scroll
      @load="onLoadData"
      :offset="250"
      class="q-mb-lg row justify-center"
      ref="infiniteScroll"
    >
      <router-link
        v-if="needTemplate"
        class="q-my-sm"
        style="text-decoration: none;color:#877457;"
        :to="{ name: `${category}AddTemplate` }"
      >
        {{ noTemplateNotes }}
      </router-link>
      <tw-search-panel
        v-if="searchable"
        class="q-mt-sm"
        :queryList="queryList"
        :search.sync="search"
        :query.sync="query"
        :label="searchPlaceholder"
      />

      <div
        v-if="listStyle === 'showcards'"
        class="row q-gutter-y-md full-width q-my-sm"
      >
        <resource-card
          v-for="model in modelList"
          :key="model.id"
          :category="category"
          :model="model"
          :cardMenus="cardMenus"
        />
      </div>
      <component
        v-else-if="listStyle === 'showtable'"
        class="q-my-sm"
        :is="`${capitalize(category)}Table`"
        :modelList="modelList"
      ></component>
      <resource-list
        v-else
        :category="category"
        :modelList="modelList"
      />

      <template
        v-slot:loading
        v-if="!relatedResource && modelList.length > 0 && showLoading"
      >
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <!-- 卡片列表length===0时展示没有数据 -->
    <tw-banner-no-result
      v-if="modelList.length === 0"
      :info="$t(`${category}.notes`)"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { format } from 'quasar'
import { i18n } from '@/boot/i18n'
const { capitalize } = format
export default {
  name: 'ResourceGrid',
  props: {
    category: {
      type: String,
      required: true
    },
    relatedResource: {
      type: Array,
      default: null,
      required: false,
      description: '关联的资源数据'
    },
    selectCondition: {
      type: Object,
      default: () => {
        return { isArchive: false }
      },
      description: '获取资源列表的条件，后面有了后台可以传递，params，query等条件'
    },
    cardMenus: {
      type: Array,
      default: () => [],
      desc: '卡片菜单'
    },
    needTemplate: {
      type: Boolean,
      default: false,
      required: false,
      description: '是否有模板功能'
    }
  },
  data () {
    return {
      isUpdatePage: true,
      exitTemplate: true
    }
  },
  created () {
    this.$store.dispatch(`${this.category}/loadArchivedCount`)
    // 获取搜索需要的数据
    this.loadDictionarys(this.category)
    this.needTemplate &&
      this.exist(this.category).then(res => {
        this.exitTemplate = res
      })
  },
  mounted () {
    this.$refs.infiniteScroll && this.$refs.infiniteScroll.resume()
  },
  computed: {
    ...mapState('person', ['persons']),
    ...mapState('dictionary', ['dictionary']),
    noTemplateNotes () {
      const categoryTrans = this.$t(`${this.category}.title`)
      return this.$t('template.noTemplateNotes', { category: categoryTrans })
    },
    searchable () {
      return this.$route.name !== 'resourceRelation' && [
        'customer',
        'productDev',
        'team',
        'manufacturer',
        'project'
      ].includes(this.category) // 客户、项目、产品研发、工程服务、团队。目前数组只加了客户
    },
    searchPlaceholder () {
      return i18n.t(`${this.category}.searchPlaceholder`)
    },
    modelList () {
      if (this.relatedResource) {
        // 展示关联
        return _.cloneDeep(this.relatedResource)
      } else {
        let list = this.$store.getters[`${this.category}/getAllList`](this.$route.name)
        let page = this.$store.state[this.category].page
        if (list.length !== page.offset) {
          this.$store.commit(
            `${this.category}/updatePage`,
            Object.assign(page, { offset: list.length })
          )
        }
        return list
      }
    },
    listStyle () {
      return this.$store.state[this.$route.params.relates || this.category].listStyle
    },
    showLoading () {
      const pagePayload = this.$store.state[`${this.category}`].page
      return !(pagePayload['nextPageToken'] === -1)
    },
    queryList () {
      let queryList = this.$store.state[this.category].queryList
      const dictionary = this.dictionary[this.category]
      if (dictionary) {
        for (const [key, value] of Object.entries(dictionary)) {
          const query = _.find(queryList, { field: key })
          if (query) {
            query.value = value.map(v => {
              return {
                label: v.dictValue,
                value: v.dictValue,
                name: v.field
              }
            })
          }
        }
      }
      return queryList
    },
    query: {
      get () {
        return this.$store.state[this.category].query
      },
      set (val) {
        // 清空数据
        this.$store.commit(`${this.category}/empty${capitalize(this.category)}s`)
        this.$store.commit(`${this.category}/setQuery`, val)
      }
    },
    search: {
      get () {
        return this.$store.state[this.category].search
      },
      set (val) {
        this.$store.commit(
          `${this.category}/empty${capitalize(this.category)}s`
        )
        this.$store.commit(
          `${this.category}/updatePage`,
          {
            offset: 0,
            limit: 20,
            nextPageToken: 0
          }
        )
        val
          ? this.$store.commit(`${this.category}/setSearch`, val)
          : this.$store.commit(`${this.category}/setSearch`, '')
      }
    }
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapActions('template', ['exist']),
    capitalize,
    onLoadData (index, done) {
      this.init(() => {
        setTimeout(() => {
          if (!this.showLoading) {
            done(true)
          } else {
            done()
          }
        }, 1000)
      })
    },
    init (callBack) {
      if (!this.relatedResource) {
        this.$store.dispatch(
          `${this.category}/load${capitalize(this.category)}s`,
          this.selectCondition
        ).then(res => {
          callBack && callBack()
        })
      }
    }
  },
  components: {
    ResourceCard: () => import('components/resource/ResourceCard'),
    ResourceList: () => import('components/resource/ResourceList'),
    // ResourceTable: () => import('components/resource/ResourceTable'),
    TeamTable: () => import('components/resource-table/TeamTable'),
    ProjectTable: () => import('components/resource-table/ProjectTable'),
    ProductDevTable: () => import('components/resource-table/ProductDevTable'),
    CustomerTable: () => import('components/resource-table/CustomerTable'),
    ManufacturerTable: () => import('components/resource-table/ManufacturerTable'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  },
  watch: {
    selectCondition: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        setTimeout(() => {
          if (this.$refs.infiniteScroll) {
            this.$refs.infiniteScroll.reset() // 设置滚动索引为0
            this.$refs.infiniteScroll.resume() // 重新开启加载
            this.$refs.infiniteScroll.trigger() // 不管滚动位置如何，重新调用onload
            this.$store.state[this.category].loadedAll = false
          }
        }, 200)
      }
    }
  }
}
</script>

<style scoped></style>
