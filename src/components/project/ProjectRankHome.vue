<template>
  <component :is="$q.platform.is.mobile ? 'ProjectRankMobile' : 'ProjectRank'"></component>
</template>
<script>

export default {
  name: 'ProjectRankHome',
  components: {
    ProjectRankMobile: () => import('components/project/ProjectRankMobile'),
    ProjectRank: () => import('components/project/ProjectRank')
  }
}
</script>

<style lang="scss">
</style>
