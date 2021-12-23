<template>
  <!-- 任务卡片 -->
  <q-card
    class="task-card col-3 cursor-pointer q-pa-sm"
    @click="toPagetaskDetail(id)"
  >
    <task-item
      :task="task"
      type="item"
    />
  </q-card>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'TaskCard',
  props: {
    // 任务Id
    id: {
      type: [Number, String],
      default: 0,
      requierd: true
    }
  },
  computed: {
    ...mapState('task', ['tasks']),
    task () {
      return this.tasks.find(t => t.id === +this.id)
    }
  },
  components: {
    'TaskItem': () => import('components/task/TaskItem')
  }
}
</script>
<style scoped>
.task-card {
  font-size: smaller;
  overflow: hidden;
  min-height: 100px;
}
</style>
