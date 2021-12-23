<template>
  <q-list
    :class="view === 'list' ? 'q-mb-lg' : 'q-mb-sm'"
    style="margin-top:0;"
  >
    <!-- 未归档list详情页 -->
    <div v-if="!task.archived">
      <div v-if="editing">
        <task-form-list
          v-if="task.type==='list'"
          :id="id"
          @ok="$emit('update:editing',false)"
          @cancel="$emit('update:editing',false)"
        />
        <task-form-group
          v-if="task.type==='group'"
          :id="id"
          @ok="$emit('update:editing',false)"
          @cancel="$emit('update:editing',false)"
        />
      </div>
      <!-- 任务清单(分组) -->
      <task-item
        v-else
        :task="task"
        :isDetail="isDetail"
        :menus="taskMenus(task)"
        :view='view'
        @addGroup="setAddingGroup(true)"
      />
      <div v-if="!listOnly">
        <!-- 清单详情页混合视图下的任务列表 -->
        <draggable
          v-if="isMixtureView"
          v-model="allTasksInMixture"
          v-bind="dragOptions"
          :disabled="$q.platform.is.mobile"
          @start="onDragStart"
          @change="dragSort($event,allTasksInMixture)"
        >
          <task-item
            v-for="task in allTasksInMixture"
            :key="task.id"
            :view='view'
            :task="task"
            :menus="taskMenus(task)"
          />
        </draggable>

        <!-- 未完成的任务列表item -->
        <draggable
          v-else
          v-model="unfinishedTasks"
          :disabled="$q.platform.is.mobile"
          v-bind="dragOptions"
          @start="onDragStart"
          @change="dragSort($event,unfinishedTasks)"
        >
          <task-item
            v-for="task in unfinishedTasks"
            :key="task.id"
            :view='view'
            :task="task"
            :menus="taskMenus(task)"
          />
        </draggable>
        <div class="q-my-sm">

          <!-- 任务添加按钮 -->
          <q-btn
            flat
            v-if="view==='list'&&addibleItem&&!addingItem&&showEditMenu&&task.type==='group'"
            class="add-task-button"
            :class="{'item-left-margin':$q.screen.gt.sm}"
            label="新建任务"
            @click.stop="addingItem = true"
          />
          <q-btn-dropdown
            flat
            split
            v-if="view==='list'&&addibleItem&&!addingItem&&!addingGroup&&showEditMenu&&task.type==='list'"
            class="add-task-button"
            :class="{'item-left-margin':$q.screen.gt.sm}"
            label="新建任务"
            @click.stop="addingItem = true"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="addingGroup = true"
              >
                <q-item-section>
                  <q-item-label>新建分组</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- 添加组 -->
          <task-form-group
            v-if="addingGroup"
            :category="task.objectType"
            :objectID="task.objectId"
            :parentId="task.id"
            @ok="setAddingGroup(false)"
            @cancel="setAddingGroup(false)"
          />
          <!-- 添加任务 -->
          <task-form-item
            v-if="addingItem"
            :category="task.objectType"
            :objectID="task.objectId"
            :rootId="rootId"
            :parentId="parentId"
            inset
            @ok="addingItem = false"
            @cancel="addingItem = false"
          />
        </div>
        <!-- 已完成的任务列表 -->
        <div v-if="!isMixtureView">
          <task-item
            v-for="task in finishedTasks"
            :view='view'
            :key="task.id"
            :task="task"
            :menus="taskMenus(task)"
          />
        </div>
        <div
          class="flex "
          :class="'justify-left'"
          v-if="unloadFinishedCount"
        >
          <q-btn
            flat
            :label="$t('task.AndMoreCompletedTodo',{number:unloadFinishedCount} )"
            color="primary"
            @click="loadAllFinishedUnarchivedTasksInList(id)"
          />
        </div>
      </div>
    </div>
    <!-- 已归档list详情页 -->
    <div v-else>
      <!--任务清单（分组） -->
      <task-item
        :task="task"
        :view='view'
      />
      <task-item
        v-for="task in unfinishedTasks"
        :key="task.id"
        :view='view'
        :task="task"
      />
      <!-- 已完成的任务列表 -->
      <task-item
        v-for="task in finishedTasks"
        :view='view'
        :key="task.id"
        :task="task"
      />
    </div>
  </q-list>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import { computedOrder } from '@/utils/computed-order'
import getCategory from '@/mixins/mixins-get-category'
/**
 * 一个完整的任务清单（分组）
 */
