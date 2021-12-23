<template>
  <q-table
    bordered
    hide-bottom
    :data="modelList"
    :columns="columns"
    :row-key="rowKey"
    separator="cell"
    :pagination.sync="pagination"
    @row-click="rowClick"
    @request="onRequest"
  >
  </q-table>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'ResumeDashboardDetailTable',
  props: {
    modelList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 14,
        rowsNumber: 10
      },
      rowKey: 'resumeDeliveryID',
      columns: [
        { name: 'interviewee', label: '姓名', align: 'left', field: 'interviewee' },
        { name: 'sex', align: 'left', label: '性别', field: 'sex' },
        { name: 'school', align: 'left', label: '学校', field: 'school' },
        { name: 'highestEducation', align: 'left', label: '学历', field: 'highestEducation' },
        { name: 'major', align: 'left', label: '专业', field: 'major' },
        { name: 'jobTitle', align: 'left', label: '投递岗位', field: 'jobTitle' },
        { name: 'city', align: 'left', label: '工作地', field: 'city' },
        { name: 'email', align: 'left', label: '邮箱', field: 'email' },
        { name: 'tel', align: 'left', label: '手机', field: 'tel' },
        { name: 'deliveryTime', align: 'left', label: '投递时间', field: 'deliveryTime' }
      ]
    }
  },
  methods: {
    ...mapMutations('resume', ['setDashboardDetailSort', 'setDashboardDetailOrder']),
    onRequest (props) {
      let sortName = props.pagination &&
        props.pagination.sortBy
      if (sortName) {
        this.pagination.descending = !this.pagination.descending
        let sortOrder = this.pagination.descending ? 'desc' : 'asc'
        this.pagination.sortBy = sortName
        this.setDashboardDetailSort(sortName)
        this.setDashboardDetailOrder(sortOrder)
      }
    },
    rowClick (evt, row, index) {
      this.$router.push({
        name: 'resumeDetail',
        params: {
          resumeDeliveryID: row[this.rowKey]
        }
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
