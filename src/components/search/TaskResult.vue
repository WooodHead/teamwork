<!--
 * @Author: your name
 * @Date: 2020-09-16 09:01:01
 * @LastEditTime: 2020-09-23 08:41:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\search\TaskResult.vue
-->
<template>
  <div>
    <task-item
      :task="task"
      @click="toDetail(task)"
    />
  </div>
</template>

<script>

export default {
  props: {
    task: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  components: {
    'task-item': () => import('components/task/TaskItem')
  },
  methods: {
    toDetail (model) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          category: model.objectType,
          objectID: +model.objectId,
          id: +model.id
        }
      })
    }
  }

}
</script>

<style>
</style>
