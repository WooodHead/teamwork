<!--
@Name：组件
@Author：陆欢
@date：2021/08/05
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-page>
    <left-right-card-layout v-if="!$q.platform.is.mobile">
      <template #left>
        <component :is="`${upperFirst(category)}Menu`" />
      </template>
      <template #right>
        <tw-breadcrumbs :class="{'bread-width-with-table':withTable}"></tw-breadcrumbs>
        <router-view />
      </template>
    </left-right-card-layout>
    <router-view v-else />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ResourceIndexWithMenu',
  props: {
    category: {
      type: String,
      required: true
    }
  },
  created () {
    this.setModuleBreadcrumbs()
  },
  watch: {
    $route () {
      this.setModuleBreadcrumbs()
    }
  },
  computed: {
    withTable () {
      // 表格视图，返回true
      if (this.$route.name === 'resourceRelation') {
        return this.$store.state[this.$route.params.relates].listStyle === 'showtable'
      } else {
        const regExp = new RegExp('^((\\D*)Home)|(archived(\\D*)s)$')
        if (regExp.test(this.$route.name)) {
          let category = this.$route.path.split('/')[1]
          return this.$store.state[category].listStyle === 'showtable'
        }
        return false
      }
    }
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    upperFirst: _.upperFirst
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    ProjectMenu: () => import('components/project/ProjectMenu'),
    LeftRightCardLayout: () => import('layouts/LeftRightCardLayout')
  }
}
</script>

<style>
</style>
