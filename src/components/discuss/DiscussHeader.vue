<template>
  <div
    class="row items-center"
    :class="textSize"
  >
    <q-avatar
      v-if="length"
      class="q-mr-sm"
      :size="avatarSize"
      color="primary"
      text-color="white"
    >{{length}}</q-avatar>
    <span v-if="length">条</span>
    <span>{{$t(`discuss.type.${type}`)}}</span>
    <q-separator class="col q-ml-sm" />
  </div>
</template>

<script>
export default {
  name: 'DiscussHeader',
  props: {
    length: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'discuss',
      description: '标题显示。比如：discuss、communication'
    }
  },
  data () {
    return {
      avatarSize: this.$q.platform.is.desktop ? 'xl' : 'md',
      textSize: this.$q.platform.is.desktop ? 'text-h5' : 'text-h6'
    }
  }
}
</script>

<style lang="scss" scoped>
.q-item__section--avatar {
  min-width: 40px;
  padding-right: 8px;
}
</style>
