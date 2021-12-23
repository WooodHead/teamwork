<!--
@Name：导入第二步，导入结果显示
@Author：陆欢
@date：2021/01/05
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <xlsx-workbook>
    <xlsx-sheet
      :collection="sheet.data"
      v-for="sheet in sheets"
      :key="sheet.name"
      :sheet-name="sheet.name"
    />
    <xlsx-download
      disable-wrapper-click
      :filename="`${$t(`${importType}.title`)}信息导入未成功数据.xlsx`"
      :options="{bookType:'xlsx'}"
    >
      <template #default="{download}">
        <div>{{$t('excelImport.importFinishRemark',{totalLength:totalLength})}}
          <span class="text-orange-8">{{$t('excelImport.importFailRemark',{failTotal:sheets[0].data.length-1})}}</span>
        </div>

        <!-- 错误结果显示 -->
        <template v-if="sheets[0].data.length>1">
          <div class="q-mt-md text-grey">{{$t('excelImport.downloadErrorReason')}}</div>

          <q-separator
            class="q-my-md"
            color="grey-5"
            style="height:2px"
          />

          <img src="icons/file/icon-excel.png" />

          <div>
            {{`${$t(`${importType}.title`)}信息导入未成功数据`}}.xlsx
            <span
              @click="download"
              class="cursor-pointer q-ml-sm"
            >
              <q-icon
                name="file_download"
                size='sm'
              /> {{$t('excelImport.download')}}
            </span>
          </div>
        </template>
      </template>
    </xlsx-download>
  </xlsx-workbook>
</template>

<script>
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from 'vue-xlsx'
export default {
  name: '',
  props: {
    importType: {
      type: String,
      default: 'person',
      required: false,
      description: '导入类型,例如：person、doc'
    },
    errorList: {
      type: Array,
      required: true,
      description: '错误列表'
    },
    modelList: {
      type: Array,
      required: true,
      description: '总数'
    },
    totalLength: {
      type: Number,
      required: true,
      description: '总条数'
    }
  },
  data () {
    return {
      sheets: [{ name: '未成功数据', data: [] }]
    }
  },
  mounted () {
    this.sheets[0].data.push(...this.errorList)
  },
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
  }
}
</script>

<style scoped>
</style>
