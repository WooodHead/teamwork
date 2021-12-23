<!--
@Name：导入excel模板转换成model
@Author：陆欢
@date：2020/12/30
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card class="card-grow-in-page q-px-md q-pt-md">
    <q-toolbar>
      <q-toolbar-title>
        {{$t('excelImport.importResource',{importType:$t(`${importType}.title`)})}}
      </q-toolbar-title>
      <q-btn
        flat
        v-close-popup
        round
        dense
        icon="close"
      />
    </q-toolbar>
    <q-separator color="grey-3 q-mb-md q-mt-sm" />
    <!-- 头部信息 -->
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
    >
      <!-- 步进器部分 -->
      <q-step
        v-for="item in stepList"
        :key="item.name"
        :name=item.name
        :title=item.title
        :icon=item.icon
        :done="step>item.name"
      >
        <import-and-download-template
          v-if="step===1"
          :importType=importType
          :file.sync=file
          :repeatDataWay.sync=repeatDataWay
          :showChoiceRepeatWay=showChoiceRepeatWay
        >
          <template>
            <slot></slot>
          </template>
        </import-and-download-template>
        <import-loading
          v-if="step===2"
          :importType=importType
          :file="file"
          :repeatDataWay=repeatDataWay
          :category='category'
          :objectID='objectID'
          @stepTwoParse="stepTwoParse"
          :extraProperty="extraProperty"
        />
        <import-finish
          v-if="step===3"
          :importType=importType
          :errorList="errorList"
          :modelList="modelList"
          :totalLength="totalLength"
        />
      </q-step>

      <template v-slot:navigation>
        <q-separator class="grey-3 q-mb-md" />
        <q-stepper-navigation align="right">
          <q-btn
            v-if="showNextButton"
            @click="()=>{stepList[step-1].click()}"
            color="primary"
            :label="stepLabel[step]"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <xlsx-read :file="file">
      <xlsx-json @parsed="xlsxJsonParse"></xlsx-json>
    </xlsx-read>
  </q-card>
</template>

<script>
import { showWarningMessage } from '@/utils/show-message'
import { XlsxRead, XlsxJson } from 'vue-xlsx'
export default {
  name: 'ImportIndex',
  props: {
    importType: {
      type: String,
      default: '',
      required: false,
      description: '导入类型,例如：person、document'
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
    showChoiceRepeatWay: {
      type: Boolean,
      default: true,
      required: false,
      description: '是否展示数据重复方式'
    },
    extraProperty: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '导入模板的额外属性'
    }
  },
  data () {
    return {
      showNextButton: true,
      file: null,
      repeatDataWay: 'none',
      step: 1,
      errorList: [],
      modelList: [], // 导入总数
      totalLength: 0, // 导入总条数
      templateRequireFieldsRight: true,
      stepList: [
        {
          name: 1,
          title: this.$t('excelImport.uploadDocument'),
          icon: 'settings',
          click: () => { this.startImporting() }
        },
        {
          name: 2,
          title: this.$t('excelImport.importData'),
          icon: 'import_export'
        },
        {
          name: 3,
          title: this.$t('excelImport.finish'),
          icon: 'done',
          click: () => { this.$emit('close') }
        }
      ],
      stepLabel: {
        1: this.$t('excelImport.startImport'),
        2: this.$t('excelImport.finish'),
        3: this.$t('excelImport.finish')
      }
    }
  },
  methods: {
    stepTwoParse (data) {
      this.showNextButton = true
      this.errorList = data.errorList
      this.modelList = data.modelList
      this.totalLength = data.totalLength
      this.$refs.stepper.next()
    },
    startImporting () {
      // 1、没有导入文件校验
      if (this.file === null) {
        showWarningMessage(this.$t('excelImport.noAnyFile'))
        return false
      }
      if (!this.templateRequireFieldsRight) {
        showWarningMessage(this.$t('excelImport.notDestroyTemplateRequireFields'))
        return false
      }
      this.showNextButton = false
      this.$refs.stepper.next()
    },
    xlsxJsonParse (excelModelList) {
      const header = excelModelList[0]
      // 1、校验模板必填项字段是否正确importType
      const objectOfImportType = require(`src/store/${this.importType}/model.js`)
      const requireFields = objectOfImportType.default.formRequiredFields()
      if (requireFields && requireFields.length > 0) {
        let noKeys = _.filter(requireFields, (item) => {
          return _.keys(header).toString().includes(`${item},`) ||
            _.keys(header).toString().includes(`,${item}`) ||
            _.keys(header).toString().includes(`(${item})`) ||
            _.keys(header).toString().includes(`,${item},`)
        })
        if (noKeys.length !== requireFields.length) {
          this.templateRequireFieldsRight = false
        } else {
          this.templateRequireFieldsRight = true
        }
        return false
      }
    }
  },
  components: {
    XlsxRead,
    XlsxJson,
    ImportAndDownloadTemplate: () => import('components/import/ImportAndDownloadTemplate'),
    ImportFinish: () => import('components/import/ImportFinish'),
    ImportLoading: () => import('components/import/ImportLoading')
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .q-stepper__header--border {
    border-bottom: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
