<!-- 跟进动态 -->
<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span class="q-mr-xs">
        {{title}}
      </span>
      <a
        class="text-primary"
        href="javascript:void(0);"
        @click="toDetail(activity)"
        v-html="activity.widget.title"
      > </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FollowupActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    title () {
      let types = { 'customer': '客户', 'opportunity': '商机', 'order': '订单' }
      return `${this.activity.actor}跟进了${types[this.activity.objectType]}` || ''
    }
  },
  methods: {
    toDetail (activity) {
      this.$router.push({
        name: 'followupDetail',
        params: {
          category: activity.objectType,
          objectID: +activity.objectId,
          id: +activity.widget.id
        }
      })
    }
  },
  mounted () {

  }
}

</script>

<style lang='scss' scoped>
</style>
