<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="listPageType.title"
        :actions="fromRelated?['add']:['add','select','menu']"
        :add="{label:$t('opportunity.add'),click:toOpportunityAdd}"
        :select.sync="newSort"
        :selectOptions="sortOptions"
        @update:select="sortUpdate"
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
      <!--商机列表-->
      <opportunity-grid
        :class="listStyle==='showtable'?'q-px-lg':($q.screen.gt.xs?'q-px-xl':'q-px-md')"
        :selectKey="listPageType.key"
        :condition="listPageType.selectCondition"
        ref="resourceGrid"
      />
      <!-- 归档说明区 -->
      <q-card-section v-if="archivedCount>0">
        <tw-archived-count
          :label="$t('archive.someArchived',{count:archivedCount,something:$t('opportunity.title')})"
          @click="$router.push({name: 'opportunitysArchived'})"
        />
      </q-card-section>
      <!-- 导出列表区 -->
      <q-dialog v-model="exportExcel">
        <opportunity-data-export />
      </q-dialog>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
export default {
  name: 'PageOpportunity',
  props: {
    category: { type: String, default: '' },
    objectID: [String, Number]
  },
  data () {
    return {
      menus: ['showcards', 'showlist', 'showtable', { group: ['exportExcel'] }],
      exportExcel: false,
      showOpportunityEdit: false,
      fromRelated: false,
      relatedIds: null
    }
  },
  computed: {
    ...mapState('opportunity', ['sort', 'sortOptions', 'archivedCount', 'listStyle']),
    ...mapGetters('opportunity', ['sortOptions', 'listStyle', 'listPageType', 'archivedCount', 'currentListPageParams']),
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
        return this.$store.getters['opportunity/search']
      },
      set (val) {
        val
          ? this.$store.commit('opportunity/setSearch', val)
          : this.$store.commit('opportunity/setSearch', '')
      }
    }
  },
  watch: {
    sort () {
      this.emptyOpportunitys()
      this.updatePage({
        offset: 0,
        limit: 10,
        nextPageToken: 0
      })
      let that = this
      setTimeout(() => {
        that.$refs.resourceGrid.$refs.qInfiniteScroll.resume()
      }, 100)
    }
  },
  mounted () {
    // 客户运维人员、系统管理员、高级管理员默认显示全部列表
    if (this.$myinfo.auth.role.isCustomerOperator || this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
      this.setListPageType('allList')
    }
  },
  methods: {
    ...mapMutations('opportunity', ['setSort', 'emptyOpportunitys', 'updatePage', 'setListStyle', 'setListPageType']),
    toOpportunityAdd () {
      this.$router.push({
        name: 'opportunityEdit',
        params: { id: 0, openType: 'add' }
      })
    },
    // 排序
    sortUpdate (value) {
      this.setSort(value)
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    OpportunityGrid: () => import('components/opportunity/OpportunityGrid'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwMenu: () => import('components/base/TwMenu'),
    OpportunityDataExport: () => import('components/opportunity/OpportunityDataExport')
  }
}
</script>

<style lang="scss" scoped>
  .my-status-card {
    min-width: 9vw;
  }
</style>
