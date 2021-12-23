<!-- 任务详情页头部：是否完成，标题，创建人等 -->
<template>
  <q-item class="items-start">
    <q-item-section
      side
      :style="checkStyle"
    >
      <!-- 已完成 -->
      <task-item-finish-check
        :model="task"
        :inDetail="inDetail"
        :inEdit="inEdit"
        class="self-end"
      />
    </q-item-section>
    <q-item-section>
      <div class="text-h5 text-weight-bold cursor-pointer">
        {{task.name}}
      </div>
      <!-- 插槽 -->
      <slot v-if="inDetail"></slot>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'TaskDetailItemHeader',
  props: {
    task: {
      type: Object,
      required: true
    },
    inDetail: {
      type: Boolean,
      required: false
    },
    inEdit: {
      type: Boolean,
      required: false
    },
    finish: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    checkStyle () {
      return this.$q.screen.lt.sm ? '' : (this.$q.lang.getLocale().includes('zh') ? 'width:7rem' : 'width:10rem')
    }
  },
  components: {
    TaskItemFinishCheck: () => import('components/task/TaskItemFinishCheck')
  }
}
</script>

<style lang="scss" scoped>
.title-area {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 11px;
    height: 11px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    min-height: 36px;
    border: 2px solid transparent;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    background-clip: padding-box;
    border-radius: 7px;
    background-color: #c4c4c4;
  }
}
</style>
