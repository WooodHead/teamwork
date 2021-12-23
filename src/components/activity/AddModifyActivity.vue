<!-- 项目、产品、团队、订单、机构、生产单位、客户创建 -->
<template>
    <div class="flex">
      <span>
        {{activity.actor}}{{$t(`activity.addModify.${activity.description}`, {type: $t(`${activity.widget.type}.title`)})}}
      </span>
    </div>
</template>

<script>
export default {
  name: 'AddModifyActivity',
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
