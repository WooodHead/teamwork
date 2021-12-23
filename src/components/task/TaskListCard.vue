<template>
  <q-card class="task-card ">
    <div
      @click.capture.stop="toPageTaskDetail(+id)"
      class="cursor-pointer"
    >
      <!-- 任务 -->
      <task-list
        class="q-pa-sm"
        view='card'
        :id="id"
        :addibleItem="false"
      />
    </div>
    <slot>
    </slot>
  </q-card>
</template>
<script>
export default {
  name: 'TaskListCard',
  props: {
    // 任务清单id
    id: {
      type: [Number, String],
      required: false,
      default: 0
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
      default: 0
    }
  },
  components: {
    'task-list': () => import('components/task/TaskList')
  },

  methods: {
    // 跳转详情页
    toPageTaskDetail (id) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.task-card {
  font-size: smaller;
  width: 170px;
  height: 220px;
  overflow: hidden;
  position: relative;
  border-radius: 6px !important;
}
.moveButton {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 1rem 0.5rem;
  background: linear-gradient(rgba(255, 255, 255, 0), #fff 30%);
  line-height: 2em;
}
</style>
