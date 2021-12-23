<template>
  <q-list class="q-gutter-xs">
    <!--清单item -->
    <widget-task-item
      :task="tasks.find(t=>t.id===+id)"
    />
    <div
      v-for="task in tasksInlist"
      :key="task.id"
      class="q-gutter-xs"
    >
      <widget-task-item
        :task="task"
        :view="view"
      />
    </div>
  </q-list>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'WidgetTaskList',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    classify: {
      type: String,
      required: true,
      desc: 'all,dates,assigned,notify'
    },
    // 是否完成
    finished: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否归档
    archived: {
      type: Boolean,
      required: false,
      default: false
    },
    view: {
      type: String,
      required: false,
      default: 'card',
      desc: 'card,list'
    }

  },
  data () {
    return {
      taskClassify: {
        allUnfinished: 'assignedToMeTasksInList',
        allFinished: 'finishedAssignedToMeTasksInList',
        datesUnfinished: 'assignedToMeTasksWithDueDateInList',
        datesFinished: 'finishedAssignedToMeTasksInList',
        assignedUnfinished: 'assignedByMeTasksInList',
        assignedFinished: 'finishedAssignedByMeTasksInList',
        notifyUnfinished: 'notifyToMeTasksInList',
        notifyFinished: 'finishedNotifyToMeTasksInList'
      }
    }
  },
  computed: {
    ...mapState('task', ['tasks']),
    ...mapGetters('task', [
      'assignedToMeTasksInList',
      'assignedToMeTasksWithDueDateInList',
      'finishedAssignedToMeTasksInList',
      'assignedByMeTasksInList',
      'finishedAssignedByMeTasksInList',
      'notifyToMeTasksInList',
      'finishedNotifyToMeTasksInList'
    ]),
    tasksInlist () {
      let classify = this.taskClassify[this.classify + (this.finished ? 'Finished' : 'Unfinished')]
      let list = this[classify]({ id: +this.id })
      if (this.archived) {
        list = list.filter(a => a.archived)
      } else {
        list = list.filter(a => !a.archived)
      }
      return list
    }
  },
  components: {
    WidgetTaskItem: () => import('components/task/WidgetTaskItem')
  }
}
</script>

<style>
</style>
