
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <!-- 任务卡片头部 -->
    <tw-header-card
      :title="$t(`task.title`)"
      :actions="actions"
      :add="{label:$t(`task.addLabel`),click:()=>{addingEvent=true}}"
      :select="view"
      :selectOptions="sortOptions"
      @update:select="sortUpdate"
    >
      <template v-slot:menu>
        <tw-menu
          :menus="menuLists"
          @publicLink="publicLink"
          @batchImport="()=>{showImportDialog=true}"
          @bookmark="bookmark()"
          @deleteBookmark="removeBookmark()"
          @exportPDF="exportPdf()"
          @exportExcel="()=>{exportExcel=true}"
        />
      </template>
      <template v-slot:titleAppend>
        <!-- 完成度 -->
        <span
          class="text-caption self-start"
          style="height:32px;line-height:32px;"
        >
          <q-circular-progress
            class="q-ml-sm"
            :value="overallProgress.value"
            :thickness="1"
            color="green-7"
            track-color="green-4"
            size="sm"
          />
          {{overallProgress.text}}
        </span>
      </template>
    </tw-header-card>
    <q-card-section class="q-px-xxl">
      <q-btn-toggle
        v-model="filterType"
        class="my-custom-toggle"
        unelevated
        toggle-text-color="primary"
        toggle-color="blue-1"
        color="white"
        text-color="black"
        :options="filterOptions"
      >
        <template v-slot:one>
          <div class="row items-center no-wrap">
            <q-icon name="list" />
            <div class="text-center">
              清单
            </div>
          </div>
        </template>
        <template v-slot:two>
          <div class="row items-center no-wrap">
            <q-icon name="bug_report" />
            <div class="text-center">
              缺陷
            </div>
          </div>
        </template>
        <template v-slot:three>
          <div class="row items-center no-wrap">
            <q-icon name="directions_railway" />
            <div class="text-center">
              里程碑
            </div>
          </div>
        </template>
        <template v-slot:four>
          <div
            class="row items-center no-wrap"
            @click="toTaskTagCount"
          >
            <q-icon name="local_offer" />
            <div class="text-center">
              标签
            </div>
          </div>
        </template>
        <template
          v-slot:five
        >
          <div
            class="row items-center no-wrap"
            @click="toTaskDashboard"
          >
            <q-icon name="poll" />
            <div class="text-center">
              仪表盘
            </div>
          </div>
        </template>
      </q-btn-toggle>
      <div
        v-if="filterType"
        class="q-mt-xs q-ml-md"
      >
        <div
          class=" cursor-pointer"
          href="javascript:void(0);"
          @click="clearFilter"
        >
          <q-chip
            dense
            icon="close"
          >清空所有筛选条件</q-chip>
        </div>
      </div>
    </q-card-section>
    <!-- 新建清单Form -->
    <q-card-section
      v-if="addingEvent"
      class="q-px-xxl"
    >
      <task-form-list
        :category="category"
        :objectID="+objectID"
        :id="+id"
        :parentId="0"
        @editTaskList="editTaskList"
        @ok="onOk"
        @cancel="onCancel"
      />
    </q-card-section>
    <!-- 任务清单 -->
    <q-card-section class="q-px-xxl">
      <task-content
        :category="category"
        :objectID="+objectID"
      />
      <tw-archived-count
        v-if="showArchive"
        :label="$t('archive.someArchived',{count:archivedCount[category+objectID+'task'+0].itemCount,something:$t('task.list.title')})"
        align="start"
        :inset="false"
        @click="toArchiveTaskLists"
      />
    </q-card-section>
    <!-- 弹出导入excel模板界面 -->
    <q-dialog
      v-model="showImportDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      full-height
      :maximized="$q.screen.lt.sm?true:false"
    >
      <import-index
        :category="category"
        :objectID="+objectID"
        importType="task"
        @close="()=>{showImportDialog=false}"
        :showChoiceRepeatWay="false"
        :extraProperty="{isSetSecretList:exportExcelIsSetSecretList}"
      >
        <q-checkbox
          ref="checkbox"
          class="q-mt-md"
          style="margin-left: 30px;"
          right-label
          v-model="exportExcelIsSetSecretList"
          :label="$t('excelImport.isSetSecretList')"
        />
      </import-index>
    </q-dialog>
    <export-pdf
      exportCommentByCategory
      v-if="exportPDF"
      moduleType="task"
      :modelList="exportPDFList"
      :category="category"
      :objectID="+objectID"
      @exit="()=>{exportPDF=false}"
      :fileName="`${resource.title}(${formatDate(new Date(), 'YYYYMMDD')})`"
    >
    </export-pdf>
    <q-dialog v-model="exportExcel">
      <export-excel
        v-if="exportExcel"
        moduleType="task"
        :toolbarTitle="$t('action.export', { type: 'Excel' })"
        :modelList="filterExportExcelList"
        :fields="exportExcelFields(categoryModel.widgets)"
        :fileName="resource.title"
        :tableHeader="{name:resource.title,style:'color:white;font-weight:bold;font-size:35px;background-color:#1976D2;text-decoration:underline;'}"
      >
      <template #topExportExtra>
         <task-filter/>
      </template>
      </export-excel>
    </q-dialog>
  </q-card>

