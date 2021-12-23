<template>
  <q-table
    hide-bottom
    wrap-cells
    :data="modelList"
    :columns="columns"
    :row-key="rowKey"
    :rows-per-page-options="[0]"
    separator="cell"
    class="full-width"
    @row-click="rowClick"
  >
    <template v-slot:body-cell-createBy="props">
      <q-td :props="props">
        <div v-for="(item, index) in modelList" :key="index">
          <div v-if="item.id === props.row.id">
            <tw-avatar :id="item.createByID" />
            {{ item.createBy }}
          </div>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'RecruitPlanTable',
  props: {
    modelList: { type: Array, default: () => [] }
  },
  data () {
    return {
      rowKey: 'name',
      columns: [
        { name: 'title', label: '招聘计划名称', field: 'title', align: 'left' },
        { name: 'createBy', label: '创建者', field: 'createBy', align: 'left' },
        {
          name: 'startDate',
          label: '开始日期',
          field: 'startDate',
          align: 'left'
        },
        {
          name: 'endDate',
          label: '预计结束日期',
          field: 'endDate',
          align: 'left'
        }
      ]
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  methods: {
    // 跳转详情页
    rowClick (evt, row, index) {
      this.$router.push({
        name: 'recruitPlanDetail',
        params: { id: +row.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-table th {
  font-weight: 600;
}
</style>
