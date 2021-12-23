<!--  -->
<template>
  <div>
    <div
      class="text-weight-bold text-body1"
      :class="color"
    >
      {{title}}
    </div>
    <q-separator />
    <div
      class="q-pt-md"
      v-for="res in resources"
      :key="res.objectType+res.objectId + new Date()"
    >
      <tasks-title
        :objectID="res.objectId"
        :category="res.objectType"
      />
      <widget-task-list
        class="q-pt-sm"
        v-for="task in lists.filter(a=>a.objectId===res.objectId&&a.objectType===res.objectType)"
        :key="task.id"
        :id="task.id"
        :classify="classify"
        view="list"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    lists: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    classify: {
      type: String,
      required: false,
      default: 'dates'
    },
    color: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    resources () {
      let res = this.lists.map(t => {
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
  }
}
</script>

<style lang='stylus' scoped></style>
