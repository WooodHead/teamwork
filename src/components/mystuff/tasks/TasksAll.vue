<!--  -->
<template>
  <div>
    <div
      class="q-gutter-sm q-pt-md"
      v-for="res in resources"
      :key="res.objectType+res.objectId + new Date()"
    >
      <tasks-title
        class="q-pt-sm text-caption"
        :objectID="res.objectId"
        :category="res.objectType"
      />
      <widget-task-list
        v-for="task in assignedToMe.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
        :key="task.id"
        :id="task.id"
        classify="all"
        view="list"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'TasksAll',
  data () {
    return {
      myinfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapGetters('task', ['taskListsOfAssignedToMe']),
    assignedToMe () {
      return this.taskListsOfAssignedToMe()
    },
    resources () {
      let res = this.taskListsOfAssignedToMe().map(t => {
        return {
          objectType: t.objectType,
          objectId: t.objectId
        }
      })
      return _.unionBy(res, 'objectType', 'objectId')
    }
  },
  components: {
    'widget-task-list': () => import('components/task/WidgetTaskList'),
    'tasks-title': () => import('components/mystuff/tasks/TasksTitle')
  },
  methods: {
    ...mapActions('task', ['loadMyTaskList'])
  },
  mounted () {
    this.loadMyTaskList({ psonId: +this.myinfo.id, type: 'all' })
  }
}

</script>

<style lang='stylus' scoped></style>
