<!--
@Name：导出PDF头部的任务表格信息
@Author：陆欢
@date：2021/02/19
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-table
    wrap-cells
    bordered
    hide-bottom
    row-key="id"
    :data="taskItemList"
    :columns="columns"
    separator="cell"
    class="q-mb-md my-sticky-header-table"
    flat
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          key="order"
          :props="props"
        >
          {{ props.row.order }}
        </q-td>
        <q-td
          key="startTime"
          :props="props"
        >
          {{formatStartDate(props.row.startTime)}}
        </q-td>
        <q-td
          key="name"
          :props="props"
        >
          {{ props.row.name }}
        </q-td>
        <q-td
          key="assignedTo"
          :props="props"
        >
          <span>
            {{assignPersonName(props.row.assignedTo)}}
          </span>
        </q-td>
        <q-td
          key="finished"
          :props="props"
          v-if="props.row.finished"
        >
          √
        </q-td>
        <q-td
          v-else
          key="finished"
          :props="props"
          class="text-green"
        >
          进行中
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapState } from 'vuex'
import { date } from 'quasar'
export default {
  name: 'TaskTable',
  props: {
    taskItemList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      columns: [
        {
          name: 'order',
          label: '序号',
          align: 'center',
          style: 'width: 6%'
        },
        {
          name: 'startTime',
          label: '开始日期',
          align: 'center',
          style: 'width: 15%'
        },
        {
          name: 'name',
          label: '任务标题',
          align: 'left',
          style: 'width: 55%'
        },
        {
          name: 'assignedTo',
          label: '负责人',
          align: 'left',
          style: 'width: 15%'
        },
        {
          name: 'finished',
          label: '状态',
          align: 'left',
          style: 'width: 9%'
        }]
    }
  },
  computed: {
    ...mapState('person', ['selectPersons'])
  },
  mounted () {
    this.adjustHeight(true)
  },
  watch: {
    taskItemList (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.adjustHeight(true)
      })
    }
  },
  methods: {
    adjustHeight (firstTime) {
      firstTime && (document.getElementsByClassName('q-table')[0].className = 'q-table my-table')
      let height = document.getElementsByClassName('q-table__middle') &&
        document.getElementsByClassName('q-table__middle')[0].offsetHeight
      if (height && height > 950 && height < 1085) {
        document.getElementsByClassName('q-table')[0].className = 'q-table'
        this.upBodyHeight()
      }
    },
    upBodyHeight () {
      let height = document.getElementsByClassName('q-table__middle') &&
        document.getElementsByClassName('q-table__middle')[0].offsetHeight
      // 矫正行高度
      var thHeight = document.querySelectorAll('.q-table tbody td')[0].offsetHeight

      let length = document.querySelectorAll('.q-table tbody tr').length
      if (height && height > 950 && height < 1085) {
        for (let i = 0; i < length; i++) {
          document.querySelectorAll('.q-table tbody tr')[i].style.height = `${thHeight + 1}px`
        }
        this.upBodyHeight()
      }
    },
    assignPersonName (assignedTo) {
      if (!assignedTo.length) {
        return ''
      }
      let assignToName = []
      _(assignedTo).forEach(id => {
        this.selectPersons[id] && assignToName.push(this.selectPersons[id].name)
      })
      return _.join(assignToName, ',')
    },
    formatStartDate (startDate) {
      if (startDate === '1000-01-01 00:00:00' || startDate === '') {
        return ''
      } else {
        return date.formatDate(startDate, 'YYYY/MM/DD')
      }
    }
  }
}
</script>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #1976d2;
    color: #fff
</style>
<style scoped lang='scss'>
  /deep/ .q-table th,
  .q-table td {
    padding: 2px;
  }
  /deep/.my-table.q-table thead tr,
  .my-table.q-table tbody td {
    height: 32px;
  }
</style>
