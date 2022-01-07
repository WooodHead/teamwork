<!--
@Name：任务模板
@Author：陆欢
@date：2021/01/25
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    class="q-px-xl"
    flat
    style="font-family:'阿里巴巴普惠体 Regular';padding-left: 35px;"
  >
    <q-card-section class="task-public text-dark q-pt-none">
      <!-- 资源名称标题 -->
      <div
        class="text-center title-page q-pb-lg"
        v-if="resourceName"
      >
        {{resourceName}}
      </div>
      <!-- 任务表格信息 -->
      <task-table
        v-if="showTaskTable()"
        :taskItemList="taskItemList"
      />
      <!-- 任务列表 -->
      <template v-if="taskList&&taskList.length">
        <div
          v-for="task in taskList"
          :key="task.id"
        >
          <!-- 清单 -->
          <!-- 是否显示完成率。如果是从任务进去的就不显示完成率，否则显示 -->
          <task-list-only-show
            :task="task"
            :showCompletePercentage="showCompletePercentage(task)"
            v-if="task.type==='list'"
          />
          <!-- 分组 -->
          <task-group-only-show
            :task="task"
            :showSeparator="false"
            v-else-if="task.type==='group'"
          />
          <!-- 任务 -->
          <task-item-only-show
            :task="task"
            v-else-if="task.type==='item'"
          />
          <div
            v-if="task.type==='item'&&taskComment(task).length>0"
            class="q-pb-sm"
            style="margin-left:20px;"
          >
            <div
              class="q-pt-xs q-pb-sm q-px-md tiptap-content editor__content bg-grey-2 full-width"
              style="margin-left:20px; white-space: normal;word-break: break-all;"
              v-for="item in taskComment(task)"
              :key="item.id"
              v-html="item.content"
            />
          </div>
          <!-- <q-card
              class="bg-grey-2 full-width"
              flat
              dense
              v-for="item in taskComment(task)"
              :key="item.id"
            >
              <q-card-section horizontal>
                <q-card-section
                  v-html="item.content"
                  class="q-py-xs tiptap-content"
                  style="padding-bottom: 10px;width: 100%;white-space: normal;word-break: break-all;"
                >
                </q-card-section>
              </q-card-section>
            </q-card> -->
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'TaskOnlyShow',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    needSettingProperty: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '需要更新的内容'
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '导入关联的资源,例如：project、product'
    },
    objectID: {
      type: Number,
      default: 0,
      required: false,
      description: '资源的ID，例如：ProjectID'
    },
    exportCommentByCategory: {
      type: Boolean,
      default: false,
      required: false,
      description: '导出某个资源下面的所有符合条件的讨论内容，例如导出某个项目下面所有符合条件的任务讨论'
    }
  },
  data () {
    return {
      lists: {},
      comments: []
    }
  },
  mounted () {
    // 获取资源名称
    this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
    this.getComments()
  },
  computed: {
    taskList () {
      let taskOrder = []
      // 清单
      let taskList = this.tasks.filter(task => task.type === 'list')
      // 清单下面的分组和任务
      _(taskList).forEach(list => {
        taskOrder.push(list)
        let listChild = this.childTasks(list.id)
        _(listChild).forEach(c => {
          taskOrder.push(c)
          if (c.type === 'group') {
            let child = this.childTasks(c.id)
            taskOrder.push(...child)
          }
        })
      })
      return taskOrder
    },
    resourceName () {
      const categoryModel = this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
      return categoryModel.title || ''
    },
    taskItemList () {
      let items = this.taskList.filter(task => task.type === 'item')
      return _.map(items, (item, index) => {
        item.order = index + 1
        return item
      })
    }
  },
  watch: {
    tasks: {
      deep: true,
      handler (newVal, oldVal) {
        this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
        this.getComments()
      }
    },
    'needSettingProperty.startTime' (newVal, oldVal) {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
      this.getComments()
    }
  },
  methods: {
    ...mapActions('discuss', ['getListOfComents']),
    ...mapActions('task', ['getNewCommentOfAssigned', 'getPeriodTimeCommentOfAssigned']),
    childTasks (id) {
      let childs = this.tasks.filter(task => task.parentId === id)
      return _.orderBy(childs, ['orderNumber'], 'asc')
    },
    taskComment (task) {
      return this.comments.filter(item => item.objectID === task.id && task.assignedTo.includes(item.createByID))
    },
    // 获取讨论
    getComments () {
      this.comments = []
      this.lists = _.cloneDeep(this.tasks)
      // 初次进来获取最新工作进展needSettingModuleContent对象为空
      // 后面如果有值再根据条件获取
      if (this.lists.length > 0) {
        const taskItems = this.lists.filter(task => task.type === 'item')
        const taskIDs = _.map(taskItems, 'id').toString()
        const params = this.exportCommentByCategory
          ? { category: this.category, objectID: this.objectID }
          : { Ids: taskIDs }
        if (!this.needSettingProperty.hasOwnProperty('startTime') || (
          this.needSettingProperty.hasOwnProperty('startTime') && this.needSettingProperty.updateType === 'isExportTable'
        )) {
          let typeList = this.lists.filter(t => t.type === 'list')
          let typeGroup = this.lists.filter(t => t.type === 'group')
          let obj = {
            taskID: 0,
            category: '',
            objectID: 0
          }
          if (typeList.length === 0 && typeGroup.length === 0) {
            // 导出任务
            obj.taskID = typeList[0].id
          } else if (typeList.length === 0 && typeGroup.length === 1) {
            // 导出分组
            obj.taskID = groups[0].id
          } else if (typeList.length === 1) {
            // 导出清单
            obj.taskID = typeList[0].id
          } else if (typeList.length > 1) {
            // 导出资源下的任务
            obj.objectID = this.lists[0].objectId
            obj.category = this.lists[0].objectType
          }
          this.getNewCommentOfAssigned(obj)
            .then(res => {
              this.comments = res
              return true
            })
        } else {
          Object.assign(params, { createTime: this.needSettingProperty.startTime })
          this.getPeriodTimeCommentOfAssigned(params)
            .then(res => {
              this.comments = res
              return true
            })
        }
      }
    },
    showCompletePercentage (task) {
      const children = _.filter(this.tasks, item => {
        return item.rootId === task.id && item.rootId !== item.id && item.type === 'item'
      })
      return children.length === task.overview.allCount
    },
    showTaskTable () {
      if (!this.taskItemList.length || this.$route.name === 'publicLink') {
        return false
      }
      const hasAttribute = this.needSettingProperty.hasOwnProperty('isExportTaskTableOfPdf')
      if (hasAttribute) {
        return this.needSettingProperty.isExportTaskTableOfPdf
      } else {
        const storage = this.$q.localStorage.getItem('isExportTaskTableOfPdf')
        return (storage === null || storage === undefined) ? true : storage
      }
    }
  },
  components: {
    TaskListOnlyShow: () => import('components/task/TaskListOnlyShow'),
    TaskGroupOnlyShow: () => import('components/task/TaskGroupOnlyShow'),
    TaskItemOnlyShow: () => import('components/task/TaskItemOnlyShow'),
    TaskTable: () => import('components/export/export-task/TaskTable')
  }
}
</script>

<style lang="scss" scoped>
  .task-public {
    color: #283c46;
    font-size: 16px;
  }
  .title-page {
    font-size: 28px;
    font-weight: 700;
  }
  .title-group {
    font-size: 16px;
    font-weight: 700;
    word-break: break-word;
  }
  /deep/ .title-list {
    margin-top: 0 !important;
  }
  /deep/ .title-list + div {
    margin-bottom: 16px;
    color: $grey-7;
    font-size: 14px;
  }
  @font-face {
    font-family: "阿里巴巴普惠体 Regular";
    src: url(../../css/fonts/Alibaba-PuHuiTi-Regular.woff);
  }
</style>
