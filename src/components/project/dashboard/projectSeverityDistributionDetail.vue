<!--
@Name：严重缺陷统计图详细信息
@Author：陆欢
@date：2021/09/23
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card :title="title" />
    <q-card-section
      v-for="task in serverityTasks"
      :key="task.id"
      class="q-pt-md row q-gutter-md q-px-xl"
    >
      <div avatar>
        <tw-avatar
          size="lg"
          :id="task.createByID"
        >
          <template>
            <q-badge
              floating
              color="primary"
            >
              <q-icon
                name="done"
                color="white"
              />
            </q-badge>
          </template>
        </tw-avatar>
      </div>
      <div class="col">
        <q-item-label
          caption
          lines="0"
        >{{timeAgo({ dateTime: task.modifyTime||task.createTime })}}
        </q-item-label>
        <q-item-label lines="5">
          <task-result :task="task" />
        </q-item-label>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import timeAgo from '@/utils/time-ago'
export default {
  name: 'projectSeverityDistributionDetail',
  props: {
    id: {
      type: [String, Number],
      required: true,
      description: '资源id,即查找哪个项目下面的有缺陷的任务列表'
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$store.dispatch('project/loadProject', +this.id)
    this.$store.dispatch('task/loadDashboardtProjectSeriousTasks', +this.id)
  },
  computed: {
    ...mapState('task', ['dashboardtProjectSeriousTasks']),
    ...mapGetters('project', ['project']),
    serverityTasks () {
      return _.filter(this.dashboardtProjectSeriousTasks, { objectId: +this.id })
    },
    title () {
      return `【${this.project(this.id).title}】严重缺陷解决情况`
    }
  },
  methods: {
    timeAgo
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar'),
    'task-result': () => import('components/search/TaskResult'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
  .q-badge {
    padding: 4px;
    border-radius: 50%;
  }
</style>
