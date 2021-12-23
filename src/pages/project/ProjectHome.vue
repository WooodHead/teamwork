<template>
  <q-page>
    <left-right-card-layout v-if="!$q.platform.is.mobile">
      <template #left>
        <project-menu />
      </template>
      <template #right>
        <router-view></router-view>
      </template>
    </left-right-card-layout>
    <project-menu v-else />
    <tw-page-scroller />
  </q-page>
</template>

<script>
export default {
  name: 'ProjectHome',
  components: {
    TwPageScroller: () => import('components/base/TwPageScroller'),
    ProjectMenu: () => import('components/project/ProjectMenu'),
    LeftRightCardLayout: () => import('layouts/LeftRightCardLayout')
  },
  methods: {
    addingEvent () {
      this.$router.push({
        name: 'projectAdd'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
