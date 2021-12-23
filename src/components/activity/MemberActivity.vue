<!-- 成员增删的动态 AddMembers,DeleteMembers-->
<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span>
        {{activity.actor}}{{$t(`activity.member.${activity.description}`, {type: $t(`${activity.widget.type}.title`)})}}
      </span>
    </div>
    <!-- 成员列表 -->
    <div class="q-ml-sm text-weight-regular text-caption flex">
      <div
        v-for="person in activity.widget.detail"
        :key="person.PsonID"
      >
        <tw-avatar
          :id="person.PsonID"
          size="sm"
        />
        {{person.PsonName}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberActivity',
  props: {
    activity: {
      type: Object,
      required: true,
      description: 'AddMembers,DeleteMembers'
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang='scss' scoped>
</style>
