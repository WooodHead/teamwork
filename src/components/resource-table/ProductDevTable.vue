<template>
  <q-table
    :title="title"
    flat
    bordered
    wrap-cells
    :hide-bottom="hideBottom"
    :data="modelList"
    :columns="columns"
    :row-key="rowKey"
    :pagination.sync="pagination"
    separator="cell"
    class="full-width"
    @row-click="rowClick"
    @request="onRequest"
    binary-state-sort
  >
    <template v-slot:body-cell-num="props">
      <q-td :props="props">
        <span :title="props.row.type">{{props.value}}</span>
      </q-td>
    </template>

    <template v-slot:body-cell-leaderID="props">
      <q-td :props="props">
        <tw-avatar
          size="md"
          :id="props.value"
        />
        {{selectPersons[props.value]&&selectPersons[props.value].name}}
      </q-td>
    </template>

    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <tw-status-badge
          :value="props.value"
          :endDate="props.row.predictEndDate"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapMutations } from 'vuex'
import { statusFilter } from '@/utils/status-filter'
export default {
  name: 'ProductDevTable',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwStatusBadge: () => import('components/base/TwStatusBadge')
  },
  props: {
    modelList: { type: Array, default: () => [] },
    hideBottom: { type: Boolean, default: true },
    perPageOptions: { type: Array, default: () => [0] },
    title: { type: String, required: false, default: null }
  },
  data () {
    return {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      rowKey: 'id',
      columns: [
        { name: 'num', label: '编号', field: 'productDevNum', align: 'left', sortable: true, sort: (a, b) => this.projNumSort(a, b) },
        { name: 'title', label: '名称', field: 'title', align: 'left', sortable: true, sort: (a, b) => this.textSort(a, b) },
        { name: 'organizeID', label: '机构', field: 'organizeID', align: 'left', format: (val, row) => this.selectOrganizes[val] && this.selectOrganizes[val].shortName },
        { name: 'leaderID', label: '负责人', field: 'leaderID', align: 'left', sortable: true, sort: (a, b) => this.personSort(a, b) },
        { name: 'status', label: '状态', field: 'status', align: 'left', sortable: true, sort: (a, b, rowA, rowB) => this.statusSort(a, b, rowA, rowB) },
        { name: 'beginDate', label: '开始日期', field: 'beginDate', align: 'left', sortable: true, format: (val, row) => date.formatDate(val, 'YYYY-MM-DD') },
        { name: 'predictEndDate', label: '预计结束日期', field: 'predictEndDate', align: 'left', sortable: true, format: (val, row) => date.formatDate(val, 'YYYY-MM-DD') }
      ],
      sortedStatus: ['wait', 'doing', 'putoff', 'suspended', 'done'],
      fieldContrast: {
        num: 'ProductDevNum',
        title: 'CONVERT(Title USING GBK)',
        orgShortName: 'OrganizeID', // 随下拉框中机构排序规则
        leaderID: 'LeaderID',
        status: 'Status',
        beginDate: 'BeginDate',
        predictEndDate: 'PredictEndDate'
      }
    }
  },
  computed: {
    ...mapState('productDev', ['sort', 'order']),
    ...mapState('person', ['selectPersons']),
    ...mapState('organize', ['selectOrganizes'])
  },
  methods: {
    ...mapMutations('productDev', ['setSort', 'setOrder']),
    onRequest (props) {
      let sortName = props.pagination &&
        props.pagination.sortBy
      if (sortName) {
        this.pagination.descending = !this.pagination.descending
        let sortOrder = this.pagination.descending ? 'desc' : 'asc'
        this.pagination.sortBy = sortName
        this.setOrder(sortOrder)
        this.setSort(this.fieldContrast[sortName])
      }
    },
    rowClick (evt, row, index) {
      this.$router.push({
        name: 'productDevDetail',
        params: { id: row[this.rowKey] }
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
    },
    statusSort (a, b, rowA, rowB) {
      // 区别进行中的延期
      let aStatusIndex = _.indexOf(this.sortedStatus, statusFilter(a, rowA.predictEndDate))
      let bStatusIndex = _.indexOf(this.sortedStatus, statusFilter(b, rowB.predictEndDate))
      // 如果同是同状态，使用开始时间排序
      if (aStatusIndex === bStatusIndex) {
        return new Date(rowA.beginDate) - new Date(rowB.beginDate)
      } else {
        return aStatusIndex - bStatusIndex
      }
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-table th {
  font-weight: 600;
}
</style>
