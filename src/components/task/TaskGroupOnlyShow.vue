<template>
  <div>
    <div class="flex no-wrap col items-center">
      <!-- 任务名 -->
      <div
        class="title-group q-my-xs"
        :class="task.color"
      >{{task.name}}</div>
    </div>
    <!-- 描述 -->
    <div
      v-if="task.description"
      class="q-mb-sm"
    >
      {{task.description}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskGroupOnlyShow',
  props: {
    // 任务
    task: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.title-group {
  font-size: 16px;
  font-weight: 700;
  word-break: break-word;
}
</style>
