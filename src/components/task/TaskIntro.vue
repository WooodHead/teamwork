<template>
  <div>
    <!-- 单条list -->
    <div
      v-if="param.id"
      @click.capture.stop="toPageTaskDetail(+param.id)"
    >
      <div v-if="task.type!=='list'">{{$t('task.publicFrom')}}{{(tasks.find(t => t.id === task.rootId)||{}).name}}</div>
      <div v-if="task.type==='list'">
        <widget-task-item
          v-for="taskInList in latestTasksOfList"
          :key="taskInList.id"
          :task="taskInList"
        />
      </div>
      <div v-else-if="task.type==='group'">
        <widget-task-item
          v-for="taskInGroup in latestTasksOfGroup"
          :key="taskInGroup.id"
          :task="taskInGroup"
        />
      </div>
      <!--分组中的任务 -->
      <div v-else-if="task.rootId!==task.parentId">
        <widget-task-item :task="tasks.find(t=>t.id===task.parentId)||{}" />
        <widget-task-item :task="task" />
      </div>
      <widget-task-item
        v-else
        :task="task"
      />
    </div>
    <!-- 资源的最新的几条任务 -->
    <div v-else>
      <widget-task-item
        v-for="latestTask in latestTasks"
        :key="latestTask.id"
        :task="latestTask"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'TaskIntro',
  props: {
    // 根据传入参数请求不同数据
    // 传入 id 时请求单条数据
    // 未传入 id 时请求多条数据
    param: {
      type: Object,
      required: true,
      default: function () {
        return {
          id: 0,
          objectID: 0,
          objectType: ''
        }
      }
    }
  },
  data () {
    return {
      showCount: 10
    }
  },
  methods: {
    ...mapActions('task', ['loadTreeTasks', 'loadTasksInWidget']),
    // 跳转详情页
    toPageTaskDetail (id) {
      if (this.param.objectType && this.param.objectID) {
        this.$router.push({
          name: 'taskDetail',
          params: {
            category: this.param.objectType,
            objectID: +this.param.objectID,
            id: +id
          }
        })
      }
    }
  },
  components: {
    WidgetTaskItem: () => import('components/task/WidgetTaskItem')
  },
  computed: {
    ...mapState('task', ['tasks']),
    ...mapGetters('task', ['tasksOfList', 'tasksOfGroup', 'tasksInWidget']),
    task () {
      return this.tasks.find(t => t.id === this.param.id) || {}
    },
    latestTasksOfList () {
      return this.task.type === 'list' ? _.slice(this.tasksOfList(this.task.id), 0, this.showCount) : []
    },
    latestTasksOfGroup () {
      return this.task.type === 'group' ? _.slice(this.tasksOfGroup(this.task.id), 0, this.showCount) : []
    },
    latestTasks () {
      return this.tasksInWidget({ objectType: this.param.objectType, objectID: +this.param.objectID })
    },
    parentName () {
      if (this.task && this.task.type !== 'list' && this.task.path.length > 1) {
        return this.task.path[this.task.path.length - 2].name
      }
      return ''
    }
  },
  created () {
    if (this.param.id) {
      this.loadTreeTasks(this.param.id)
    } else {
      this.loadTasksInWidget({
        objectID: +this.param.objectID,
        objectType: this.param.objectType
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
