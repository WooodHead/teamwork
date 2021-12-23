<template>
  <q-page >
    <div class="q-pa-md absolute full-width full-height column">
    <search-sort
      :options="options"
      :search.sync="searchFields"
      :sort.sync="sortFields"
      class="q-mb-md"
    />
      <q-scroll-area
        :thumb-style="thumbStyle"
        :content-style="contentStyle"
        :content-active-style="contentActiveStyle"
        class="q-scroll-area-tasks"
      >
        <tasks-no v-if="!Object.keys(tasksTodo).length && !search"></tasks-no>

        <tasks-todo v-if="Object.keys(tasksTodo).length"></tasks-todo>

        <tasks-completed v-if="Object.keys(tasksCompleted).length"></tasks-completed>
      </q-scroll-area>
    </div>
    <q-page-sticky
      position="bottom"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        color="primary"
        icon="add"
        @click="$root.$emit('showAddTask')"
      />
    </q-page-sticky>
    <q-dialog
      v-model="showAddTask"
      persistent
    >
      <add-task @close="showAddTask = false"></add-task>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'PageTodo',
  components: {
    AddTask: () => import('components/tasks/modals/AddTask'),
    TasksTodo: () => import('components/tasks/TasksTodo'),
    TasksCompleted: () => import('components/tasks/TasksCompleted'),
    TasksNo: () => import('components/tasks/TasksNo'),
    'search-sort': () => import('components/base/TwSearchSort')
  },
  data () {
    return {
      showAddTask: false,
      options: [
        {
          label: this.$t('task.sortBy.name'),
          value: 'name'
        },
        {
          label: this.$t('task.sortBy.date'),
          value: 'dueDate'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('tasks', ['tasksTodo', 'tasksCompleted']),
    ...mapState('tasks', ['search', 'sort']),
    sortFields: {
      get () {
        return this.sort
      },
      set (value) {
        this.setSort(value)
      }
    },
    searchFields: {
      get () {
        return this.search
      },
      set (value) {
        this.setSearch(value)
      }
    },
    contentStyle () {
      return {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      }
    },

    contentActiveStyle () {
      return {
        backgroundColor: '#eee',
        color: 'black'
      }
    },

    thumbStyle () {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  methods: {
    ...mapMutations('tasks', ['setSort', 'setSearch'])
  },
  mounted () {
    this.$root.$on('showAddTask', () => {
      this.showAddTask = true
    })
  }
}
</script>

<style lang="scss" scoped>
.q-scroll-area-tasks {
  display: flex;
  flex-grow: 1;
}
</style>
