<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <!-- 页面Header -->
    <tw-header-card :title="Object.keys(taskTags).length+'个标签'" />
    <q-card-section class="q-px-xxl">
      <q-list
        bordered
        separator
      >
        <q-item
          clickable
          v-ripple
          v-for="(count,tag) in taskTags"
          :key="tag"
          @click="taskTagDetail(tag)"
        >
          <q-item-section>
            <div>
              <tw-chip
                :color="color(tag)"
                :label="tag"
              />
            </div>
          </q-item-section>
          <q-item-section>{{count}}个任务</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

  </q-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { randomColor } from '@/utils/random-color'
export default {
  name: 'TaskTagCount',
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
    }
  },
  data () {
    return {
      taskTags: {}
    }
  },
  methods: {
    ...mapActions('task', ['loadTaskTags']),
    ...mapMutations('task', ['setSearch']),
    // 查看标签任务
    taskTagDetail (name) {
      this.$router.push({
        name: 'TasksIncludesTag',
        params: {
          category: this.category,
          objectID: +this.objectID,
          tag: name
        }
      })
    },
    // 标签随机色
    color (index) {
      return randomColor()
    }
  },
  mounted () {
    // 加载所有任务清单
    this.loadTaskTags({
      objectID: +this.objectID,
      objectType: this.category
    }).then((data) => {
      const tags = _.countBy(_.map(_.concat(..._.map(data, d => JSON.parse(d.Tags)))), t => t.trim())
      this.taskTags = tags
    })
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwChip: () => import('components/base/TwChip')
  }
}
</script>

<style lang="scss" scoped>
</style>
