<template>
  <q-card
    :flat="$q.screen.lt.sm"
    clickable
    class="card-grow-in-page"
  >
    <tw-header-detail
      :actions="actions"
      :select="detailView"
      :selectOptions="viewOptions"
      @update:select="viewUpdate"
    >
      <template #menu>
        <tw-menu
          :menus="menus"
          @edit="editTask(id)"
          @move="moveTask(id)"
          @copy="copyTask(id)"
          @archive="onArchive(id)"
          @delete="onDelete(id)"
          @addGroup="onGroupAdd(id)"
          @convertToList="convertToList(id)"
          @publicLink="publicLink"
          @history="onHistory(id)"
          @bookmark="bookmark()"
          @deleteBookmark="removeBookmark()"
          @exportPDF="exportPdf()"
          @exportExcel="()=>{exportExcel=true}"
          @secrecy="setSecrecy()"
        />
      </template>
    </tw-header-detail>
    <div class="q-px-xxl">
      <!-- 任务归档区 -->
      <q-card-section v-if="archived.value">
        <tw-archive-notes
          v-if="archived.type==='selfArchived'"
          :id="+id"
          type="task"
          :label="archived.parentLabel"
          :archiveTime="task.archiveTime"
          :archiveBy="task.archiveBy"
          @delete="onDeleteFromArchived"
        />
        <tw-archive-part-notes
          v-else
          :category='category'
          :objectID="+objectID"
          :parentID='archived.parentId'
          :parentLabel='archived.parentLabel'
          type="task"
        />
      </q-card-section>

      <!-- 任务清单(分组) -->
      <q-card-section>
        <task-list
          :isDetail="true"
          :id="+id"
          :editing.sync="editing"
        />
        <!-- 添加组 -->
        <task-form-group
          v-if="addingGroup"
          :category="category"
          :objectID="objectID"
          :parentId="id"
          @ok="setAddingGroup(false)"
          @cancel="setAddingGroup(false)"
        />
        <tw-secrecy-area
          v-if="task.acl"
          :currentModel="task"
          :category="'task'"
          :parentModel="parentModel"
          :ScopeAll="categoryModel.acl !== 2"
        />
        <tw-archived-count
          v-if="showArchive"
          :label="archivedCountLabel"
          align="start"
          :separator="false"
          @click="toArchivedTasks(id)"
        />
      </q-card-section>
      <!-- 评论区 -->
      <q-card-section discuss-board>
        <discuss-board
          :objectID="+id"
          objectType="task"
          :objectTitle="task.name"
          @submitFinished="onSubmitDiscuss"
        />
      </q-card-section>
      <!-- 订阅 -->
      <q-card-section v-if="!categoryModel.isTemplate">
        <tw-subscribe
          :objectID="+id"
          objectType="task"
          :quickSelected="quickSelected"
        />
      </q-card-section>
    </div>
    <export-pdf
      v-if="exportPDF"
      moduleType="task"
      :modelList="exportPDFList"
      :category='category'
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
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { LocalStorage, date, Platform } from 'quasar'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
const { formatDate } = date
import getCategory from '@/mixins/mixins-get-category'
/**
 * 任务清单（分组）详情页
 */
