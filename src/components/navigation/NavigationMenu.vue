<template>
  <q-list class="q-pt-md">
    <template v-for="group in groupsOfMenu">
      <essential-link
        v-for="menu in menus.filter(
              menu => (menu.meta.group?menu.meta.group.index:0) === group.index && menu.name
            )"
        v-bind="menu"
        :key="menu.name"
      />
      <q-separator
        :key="group.label"
        v-if="group.index !== maxIndexGroup"
        class="q-my-md"
      />
    </template>
  </q-list>
</template>

<script>
import routes from '@/router/routes'
import { maxIndexGroup } from '@/router/group'

export default {
  name: 'NavigationMenu',
  components: {
    EssentialLink: () => import('./EssentialLink')
  },
  data () {
    const menus = this.getMenusData(routes),
      groupsOfMenu = this.getGroupsOfMenu(menus)
    return {
      menus,
      groupsOfMenu,
      maxIndexGroup
    }
  },
  methods: {
    getMenusData (routes) {
      const menus = []
      const roleMenus = this.$myinfo.auth.route.roleMenus || []
      // get all menus,and flat in array
      for (const route of routes.values()) {
        roleMenus.includes(route.name) && menus.push(route)
        route.children && menus.push(...this.getMenusData(route.children))
      }
      menus.sort((a, b) => a.meta.index - b.meta.index)
      return menus
    },
    getGroupsOfMenu (menus) {
      // get and sort all menu groups
      const groups = [...new Set(menus.map(menu => menu.meta.group))]
      groups.sort((a, b) => a.index - b.index)
      return groups
    }
  }
}
</script>

<style>
</style>
