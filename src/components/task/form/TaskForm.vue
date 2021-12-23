<template>
  <div>
    <!-- 任务清单 -->
    <task-form-list
      v-if="type==='list'"
      :id="+task.id"
      :parentId="0"
      :action="action"
      @ok="onOk"
      @cancel="onCancel"
    ></task-form-list>
    <!-- 任务组 -->
    <task-form-group
      v-else-if="type==='group'"
      :id="+task.id"
      :parentId="+task.parentId"
      :action="action"
      @ok="onOk"
      @cancel="onCancel"
    ></task-form-group>
    <!-- 单个任务 -->
    <task-form-item
      v-else
      :id="+task.id"
      :category="task.objectType"
      :objectID="+task.objectId"
      :action="action"
      :orderNumber="task.orderNumber"
      :nextTaskOrderNumber="nextTaskOrderNumber"
      :rootId="+task.rootId"
      :parentId="+task.parentId"
      inset
      @ok="onOk"
      @cancel="onCancel"
    ></task-form-item>
  </div>
</template>

<script>
export default {
  name: 'TaskForm',
  props: {
    // 任务model
    task: {
      type: Object,
      required: true,
      default: null
    },
    // 排序字段
    nextTaskOrderNumber: {
      type: [String, Number],
      default: '',
      required: false
    },
    // 任务类型 如list group item
    type: {
      type: String,
      required: false,
      default: 'item'
    },
    // 操作类型，如add edit insert
    action: {
      type: String,
      required: false,
      default: 'add'
    }
  },
  components: {
    'task-form-list': () => import('components/task/form/TaskFormList'),
    'task-form-group': () => import('components/task/form/TaskFormGroup'),
    'task-form-item': () => import('components/task/form/TaskFormItem')
  },
  methods: {
    // 确认事件
    onOk () {
      window.RichTextEditting = false
      this.$emit('ok')
    },
    // 取消事件
    onCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style>
</style>
