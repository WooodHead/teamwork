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
  </q-table>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
export default {
  name: 'CustomerTable',
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
          { name: 'title', label: '名称', field: 'title', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'customerType', label: '客户类型', field: 'customerType', align: 'left', format: (val, row) => this.dictValue({ module: 'customer', field: 'customerType', dictKey: val }) },
          { name: 'grade', label: '客户等级', field: 'grade', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'applyIndustry', label: '行业', field: 'applyIndustry', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'infoSource', label: '来源', field: 'infoSource', align: 'left', sort: (a, b) => this.textSort(a, b) },
          { name: 'province', label: '省份', field: 'province', align: 'left' },
          { name: 'createTime', label: '创建时间', field: 'createTime', align: 'left', sortable: true, format: (val, row) => date.formatDate(val, 'YYYY-MM-DD') },
          { name: 'leaderID', label: '负责人', field: 'leaderID', align: 'left', sortable: true, sort: (a, b) => this.personSort(a, b) }
        ]
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('dictionary', ['dictionary']),
    dictValue () {
      return ({ module, field, dictKey }) => {
        let dict = this.dictionary[module] ? this.dictionary[module][field] : []
        return dict.find(ct => ct.dictKey === String(dictKey)) ? dict.find(ct => ct.dictKey === String(dictKey)).dictValue : '-'
      }
    }
  },
  methods: {
    rowClick (evt, row, index) {
      this.$router.push({
        name: 'customerDetail',
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
  },
  mounted () {
    this.$store.dispatch(`dictionary/loadDictionarys`, { Type: 'customer' })
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-table th {
  font-weight: 600;
}
</style>
