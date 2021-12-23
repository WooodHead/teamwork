<template>
  <div>
    <!-- list -->
    <q-item-label
      v-if="showCompletePercentage"
      style="font-size:14px;"
      class="q-mb-sm"
    >
      <span>任务完成率：{{task.overview.finishedAllCount}}/{{task.overview.allCount}}</span>
      <span
        v-if="task.overview.seriousCount"
        class="text-negative q-mx-md"
      >
        严重问题解决率：{{task.overview.finishedSeriousCount}}/{{task.overview.seriousCount}}
      </span>
      <span
        v-if="task.overview.difficultCount"
        class="text-deep-orange"
      >
        疑难任务解决率：{{task.overview.finishedDifficultCount}}/{{task.overview.difficultCount}}
      </span>
    </q-item-label>
    <div class="title-list q-mt-md q-mb-sm">
      {{task.name}}
    </div>
    <!-- 描述 -->
    <div
      v-if="task.description && task.type != 'item'"
      class="q-mb-sm tiptap-content editor__content"
      v-html="task.description"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskListOnlyShow',
  props: {
    // 任务
    task: {
      type: Object,
      required: true
    },
    showCompletePercentage: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-list {
    line-height: 1.2;
    font-size: 18px;
    font-weight: 700;
  }
</style>
