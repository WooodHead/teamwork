<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="$t('productDev.module')"
        :actions="headerActions"
        :select="sort"
        :selectOptions="options"
        @update:select="sortUpdate"
      >
        <template v-slot:add>
          <add-btn-with-template
            category="productDev"
            @addingEvent="addingEvent"
          />
        </template>
        <template #menu>
          <resource-list-style
            category="productDev"
            :menus="menus"
            @exportHour="exportHour"
          />
        </template>
      </tw-header-card>
      <!-- 列表，key用来刷新resource-grid -->
      <resource-grid
        v-if="onLoadResource"
        needTemplate
        category='productDev'
        :class="listStyle==='showtable'?'q-px-lg':($q.screen.gt.xs?'q-px-xl':'q-px-md')"
        :key="$route.name"
        :selectCondition="selectCondition"
        ref="resourceGrid"
      />

      <!-- 归档文档说明区 -->
      <q-card-section v-if="archivedCount">
        <tw-archived-count
          :label="$t('archive.someArchived',{count:archivedCount,something:$t('productDev.title')})"
          @click="showArchiveList()"
        />
      </q-card-section>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'PageProductDev',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    AddBtnWithTemplate: () => import('components/template/AddBtnWithTemplate')
  },
  data () {
    return {
      onLoadResource: false, // 防止异步加载
      options: [
        {
          label: this.$t('productDev.sortBy.myFocus'),
          value: 'myFocus'
        },
        {
          label: this.$t('productDev.sortBy.type'),
          value: 'CONVERT(Type USING gbk)'
        },
        {
          label: this.$t('productDev.sortBy.title'),
          value: 'CONVERT(Title USING gbk)'
        },
        {
          label: this.$t('productDev.sortBy.organizeName'),
          value: 'OrganizeID'
        }
      ],
      menus: ['showcards', 'showlist', 'showtable']
    }
  },
  watch: {
    sort () {
      this.resetState()
    },
    order () {
      this.resetState()
    },
    listStyle (newListStyle, oldListStyle) {
      if (oldListStyle === 'showtable') {
        const optValues = this.options.map(opt => opt.value)
        !optValues.includes(this.sort) && this.setSort('myFocus')
      }
    }
  },
  computed: {
    ...mapState('productDev', ['sort', 'order', 'listStyle', 'archivedCount']),
    ...mapGetters('productDev', ['selectCondition']),
    headerActions () {
      // 表格视图时，移除下拉排序（由点击表头进行排序替代）
      return this.listStyle === 'showtable' ? ['add', 'menu'] : ['add', 'select', 'menu']
    }
  },
  mounted () {
    this.onLoadResource = true

    if (this.$custom.exportHour) {
      // 工时导出按钮权限
      if (this.$myinfo.auth.role.isSeniorManager ||
        this.$myinfo.auth.role.isSystemAdministrator ||
        this.$myinfo.auth.role.isOrganizeManager) {
        this.menus.push({ group: ['exportHour'] })
      }
    }
  },
  methods: {
    ...mapMutations('productDev', ['setPage', 'setSort', 'emptyProductDevs']),
    ...mapActions('productDev', ['existMyProductDev', 'loadArchivedCount']),
    addingEvent () {
      this.$router.push({ name: 'productDevEdit', params: { openType: 'add' } })
    },
    showArchiveList () {
      // this.resetState()
      this.$router.push({
        name: 'archivedProductDevs'
      })
    },
    sortUpdate (value) {
      this.setSort(value)
    },
    resetState () {
      this.emptyProductDevs()
      this.setPage({
        offset: 0,
        limit: 20,
        nextPageToken: 0
      })
    },
    exportHour () {
      this.$router.push({
        name: 'productDevExportHour'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-status-card {
    min-width: 9vw;
  }
</style>
