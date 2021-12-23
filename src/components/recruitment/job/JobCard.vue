<template>
  <q-card
    flat
    bordered
    class="cursor-pointer widget-card base-card"
    :class="{'archived':model.archived}"
    @click="openDetail"
  >
    <q-card-section class="widget-card-section base-card-section">
      <!-- 标题 -->
      <div
        :title="model.title"
        class="flex items-center ellipsis q-mb-sm"
      >
        <span class="text-h2-g text-text1 text-weight-bold">{{model.title}}</span>
        <q-space />
      </div>
      <div class="text-body-g text-text1">
        <div class="q-mb-xs">岗位类型：{{jobKind[model.kind].label}}</div>
        <div class="q-mb-xs">岗位类别：{{model.category}}</div>
      </div>
      <q-separator class="q-my-sm" />
      <!-- 工作地点 -->
      <div class="text-weight-bold q-mb-xs">工作地点：<span class="text-primary1">{{model.citys}}</span></div>
      <!--招聘人数-->
      <div class="text-weight-bold q-mb-xs">招聘人数：<span class="text-primary1">{{model.num}}</span></div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'JobCard',
  props: {
    model: { type: Object }
  },
  computed: {
    ...mapState('job', ['jobStatus', 'jobKind'])
  },
  methods: {
    // ...mapActions('job', ['archiveJob', 'unarchiveJob', 'startJob', 'doneJob']),
    htmlToText,
    openDetail () {
      let that = this
      that.$router.push({
        name: 'jobDetail',
        params: { id: +that.model.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-menu {
  width: 100px;
}
.q-badge {
  padding: 4px 6px;
}
</style>
