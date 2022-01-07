<!--
@Name：导出PDF
@Author：陆欢
@date：2021/01/21
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div class="column items-center">
    <q-toolbar
      class="bg-grey-3 fixed"
      style="z-index: 999999;top: 0; max-width: 800px; left: 50%; transform: translateX(-50%);"
    >
      <q-btn
        unelevated
        rounded
        color="primary"
        :label="$t('exportFile.exportPDF')"
        icon="file_download"
        @click="exportPdf()"
      />
      <q-btn-dropdown
        flat
        label="导出设置"
        color="primary"
        ref="btnDropdown"
      >
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <export-setting
              :fileName.sync="pdfFileName"
              :moduleType="moduleType"
              :needSettingProperty.sync="needSettingProperty"
            ></export-setting>
          </div>
        </div>
      </q-btn-dropdown>
      <q-space />
      <q-btn
        flat
        round
        dense
        @click="()=>{$emit('exit')}"
      >
        <q-icon name="close" />
      </q-btn>
    </q-toolbar>
    <vue-html2pdf
      class="card-grow-in-page"
      :pdf-quality='2'
      show-layout
      manual-pagination
      :enable-download="enableDownload"
      :preview-modal="previewModal"
      :filename="pdfFileName"
      @progress="onProgress($event)"
      ref="html2Pdf"
      style="color: #2c3e50;"
      :paginate-elements-by-height="1100"
      @beforeDownload="beforeDownload($event)"
    >

      <template slot="pdf-content">
        <component
          :is="`Pdf${capitalize(moduleType)}`"
          :modelList="modelListOfPDF"
          :category="category"
          :objectID="objectID"
          :needSettingProperty="needSettingProperty"
          class="card-grow-in-page full-height full-width"
          :exportCommentByCategory="exportCommentByCategory"
        ></component>
      </template>
    </vue-html2pdf>
    <!-- 导出进度 -->
    <q-circular-progress
      v-if="showProgress"
      show-value
      font-size="12px"
      :value="progress"
      size="80px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md text-black progress-bar"
    >
      {{ progress }}%
    </q-circular-progress>
  </div>
</template>

<script>
import request from '@/boot/axios'
import VueHtml2pdf from 'vue-html2pdf'
import { format, Platform } from 'quasar'
const { capitalize } = format

export default {
  name: 'ExportPDF',
  props: {
    moduleType: {
      type: String,
      required: true,
      description: '模块类型,例如：document.notice'
    },
    loadDataAction: {
      type: String,
      default: 'getList',
      required: false,
      description: '后台默认搜索方法是走getList方法，如果不一致的话就自己传过来'
    },
    condition: {
      type: Array,
      default: () => { return [] },
      required: false,
      description: '导出数据的条件,后台拼出的query条件'
    },
    fields: {
      type: String,
      defaule: '',
      required: false,
      description: '用户可选字段,如果有modelList此值可不用传'
    },
    orderBy: {
      type: String,
      default: '',
      required: false,
      description: '导出数据排序, 例如：ID DESC'
    },
    modelList: {
      type: Array,
      default: () => { return [] },
      required: false,
      description: '直接导出的数据，如果有可以直接传过来，直接会导出这些数据'
    },
    fileName: {
      type: String,
      default: '',
      required: false,
      description: '导出文件名称。默认为：模块名+列表信息，例如项目列表信息，团队列表信息'
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '导入关联的资源,例如：project、product'
    },
    objectID: {
      type: Number,
      default: 0,
      required: false,
      description: '资源的ID，例如：ProjectID'
    },
    exportCommentByCategory: {
      type: Boolean,
      default: false,
      required: false,
      description: '导出某个资源下面的所有符合条件的讨论内容，例如导出某个项目下面所有符合条件的任务讨论'
    }
  },
  data () {
    return {
      modelListOfPDF: [],
      progress: 0,
      showProgress: false,
      pdfFileName: '',
      needSettingProperty: {},
      enableDownload: false,
      previewModal: false
    }
  },
  mounted () {
    // 将滚动条置于顶层
    document.querySelectorAll('.q-page-container') &&
      document.querySelectorAll('.q-page-container')[0].scrollIntoView()
    if (this.modelList.length > 0) {
      this.modelListOfPDF.push(...this.modelList)
    } else {
      this.getExportData()
    }
    this.pdfFileName = this.fileName || this.$t('exportFile.fileName', { exportType: this.$t(`${this.moduleType}.title`) })
  },
  watch: {
    'modelList' (val) {
      if (val.length > 0) {
        this.modelListOfPDF = []
        this.modelListOfPDF.push(...val)
      }
    }
  },
  methods: {
    capitalize,
    async beforeDownload ({ html2pdf, options, pdfContent }) {
      options.pagebreak = { mode: 'avoid-all' }
      options.margin = [0.5, 0, 0.5, 0]
      await html2pdf()
        .set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages()
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i)
            pdf.setFontSize(10)
            pdf.setTextColor(150)
            pdf.text(this.$t('app.name'), (pdf.internal.pageSize.getWidth() * 0.065), (pdf.internal.pageSize.getHeight() - 0.3))
            pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.85), (pdf.internal.pageSize.getHeight() - 0.3))
          }
          // 添加水印
          // for (let i = 1; i <= totalPages; i++) {
          //
          //   pdf.addImage('', 'JPEG', 15, 40, 180, 180)
          //   // pdf.setPage(i)
          //   // pdf.setFontSize(60)
          //   // pdf.setTextColor(150)
          //   // pdf.text('TeamWork', (pdf.internal.pageSize.getWidth() * 0.2), (pdf.internal.pageSize.getHeight() - 0.5))
          // }
        }).save()
    },
    onProgress (progress) {
      this.progress = progress
      if (progress === 100) {
        let _self = this
        setTimeout(function () { _self.showProgress = false }, 4000)
      }
    },
    exportPdf () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(this.$t('exportFile.weChatDoesNotCurrentlySupportExports'))
        return false
      }
      // 将滚动条置于顶层
      document.querySelectorAll('.q-page-container')[0].scrollIntoView()
      this.showProgress = true
      this.$refs.html2Pdf.generatePdf()
    },
    // 获取导出的数据
    getExportData () {
      const parameter = {
        query: this.condition.length === 0 ? '' : JSON.stringify(this.condition),
        orderBy: this.orderBy,
        fields: this.fields
      }
      return request.get(`${this.moduleType}s/${this.loadDataAction}`, parameter)
        .then(res => {
          if (res && res.data) {
            const object = require(`src/store/${this.moduleType}/model.js`).default
            const models = object.to(res.data)
            this.modelListOfPDF.push(...models)
          }
        })
        .catch(error => {
          error.userMessage && showWarningMessage(error.userMessage)
          return []
        })
    }
  },
  components: {
    VueHtml2pdf,
    PdfTask: () => import('components/export/export-task/PdfTask'),
    ExportSetting: () => import('components/export/ExportSetting')
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  z-index: 999999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/deep/ .content-wrapper {
  margin-top: 50px;
  min-height: 100% !important;
  background-color: white;
}
/deep/.vue-html2pdf .layout-container.show-layout {
  z-index: 2001 !important;
}
// @media screen and (min-width: 800px) {
//   .toolbar-margin {
//     margin-left: 16px;
//   }
// }
</style>
