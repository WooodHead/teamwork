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
        v-for="task in notifyToMe.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
        :key="task.id"
        :id="task.id"
        classify="notify"
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
  computed: {
    ...mapGetters('task', ['taskListsOfNotifyToMe']),
    notifyToMe () {
      return this.taskListsOfNotifyToMe()
    },
    resources () {
      let res = this.taskListsOfNotifyToMe().map(t => {
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
    this.loadMyTaskList({ psonId: +LocalStorage.getItem('myself').id, type: 'notify' })
  }
}
</script>

<style lang='stylus' scoped></style>
