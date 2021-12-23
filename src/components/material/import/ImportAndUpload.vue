<template>
  <div>
    <q-table
      class="my-sticky-virtscroll-table"
      title="确认导入数据"
      :data="importData"
      :columns="dataTable.columns"
      row-key="index"
      dense
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      style="height: 400px"
      :filter="filter"
    >
      <template v-slot:top-right>
        <tw-search-sort
          style="width: 400px;"
          :search.sync="filter"
        />
      </template>
      <template v-slot:body-cell-CheckResult="props">
        <q-td :props="props">
          <div>
            <q-badge
              :color="checkInfo[props.value].color"
              :label="checkInfo[props.value].text"
            />
          </div>
        </q-td>
      </template>
    </q-table>
    <div
      class="q-pt-md"
      align="center"
    >
      <q-btn
        size="md"
        style="background:#33ac37;color:white"
        label="导入并上传"
        @click.stop="importAndUpload"
      >
      </q-btn>
      <br>
      <q-btn
        flat
        color="primary"
        label="上一步"
        @click="$emit('back')"
      />
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-hourglass
        color="primary"
        size="4em"
      />
    </q-inner-loading>
  </div>
</template>

<script>
// import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import { mapActions, mapState } from 'vuex'
import Model from '@/store/material/model'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
export default ({
  name: 'ImportAndUpload',
  props: {
    modelList: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },
  data () {
    return {
      filter: '',
      loading: false,
      matDetailList: [],
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  created () {
    this.checkData()
  },
  computed: {
    ...mapState('material', ['dataTable', 'importData', 'checkInfo'])
  },
  mounted () {
    this.getAnalyzeImportData(this.matDetailList).then(res => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('material', ['getAnalyzeImportData', 'addBatchMat', 'uploadFile']),
    // 解析物料数据
    checkData () {
      this.loading = true
      let model = new Model.MatDetails()
      this.modelList.forEach(item => {
        let values = _.pickBy(item, (value, key) => { return value })
        let columnNames = _.values(values)
        if (columnNames.length > 5 && !isNaN(columnNames[0])) {
          model.OrderNo = columnNames[0]
          model.Code = columnNames[1]
          model.Version = columnNames[2]
          model.Graphics = columnNames[3]
          model.Name = columnNames[4]
          model.Materials = columnNames[5]
          model.Amount = columnNames[6]
          model.Notes = columnNames[7]
          this.matDetailList.push(_.clone(model))
        }
      })
    },
    importAndUpload () {
      if (this.importData.length <= 0) {
        showWarningMessage('无数据可导入！')
        return
      }
      // 导入之前，同步不存在的物料数据
      let noneList = _.filter(this.importData, item => item.CheckResult === 'none')
      if (noneList.length) {
        showConfirm('是否同步不存在数据？',
          () => {
            // 批量导入不存在的数据
            this.addBatchMat(noneList).then(res => {
              if (res) {
                showSuccessMessage('数据同步成功！')
                this.uploadFile()
              }
            })
          },
          () => {
            this.uploadFile()
          },
          '是',
          '否'
        )
      } else {
        this.uploadFile()
      }
    }
  },
  components: {
    TwSearchSort: () => import('components/base/TwSearchSort')
  }
})
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
