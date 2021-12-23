<template>
  <widget-layout
    :isEmpty="tasks.length===0"
    :isSetting="false"
    widget="task"
    :category="category"
    :id="objectID"
  >
    <template
      v-if="tasks.length>0"
      slot="content"
    >
      <q-item class="column no-pointer-events text-left text-caption q-gutter-sm">
        <widget-task-item
          v-for="task in tasks"
          :key="task.id"
          :task="task"
        />
      </q-item>
    </template>
  </widget-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'WidgetTask',
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: Number,
      required: false
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    WidgetTaskItem: () => import('components/task/WidgetTaskItem')
  },
  computed: {
    ...mapGetters('task', ['tasksInWidget']),
    tasks () {
      return this.tasksInWidget({ objectType: this.category, objectID: +this.objectID })
    }
  },
  methods: {
    ...mapActions('task', ['loadTasksInWidget']),
    ...mapMutations('task', ['setSearch'])
  },
  mounted () {
    this.loadTasksInWidget({
      objectType: this.category,
      objectID: +this.objectID
    })
    this.setSearch('')
  }
}
</script>

<style scoped>
</style>
