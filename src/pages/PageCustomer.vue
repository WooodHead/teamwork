<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="$t('customer.module')"
        :actions="fromRelated?['add']:['add','select','menu']"
        :add="{label:$t('customer.add'),click:toCustomerAdd}"
        :select="sort"
        :selectOptions="sortOptions"
        @update:select="sortUpdate"
      >
        <template #menu>
          <resource-list-style category="customer" />
        </template>
      </tw-header-card>
      <!--客户列表-->
      <resource-grid
        v-if="relatedIds !== null"
        category='customer'
        :fromRelated="fromRelated"
        :class="listStyle==='showtable'?'q-px-lg':($q.screen.gt.xs?'q-px-xl':'q-px-md')"
        :relatedIds="relatedIds"
        :key="$route.name+relatedIds.join('')"
        :selectCondition="currentListPageParams.selectCondition"
        ref="resourceGrid"
      />
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { format } from 'quasar'
import { mapMutations, mapState, mapGetters } from 'vuex'
const { capitalize } = format
export default {
  name: 'PageCustomer',
  props: {
    category: { type: String, default: '' },
    objectID: [String, Number]
  },
  data () {
    return {
      showCustomerEdit: false,
      fromRelated: false,
      relatedIds: null
    }
  },
  computed: {
    ...mapState('customer', ['sort', 'sortOptions', 'archivedCount', 'listStyle']),
    ...mapGetters('customer', ['currentListPageParams']),
    search: {
      get () {
        return this.$store.getters['customer/search']
      },
      set (val) {
        val
          ? this.$store.commit('customer/setSearch', val)
          : this.$store.commit('customer/setSearch', '')
      }
    }
  },
  watch: {
    sort () {
      this.emptyCustomers()
      this.updatePage({
        offset: 0,
        limit: 10,
        nextPageToken: 0
      })
      setTimeout(() => {
        this.$refs.resourceGrid.$refs.infiniteScroll.resume()
      }, 100)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations('customer', ['setSort', 'emptyCustomers', 'updatePage', 'setListStyle']),
    init () {
      let that = this
      this.search = ''
      if (this.category !== '') {
        this.fromRelated = true
        this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, +this.objectID).then(m => {
          that.relatedIds = m.members
        })
      } else {
        this.fromRelated = false
        that.relatedIds = []
      }
    },
    toCustomerAdd () {
      this.$router.push({
        name: 'customerEdit',
        params: { id: 0, openType: 'add' }
      })
    },
    // 排序
    sortUpdate (value) {
      this.setSort(value)
    }
  },
  components: {
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style lang="scss" scoped>
  .my-status-card {
    min-width: 9vw;
  }
</style>