export default {
  name: 'TaskList',
  mixins: [getCategory],
  props: {
    // 任务清单id(或者分组id)
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 视图类型，分为card和list，默认为list
    view: {
      type: String,
      required: false,
      default: 'list'
    },
    // 是否可添加任务
    addibleItem: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否在编辑中
    editing: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否在添加分组中
    // addingGroup: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // },
    listOnly: {
      type: Boolean,
      required: false,
      default: false,
      description: '当显示的清单数大于一定的数量后（比如20个）就只显示清单'
    },
    isDetail: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否为详情页，默认为false'
    }
  },
  data () {
    return {
      addingItem: false,
      fromTask: {},
      fromArray: [],
      addingGroup: false
    }
  },
  computed: {
    ...mapState('task', ['tasks', 'dragOptions', 'ctrlList', 'detailView']),
    taskMenus () {
      return (task) => {
        let menus = ['edit', 'move', 'copy', 'delete', 'archive']
        const exportMenus = { group: ['exportPDF', 'exportExcel'] }
        if (task.type === 'list') {
          this.listOnly || menus.push({ group: ['insert', 'addGroup'] })
          menus.push(exportMenus)
        } else if (task.type === 'group') {
          menus.push({ group: ['insert', 'releaseGroup', 'convertToList'] }, exportMenus)
        } else {
          task.finished
            ? menus = ['move', 'copy', 'delete', 'archive', exportMenus]
            : menus.push({ group: ['insert'] }, exportMenus)
        }
        return menus
      }
    },
    category () { return this.task.objectType },
    objectID () { return this.task.objectId },
    task () {
      return this.tasks.find(t => t.id === +this.id)
    },
    // 过滤分组被删除、归档情况下分组内的所有任务
    tasksInList () {
      return this.task.type === 'group'
        ? this.$store.getters['task/tasksInGroup'](+this.id)
        : this.$store.getters['task/tasksInList'](+this.id)
    },
    // 根节点ID（如果是分组，返回父节点，如果是清单，返回本身id）
    rootId () {
      if (this.task.type === 'group') {
        return this.task.parentId
      } else {
        return this.id
      }
    },
    parentId () {
      if (this.tasksInList.length) {
        const lastTask = _.last(this.tasksInList)
        return lastTask.type === 'group' ? lastTask.id : lastTask.parentId
      } else {
        return this.id
      }
    },
    unloadFinishedCount () {
      if (this.task.id === 0) {
        return 0
      } else {
        let list = this.tasksInList.filter(t => t.finished) || []
        return this.task.overview.finishedAllCount - list.length
      }
    },
    // 未完成的任务
    unfinishedTasks: {
      get () {
        return this.tasksInList.filter(t => !t.finished) || []
      },
      set (newValue) {
        this.updateOrderNumber(newValue)
      }
    },
    // 已完成的任务
    finishedTasks () {
      let list = this.tasksInList.filter(t => t.finished) || []
      return _.orderBy(list, ['finishedTime'], ['desc'])
    },
    // 未分离状态下显示的任务
    allTasksInMixture: {
      get () {
        return this.tasksInList || []
      },
      set (newValue) {
        this.updateOrderNumber(newValue)
      }
    },
    // 是否显示为混合视图
    isMixtureView () {
      return this.detailView === 'mixture' && this.task.type === 'list' && this.isDetail
    }
  },
  components: {
    draggable,
    'task-form-list': () => import('components/task/form/TaskFormList'),
    'task-form-item': () => import('components/task/form/TaskFormItem'),
    'task-form-group': () => import('components/task/form/TaskFormGroup'),
    'task-item': () => import('components/task/TaskItem')
  },
  methods: {
    ...mapMutations('task', ['addTasks']),
    ...mapActions('task', ['loadTaskList', 'sortTask', 'loadAllFinishedUnarchivedTasksInList']),
    updateOrderNumber (newValue) {
      let index = _.findIndex(newValue, value => value.id === this.fromTask.id)
      if (this.fromTask.type !== 'group') {
        // 更新 parentId
        let group = _.find(newValue.slice(0, index).reverse(), value => value.type === 'group')
        newValue[index].parentId = group ? group.id : this.id
        // 更新 orderNumber
        let prev = newValue[index - 1]
        let next = newValue[index + 1]
        let order1 = prev && prev.type !== 'group' ? prev.orderNumber : 1
        let order2 = next ? (group ? (next.type === 'group' ? 0 : next.orderNumber) : next.orderNumber) : 0
        let orderNumber = computedOrder(order1, order2)
        newValue[index].orderNumber = orderNumber
        // 更新 level
        let level1 = prev ? prev.level : newValue[index].level
        let level2 = next ? next.level : newValue[index].level
        newValue[index].level = Math.max(level1, level2)
        // 更新数组
        this.addTasks(newValue)
      } else {
        let prev = newValue[index - 1]
        let next = newValue[index + 1]
        var type1 = prev ? prev.type : ''
        var type2 = next ? next.type : ''
        if (type1 === 'group' || type2 === 'group') {
          let order1 = prev ? prev.orderNumber : 1
          let order2 = next ? next.orderNumber : 0
          let orderNumber = computedOrder(order1, order2)
          // 更新 orderNumber
          newValue[index].orderNumber = orderNumber
          // 更新数组
          this.addTasks(newValue)
        }
      }
    },
    onDragStart (event) {
      this.fromTask = event.item.__vue__.task
      this.fromArray = event.from.__vue__.value
    },
    dragSort (event, list) {
      let from = event.moved.element
      let index = _.findIndex(this.fromArray, value => value.id === from.id)
      let newIndex = _.findIndex(list, value => value.id === from.id)
      if (index !== newIndex) {
        this.sortTask(from)
      }
    },
    setAddingGroup (value) {
      this.addingGroup = value
      this.$emit('update:addingGroup', value)
    }
  },
  mounted () {
    if (!this.listOnly) {
      this.loadTaskList(+this.id)
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-task-button {
    vertical-align: middle;
    text-decoration: none;
    text-align: center;
    border: 1px solid #d9d9d9;
    border-radius: 1.5rem;
    line-height: 1.5;
  }
  .item-left-margin {
    margin-left: 36px;
  }
  .ghost {
    border-radius: 4px;
    background-color: #ecf9fd;
  }
  .chosen {
    border-radius: 4px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
  }
</style>
