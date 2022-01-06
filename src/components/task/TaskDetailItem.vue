<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-detail :noMenu="!showEditMenu">
      <template #menu>
        <tw-menu
          :menus="menus"
          @edit="onEdit()"
          @move="onMove(id)"
          @copy="onCopy(id)"
          @archive="onArchive(id)"
          @delete="onDelete(id)"
          @publicLink="publicLink"
          @history="onHistory"
          @bookmark="bookmark()"
          @deleteBookmark="removeBookmark()"
          @exportPDF="exportPdf()"
          @exportExcel="()=>{exportExcel=true}"
          @send="sendToSomeone(id)"
        />
      </template>
    </tw-header-detail>
    <div class="q-px-xxl">
      <q-card-section v-if="archived.value">
        <!-- 归档提示 -->
        <tw-archive-notes
          v-if="archived.type==='selfArchived'"
          :id="+id"
          type="task"
          :label="$t('task.item.title')"
          :archiveTime="task.archiveTime"
          :archiveBy="task.archiveBy"
          @delete="onDeleteFromArchived"
        />
        <!-- 归档清单的一部分 -->
        <tw-archive-part-notes
          v-else
          :category="category"
          :objectID="+objectID"
          :parentID="+archived.parentId"
          :parentLabel="archived.parentLabel"
          type="task"
        />
      </q-card-section>
      <!-- 任务详情 -->
      <q-card-section :class="{'no-pointer-events':archived.value}">
        <q-list
          separator
          :class="{'no-pointer-events':archived.value}"
        >
          <!-- 头部（是否完成，人物名，创建人） -->
          <task-detail-item-header
            :task="task"
            inDetail
            :finish="showEditMenu"
          >
            {{$t('task.detail.addedBy', {createBy: task.createBy || ''})}}
            {{task.createTime }}
          </task-detail-item-header>
          <!-- 指派给 -->
          <template v-if="!categoryModel.isTemplate">
            <q-item :class="{ column: $q.screen.lt.sm }">
              <q-item-section
                side
                :class="labelClass"
                :style="labelStyle"
              >
                {{$t('task.detail.assignedTo')}}
              </q-item-section>
              <q-item-section @click="onEdit('assignedTo')">
                <!-- 无值时展示提示文字 -->
                <div
                  v-if="!task.assignedTo.length"
                  class="text-grey cursor-pointer"
                >{{$t('task.detail.assignHint')}}
                </div>
                <div
                  class="row q-gutter-sm cursor-pointer"
                  v-else
                >
                  <div
                    v-for="id in task.assignedTo"
                    :key="id"
                  >
                    <tw-avatar
                      :id="id"
                      size="md"
                    />
                    {{persons[id]?persons[id].name:""}}
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <!-- 通知 -->
            <q-item :class="{ column: $q.screen.lt.sm }">
              <q-item-section
                side
                :class="labelClass"
                :style="labelStyle"
              >
                {{$t('task.detail.notifyTo')}}
              </q-item-section>
              <q-item-section @click="onEdit('notifyTo')">

                <!-- 无值时展示提示文字 -->
                <div
                  v-if="!task.notifyTo.length"
                  class="text-grey cursor-pointer"
                >{{$t('task.detail.notifyHint')}}
                </div>
                <div
                  v-else
                  class="row q-gutter-sm cursor-pointer"
                >
                  <div
                    v-for="id in task.notifyTo"
                    :key="id"
                  >
                    <tw-avatar
                      :id="id"
                      size="md"
                    />
                    {{persons[id]?persons[id].name:""}}
                  </div>
                </div>
              </q-item-section>

            </q-item>
            <!-- 选择日期 -->
            <q-item :class="{ column: $q.screen.lt.sm }">
              <q-item-section
                side
                :class="labelClass"
                :style="labelStyle"
              >
                {{$t('task.detail.dueOn')}}
              </q-item-section>
              <q-item-section @click="onEdit('dateType')">
                <!-- 日期组件 -->
                <task-detail-item-date
                  class="col"
                  :dateType="task.dateType"
                  :startTime="task.startTime"
                  :endTime="task.endTime"
                />
              </q-item-section>
            </q-item>
          </template>
          <!-- 预计工作用时 -->
          <q-item
            v-if="setting.predictHour"
            :class="{ column: $q.screen.lt.sm }"
          >
            <q-item-section
              side
              :class="labelClass"
              :style="labelStyle"
            >
              {{$t('task.detail.predictHour')}}
            </q-item-section>
            <q-item-section @click="onEdit('predictHour')">
              <div v-if="task.predictHour">
                {{task.predictHour+$t('date.hour')}}
              </div>
              <div
                v-else
                class="text-grey"
              >{{$t('task.detail.predictHourHint')}}
              </div>
            </q-item-section>
          </q-item>
          <!-- 实际工作用时 -->
          <q-item
            v-if="setting.actualHour&&task.workHour"
            :class="{ column: $q.screen.lt.sm }"
          >
            <q-item-section
              side
              :class="labelClass"
              :style="labelStyle"
            >
              {{$t('task.detail.workHour')}}
            </q-item-section>
            <q-item-section @click="onEdit('workHour')">
              <div v-if="task.workHour">
                {{task.workHour+$t('date.hour')}}
              </div>
              <div
                v-else
                class="text-grey"
              >{{$t('task.detail.workHourHint')}}
              </div>
            </q-item-section>
          </q-item>
          <!-- 添加标签 -->
          <q-item :class="{ column: $q.screen.lt.sm }">
            <q-item-section
              side
              :class="labelClass"
              :style="labelStyle"
            >
              {{$t('task.detail.tag')}}
            </q-item-section>
            <q-item-section @click="onEdit('tags')">
              <!-- 无值时展示提示文字 -->
              <div
                v-if="!task.tags.length"
                class="text-grey cursor-pointer"
              >{{$t('task.detail.tagHint')}}
              </div>
              <div
                v-else
                class="row q-gutter-sm cursor-pointer"
              >
                <tw-chip
                  v-for="tag in task.tags"
                  :key="tag.id"
                  :label="tag"
                />
              </div>
            </q-item-section>
          </q-item>
          <!-- 备注 -->
          <q-item :class="{ column: $q.screen.lt.sm }">
            <q-item-section
              side
              :class="labelClass"
              :style="labelStyle"
            >
              {{$t('task.detail.notes')}}
            </q-item-section>
            <q-item-section
              @click="onEdit('notes')"
              :class="task.description ?'tiptap-content editor__content':'text-grey'"
              v-html="task.description || $t('task.detail.extraNotes')"
            />
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section :class="{'q-ml-md':$q.screen.lt.sm}">
        <tw-boost-pack
          :objectID="+id"
          objectType="task"
          :messageTitle="task.name"
          :boostTo="task.createBy"
        />
      </q-card-section>
      <!-- 任务保密区 -->
      <q-card-section v-if="!!task.acl">
        <tw-secrecy-area
          :currentModel="task"
          :category="'task'"
          :parentModel="parentModel"
          :ScopeAll="categoryModel.acl !== 2"
        />
      </q-card-section>
      <q-card-section>
        <!-- 讨论区 -->
        <discuss-board
          :objectID="+id"
          objectType="task"
          :objectTitle="task.name"
          @submitFinished="onSubmitDiscuss"
        />
      </q-card-section>
      <q-card-section v-if="!categoryModel.isTemplate">
        <!-- 订阅 -->
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
        :modelList="exportExcelList"
        :fields="exportExcelFields(categoryModel.widgets)"
        :fileName="resource.title"
        :tableHeader="{name:resource.title,style:'color:white;font-weight:bold;font-size:35px;background-color:#1976D2;text-decoration:underline;'}"
      ></export-excel>
    </q-dialog>
  </q-card>
