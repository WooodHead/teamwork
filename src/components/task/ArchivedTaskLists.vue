<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 页面Header -->
    <tw-header-card :title="$t('archive.someArchived',
    {count:archivedList.length,something:$t('task.list.title')})">
    </tw-header-card>

    <q-card-section class="q-px-xxl">
      <!-- 归档任务清单Intro -->
      <div
        v-if="archivedList.length>0"
        class="row justify-center q-gutter-md"
      >
        <q-card
          v-for="task in archivedList"
          :key="task.id"
          class="whole-card archived cursor-pointer"
          @click.capture.stop="ToTaskListDetail(task.id)"
        >
          <q-card-section>
            <task-intro :param="{
                     id: +task.id,
                     category: category,
                     objectID: +objectID
                    }" />
          </q-card-section>
        </q-card>
      </div>
      <!-- 归档任务清单为空时的提醒 -->
      <tw-banner-no-result v-else />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ArchivedTaskLists',
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
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TaskIntro: () => import('components/task/TaskIntro'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  computed: {
    ...mapGetters('task', ['archivedTaskLists']),
    ...mapState('task', ['search']),
    archivedList () {
      return this.archivedTaskLists({
        objectType: this.category,
        objectID: +this.objectID
      })
    }
  },
  methods: {
    ...mapActions('task', ['loadArchivedTasks']),
    ...mapMutations('task', ['setSearch']),
    // 任务清单详情页
    ToTaskListDetail (id) {
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
    // 加载所有任务清单
    this.loadArchivedTasks({
      objectID: +this.objectID,
      objectType: this.category
    })
  }
}
</script>

<style lang="scss" scoped>
.widget-card,
.torn-card {
  width: 10.7rem !important;
  height: calc(10.7rem * 1.33) !important;
}
.widget-card:before {
  content: none !important;
}
.widget-card-section {
  height: calc(10rem * 1.33);
  overflow: hidden;
}
</style>
