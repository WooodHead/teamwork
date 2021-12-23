<template>
  <task-only-show
    :tasks="tasks"
    :category="tasks[0].objectType"
    :objectID="tasks[0].objectId"
    class="q-pt-xl"
  />
</template>

<script>
import Task from '@/store/task/model'
import { mapMutations } from 'vuex'
import Person from '@/store/person/model'
export default {
  name: 'PublicTask',
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  mounted () {
    var publicPersons = Person.from(this.publicContent.persons)
    this.setPublicPersons(publicPersons)
  },
  computed: {
    tasks () {
      return Task.from(this.publicContent.tasks)
    }
  },
  methods: {
    ...mapMutations('task', ['setPublicPersons'])
  },
  components: {
    TaskOnlyShow: () => import('components/task/TaskOnlyShow')
  }
}
</script>

<style lang="scss" scoped>
  .task-public {
    color: #283c46;
    font-size: 16px;
  }
  .title-page {
    font-size: 28px;
    font-weight: 700;
  }
</style>