export default {
  name: 'TaskListDetail',
  mixins: [getCategory],
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      exportExcel: false,
      exportExcelList: [],
      exportPDF: false,
      exportPDFList: [],
      editing: false,
      addingGroup: false,
      size: 'sm',
      myself: LocalStorage.getItem('myself'),
      isBookmark: false,
      viewOptions: [{
        value: 'separate',
        label: this.$t(`task.detailView.separate`)
      }, {
        value: 'mixture',
        label: this.$t(`task.detailView.mixture`)
      }]
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwArchivePartNotes: () => import('components/base/TwArchivePartNotes'),
    TaskList: () => import('components/task/TaskList'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe'),
    TaskFormGroup: () => import('components/task/form/TaskFormGroup'),
    ExportPdf: () => import('components/export/ExportPDF'),
    ExportExcel: () => import('components/export/ExportExcel'),
    TwSecrecyArea: () => import('components/base/TwSecrecyArea'),
    TaskFilter: () => import('components/export/export-task/TaskFilter')
  },
  computed: {
    ...mapState('breadcrumbs', ['resource']),
    ...mapState('task', ['tasks', 'archivedCount', 'detailView']),
    ...mapGetters('task', ['exportExcelFields', 'filterExportExcel']),
    task () {
      return this.tasks.find(t => t.id === +this.id)
    },
    parentTask () {
      return this.tasks.find(t => t.id === this.task.parentId)
    },
    parentWhiteList () {
      return this.categoryModel.members
    },
    parentModel () {
      if (this.task.type === 'group') {
        return {
          acl: this.parentTask.acl,
          whiteList: this.parentWhiteList
        }
      } else {
        return {
          acl: this.categoryModel.acl,
          whiteList: this.parentWhiteList
        }
      }
    },
    // 菜单
    menus () {
      let menus = ['bookmark', { group: ['exportPDF', 'exportExcel'] }, { group: ['publicLink'] }, { group: ['history'] }]
      if (!this.archived.value) {
        if (this.task.type === 'list') {
          menus = ['edit', 'copy', 'move', 'archive', 'delete', 'addGroup', this.isBookmark ? 'deleteBookmark' : 'bookmark',
            { group: ['exportPDF', 'exportExcel'] }, { group: ['publicLink'] }, { group: ['history'] }]
          !this.task.acl && menus.push('secrecy')
        } else if (this.task.type === 'group') {
          menus = ['edit', 'copy', 'move', 'archive', 'delete', 'convertToList', this.isBookmark ? 'deleteBookmark' : 'bookmark',
            { group: ['exportPDF', 'exportExcel'] }, { group: ['publicLink'] }, { group: ['history'] }]
        }
      }
      return menus
    },
    actions () {
      if (this.task.type === 'list') {
        return ['menu', 'select']
      } else {
        return ['menu']
      }
    },
    archived () {
      if (this.task.type === 'list') {
        return {
          value: this.task.archived,
          type: 'selfArchived', // selfArchived,inArchived
          parentId: 0,
          parentLabel: this.$t('task.list.title')
        }
      } else if (this.task.type === 'group') {
        if (this.task.archived) {
          return {
            value: true,
            type: 'selfArchived', // selfArchived,inArchived
            parentId: this.task.parentId,
            parentLabel: this.$t('task.group.title')
          }
        } else {
          return {
            value: this.task.archived,
            type: 'inArchived', // selfArchived,inArchived
            parentId: this.task.parentId,
            parentLabel: this.$t('task.list.title')
          }
        }
      }
      return {
        value: false,
        type: 'selfArchived', // selfArchived,inArchived
        parentId: 0,
        parentLabel: this.$t('task.group.title')
      }
    },

    archivedTaskCount () {
      return this.archivedCount[this.category + this.objectID + 'task' + this.id]
    },
    showArchive () {
      return this.archivedTaskCount && (this.archivedTaskCount.itemCount || this.archivedTaskCount.groupCount)
    },
    archivedCountLabel () {
      const archivedItemCountLabel = this.$t('archive.someArchived', { count: this.archivedTaskCount.itemCount, something: this.$t('task.item.title') })
      const archivedGroupCountLabel = this.$t('archive.someArchived', { count: this.archivedTaskCount.groupCount, something: this.$t('task.group.title') })
      return this.archivedTaskCount.groupCount
        ? `${archivedItemCountLabel}和${archivedGroupCountLabel}`
        : archivedItemCountLabel
    },
    quickSelected () {
      if (this.categoryModel.members && this.categoryModel.members.length) {
        let IDs = this.categoryModel.members.filter(a => a !== this.myself.id)
        return {
          title: this.$t(`${this.category}.title`) + '成员',
          personIDs: IDs
        }
      } else {
        return null
      }
    },
    filterExportExcelList () {
      return this.filterExportExcel(this.exportExcelList)
    }
  },
  watch: {
    'exportPDF' (value) {
      value && this.loadTreeTasks(this.task.id)
        .then(res => {
          this.exportPDFList = res
        })
    },
    'exportExcel' (value) {
      value && this.loadTreeTasks(this.task.id)
        .then(res => {
          this.exportExcelList = this.$store.getters['task/tasksOfList'](+this.id)
        })
    }
  },
  methods: {
    formatDate,
    ...mapActions('member', ['loadMembers']),
    ...mapActions('task', [
      'loadTask',
      'archiveTask',
      'unarchiveTask',
      'deleteTask',
      'convertToList',
      'loadArchivedCount',
      'loadTreeTasks',
      'secrecyTask',
      'updateTaskCommentCount'
    ]),
    ...mapMutations('task', ['setView', 'setDetailView']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    // ---------------------------------------菜单栏方法
    viewUpdate (value) {
      this.setDetailView(value)
    },
    // 编辑
    editTask () {
      this.editing = true
    },
    onGroupAdd () {
      this.addingGroup = true
    },
    // 移动
    moveTask (id) {
      this.$router.push({
        name: 'taskMove',
        params: {
          id: +id,
          category: this.task.objectType,
          objectID: this.task.objectId
        }
      })
    },
    // 复制
    copyTask (id) {
      this.$router.push({
        name: 'taskCopy',
        params: {
          id: +id,
          category: this.task.objectType,
          objectID: this.task.objectId
        }
      })
    },
    // 删除
    onDelete (id) {
      showConfirm(this.$t('action.reallyDelete'), () => {
        const parentId = this.task.parentId
        this.deleteTask(+id).then(res => {
          if (this.isBookmark) {
            this.removeBookmark()
          }
        })
        this.routeAfterDelete(parentId)
      })
    },
    onDeleteFromArchived () {
      const parentId = this.task.parentId
      if (this.isBookmark) {
        this.removeBookmark()
      }
      this.routeAfterDelete(parentId)
    },
    routeAfterDelete (parentId) {
      if (parentId) {
        this.$router.replace({
          name: 'taskDetail',
          params: {
            category: this.category,
            objectID: +this.objectID,
            id: parentId
          }
        })
      } else {
        this.$router.push({
          name: 'task',
          params: {
            category: this.category,
            objectID: +this.objectID
          }
        })
      }
    },
    // 归档
    onArchive (id) {
      this.archiveTask(+id)
    },
    // 共享链接
    publicLink (id) {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'task',
          param: encodeURIComponent(JSON.stringify({ id: +this.id })),
          title: this.task.name
        }
      })
    },

    // 跳转到任务item归档区
    toArchivedTasks (id) {
      this.$router.push({
        name: 'archivedTasks',
        params: {
          category: this.category,
          objectID: this.objectID,
          id: +id
        }
      })
    },
    onHistory (id) {
      // 弹出分享框
      this.$router.push({
        name: 'taskHistory',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +id
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
        objectID: +this.id,
        objectType: 'task',
        objectTitle: this.task.name,
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
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'task', Oper: 'eq' }
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
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'task', Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    },
    setAddingGroup (value) {
      this.addingGroup = value
      this.$emit('update:addingGroup', value)
    },
    // -------------------------------------------------//
    onSubmitDiscuss () {
      this.updateTaskCommentCount({
        id: +this.id,
        isAdd: true
      })
    },
    // 设置保密
    setSecrecy () {
      this.secrecyTask(this.id)
        .then(res => {
          this.$q.notify({ message: '设置保密成功！', icon: 'check', color: 'positive' })
        })
    },
    exportPdf () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(this.$t('exportFile.weChatDoesNotCurrentlySupportExports'))
        return false
      }
      this.exportPDF = true
    }
    // -------------------------------------------------//
  },
  mounted () {
    this.setView('list')
    // 加载当前清单任务
    this.loadTask(+this.id).then(task => {
      // 如果还有父任务，再加载父任务（针对分组任务来说）
      task && task.parentId && this.loadTask(task.parentId)
    })
    this.loadArchivedCount({
      objectID: +this.objectID,
      objectType: this.category,
      id: +this.id
    })
    this.isExistBookmark()
    this.$route.meta.label = this.task.name
    document.title = `${this.task.name} | TeamWork`
  }
}
</script>

<style scoped>
</style>
