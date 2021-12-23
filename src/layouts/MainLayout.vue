<template>
  <component :is="$q.platform.is.mobile ? 'MainLayoutMobile' : 'MainLayoutDesktop'"></component>
</template>

<script>
export default {
  name: 'MainLayout',
  provide: function () {
    return {
      layoutTextColor: 'text-blue-grey-8'
    }
  },
  components: {
    MainLayoutDesktop: () => import('./MainLayoutDesktop'),
    MainLayoutMobile: () => import('./MainLayoutMobile')
  }
}
</script>

<style>
</style>
