<template>
  <q-layout view="hHh lpR fFf">
    <q-footer
      v-show="footerVisible"
      bordered
      class="ground-glass main-layout"
      :class="layoutTextColor"
    >
      <q-tabs
        v-model="currentActivateTab"
        dense
        align="justify"
        active-color="blue-8"
        indicator-color="transparent"
      >
        <q-tab
          v-for="nav in navs"
          :key="nav.name"
          :name="nav.name"
          :icon="nav.icon"
          :label="nav.label"
          :alert="nav.alert"
          @click.stop="singleClick(nav)"
        />
      </q-tabs>
    </q-footer>
    <q-page-container class="bg-grey-1">
      <!-- q-tab-panels必须给上高度，否则使用的q-infinite-scoll将会无限滚动 -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        </router-view>
      </keep-alive>
      <router-view v-if=" !$route.meta.keepAlive" />
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import init from '@/utils/init'
export default {
  name: 'MainLayoutMobile',
  inject: ['layoutTextColor'],
  created () {
    init.call(this)
    this.loadCategorys()
  },
  data () {
    return {
      activeNav: ''// 此参数无用，为了计算属性响应式
    }
  },
  mounted () {
    this.loadMyOneUnread()
  },
  methods: {
    ...mapActions('message', ['loadMyOneUnread']),
    ...mapMutations('layout', ['setNavs', 'setLastActivateTab']),
    ...mapActions('resource', ['loadCategorys']),
    singleClick (nav) {
      this.$nextTick(() => {
        let lastNavs = this.$q.localStorage.getItem('navLastRoute')
        if (_.has(lastNavs, nav.name) && this.lastActivateTab !== this.currentActivateTab) {
          this.$router.push({ name: lastNavs[nav.name].name, params: lastNavs[nav.name].params })
        } else {
          this.$router.push(nav.to)
        }
        this.setLastActivateTab(nav.name)
      })
    }
  },
  watch: {
    unRead (newVal, oldVal) {
      let navsList = _.cloneDeep(this.navs)
      if (newVal) {
        navsList['message'].alert = 'red'
      } else {
        navsList['message'].alert = false
      }
      this.setNavs(navsList)
    }
  },
  computed: {
    ...mapState('layout', ['footerVisible', 'navs', 'lastActivateTab']),
    ...mapGetters('message', ['unRead']),
    currentActivateTab: {
      get () {
        return this.activeNav || this.$q.localStorage.getItem('nowActivateTab') || 'home'
      },
      set (val) {
        // 修改旧的location
        let x = window.pageXOffset
        let y = window.pageYOffset
        let lastNavs = this.$q.localStorage.getItem('navLastRoute')
        let oldNav = this.$q.localStorage.getItem('nowActivateTab') || 'home'
        if (oldNav && _.has(lastNavs, oldNav)) {
          let oldNavObj = lastNavs[oldNav]
          oldNavObj.location = { x, y }
          lastNavs[oldNav] = oldNavObj
          this.$q.localStorage.set('navLastRoute', lastNavs)
        }
        this.setLastActivateTab(this.$q.localStorage.getItem('nowActivateTab'))
        this.$q.localStorage.set('nowActivateTab', val)
        this.activeNav = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
