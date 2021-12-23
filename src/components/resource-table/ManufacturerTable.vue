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
import { mapState } from 'vuex'
export default {
  name: 'ManufacturerTable',
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
          { name: 'title', label: '生产单位', field: 'title', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'classification', label: '类型', field: 'classify', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b), format: (val, row) => val === 'internal' ? '内控' : '外协' },
          { name: 'level', label: '等级', field: 'level', align: 'left', sortable: true, format: (val, row) => (val && val.includes(':')) ? val.split(':')[1] : val },
          { name: 'canControl', label: '生产可控', field: 'canControl', align: 'left', sortable: true, format: (val, row) => val ? '可控' : '不可控' },
          { name: 'leaderID', label: '负责人', field: 'leaderId', align: 'left', sortable: true, sort: (a, b) => this.personSort(a, b) }
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
        name: 'manufacturerDetail',
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
