<template>
  <q-table
    :title="title"
    flat
    bordered
    wrap-cells
    :hide-bottom="hideBottom"
    :data="modelList"
    :columns="categoryTable.columns"
    :row-key="categoryTable.rowKey"
    :rows-per-page-options="perPageOptions"
    separator="cell"
    class="full-width"
    @row-click="rowClick"
  >
    <template v-slot:body-cell-leaderID="props">
      <q-td :props="props">
        <tw-avatar
          size="md"
          :id="props.value"
        />
        {{selectPersons[props.value]&&selectPersons[props.value].name}}
      </q-td>
    </template>

    <template v-slot:body-cell-opportunityStatus="props">
      <q-td :props="props">
        <opportunity-status-badge
          :status="props.value"
          :isLost="props.row.isLost"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
export default {
  name: 'OpportunityTable',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    OpportunityStatusBadge: () => import('components/opportunity/OpportunityStatusBadge')
  },
  props: {
    modelList: { type: Array, default: () => [] },
    hideBottom: { type: Boolean, default: true },
    perPageOptions: { type: Array, default: () => [0] },
    title: { type: String, required: false, default: null }
  },
  data () {
    return {
      categoryTable: {
        rowKey: 'id',
        columns: [
          { name: 'title', label: '名称', field: 'title', align: 'left' },
          // { name: 'customerID', label: '客户', width: 0, field: 'customerID', align: 'left' },
          { name: 'customerName', label: '客户', field: 'customerName', align: 'left' },
          { name: 'leaderID', label: '客户经理', field: 'leaderID', align: 'left' },
          { name: 'processType', label: '加工类型', field: 'processType', align: 'left', format: (val, row) => val ? val.split(':')[1] : '' },
          { name: 'transactionPrice', label: '成交价', field: 'transactionPrice', align: 'left', format: (val, row) => val > 0 ? val : '' },
          // { name: 'organizeID', label: '所属部门', field: 'organizeID', align: 'left', format: (val, row) => this.selectOrganizes[val].name },
          { name: 'opportunityStatus', label: '状态', field: 'status', align: 'left' },
          { name: 'expectedDeliveryDate', label: '期望交付日期', field: 'expectedDeliveryDate', sortable: true, align: 'left', format: (val, row) => date.formatDate(val, 'YYYY-MM-DD') },
          { name: 'createTime', label: '创建时间', field: 'createTime', align: 'left', sortable: true, format: (val, row) => date.formatDate(val, 'YYYY-MM-DD') }
        ]
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons'])
  },
  methods: {
    rowClick (evt, row, index) {
      this.$router.push({
        name: 'opportunityDetail',
        params: { id: row[this.categoryTable.rowKey] }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-table th {
  font-weight: 600;
}
</style>
