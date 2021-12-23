<!--
 * @Author: your name
 * @Date: 2020-12-15 15:52:52
 * @LastEditTime: 2020-12-15 16:44:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\task\TasksWithTag.vue
-->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section class="q-pt-lg q-px-xxl">
      <div class="text-h5 text-center q-pt-lg">
        所有包含标签"{{tag}}"的任务
      </div>
    </q-card-section>
    <q-card-section class="q-px-xxl">
      <div>
        共有{{tasks.length}}个结果
      </div>
      <task-item
        class="text-body1"
        :class="item.archived?'text-grey':''"
        v-for="item in tasks"
        :task="item"
        :key="item.id"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TasksIncludesTag',
  props: {
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    // Tag
    tag: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      query: [
        [{ Key: 'ObjectID', Value: this.objectID, Oper: 'eq' },
          'and',
          { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
          'and',
          { Key: 'Tags', Value: this.tag, Oper: 'search' }
        ]
      ]
    }
  },
  components: {
    'task-item': () => import('components/task/TaskItem')
  },
  computed: {
    ...mapGetters('task', ['tasksIncludesTag']),
    tasks () {
      const list = this.tasksIncludesTag({
        objectType: this.category,
        objectID: +this.objectID,
        tag: this.tag
      })
      return _.orderBy(list, ['finished', 'archived'], ['asc', 'asc'])
    }
  },
  methods: {
    ...mapActions('task', ['loadTasks'])
  },
  mounted () {
    this.loadTasks({
      query: this.query
    })
  }

}
</script>

<style>
</style>
