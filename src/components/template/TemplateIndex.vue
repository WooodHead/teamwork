<!--
@Name：添加资源或者管理模板
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
    <!-- 标题 -->
    <tw-header-card
      v-if="!showForm"
      :title="action === 'manage'?$t('template.manageTemplates'):$t(`${category}.addFromTemplate`)"
    />
    <q-card-section class="q-px-xxl">
      <!-- 初始化未更新，正在加载中 -->
      <template v-if="!showForm">
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
          @load="onLoadData"
          :offset="250"
          class="q-mb-lg row"
          :class="{'full-width':action==='use'}"
          ref="infiniteScroll"
        >
          <tw-search-panel
            :search.sync="searchPanel"
            :label="$t('template.searchPlaceholder')"
            :showPanelBtn="false"
            class="q-mt-sm"
          />
          <!-- 管理模板 -->
          <div
            v-if="action==='manage'"
            class="manage-template row q-gutter-y-md full-width q-my-sm"
          >
            <q-card
              flat
              bordered
              class="cursor-pointer widget-card base-card"
              style="overflow:hidden"
              v-ripple:grey-5
              cursor-pointer
              :class="{'q-mt-none':$q.platform.is.mobile}"
              @click="addTemplate"
            >
              <div class="text-center absolute-center">
                <q-icon
                  name="add"
                  color="positive"
                  size="xl"
                />
                <div class="q-px-sm text-caption">{{$t('template.addTemplate')}}</div>
              </div>
            </q-card>
            <resource-card
              v-for="model in modelList"
              :key="model.id"
              :category="category"
              :model="model"
              class="card-template"
            />
          </div>
          <!-- 选择资源从模板中 -->
          <template v-else>
            <q-list
              dense
              padding
              class="rounded-borders"
              style="width:100%"
            >
              <public-resource-list
                v-for="model in modelList"
                :key="model.id"
                :psonID="model.leaderID"
                :title="model.title"
                :organizeID="model.organizeID"
                @click.native="addCategoryFromTemplate(model)"
              />
            </q-list>
          </template>
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
        <!-- 归档说明区 -->
        <q-card-section v-if="showArchive">
          <tw-archived-count
            :label="$t('archive.someArchived',{count:archivedCount[category].count,something:$t(`${category}.title`)})"
            @click="showArchiveList()"
          />
        </q-card-section>
      </template>
      <component
        v-else
        addFromTemplate
        :is="`${capitalize(category)}Form`"
        openType="edit"
        :id="selectTemplate.id"
        class="q-pa-none"
      />
    </q-card-section>
  </q-card>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'TemplateIndex',
  props: {
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    },
    action: {
      type: String,
      required: true,
      description: '行为'
    }
  },
  data () {
    return {
      showForm: false,
      selectTemplate: {},
      showArchive: false
    }
  },
  mounted () {
    if (this.action === 'manage') {
      this.loadArchivedCount(this.category)
        .then(res => {
          if (res) { this.showArchive = true }
        })
    }
    this.setSearch('')
  },
  computed: {
    ...mapState('template', ['archivedCount', 'page', 'search']),
    ...mapGetters('template', ['getCategoryList']),
    modelList () {
      let list = this.getCategoryList(this.category)
      let page = _.cloneDeep(this.page[this.category])
      if (!page) {
        page = {}
        page[this.category] = { limit: 20, offset: 0, nextPageToken: 0 }
      }
      if (list.length !== page.offset) {
        this.updatePage(Object.assign(page, { offset: list.length }))
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
      this.loadCategoryTemplates({ category: this.category })
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
    },
    addTemplate () {
      this.$router.push({ name: `${this.category}AddTemplate` })
    },
    addCategoryFromTemplate (m) {
      this.showForm = true
      this.selectTemplate = m
    },
    showArchiveList () {
      this.$router.push({
        name: `archived${capitalize(this.category)}Templates`,
        params: { category: this.category }
      })
    }
  },
  components: {
    PublicResourceList: () => import('components/resource/PublicResourceList'),
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    ResourceCard: () => import('components/resource/ResourceCard'),
    ProjectForm: () => import('components/project/ProjectForm'),
    TeamForm: () => import('components/team/TeamForm'),
    ProductDevForm: () => import('components/product-dev/ProductDevForm'),
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
/deep/.q-field__before {
  padding-right: 0px;
}
</style>
