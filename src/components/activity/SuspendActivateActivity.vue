<!-- 项目、产品挂起激活 -->
<template>
  <div>
    <div class="flex">
      <span>
        {{activity.actor}}{{$t(`approval.${activity.description}`, {type: $t(`${activity.widget.type}.title`)})}}
      </span>
    </div>
    <div
      class="tiptap-content editor__content text-caption"
      v-html="activity.widget.detail"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'SuspendActivateActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
