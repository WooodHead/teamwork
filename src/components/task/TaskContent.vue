<template>
  <!-- 未归档列表 -->
  <div v-if="unarchivedTaskLists.length">
    <!-- 任务清单 -->
    <draggable
      v-if="view==='list'"
      :class="{'q-pl-sm':$q.platform.is.mobile}"
      v-model="unarchivedTaskLists"
      v-bind="dragOptions"
      :disabled="$q.platform.is.mobile"
      @start="onDragStart"
      @change="dragSort"
    >
      <!-- 任务清单 -->
      <task-list
        v-for="task in unarchivedTaskLists"
        :key="task.id"
        :listOnly="tooManyLists"
        :id="+task.id"
      />
    </draggable>
    <div
      v-else
      class="row q-gutter-md flex-center"
    >
      <task-list-card
        v-for="task in unarchivedTaskLists"
        :key="task.id"
        :id="+task.id"
        :category="category"
        :objectID="+objectID"
      />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions, mapMutations, mapState } from 'vuex'
import { computedOrder } from '@/utils/computed-order'
export default {
  name: 'TaskContent',
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  components: {
    draggable,
    'task-list': () => import('components/task/TaskList'),
    'task-list-card': () => import('components/task/TaskListCard')
  },
  data () {
    return {
      showNotes: false,
      showNotesID: 0,
      showArchiveList: false,
      showArchiveCards: false,
      fromTask: {}
    }
  },
  computed: {
    ...mapState('task', ['search', 'view']),
    unarchivedTaskLists: {
      get () {
        let list = []
        if (this.category === 'organize') {
          list = this.$store.getters['task/unarchivedTaskLists']({
            objectID: +this.objectID,
            objectType: this.category
          })
        } else {
          const models = this.$store.getters['task/unarchivedTaskLists']({
            objectID: +this.objectID,
            objectType: this.category
          })
          list = models.filter(a => a.id !== 0)
        }
        return list
      },
      set (newValue) {
        let index = _.findIndex(newValue, value => value.id === this.fromTask.id)
        let prev = newValue[index - 1]
        let next = newValue[index + 1]
        let order1 = prev ? prev.orderNumber : 0
        let order2 = next ? next.orderNumber : 0
        let orderNumber = computedOrder(order1, order2)
        // 清单按照倒序排列，拖至第一条时设置 orderNumber 为最大值
        if (!prev) {
          orderNumber = computedOrder(order2, 0)
        }
        // 清单按照倒序排列，拖至最后一条时设置 orderNumber 为最小值
        if (!next) {
          orderNumber = computedOrder(0, order1)
        }
        newValue[index].orderNumber = orderNumber
        this.$store.commit('task/updateTask', newValue[index])
      }
    },
    tooManyLists () {
      return this.unarchivedTaskLists.length >= 10
    },
    filterType: {
      get () {
        return this.$store.state.task.filterType
      },
      set (value) {
        this.setFilterType(value)
      }
    },
    dragOptions () {
      return this.$store.state.task.dragOptions
    }
  },
  mounted () {
    this.loadTasksInHome({
      objectID: +this.objectID,
      objectType: this.category
    }).then(res => {
      this.setAddingEvent = !this.unarchivedTaskLists.length
    })
  },
  methods: {
    ...mapActions('task', ['loadTasksInHome', 'sortTask']),
    ...mapMutations('task', ['setAddingEvent']),
    onDragStart (event) {
      this.fromTask = event.item._underlying_vm_
    },
    dragSort (event) {
      let from = event.moved.element
      this.sortTask(from)
    }
  }
}
</script>

<style scoped>
</style>
