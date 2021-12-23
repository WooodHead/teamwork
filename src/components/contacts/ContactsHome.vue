<template>
  <component :is="$q.platform.is.mobile ? 'ContactsMobile' : 'ContactsDesktop'"></component>
</template>
<script>

export default {
  name: 'ContactsHome',
  components: {
    ContactsDesktop: () => import('components/contacts/ContactsDesktop'),
    ContactsMobile: () => import('components/contacts/ContactsMobile')
  }
}
</script>

<style lang="scss">
</style>
