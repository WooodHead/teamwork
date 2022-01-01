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
    binary-state-sort
  >
    <template v-slot:body-cell-leaderID="props">
      <q-td
        :props="props"
        style="width:8%"
      >
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
  name: 'TeamTable',
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
          { name: 'type', label: '类型', field: 'type', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
          { name: 'organizeID', label: '机构', field: 'organizeID', align: 'left', sortable: true, format: (val, row) => this.selectOrganizes[val] && this.selectOrganizes[val].shortName },
          { name: 'leaderID', label: '负责人', field: 'leaderID', align: 'left' },
          { name: 'members', label: '成员', field: 'members', align: 'left', format: (val, row) => _.join(_.map(val, v => { return this.selectPersons[v] && this.selectPersons[v].name }), ',') }
        ]
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('organize', ['selectOrganizes'])
  },
  methods: {
    rowClick (evt, row, index) {
      this.$router.push({
        name: 'teamDetail',
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
