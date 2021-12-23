<!--  -->
<template>
  <div>
    <div
      class="text-weight-bold text-body1 text-negative"
      v-if="overdueYesterdayResources.length>0"
    >
      {{$t('task.mystuff.overdueYesterday')}}
    </div>
    <div
      v-for="res in overdueYesterdayResources"
      :key="res.objectType+res.objectId"
    >
      <tasks-title
        :objectID="res.objectId"
        :category="res.objectType"
      />
      <widget-task-item
        :class="task.type==='item'?'text-body1':''"
        v-for="task in assignedByMe.overdueYesterdayList.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
        :key="task.id"
        :task="task"
      />
    </div>
    <div
      class="text-weight-bold text-body1 text-negative q-pt-md"
      v-if="overdueMoreResources.length>0"
    >
      {{$t('task.mystuff.overdueMore')}}
    </div>
    <div
      v-for="res in overdueMoreResources"
      :key="res.objectType+res.objectId + new Date()"
    >
      <tasks-title
        :objectID="res.objectId"
        :category="res.objectType"
      />
      <widget-task-item
        :class="task.type==='item'?'text-body1':''"
        v-for="task in assignedByMe.overdueMoreList.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
        :key="task.id"
        :task="task"
      />
    </div>
    <div
      class="text-weight-bold text-body1 q-pt-md text-primary"
      v-if="noOverdueResources.length>0"
    >
      {{$t('task.mystuff.noOverdue')}}
    </div>
    <div
      v-for="res in noOverdueResources"
      :key="res.objectType+res.objectId"
    >
      <tasks-title
        :objectID="res.objectId"
        :category="res.objectType"
      />
      <widget-task-item
        :class="task.type==='item'?'text-body1':''"
        v-for="task in assignedByMe.noOverdueList.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'TasksAll',
  computed: {
    ...mapGetters('task', ['taskListsOfAssignedByMeOverDue']),
    assignedByMe () {
      return this.taskListsOfAssignedByMeOverDue()
    },
    overdueYesterdayResources () {
      let res = this.assignedByMe.overdueYesterdayList.map(t => {
        return {
          objectType: t.objectType,
          objectId: t.objectId
        }
      })
      return _.unionBy(res, 'objectType', 'objectId')
    },
    overdueMoreResources () {
      let res = this.assignedByMe.overdueMoreList.map(t => {
        return {
          objectType: t.objectType,
          objectId: t.objectId
        }
      })
      return _.unionBy(res, 'objectType', 'objectId')
    },
    noOverdueResources () {
      let res = this.assignedByMe.noOverdueList.map(t => {
        return {
          objectType: t.objectType,
          objectId: t.objectId
        }
      })
      return _.unionBy(res, 'objectType', 'objectId')
    }
  },
  components: {
    'widget-task-item': () => import('components/task/WidgetTaskItem'),
    'tasks-title': () => import('components/mystuff/tasks/TasksTitle')
  },
  methods: {
    ...mapActions('task', ['loadMyTaskList'])
  },
  mounted () {
    this.loadMyTaskList({ psonId: +LocalStorage.getItem('myself').id, type: 'assigned' })
  }
}
</script>

<style lang='stylus' scoped></style>