</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import { LocalStorage, date, Platform } from 'quasar'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
const { formatDate } = date
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'TaskIndex',
  mixins: [getCategory],
  props: {
    // 资源类型
    category: {
      type: String,
      required: false,
      default: 'person'
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
    TaskFormList: () => import('components/task/form/TaskFormList'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TaskContent: () => import('components/task/TaskContent'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    ImportIndex: () => import('components/import/ImportIndex'),
    ExportPdf: () => import('components/export/ExportPDF'),
    ExportExcel: () => import('components/export/ExportExcel'),
    TaskFilter: () => import('components/export/export-task/TaskFilter') 
  },
  data () {
    return {
      exportExcelIsSetSecretList: false,
      exportExcel: false,
      exportExcelList: [],
      exportPDF: false,
      exportPDFList: [],
      showImportDialog: false,
      // menus: ['bookmark', { group: ['publicLink'] }, { group: ['batchImport', 'exportPDF', 'exportExcel'] }],
      sortOptions: [{
        value: 'card',
        label: this.$t(`task.view.card`)
      }, {
        value: 'list',
        label: this.$t(`task.view.list`)
      }],
      filterOptions: [
        { value: 'list', slot: 'one', filter: true },
        { value: 'bug', slot: 'two', filter: true },
        { value: 'milestone', slot: 'three', filter: true },
        { value: 'tag', slot: 'four' },
        { value: 'chart', slot: 'five' }
      ],
      id: 0, // 新建和编辑清单Form时使用
      myself: LocalStorage.getItem('myself'),
      isBookmark: false
    }
  },
  watch: {
    exportPDF (value) {
      const query = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ]
      value && this.loadTasks({ query }).then(res => {
        this.exportPDFList = res
      })
    },
    exportExcel (value) {
      const query = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ]
      value && this.loadTasks({ query }).then(res => {
        let rootList = res.filter(a => a.type === 'list')
        rootList = _.orderBy(rootList, 'orderNumber', 'desc')
        let list = []
        rootList.forEach(item => {
          list.push(item)
          let tasksInList = this.$store.getters['task/tasksInList'](+item.id)
          list.push(tasksInList)
        })
        this.exportExcelList = _.flattenDeep(list)
      })
    }
  },
  computed: {
    ...mapState('task', ['view', 'archivedCount']),
    ...mapState('breadcrumbs', ['resource']),
    ...mapGetters('task', ['overview', 'exportExcelFields', 'filterExportExcel']),
    overallProgress () {
      const count = this.overview({
        objectID: +this.objectID,
        objectType: this.category
      })
      return {
        value: count.allCount ? 100 * count.finishedAllCount / count.allCount : 100,
        text: `${count.finishedAllCount}/${count.allCount}`
      }
    },
    menuLists () {
      return [this.isBookmark ? 'deleteBookmark' : 'bookmark', { group: ['publicLink'] }, { group: ['batchImport', 'exportPDF', 'exportExcel'] }]
    },
    actions () {
      if (this.showEditMenu) {
        return ['add', 'menu', 'select']
      } else {
        return ['select']
      }
    },
    addingEvent: {
      get () {
        return this.$store.state.task.addingEvent
      },
      set (value) {
        this.setAddingEvent(value)
      }
    },
    filterType: {
      get () {
        return this.$store.state.task.filterType
      },
      set (value) {
        value || this.setFilterType(value)
        const opt = this.filterOptions.find(item => item.value === value)
        opt && opt.filter && this.setFilterType(value)
      }
    },
    showArchive () {
      let aa = this.archivedCount[this.category + this.objectID + 'task' + 0]
      return aa && aa.itemCount > 0
    },
    filterExportExcelList () {
      return this.filterExportExcel(this.exportExcelList)
    }
  },
  methods: {
    formatDate,
    ...mapMutations('task', ['setAddingEvent', 'setView', 'setFilterType', 'cleanCtrlList']),
    ...mapActions('task', ['loadArchivedCount', 'loadTasks']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    // 切换卡片和列表
    sortUpdate (value) {
      this.setView(value)
    },
    // 分享链接
    publicLink () {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'task',
          param: encodeURIComponent(JSON.stringify({ objectID: Number(this.objectID), objectType: this.category })),
          title: this.resource.title
        }
      })
    },
    // 添加书签
    bookmark () {
      const { name, params, path } = this.$route
      let bookmark = new Bookmark({
        module: {
          id: +this.objectID,
          title: '',
          type: this.category
        },
        route: { name, params, path },
        objectID: 0,
        objectType: 'task',
        objectTitle: this.$t(`task.title`),
        owner: this.myself.id
      })
      this.addBookmark(bookmark).then(res => {
        if (res) {
          this.isBookmark = true
          showSuccessMessage(this.$t(`bookmark.addBookmarkSuccess`))
        } else {
          showWarningMessage(this.$t(`bookmark.addBookmarkFail`))
        }
      })
    },
    // 移除书签
    removeBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'task', Oper: 'eq' },
        'and',
        { Key: 'Module.Id', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Module.Type', Value: this.category, Oper: 'eq' }
      ]
      this.deleteBookmark(query).then(res => {
        if (res) {
          this.isBookmark = false
          showSuccessMessage(this.$t(`bookmark.delBookmarkSuccess`))
        } else {
          showWarningMessage(this.$t(`bookmark.delBookmarkFail`))
        }
      })
    },
    // 判断当前页面是否存在书签
    isExistBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'task', Oper: 'eq' },
        'and',
        { Key: 'Module.Id', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Module.Type', Value: this.category, Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    },
    // 编辑任务清单form
    editTaskList (id) {
      this.id = id
      this.setAddingEvent(true)
    },
    // 编辑确认按钮
    onOk () {
      this.setAddingEvent(false)
    },
    // 编辑取消按钮
    onCancel () {
      this.setAddingEvent(false)
    },
    // 跳转归档区
    toArchiveTaskLists () {
      this.$router.push({
        name: 'archivedTaskLists',
        params: {
          category: this.category,
          objectID: +this.objectID
        }
      })
    },
    // 跳转标签统计
    toTaskTagCount () {
      this.$router.push({ name: 'TaskTagCount' })
    },
    toTaskDashboard () {
      this.$router.push({
        name: 'taskChart',
        params: {
          category: this.category,
          objectID: +this.objectID
        }
      })
    },
    clearFilter () {
      this.filterType = ''
    },
    exportPdf () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(this.$t('exportFile.weChatDoesNotCurrentlySupportExports'))
        return false
      }
      this.exportPDF = true
    }
  },
  mounted () {
    this.loadArchivedCount({
      objectID: +this.objectID,
      objectType: this.category
    })
    this.isExistBookmark()
  }
}
</script>
<style scoped>
</style>
