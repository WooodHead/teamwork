<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header
      :title="$t(`task.mystuff.CompletedTask.${type}`)"
      noMenu
    ></tw-header>
    <!-- 头部logo -->
    <q-card-section
      v-if="!$q.platform.is.mobile"
      class="text-center q-px-none"
    >
      <!-- 顶部头像 -->
      <tw-avatar
        :id="person.id"
        :name="person.name"
        :img="person.img"
      />
      <div class=" text-h5 q-py-sm">
        {{$t(`task.mystuff.CompletedTask.${type}`)}}</div>
      <q-separator />
    </q-card-section>

    <q-card-section class="q-px-xxl q-pt-none">
      <div
        class="q-gutter-y-sm"
        v-for="res in resources"
        :key="res.objectType+res.objectId + new Date()"
      >
        <tasks-title
          class="q-pt-sm text-caption"
          :objectID="res.objectId"
          :category="res.objectType"
        />
        <widget-task-list
          v-for="task in unarchivedFinishedLists.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
          :key="task.id"
          :id="task.id"
          :classify="type"
          :finished="true"
          view="list"
        />

      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  props: {
    type: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      unarchivedFinishedLists: [],
      person: LocalStorage.getItem('myself')
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwHeader: () => import('components/base/TwHeader'),
    'widget-task-list': () => import('components/task/WidgetTaskList'),
    'tasks-title': () => import('components/mystuff/tasks/TasksTitle')

  },
  computed: {
    ...mapGetters('task', [
      'unarchivedTaskListsOfFinishedAssignedToMe',
      'unarchivedTaskListsOfFinishedNotifyToMe',
      'unarchivedTaskListsOfFinishedAssignedByMe']),
    resources () {
      let res = this.unarchivedFinishedLists.map(t => {
        return {
          objectType: t.objectType,
          objectId: t.objectId
        }
      })
      return _.unionBy(res, 'objectType', 'objectId')
    }
  },
  methods: {
    ...mapActions('task', ['loadMyTaskList'])
  },
  mounted () {
    let classify = '',
      getTasks = ''
    if (this.type === 'all' || this.type === 'dates') {
      classify = 'finishedWithMe'
      getTasks = 'unarchivedTaskListsOfFinishedAssignedToMe'
    } else if (this.type === 'notify') {
      classify = 'finishedWithNotify'
      getTasks = 'unarchivedTaskListsOfFinishedNotifyToMe'
    } else if (this.type === 'assigned') {
      classify = 'finishedWithAssigned'
      getTasks = 'unarchivedTaskListsOfFinishedAssignedByMe'
    }
    this.loadMyTaskList({ psonId: +LocalStorage.getItem('myself').id, type: classify })
      .then(tasks => {
        this.unarchivedFinishedLists = this[getTasks]()
      })
  }
}
</script>

<style lang='scss' scoped></style>
