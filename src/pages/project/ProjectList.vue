<template>
  <q-page>
    <project-list />
    <tw-page-scroller />
  </q-page>
</template>

<script>
export default {
  name: 'ProjectPageList',
  components: {
    TwPageScroller: () => import('components/base/TwPageScroller'),
    ProjectList: () => import('components/project/ProjectList')
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
</style>
