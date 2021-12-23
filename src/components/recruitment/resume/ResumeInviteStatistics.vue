<!-- 简历邀约统计 -->
<template>
  <div class="col">
    <q-chip
      v-for="key in Object.keys(inviteStatistics)"
      :key="key"
      dense
      color="grey-3"
      text-color="grey-9"
      :removable="views.length>1"
      @remove="removeQuery(key)"
    >
      {{key}}（{{inviteStatistics[key].length}}）
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'ResumeInviteStatistics',
  props: {
    views: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    inviteStatistics () {
      if (_.isEmpty(this.views)) {
        return {}
      } else {
        let obj = {}
        this.views.map(view => {
          // 学校
          let key = _.last(_.sortBy(view.educations, 'startTime')).college
          if (!obj[key]) {
            obj[key] = []
          }
          obj[key].push(view.resumeDeliveryID)
        })
        return obj
      }
    }
  },
  methods: {
    removeQuery (city) {
      this.$emit('remove', city)
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
