<template>
  <div>
    <widget-task-item
      v-for="task in list"
      :key="task.id"
      :task="task"
      @click.capture.stop="toPageTaskDetail(+task.id)"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TaskIntroBatch',
  props: {
    ids: {
      type: String,
      required: true
    },
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
    }
  },
  data () {
    return {
      query: [
        { Key: 'TaskID', Value: this.ids, Oper: 'in' }
      ]
    }
  },
  methods: {
    ...mapActions('task', ['loadTasks']),
    // 跳转详情页
    toPageTaskDetail (id) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          category: this.param.objectType,
          objectID: +this.param.objectID,
          id: +id
        }
      })
    }
  },
  components: {
    WidgetTaskItem: () => import('components/task/WidgetTaskItem')
  },
  computed: {
    ...mapState('task', ['tasks']),
    list () {
      return this.tasks.filter(a => this.ids.includes(a.id))
    }
  },
  created () {
    this.loadTasks({
      query: this.query
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
