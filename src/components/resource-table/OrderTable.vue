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

    <template v-slot:body-cell-orderStatus="props">
      <q-td :props="props">
        <q-badge
          :color="$store.getters['order/status'](props.value).color"
          align="top"
        >
          {{$store.getters['order/status'](props.value).title}}
        </q-badge>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
export default {
  name: 'OrderTable',
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
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
          { name: 'orderNo', label: '订单编号', field: 'orderNo', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b), style: 'font-weight:bold;' },
          { name: 'customerName', label: '客户名称', field: 'customerName', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'expectedDeliveryDate', label: '预计交期', field: 'expectedDeliveryDate', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'opportunityName', label: '商机', field: 'opportunityName', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'orderStatus', label: '订单状态', field: 'status', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'createTime', label: '创建时间', field: 'createTime', align: 'left', sortable: true, format: (val, row) => date.formatDate(val, 'YYYY-MM-DD') },
          { name: 'leaderID', label: '客户经理', field: 'leaderID', align: 'left', sortable: true, sort: (a, b) => this.personSort(a, b) }
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
        name: 'orderDetail',
        params: { id: row[this.categoryTable.rowKey] }
      })
    },
    textSort (a, b) {
      return a.localeCompare(b)
    },
    personSort (a, b) {
      // 人员id转换为人名再排序
      let aName = (this.selectPersons[a] && this.selectPersons[a].name) || ''
      let bName = (this.selectPersons[b] && this.selectPersons[b].name) || ''
      return aName.localeCompare(bName)
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-table th {
  font-weight: 600;
}
</style>
