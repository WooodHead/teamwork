<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pa-none"
  >
    <q-card-section class="q-pa-lg text-right guide-header">
      <guide-add-header
        :guideModule="guideModule"
      ></guide-add-header>
    </q-card-section>
    <q-card-section class="q-px-xxl q-py-lg text-left">
      <task-content
        :category="$route.params.category"
        :objectID="+$route.params.objectID"
      ></task-content>
    </q-card-section>
  </q-card>
</template>

<script>
import { i18n } from '@/boot/i18n'
import Task from '@/store/task/model'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'TaskGuide',
  components: {
    TaskContent: () => import('components/task/TaskContent'),
    GuideAddHeader: () => import('components/guide/GuideAddHeader')
  },
  data () {
    return {
      model: new Task()
    }
  },
  computed: {
    ...mapState('guide', ['guideModule']),
    ...mapGetters('task', ['tasks'])
  },
  methods: {
    ...mapActions('task', ['addTask', 'updateTask', 'loadTaskLists'])
  },
  mounted () {
    this.loadTaskLists({
      objectID: +this.$route.params.objectID,
      objectType: this.$route.params.category
    }).then(res => {
      if (!res.length || !_.some(res, item => item.level < 2)) {
        Object.assign(this.model,
          {
            parentId: 0,
            objectType: this.$route.params.category,
            objectId: +this.$route.params.objectID,
            type: 'list',
            name: i18n.t('guide.task.newTaskName')
          })
        this.addTask(this.model)
      }
    })
  }
}
</script>

<style scoped lang="scss">
.guide-header {
  background-color: $friend;
}
</style>
