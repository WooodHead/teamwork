<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 页面header -->
    <tw-header-card
      :title="headerTitle"
      :actions="actions"
    >
    </tw-header-card>
    <!-- 归档任务 -->
    <q-card-section class="q-px-xxl">
      <div v-if="archivedTasks.length">
        <div
          v-for="task in archivedTasks"
          :key="task.id"
          @click.capture.stop="toPageTaskDetail(+task.id)"
        >
          <task-item :task="task" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
/**
 * 一个清单（分组）内的归档任务
 */
export default {
  name: 'ArchivedTasks',
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
      required: 0
    },
    // 任务清单ID（归档任务指一个清单内的归档）
    id: {
      type: [Number, String],
      default: 0,
      required: true
    }
  },
  components: {
    TaskItem: () => import('components/task/TaskItem'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  data () {
    return {
      actions: ['search']
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    ...mapState('task', ['tasks', 'search']),
    ...mapGetters('task', ['archivedTasksInList', 'archivedTasksInGroup']),
    task () {
      return this.tasks.find(t => t.id === +this.id) || {}
    },
    archivedTasks () {
      let archivedTasks = []
      if (this.task.type && this.task.type === 'list') {
        archivedTasks = this.archivedTasksInList(+this.id)
      } else if (this.task.type && this.task.type === 'group') {
        archivedTasks = this.archivedTasksInGroup(+this.id)
      }
      return this.search ? archivedTasks.filter(t => {
        t.name.toLowerCase().includes(this.search.toLowerCase())
        t.tags.includes(this.search)
      }) : archivedTasks
    },
    headerTitle () {
      let items = this.archivedTasks.filter(r => r.type === 'item')
      let groups = this.archivedTasks.filter(r => r.type === 'group')
      let res = ''
      if (items.length && groups.length) {
        res = this.$t('archive.someArchived', { count: items.length, something: this.$t('task.item.title') }) + '和' +
          this.$t('archive.someArchived', { count: groups.length, something: this.$t('task.group.title') })
      } else if (items.length) {
        res = this.$t('archive.someArchived', { count: items.length, something: this.$t('task.item.title') })
      } else if (groups.length) {
        res = this.$t('archive.someArchived', { count: groups.length, something: this.$t('task.group.title') })
      }
      return res
    }
  },
  methods: {
    ...mapActions('task', ['loadTreeTasks', 'loadArchivedTasks']),
    ...mapMutations('task', ['setSearch']),
    // 跳转任务详情页
    toPageTaskDetail (id) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +id
        }
      })
    },
    // 搜索
    searchUpdate (value) {
      this.setSearch(value)
    }
  },
  mounted () {
    this.loadTreeTasks(+this.id)
    this.loadArchivedTasks({
      objectType: this.category,
      objectID: +this.objectID,
      id: +this.id
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
