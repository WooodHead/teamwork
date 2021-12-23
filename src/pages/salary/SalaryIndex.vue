<!--
@Name：新增工资头部面包屑
@Author：陆欢
@date：2021/05/24
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'SalaryIndex',
  created () {
    // 添加主页面包屑
    const breads = [
      {
        id: 'salaryHome',
        title: this.$t('salary.title'),
        to: { name: 'salaryHome' },
        level: 'home'
      }
    ]
    this.clearBreadcrumbs()
    this.setModuleBreadcrumbs(breads)
  },
  methods: {
    ...mapMutations('breadcrumbs', ['clearBreadcrumbs', 'setModuleBreadcrumbs'])
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>
<style lang="scss" scoped>
/deep/.widget-header-bread {
  max-width: 1250px !important;
}
</style>
