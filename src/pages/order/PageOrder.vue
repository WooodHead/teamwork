<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="listPageType.title"
        :actions="actions"
        :select.sync="newSort"
        :selectOptions="sortOptions"
        :add="{label:$t('order.add'),click:()=>$router.push({ name: 'orderEdit', params: { id: 0, openType: 'add' } })}"
      >
        <template #menu>
          <tw-menu
            :menus="menus"
            @showcards="setListStyle('showcards')"
            @showlist="setListStyle('showlist')"
            @showtable="setListStyle('showtable')"
            @exportExcel="()=>{exportExcel=true}"
          />
        </template>
      </tw-header-card>
      <!-- 订单列表，key用来刷新order-grid -->
      <q-card-section class="q-pa-none q-pb-md">
        <order-grid
          :class="listStyle==='showtable'?'q-px-lg':($q.screen.gt.xs?'q-px-xl':'q-px-md')"
          :selectKey="listPageType.key"
          :condition="listPageType.selectCondition"
        />
      </q-card-section>
      <!-- 归档说明区 -->
      <q-card-section v-if="archivedCount>0">
        <tw-archived-count
          :label="$t('archive.someArchived',{count:archivedCount,something:$t('order.title')})"
          @click="$router.push({name: 'archivedOrders'})"
        />
      </q-card-section>
      <!-- 导出列表区 -->
      <q-dialog v-model="exportExcel">
        <order-data-export />
      </q-dialog>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PageOrder',
  props: {
    category: { type: String, default: '' },
    objectID: [String, Number]
  },
  data () {
    return {
      menus: ['showcards', 'showlist', 'showtable', { group: ['exportExcel'] }],
      exportExcel: false,
      actions: ['select', 'add', 'menu']
    }
  },
  computed: {
    ...mapGetters('order', ['sort', 'sortOptions', 'listStyle', 'listPageType', 'archivedCount']),
    newSort: {
      get () {
        return this.sort
      },
      set (newVal) {
        this.setSort(newVal)
      }
    },
    search: {
      get () {
        return this.$store.getters['order/search']
      },
      set (val) {
        val
          ? this.$store.commit('order/setSearch', val)
          : this.$store.commit('order/setSearch', '')
      }
    }
  },
  mounted () {
    // 客户运维人员、系统管理员、高级管理员默认显示全部列表
    if (this.$myinfo.auth.role.isCustomerOperator || this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
      this.setListPageType('allList')
    }
  },
  methods: {
    ...mapMutations('order', ['setSort', 'setSearch', 'setListStyle', 'setListPageType'])
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    OrderGrid: () => import('components/order/OrderGrid'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwMenu: () => import('components/base/TwMenu'),
    OrderDataExport: () => import('components/order/OrderDataExport')
  }
}
</script>
<style scoped>
</style>
