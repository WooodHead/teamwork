<!--  -->
<template>
  <div class="q-gutter-sm">
    <tasks-overdue
      v-if="assignedToMeOverdue.overdueList.length>0"
      :lists="assignedToMeOverdue.overdueList"
      :title="$t('task.mystuff.overdue')"
      classify="dates"
      color="text-red-10"
    />
    <tasks-overdue
      v-if="assignedToMeOverdue.dueTodayList.length>0"
      :lists="assignedToMeOverdue.dueTodayList"
      :title="$t('task.mystuff.dueToday')"
      classify="dates"
      color="text-red-10"
    />
    <tasks-overdue
      v-if="assignedToMeOverdue.dueTomorrowList.length>0"
      :lists="assignedToMeOverdue.dueTomorrowList"
      :title="$t('task.mystuff.dueTomorrow')"
      classify="dates"
      color="text-red-10"
    />
    <tasks-overdue
      v-if="assignedToMeOverdue.dueWeekList.length>0"
      :lists="assignedToMeOverdue.dueWeekList"
      classify="dates"
      :title="$t('task.mystuff.dueThisWeek')"
    />
    <tasks-overdue
      v-if="assignedToMeOverdue.dueLaterList.length>0"
      :lists="assignedToMeOverdue.dueLaterList"
      classify="dates"
      :title="$t('task.mystuff.dueLater')"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'TasksWithDate',
  computed: {
    ...mapGetters('task', ['taskListsOfAssignedToMeOverDue']),
    assignedToMeOverdue () {
      return this.taskListsOfAssignedToMeOverDue()
    }
  },
  components: {
    'tasks-overdue': () => import('components/mystuff/tasks/TasksOverdue')
  },
  methods: {
    ...mapActions('task', ['loadMyTaskList'])
  },
  mounted () {
    this.loadMyTaskList({ psonId: +LocalStorage.getItem('myself').id, type: 'notify' })
  }
}
</script>

<style lang='stylus' scoped></style>
