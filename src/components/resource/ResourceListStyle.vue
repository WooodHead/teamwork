<template>
  <div>
    <tw-menu
      :menus="filterMenus"
      @showcards="setListStyle('showcards')"
      @showlist="setListStyle('showlist')"
      @showtable="setListStyle('showtable')"
      @exportHour="$emit('exportHour')"
      @exportProjectHour="$emit('exportProjectHour')"
    />
  </div>
</template>

<script>
export default {
  name: 'ResourceListStyle',
  components: {
    TwMenu: () => import('components/base/TwMenu')
  },
  props: {
    category: { type: String, required: true, desc: 'category' },
    menus: { type: Array, default: () => ['showcards', 'showlist', 'showtable'], desc: 'style list, eg. ["showcards", "showlist", "showtable"]' }
  },
  computed: {
    filterMenus () {
      return this.$q.platform.is.mobile
        ? this.menus.filter(m => m !== 'showtable')
        : this.menus
    }
  },
  methods: {
    setListStyle (listStyle) {
      this.$store._mutations[`${this.category}/setListStyle`] &&
        this.$store.commit(`${this.category}/setListStyle`, listStyle, { root: true })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
