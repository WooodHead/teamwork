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
    dense
    virtual-scroll
  >
    <template v-slot:body-cell-archived="props">
      <q-td :props="props">
        <q-btn
          v-if="canOp"
          class="gt-xs"
          size="12px"
          flat
          dense
          round
          :color="props.value?'blue-grey-5':'primary'"
          :icon="props.value?'unarchive':'archive'"
          @click.stop="archivedOrUnarchivedJob(props.row)"
        >{{props.value?$t('archive.unarchive'):$t('archive.archive')}}</q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-requirements="props">
      <q-td :props="props">
        <div
          class="wrapper"
          v-html="props.value"
        ></div>
      </q-td>
    </template>
    <template v-slot:body-cell-detailRequirements="props">
      <q-td :props="props">
        <div
          class="wrapper"
          v-html="props.value"
        ></div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
import { LocalStorage } from 'quasar'
export default {
  name: 'JobTable',
  props: {
    modelList: { type: Array, default: () => [] }
  },
  data: function () {
    let that = this
    return {
      rowKey: 'id',
      columns: [
        { name: 'title', label: '岗位名称', field: 'title', align: 'left' },
        { name: 'kind', label: '岗位类型', field: 'kind', align: 'left', format: (val, row) => that.$t(`job.kind${val}`) },
        { name: 'category', label: '岗位类别', field: 'category', align: 'left' },
        { name: 'major', label: '专业要求', field: 'major', align: 'left' },
        { name: 'educationDegree', label: '学历要求', field: 'educationDegree', align: 'left' },
        { name: 'workingYears', label: '工作年限', field: 'workingYears', align: 'left' },
        // { name: 'organizeNames', label: '所属机构', field: 'organizeNames', align: 'left', format: (val, row) => val && val.join('、') },
        { name: 'citys', label: '工作地点', field: 'citys', align: 'left' },
        { name: 'num', label: '招聘人数', field: 'num', align: 'left' },
        { name: 'requirements', label: '岗位要求', field: 'requirements', align: 'left' },
        { name: 'detailRequirements', label: '具体要求', field: 'detailRequirements', align: 'left' },
        { name: 'archived', label: '归/解档', field: 'archived', align: 'left' }
      ]
    }
  },
  methods: {
    ...mapActions('job', ['archiveJob', 'unarchiveJob']),
    htmlToText,
    rowClick (evt, row, index) {
      let that = this
      that.$router.push({
        name: 'jobDetail',
        params: { id: +row.id }
      })
    },
    // 归档或解档岗位
    archivedOrUnarchivedJob (model) {
      let that = this
      // 归档===>解档
      if (model.archived) {
        that.unarchiveJob(model.id).then(res => {
          if (res) {
            model = res
          }
        })
      } else {
        // 解档===>归档
        that.archiveJob(model.id).then(res => {
          if (res) {
            model = res
          }
        })
      }
    }
  },
  computed: {
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(_.find(LocalStorage.getItem('myself').roles, { code: 'HRSpecialist' }) || _.find(LocalStorage.getItem('myself').roles, { code: 'SystemAdministrator' }))
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  white-space: pre-wrap;
}
/deep/.q-table th {
  font-weight: 600;
}
</style>
