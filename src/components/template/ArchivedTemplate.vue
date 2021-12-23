<!--
@Name：归档的资源
@Author：陆欢
@date：2021/06/10
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card title="归档的模版" />
    <q-card-section class="q-px-xxl">

      <!-- 初始化未更新，正在加载中 -->

      <div
        v-if="modelList===null"
        class="row justify-center q-py-md"
      >
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
      <q-infinite-scroll
        v-show="modelList.length>0"
        @load="onLoadData"
        :offset="250"
        class="q-mb-lg"
        ref="infiniteScroll"
      >
        <tw-search-panel
          :showPanelBtn="false"
          :search.sync="searchPanel"
          :label="$t('template.searchPlaceholder')"
          class="q-mt-sm"
        />
        <!-- 管理模板 -->
        <div class="manage-template row q-gutter-y-md full-width q-my-sm">
          <resource-card
            v-for="model in modelList"
            :key="model.id"
            :category="category"
            :model="model"
            class="card-template"
          />
        </div>
        <template
          v-slot:loading
          v-if="modelList.length>0&&showLoading"
        >
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </q-card-section>
  </q-card>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'ArchivedTemplate',
  props: {
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    }
  },
  data () {
    return {
      selectTemplate: {}
    }
  },
  mounted () {
    // this.setSearch('')
  },
  computed: {
    ...mapState('template', ['archivedCount', 'page', 'search']),
    ...mapGetters('template', ['getCategoryList']),
    modelList () {
      let list = this.getCategoryList(this.category, true)
      let page = _.cloneDeep(this.page[this.category])
      if (!page) {
        page = {}
        page[this.category] = { limit: 20, offset: 0, nextPageToken: 0 }
      }
      if (list.length !== page.offset) {
        this.updatePage(Object.assign(page, { offset: list.length, category: this.category }))
      }
      return list
    },
    searchPanel: {
      get () {
        return this.search
      },
      set (val) {
        this.initCategoryPage(this.category)
        this.emptyCategoryTemplates(this.category)
        // this.updatePage({ category: this.category, nextPageToken: -1, offset: 0 })
        this.setSearch(val || '')
        this.$refs.infiniteScroll.reset() // 设置滚动索引为0
        this.$refs.infiniteScroll.resume() // 重新开启加载
        this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      }
    }
  },
  methods: {
    capitalize,
    ...mapMutations('template', ['emptyCategoryTemplates', 'updatePage', 'initCategoryPage', 'setSearch']),
    ...mapActions('template', ['loadArchivedCount', 'loadCategoryTemplates']),
    onLoadData (index, done) {
      this.loadCategoryTemplates({ category: this.category, archived: 1 })
        .then(res => {
          setTimeout(() => {
            if (!this.showLoading()) {
              done(true)
            } else {
              done()
            }
          }, 1000)
        })
    },
    showLoading () {
      const pagePayload = this.page[this.category]
      if (!pagePayload) { return true }
      return !(pagePayload['nextPageToken'] === -1)
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    ResourceCard: () => import('components/resource/ResourceCard'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
.card-template {
  background: #ecf9fd url(/icons/grid-background.png) -5px -22px;
  border: 1px dashed rgba(27, 106, 201, 0.5);
}
.manage-template .base-card:first-child {
  background-color: white;
  border: 1px dashed $grey-6;
  min-height: 150px;
}
</style>
