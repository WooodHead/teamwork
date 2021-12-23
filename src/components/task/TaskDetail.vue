<template>
   <div class="card-grow-in-page flex">
    <!-- 任务清单详情 -->
    <task-list-detail
      v-if="task && task.type!=='item'"
      :id="+newId"
      :category="category"
      :objectID="+objectID"
    ></task-list-detail>
    <!-- 单个任务详情 -->
    <task-detail-item
      v-if="task && task.type==='item'"
      :id="+newId"
      :category="category"
      :objectID="+objectID"
    ></task-detail-item>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TaskDetail',
  props: {
    // 资源类型
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 1
    },
    // 任务ID
    id: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    TaskDetailItem: () => import('components/task/TaskDetailItem'),
    TaskListDetail: () => import('components/task/TaskListDetail')
  },
  data () {
    return {
      newId: +this.id
    }
  },
  computed: {
    ...mapState('task', ['tasks']),
    task () {
      return this.tasks.find(t => t.id === this.newId)
    }
  },
  watch: {
    '$route' (to, from) {
      this.newId = +to.params.id
    },
    task: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal) {
          this.$route.meta.label = newVal.name
          document.title = `${newVal.name} | TeamWork`
        }
      }
    }
  },
  methods: {
    ...mapActions('task', ['loadTreeTasks'])
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    if (Number(to.params.id) !== 0) {
      this.loadTreeTasks(Number(to.params.id))
      next()
    }
  },
  mounted () {
    if (+this.id !== 0) {
      this.loadTreeTasks(+this.id)
    }
  }
}
</script>

<style>
</style>
