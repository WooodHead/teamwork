<template>
  <div class="column">
    <!-- 任务进度 -->
    <div
      v-if="!showEditForm||actionType === 'insert'"
      class="task-width"
    >
      <q-item-label
        v-if="task.type==='list'||(task.type==='group'&&$route.name==='taskDetail'&&+$route.params.id===task.id)"
        caption
        class="cursor-pointer row q-gutter-xs"
        :class="{'q-pl-xl':showMenu}"
        @click.stop="toPageTaskDetail(+task.id)"
      >
        <span>
          {{task.overview.finishedAllCount}}/{{task.overview.allCount}} {{$t('task.completed')}}
        </span>
        <span
          v-if="task.overview.seriousCount"
          class="text-negative"
          :class="{ 'emoji-font':$q.platform.is.win}"
          title="严重问题解决率"
        >
          🚨{{task.overview.finishedSeriousCount}}/{{task.overview.seriousCount}} {{$t('task.completed')}}
        </span>
        <span
          v-if="task.overview.difficultCount"
          class="text-deep-orange"
          :class="{ 'emoji-font':$q.platform.is.win}"
          title="疑难任务解决率"
        >
          💡{{task.overview.finishedDifficultCount}}/{{task.overview.difficultCount}} {{$t('task.completed')}}
        </span>
      </q-item-label>
      <!-- 任务 -->
      <q-item
        class="q-pa-none q-pb-sm"
        :view="view"
      >
        <q-item-section :class="ctrl.bgColor">
          <div
            class="flex no-wrap items-start task-width"
            style="border-radius:4px;"
          >
            <!-- menu按钮 -->
            <span @click.ctrl.capture.stop="setCtrlIds(task.id)">
              <tw-menu
                v-if="showMenu"
                class="q-mr-xs text-grey"
                icon="menu"
                noClose
                flat
                color="grey-4"
                :offset="false"
                :ripple="false"
                :menus="taskMenus"
                :showing="ctrl.showMenu"
                @assignedThem="onAssignTasks(taskIDs)"
                @deleteThem="onDeleteTasks(taskIDs)"
                @moveThem="onMoveTasks(taskIDs)"
                @copyThem="onCopyTasks(taskIDs)"
                @archiveThem="onArchiveTasks(taskIDs)"
                @edit="onEditTask(task.id)"
                @move="onMoveTask(task.id)"
                @copy="onCopyTask(task.id)"
                @archive="onArchiveTask(task.id)"
                @delete="onDeleteTask(task.id)"
                @insert="onInsertTask(task.id)"
                @addGroup="addGroup(task.id)"
                @releaseGroup='releaseGroup(task.id)'
                @convertToList="convertToList(task.id)"
                @publicLink="onPublicLinkTask(task.id)"
                @exportPDF="exportPdf()"
                @exportExcel="()=>{exportExcel=true}"
              />
            </span>
            <!-- 任务清单 -->
            <div
              v-if="task.type==='list'"
              class="column task-list task-width"
            >
              <div class="row no-wrap task-width">
                <!-- 完成度 -->
                <q-circular-progress
                  class="q-mr-xs "
                  :value="progress"
                  :thickness="1"
                  color="green-7"
                  track-color="green-4"
                  :size="view==='card'?'xs':'sm'"
                  :style="{minWith:view==='card'?'18px':'24px'}"
                />
                <!-- 任务名称 -->
                <q-item-label
                  class="cursor-pointer items-center text-primary break-word row"
                  :class="'text-title0-'+view"
                  @click.stop="toPageTaskDetail"
                >
                  {{task.name}}
                  <span
                    v-if="task.startTime"
                    class="q-ml-xs"
                  >
                    {{task.startTime }} ~ {{task.endTime }}
                  </span>
                  <q-icon
                    v-if="task.tags.includes('里程碑')"
                    name="directions_railway"
                    class="text-accent"
                  />
                  <q-icon
                    v-if="task.tags.includes('缺陷')"
                    name="bug_report"
                    class="text-negative"
                  />

                  <!-- 评论数量 -->
                  <span
                    v-if="task.commentCount"
                    class="q-ml-xs cursor-pointer"
                    style="margin-top: -4px;"
                    @click.stop="toPageTaskDetail"
                  >
                    <q-avatar
                      color="primary"
                      text-color="white"
                      size="xs"
                    ><span>{{task.commentCount}}</span></q-avatar>
                  </span>
                </q-item-label>
              </div>
              <!-- 清单描述 -->
              <div
                v-if="task.description && view==='list' && $q.screen.gt.sm"
                class="q-mt-xs tiptap-content task-width"
              >
                <div v-html="description">
                </div>
              </div>
            </div>
            <!-- 任务组 -->
            <div
              v-else-if="task.type==='group'"
              class="task-group flex col items-center"
            >
              <!-- 完成度 -->
              <q-circular-progress
                v-if="$route.name==='taskDetail'&&+$route.params.id===task.id"
                class="q-mr-xs"
                :value="progress"
                :thickness="1"
                color="green-7"
                track-color="green-4"
                :size="view==='card'?'xs':'sm'"
                :style="{minWith:view==='card'?'18px':'24px'}"
              />
              <div
                class=" group-title cursor-pointer"
                :class="`text-title0-${view} ${task.color}`"
                @click.stop="toPageTaskDetail(+task.id)"
              >
                {{task.name}}
              </div>
              <!-- 评论数量 -->
              <div
                v-if="task.commentCount"
                class="self-center q-ml-xs cursor-pointer"
                clickable
                @click.stop="toPageTaskDetail"
              >
                <q-avatar
                  color="primary"
                  text-color="white"
                  size="xs"
                > <span>{{task.commentCount}}</span></q-avatar>
              </div>
              <q-separator class="fade-line" />
            </div>
            <!-- 任务项 -->
            <div
              v-else
              class="row no-wrap items-start"
            >
              <!-- 是否完成 -->
              <task-item-finish-check
                :class="[view==='list'?'q-mr-sm':'q-mr-xs']"
                :model="task"
              />
              <div
                class="cursor-pointer row break-word items-center"
                :class="`text-subtitle${Number(task.finished)}-${view}`"
              >
                <span
                  :class="`text-title${Number(task.finished)}-${view}`"
                  @click.stop="toPageTaskDetail"
                >
                  {{task.name}}
                </span>
                <span
                  v-if="task.tags&&task.tags.length"
                  class="q-pl-xs q-gutter-x-none"
                >
                  <tw-chip
                    v-for="tag in task.tags"
                    :key="tag"
                    size="xs"
                    :label="tag"
                  />
                </span>
                <!-- 评论数量 -->
                <span
                  v-if="task.commentCount"
                  class="self-center q-ml-xs q-mr-xs "
                  @click.stop="toPageTaskDetail"
                >
                  <q-avatar
                    color="primary"
                    text-color="white"
                    size="xs"
                  > <span>{{task.commentCount}}</span></q-avatar>
                </span>
                <!-- 备注 -->
                <q-icon
                  v-if="description"
                  class="cursor-pointer"
                  name="insert_drive_file"
                  size="xs"
                  color="grey"
                  :title="htmlToText(description)"
                />
                <!-- 日程 -->
                <span
                  :title="$t('task.detail.redueDate')"
                  class="cursor-pointer text-brown q-mr-xs"
                  v-if="dueDate &&dueDate!='1000-01-01'"
                  @click.stop="onEditTask(task.id)"
                >
                  <q-icon
                    name="event"
                    size="xs"
                    color="cyan-6"
                  />
                  {{dueDate}}
                </span>
                <!-- 预计时间 -->
                <span
                  :title="$t('task.item.predictHour')"
                  class="cursor-pointer text-brown q-mr-xs"
                  v-if="task.predictHour"
                  @click.stop="onEditTask(task.id)"
                >
                  <q-icon
                    name="alarm"
                    size="xs"
                    color="cyan-6"
                  />
                  {{task.predictHour}}
                  <span class="text-caption">{{$t('date.hour')}}</span>
                </span>
                <!-- 实际工时 -->
                <span
                  :title="$t('task.item.workHour')"
                  class="cursor-pointer text-brown q-mr-xs"
                  v-if="task.workHour"
                  @click.stop="onEditTask(task.id)"
                >
                  <q-icon
                    name="alarm_on"
                    size="xs"
                    color="cyan-6"
                  />
                  {{task.workHour}}
                  <span class="text-caption">{{$t('date.hour')}}</span>
                </span>
                <!-- 指派人员 -->
                <span
                  :title="$t('task.detail.reassign')"
                  class="cursor-pointer text-brown"
                  v-for="id in task.assignedTo"
                  :key="id"
                  @click.stop="onEditTask(task.id)"
                >
                  <tw-avatar
                    size="xs"
                    :id="id"
                  />
                  {{selectPersons[id]&&selectPersons[id].name}}
                </span>
                <!-- Assign/DueDate -->
                <span
                  v-if="(!task.finished && view==='list') && $q.screen.gt.sm"
                  class="q-pl-sm"
                >
                  <span
                    v-if="showEditMenu"
                    @click.stop="onEditTask(task.id)"
                    class="text-brown"
                    :class="{'show-hover-label':view==='list' && !task.finished}"
                  >
                    <span v-show="task.assignedTo.length === 0">
                      {{$t('task.detail.assign')}}
                    </span>
                    <span v-show="!dueDate">
                      {{$t('task.detail.dueDate')}}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </div>
    <!-- 任务编辑 包含list group item-->
    <task-form
      class="q-mb-sm"
      v-if="showEditForm"
      :task="model"
      :nextTaskOrderNumber="nextTask && nextTask.orderNumber"
      :type="model.type"
      :action="actionType"
      @ok="showEditForm = false"
      @cancel="showEditForm = false"
    />
    <export-pdf
      v-if="exportPDF"
      moduleType="task"
      :modelList="exportPDFList"
      :category="task.objectType"
      :objectID="task.objectId"
      @exit="()=>{exportPDF=false}"
      :fileName="`${resource.title}(${formatDate(new Date(), 'YYYYMMDD')})`"
    >
    </export-pdf>
    <q-dialog v-model="exportExcel">
      <export-excel
        v-if="exportExcel"
        moduleType="task"
        :modelList="exportExcelList"
        :fields="exportExcelFields(categoryModel.widgets)"
        :fileName="resource.title"
        :tableHeader="{name:resource.title,style:'color:white;font-weight:bold;font-size:35px;background-color:#1976D2;text-decoration:underline;'}"
      ></export-excel>
    </q-dialog>
  </div>
