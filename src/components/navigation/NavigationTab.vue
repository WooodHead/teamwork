<template>

</template>

<script>
export default {
  name: 'NavigationTab',
  data () {
    return {
      navs: {
        home: {
          label: '工作台',
          name: 'home',
          icon: 'home',
          to: { name: 'home' }
        },
        message: {
          label: this.$i18n.t('message.module'),
          name: 'message',
          icon: 'notifications',
          to: { name: 'message' }
        },
        contacts: {
          label: this.$i18n.t('contacts.module'),
          name: 'contacts',
          icon: 'contacts', // app:tw-icon-
          to: { name: 'contactsHome' }
        },
        find: {
          label: '发现',
          name: 'find',
          icon: 'search',
          to: { name: 'search' }
        },
        me: {
          label: '我的',
          name: 'me',
          icon: 'person',
          to: { name: 'myProfile' }
        }
      }
    }
  }
}
</script>

<style>
</style>