</template>

<script>
import { LocalStorage, date, Platform } from 'quasar'
import { mapState, mapActions, mapGetters } from 'vuex'
import timeAgo from '@/utils/time-ago'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
import Task from '@/store/task/model'
const { formatDate } = date
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'TaskDetailItem',
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
      required: true,
      default: 0
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwChip: () => import('components/base/TwChip'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe'),
    TaskDetailItemHeader: () => import('components/task/TaskDetailItemHeader'),
    TaskDetailItemDate: () => import('components/task/TaskDetailItemDate'),
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwArchivePartNotes: () => import('components/base/TwArchivePartNotes'),
    ExportPdf: () => import('components/export/ExportPDF'),
    ExportExcel: () => import('components/export/ExportExcel'),
    TwSecrecyArea: () => import('components/base/TwSecrecyArea')
  },
  data () {
    return {
      exportExcel: false,
      exportExcelList: [],
      exportPDF: false,
      exportPDFList: [],
      labelStyle: this.$q.lang.getLocale().includes('zh') ? 'width:7.2rem' : 'width:10rem',
      description: '',
      focusEditor: false,
      myself: LocalStorage.getItem('myself'),
      isBookmark: false,
      goIntoAction: false
    }
  },
  computed: {
    ...mapState('breadcrumbs', ['resource']),
    ...mapState('task', ['tasks']),
    ...mapGetters('task', ['exportExcelFields']),
    ...mapState('person', ['selectPersons']),
    persons () {
      return this.selectPersons
    },
    task () {
      return this.tasks.find(t => t.id === +this.id) || new Task()
    },
    parentTask () {
      return this.tasks.find(t => t.id === this.task.parentId)
    },
    parentWhiteList () {
      return this.categoryModel.members
    },
    parentModel () {
      return {
        acl: this.parentTask.acl,
        whiteList: this.parentWhiteList
      }
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
    archived () {
      if (this.task.archived) {
        return {
          value: true,
          type: 'selfArchived', // selfArchived,inArchived
          parentId: 0
        }
      } else {
        const parentTask = this.tasks.find(t => t.id === this.task.parentId),
          rootTask = this.tasks.find(t => t.id === this.task.rootId)
        if (parentTask && parentTask.archived && parentTask.type === 'group') {
          // 分组
          return {
            value: true,
            type: 'inArchived', // selfArchived,inArchived
            parentId: this.task.parentId,
            parentLabel: this.$t('task.group.title')
          }
        } else if (rootTask && rootTask.archived) {
          // 清单
          return {
            value: true,
            type: 'inArchived', // selfArchived,inArchived
            parentId: this.task.parentId,
            parentLabel: this.$t('task.list.title')
          }
        } else {
          return {
            value: false,
            type: 'selfArchived', // selfArchived,inArchived
            parentId: 0
          }
        }
      }
    },
    menus () {
      if (this.archived.value) {
        return [this.isBookmark ? 'deleteBookmark' : 'bookmark', { group: ['exportPDF', 'exportExcel'] }, { group: ['publicLink'] }, { group: ['history'] }, { group: ['send'] }]
      } else {
        let menus = ['edit', 'copy', 'move', 'archive', 'delete', this.isBookmark ? 'deleteBookmark' : 'bookmark',
          { group: ['exportPDF', 'exportExcel'] }, { group: ['publicLink', 'send'] }, { group: ['history'] }]
        return menus
      }
    },
    labelClass () {
      return 'text-dark text-weight-bold text-subtitle1  ' + (this.$q.screen.lt.sm ? 'text-start' : 'items-end')
    },
    buttonLeftStyle () {
      return this.$q.screen.lt.sm ? '' : 'width:10rem'
    },
    setting () {
      return this.$store.getters['task/taskSetting'](this.categoryModel)
    }
  },
  methods: {
    formatDate,
    timeAgo,
    ...mapActions('member', ['loadMembers']),
    ...mapActions('task', ['updateTask', 'archiveTask', 'deleteTask', 'loadTask', 'loadTreeTasks', 'updateTaskCommentCount']),
    ...mapActions('bookmark', ['addBookmark', 'deleteBookmark', 'existBookmark']),
    // 初始化模型数据
    initData () {
      this.description = this.task.description
      this.loadTask(+this.id)
      this.loadTask(+this.task.parentId)
      this.loadTask(+this.task.rootId)
    },
    onEdit (focus) {
      if (focus === 'notes' && this.task.description) {
        return
      }
      this.$router.push({
        name: 'taskItemEdit',
        params: {
          id: +this.task.id,
          category: this.category,
          objectID: this.objectID,
          focus: focus
        }
      })
    },
    onMove (id) {
      this.$router.push({
        name: 'taskMove',
        params: {
          id: +id,
          category: this.category,
          objectID: this.objectID
        }
      })
    },
    onCopy (id) {
      this.$router.push({
        name: 'taskCopy',
        params: {
          id: +id,
          category: this.category,
          objectID: this.objectID
        }
      })
    },
    onArchive (id) {
      this.archiveTask(+id).then(res => {
        this.initData()
      })
    },
    sendToSomeone (id) {
      // 发送给某人
      this.$router.push({
        name: 'sendToSomeone',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +id
        }
      })
    },
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
    // 共享链接
    publicLink (id) {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'task',
          param: encodeURIComponent(JSON.stringify({ id: +this.task.id })),
          cardStyle: 'torn',
          title: this.task.name
        }
      })
    },

    onHistory () {
      // 弹出分享框
      this.$router.push({
        name: 'taskHistory',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +this.id
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
    onSubmitDiscuss () {
      this.updateTaskCommentCount({
        id: +this.id,
        isAdd: true
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
  },
  mounted () {
    this.initData()
    this.isExistBookmark()
  },
  watch: {
    'task.finished' (newValue, oldValue) {
      this.task.finished = newValue
    },
    'id' (newValue, oldValue) {
      this.description = _.clone(this.task.description)
    },
    'exportPDF' (value) {
      value && this.loadTreeTasks(this.task.id)
        .then(res => {
          this.exportPDFList = res
        })
    },
    'exportExcel' (value) {
      value && this.loadTreeTasks(this.task.id)
        .then(res => {
          this.exportExcelList = res
        })
    }
  }

}
</script>

<style lang="scss" scoped>
textarea {
  outline: none;
  resize: none;
}
.q-select {
  flex: 0 0 0 !important;
}
/deep/.menubar__button {
  padding: 0.2rem 0.4rem;
}
/deep/.content img {
  transition: all 0.6s;
  -moz-transition: all 0.6s;
  -webkit-transition: all 0.6s;
  -ms-transition: all 0.6s;
}
/deep/.content img.scale {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
}
</style>