</template>
<script>
import Task from '@/store/task/model'
import htmlToText from '@/utils/html-to-text'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import timeRangeFormat from '@/utils/time-range-format'
import { date, Platform } from 'quasar'
import { computedOrder } from '@/utils/computed-order'
const { formatDate } = date
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'TaskItem',
  mixins: [getCategory],
  props: {
    task: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    // 视图类型，卡片或列表
    view: {
      type: String,
      required: false,
      default: 'list'
    },
    // 菜单
    menus: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    isDetail: {
      type: Boolean,
      required: false,
      default: false
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
          // 进行tasks排序
          let tasks = res
          let taskOrder = []
          // 清单
          let taskList = tasks.filter(task => task.type === 'list')
          // 清单下面的分组和任务
          _(taskList).forEach(list => {
            taskOrder.push(list)
            let listChildren = tasks.filter(task => task.parentId === list.id)
            listChildren = _.orderBy(listChildren, ['orderNumber'], 'asc')
            _(listChildren).forEach(c => {
              taskOrder.push(c)
              if (c.type === 'group') {
                let groupChildren = tasks.filter(task => task.parentId === c.id)
                groupChildren = _.orderBy(groupChildren, ['orderNumber'], 'asc')
                taskOrder.push(...groupChildren)
              }
            })
          })
          this.exportExcelList = taskOrder
        })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwMenu: () => import('components/base/TwMenu'),
    TwChip: () => import('components/base/TwChip'),
    ExportPdf: () => import('components/export/ExportPDF'),
    TaskForm: () => import('components/task/form/TaskForm'),
    ExportExcel: () => import('components/export/ExportExcel'),
    TaskItemFinishCheck: () => import('components/task/TaskItemFinishCheck')
  },
  data () {
    return {
      exportExcel: false,
      exportExcelList: [],
      exportPDF: false,
      exportPDFList: [],
      model: new Task(),
      showEditForm: false, // 是否显示编辑框
      actionType: '', // 操作类型
      ctrlMenus: ['assignedThem', 'moveThem', 'copyThem', { group: ['archiveThem', 'deleteThem'] }]
    }
  },
  computed: {
    ...mapState('breadcrumbs', ['resource']),
    ...mapState('person', ['selectPersons']),
    ...mapGetters('task', ['tasksInList', 'ctrlModel', 'exportExcelFields']),
    ...mapState('task', ['ctrlList']),
    description () {
      return this.task.description
    },
    // 任务进度
    progress () {
      if (this.task.overview.allCount === 0) {
        return 0
      } else {
        return 100 * this.task.overview.finishedAllCount / this.task.overview.allCount
      }
    },
    category () { return this.task.objectType },
    objectID () { return this.task.objectId },
    // 任务日期
    dueDate () {
      if (this.task.dateType === 'none') {
        return ''
      } else if (this.task.dateType === 'day') {
        return timeRangeFormat({ endTime: this.task.endTime, allDay: true, charMonth: false })
      } else {
        return timeRangeFormat({ startTime: this.task.startTime, endTime: this.task.endTime, allDay: true, charMonth: false })
      }
    },
    // 菜单显示
    showMenu () {
      return this.menus.length &&
        this.view === 'list' && this.task.id !== 0 &&
        this.$q.screen.gt.sm &&
        (this.task.type !== 'item' ||
          (this.task.type === 'item' && !this.task.archived && this.task.rootId !== 0))
    },
    nextTask () {
      const tasksInList = this.tasksInList(this.task.rootId)
      const index = tasksInList.findIndex(t => t.id === this.task.id)
      return index + 1 < tasksInList.length ? tasksInList[index + 1] : undefined
    },
    taskIDs () {
      let ids = []
      this.ctrlList.forEach(item => {
        ids.push(item.id)
      })
      return ids.join(',')
    },
    ctrl () {
      return this.ctrlModel(this.task.id)
    },
    taskMenus () {
      if (!this.showEditMenu) { return [] }
      if (this.ctrl.showMenu) {
        return this.ctrlMenus
      } else {
        return this.menus
      }
    }
  },
  methods: {
    formatDate,
    htmlToText,
    timeRangeFormat,
    ...mapMutations('task', ['updateCtrlList']),
    ...mapActions('discuss', ['loadComents']),
    ...mapActions('task', [
      'updateTask',
      'deleteTask',
      'deleteTasks',
      'archiveTask',
      'archiveTasks',
      'convertToList',
      'releaseGroup',
      'loadTreeTasks'
    ]),
    // 编辑任务
    onEditTask (id) {
      this.actionType = 'edit'
      this.model = this.task
      this.showEditForm = true
    },
    // 插入任务
    onInsertTask (id) {
      this.actionType = 'insert'
      this.model = new Task({
        objectType: this.task.objectType,
        objectId: this.task.objectId,
        type: 'item',
        rootId: this.task.rootId,
        parentId: this.task.type === 'item'
          ? this.task.parentId
          : this.task.id,
        assignedByID: this.$myinfo.id,
        assignedTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        orderNumber: computedOrder(
          this.task.type === 'item'
            ? this.task.orderNumber
            : 0,
          this.nextTask && this.nextTask.orderNumber)
      })

      this.showEditForm = true
    },
    // 移动任务
    onMoveTask (id) {
      this.$router.push({
        name: 'taskMove',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          id: +this.task.id
        }
      })
    },
    // 复制任务
    onCopyTask (id) {
      this.$router.push({
        name: 'taskCopy',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          id: +this.task.id
        }
      })
    },
    // 添加组
    addGroup (id) {
      this.$emit('addGroup', id)
    },
    // 归档任务
    onArchiveTask (id) {
      this.$emit('showArchivedNotes', id)
      this.archiveTask(+id)
    },
    // 删除任务
    onDeleteTask (id) {
      showConfirm(this.$t('action.reallyDelete'), () => {
        this.deleteTask(+id)
      })
    },
    // 跳转详情页
    toPageTaskDetail () {
      this.$router.push({
        name: 'taskDetail',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          id: +this.task.id
        }
      })
    },
    // 设置ctrl选项
    setCtrlIds (id) {
      if (this.task.type === 'item') {
        this.updateCtrlList(id)
      }
    },
    // 指派它们
    onAssignTasks (ids) {
      this.$router.push({
        name: 'taskBatchAssigned',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          ids: ids
        }
      })
    },
    // 复制它们
    onCopyTasks (ids) {
      this.$router.push({
        name: 'taskBatchCopy',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          ids: ids
        }
      })
    },
    // 移动任务
    onMoveTasks (ids) {
      this.$router.push({
        name: 'taskBatchMove',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          ids: ids
        }
      })
    },
    // 归档它们
    onArchiveTasks (ids) {
      this.archiveTasks(ids)
    },
    // 删除它们
    onDeleteTasks (ids) {
      showConfirm(this.$t('action.reallyDelete'), () => {
        this.deleteTasks(ids)
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
  }
}
</script>
<style lang="scss" scoped>
.listDetail {
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.q-item {
  min-height: auto;
}

/deep/.q-chip .q-chip__content {
  font-size: 12px;
}
/deep/.q-item[view="list"] .q-btn,
/deep/.q-item[view="list"] .q-btn__wrapper {
  min-height: 24px;
}
.show-hover-label {
  visibility: hidden;
}
/deep/.q-item:hover .show-hover-label {
  visibility: visible;
}
.break-word {
  word-break: break-all;
}
.task-width {
  width: 100%;
}
.text-title0-list {
  font-size: 16px;
}
.task-list .text-title0-card {
  font-size: 14px;
  font-weight: bold;
  line-height: 18px !important;
}
.task-group .text-title0-list {
  font-size: 16px;
  font-weight: bold;
}
.task-group .text-title0-card {
  font-size: 12px;
  font-weight: bold;
}

.text-subtitle0-list {
  font-size: 14px;
}
.text-title1-list {
  font-size: 13px;
}
.text-subtitle1-list {
  font-size: 12px;
  line-height: 24px;
}
.text-title0-card {
  padding: 2px 0 0 0;
  font-size: 12px;
}
.text-subtitle0-card {
  font-size: 12px;
}
.text-title1-card {
  font-size: 12px;
}
.text-subtitle1-card {
  font-size: 12px;
}
.group-title {
  padding: 0.01em 0.33em;
  border-radius: 0.25em;
  word-break: break-word;
}
.task-list .text-title0-list {
  font-size: 18.72px;
  font-weight: bold;
}
</style>
