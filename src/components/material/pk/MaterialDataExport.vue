<!--商机\订单列表导出-->
<template>
  <q-card>
    <div>
      <q-card-section>
        <div class="text-h6">确认导出所有数据吗？</div>
      </q-card-section>
      <q-card-actions align="right">
        <!-- 取消按钮 -->
        <q-btn
          outline
          color="primary"
          type="reset"
          class="q-ml-sm"
          :label="$t('action.cancel')"
          v-close-popup
        />
        <q-btn
          color="primary"
          :label="$t('action.confirm')"
          class="text-bold"
          @click="exportMatPkExcel()"
          v-close-popup
        />
      </q-card-actions>
      <!-- 导出按钮 -->
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download
          ref="download"
          disable-wrapper-click
          :filename="$t('material.pkResult')"
          :options="{bookType:'xlsx'}"
        >
        </xlsx-download>
      </xlsx-workbook>
    </div>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from 'vue-xlsx'
export default {
  name: 'MaterialDataExport',
  props: {
    excelData: {
      Type: Object,
      require: true,
      default: {}
    },
    pkList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState('material', ['tabNames', 'columusNames']),
    sheets () {
      const sheetData = []
      let sheetListName = []
      let count = 0
      let bomList = _.cloneDeep(this.pkList)
      bomList = this.tabNames.concat(bomList)
      bomList.forEach(item => {
        count = 0
        let sheetItem = { name: '', data: [] }
        let sheetName = (item.ID === 'same' || item.ID === 'dif') ? item.FileName : item.FileName + '(单项)'
        sheetItem.name = sheetName.lastIndexOf('-') > 0 ? sheetName.slice(0, sheetName.lastIndexOf('-')) + '(单项)' : sheetName
        sheetListName.forEach(item => {
          if (item.toString().match(sheetItem.name)) {
            count++
          }
        })
        if (count > 0) {
          sheetItem.name = sheetItem.name + count
        }
        sheetListName.push(sheetItem.name)
        sheetItem.data = this.excelData[item.ID]
        if (sheetItem.data.length) {
          sheetData.push(_.cloneDeep(sheetItem))
        }
      })
      return sheetData
    }
  },
  methods: {
    exportMatPkExcel () {
      this.$q.loading.show({
        message: '<b>正在下载请稍等...</b>'
      })
      // 导出对比结果,Excel
      Promise.all([this.$refs.download.load()]).then(() => {
        this.$refs.download.download(this.sheets)
      })
      this.$q.loading.hide()
    }
  },
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
  }
}
</script>

<style lang='scss' scoped>
</style>
