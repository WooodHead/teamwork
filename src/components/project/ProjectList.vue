<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="title"
      :actions="headerActions"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
      :showOrderReverse="['ProjNum','Status','BeginDate'].includes(sort)"
      @update:order="orderUpdate"
    >
      <template v-slot:add>
        <add-btn-with-template
          category="project"
          :addLabel=addLabel
          @addingEvent="addingEvent"
        />
      </template>
      <template #menu>
        <resource-list-style
          category="project"
          :menus="menus"
          @exportProjectHour="exportProjectHour"
        />
      </template>
    </tw-header-card>
    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      needTemplate
      v-if="relatedIds !== null&&onLoadResource"
      category='project'
      :class="listStyle==='showtable'?'q-px-lg':($q.screen.gt.xs?'q-px-xl':'q-px-md')"
      :fromRelated="fromRelated"
      :relatedIds="relatedIds"
      :key="$route.name+relatedIds.join('')"
      :selectCondition="currentListPageParams.selectCondition"
      ref="resourceGrid"
    />
    <!-- 归档说明区 -->
    <q-card-section v-if="archivedCount>0">
      <tw-archived-count
        :label="$t('archive.someArchived',{count:archivedCount,something:$t('project.title')})"
        @click="showArchiveList()"
      />
    </q-card-section>

    <!-- 资源选择弹窗 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <resource-select-panel
        category="project"
        flat
        multiple
        :initSelectedResources="relatedProjects"
        @multiSelect="multiSelect"
        style="width: 600px; max-width: 80vw;"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'ProjectList',
  props: {
    category: { type: String, default: '' },
    objectID: [String, Number]
  },
  data () {
    return {
      onLoadResource: false, // 防止加载异步
      fromRelated: false,
      relatedIds: null,
      relatedProjects: [],
      relatedTitle: '',
      relates: {},
      showSelect: false,
      options: [
        {
          label: this.$t('project.sortBy.myFocus'),
          value: 'myFocus'
        },
        {
          label: this.$t('project.sortBy.level'),
          value: 'ProjLevel'
        },
        {
          label: this.$t('project.sortBy.projNum'),
          value: 'ProjNum'
        },
        {
          label: this.$t('project.sortBy.status'),
          value: 'Status'
        },
        {
          label: this.$t('project.sortBy.beginDate'),
          value: 'BeginDate'
        },
        {
          label: this.$t('project.sortBy.organizeID'),
          value: 'OrganizeID'
        }
      ],
      menus: ['showcards', 'showlist', 'showtable']
    }
  },
  watch: {
    // refresh PageProject componet
    $route (to, from) {
      if (to.name !== from.name) {
        this.init()
      }
    },
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
  mounted () {
    this.init()
    // 工时导出按钮权限
    if (this.$myinfo.auth.role.isSeniorManager ||
      this.$myinfo.auth.role.isSystemAdministrator ||
      this.$myinfo.auth.role.isOrganizeManager) {
      this.menus.push({ group: ['exportProjectHour'] })
    }
  },
  computed: {
    ...mapState('project', ['sort', 'order', 'archivedCount', 'listStyle']),
    ...mapGetters('project', ['currentListPageParams']),
    title () {
      return this.fromRelated ? `[${this.relatedTitle}] ${this.$t('project.relate')}` : this.$t('project.dashboard.projectList')
    },
    addLabel () {
      return this.fromRelated ? this.$t('project.relate') : this.$t('project.add')
    },
    headerActions () {
      // 表格视图时，移除下拉排序（由点击表头进行排序替代）
      return this.fromRelated
        ? ['add']
        : this.listStyle === 'showtable' ? ['add', 'menu'] : ['add', 'select', 'menu']
    }
  },
  methods: {
    ...mapMutations('project', ['updatePage', 'setSort', 'setOrder', 'emptyProjects']),
    ...mapActions('project', ['loadProjectsByIds', 'updateProjectField', 'loadArchivedCount']),
    init () {
      let that = this
      if (this.category !== '') {
        this.fromRelated = true
        this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, +this.objectID).then(m => {
          that.relatedTitle = m.Title
          that.relatedIds = m.relates.project
          that.relates = m.relates
        })
        this.onLoadResource = true
      } else {
        this.onLoadResource = true
        this.fromRelated = false
        that.relatedIds = []
      }
    },
    addingEvent () {
      if (this.fromRelated) {
        this.relatedIds.length ? this.loadProjectsByIds(this.relatedIds).then(res => {
          this.relatedProjects = res
          this.showSelect = true
        }) : (this.showSelect = true)
      } else {
        this.$router.push({
          name: 'projectAdd'
        })
      }
    },
    showArchiveList () {
      this.$router.push({
        name: 'archivedProjects'
      })
    },
    multiSelect (selectedResources) {
      this.showSelect = false
      this.relatedIds = selectedResources.map(r => r.id)
      this.relates.project = this.relatedIds
      this.updateProjectField({
        id: +this.objectID,
        fieldName: 'relates',
        value: this.relates
      })
    },
    sortUpdate (value) {
      this.setSort(value)
    },
    orderUpdate () {
      this.setOrder(this.order === 'desc' ? 'asc' : 'desc')
    },
    resetState () {
      this.emptyProjects()
      this.updatePage({
        offset: 0,
        limit: 20,
        nextPageToken: 0
      })
    },
    exportProjectHour () {
      this.$router.push({
        name: 'projectExportHour'
      })
    }
  },
  components: {
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    ResourceSelectPanel: () => import('components/resource/ResourceSelectPanel'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    AddBtnWithTemplate: () => import('components/template/AddBtnWithTemplate')
  }
}
</script>

<style lang="scss" scoped>
.my-status-card {
  min-width: 9vw;
}
</style>
