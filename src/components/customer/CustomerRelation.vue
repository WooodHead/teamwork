<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="listPageType.title||''"
      :actions="actions"
      :select.sync="newSort"
      :selectLabel="'排序'"
      :selectOptions="sortOptions"
      :add="{label:$t(`${relates}.add`),click:()=>$router.push({ name: `${relates}Edit`, params: { id: 0, openType: 'add' },query:{customerID:objectID} })}"
    >
      <template #menu>
        <tw-menu
          :menus="menus"
          @showcards="$store.commit(`${relates}/setListStyle`, 'showcards')"
          @showlist="$store.commit(`${relates}/setListStyle`, 'showlist')"
          @showtable="$store.commit(`${relates}/setListStyle`, 'showtable')"
          @exportExcel="()=>{exportExcel=true}"
        />
      </template>
    </tw-header-card>
    <!-- 订单列表，key用来刷新order-grid -->
    <opportunity-grid
      v-if="relates==='opportunity'"
      :class="['q-pt-md',$q.screen.gt.xs?'q-px-xl':'q-px-md']"
      :selectKey="listPageType.key"
      :condition="listPageType.selectCondition"
    />
    <order-grid
      v-if="relates==='order'"
      :class="['q-pt-md',$q.screen.gt.xs?'q-px-xl':'q-px-md']"
      :selectKey="listPageType.key"
      :condition="listPageType.selectCondition"
    />
    <!-- 导出列表区 -->
    <q-dialog v-model="exportExcel">
      <order-data-export v-if="relates==='order'" />
      <opportunity-data-export v-if="relates==='opportunity'" />
    </q-dialog>
  </q-card>
</template>
<script>
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'CustomerRelation',
  props: {
    category: { type: String, required: true },
    objectID: { type: [String, Number], required: true },
    relates: { type: String, required: true }
  },
  data () {
    return {
      menus: this.$q.platform.is.mobile
        ? [
          'showcards',
          'showlist'
        ]
        : (this.$myinfo.auth.role.isSalesExecutive || this.$myinfo.auth.role.isSalesPerson)
          ? [
            'showcards',
            'showlist',
            'showtable',
            { group: ['exportExcel'] }
          ]
          : [
            'showcards',
            'showlist',
            'showtable'
          ],
      exportExcel: false,
      actions: [
        'select',
        (this.$myinfo.auth.role.isSalesExecutive ||
          this.$myinfo.auth.role.isSalesPerson) &&
        'add',
        'menu'
      ]
    }
  },
  computed: {
    newSort: {
      get () {
        return this.$store.getters[`${this.relates}/sort`]
      },
      set (newVal) {
        this.$store.commit(`${this.relates}/setSort`, newVal)
      }
    },
    sortOptions: {
      get () {
        return this.$store.getters[`${this.relates}/sortOptions`]
      }
    },
    listStyle: {
      get () {
        return this.$store.getters[`${this.relates}/listStyle`]
      }
    },
    listPageType: {
      get () {
        let listPageType = _.cloneDeep(this.$store.getters[`${this.relates}/listPageType`])
        if (this.relates && +this.objectID) {
          let customer = this.$store.getters[`customer/customer`](+this.objectID)
          listPageType.key = 'customerList'
          listPageType.title = customer.title
          Object.assign(listPageType.selectCondition.query, [
            { Key: 'CustomerID', Value: +this.objectID, Oper: 'eq' }
          ])
        }
        if (listPageType.title) {
          listPageType.title = `[${listPageType.title}]${this.relates === 'order' ? '的订单' : this.relates === 'opportunity' ? '的商机' : ''}`
        }
        return listPageType
      }
    }
  },
  mounted () {
    this.relates && this.$store.dispatch(`customer/loadCustomer`, +this.objectID)
  },
  methods: {
    capitalize
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwMenu: () => import('components/base/TwMenu'),
    OpportunityGrid: () => import('components/opportunity/OpportunityGrid'),
    OpportunityDataExport: () => import('components/opportunity/OpportunityDataExport'),
    OrderGrid: () => import('components/order/OrderGrid'),
    OrderDataExport: () => import('components/order/OrderDataExport')
  }
}
</script>
<style scoped>
</style>
