<!--
@Name：系统导出组件。选择列可拖拽
@Author：陆欢
@date：2021/01/15
@Copyright：西安精雕软件科技有限公司
@remark:对接的话需要在自己的翻译中有个model对象，里面存储每个属性的翻译信息给用户看
-->
<template>
  <q-card
    class="q-pa-md"
    :class="{'q-mb-md': !$q.platform.is.mobile}"
  >
    <q-toolbar>
      <q-toolbar-title>
        {{$t('exportFile.exportResource')}}
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
    <!-- 复选框，可选择导出列 -->
    <!-- <div class="q-gutter-y-md q-gutter-x-xl"> -->
    <draggable
      v-bind="dragOptions"
      v-model="draggableData"
      class="fit row q-gutter-md justify-evenly list-group"
      handle=".handle"
    >
      <div
        v-for="item in draggableData"
        :key="item.label"
        style="width:100%"
        class="q-px-lg"
      >
        <q-btn
          flat
          round
          icon="reorder"
          class="handle"
          title="拖动排序"
          style="cursor: move;"
        />
        <q-checkbox
          :val=item.key
          v-model="userChoiceFields"
          :label="item.label"
        />
      </div>
    </draggable>
    <!-- 预留空间 -->
    <slot name="exportExtra"></slot>
    <!-- 导出按钮 -->
    <div class="row no-wrap">
      <span class="text-grey-7 q-mr-xs">
        {{$t('exportFile.exportOrderRemark')}}
      </span>
      <q-space />
      <q-btn
        class="cursor"
        style="width: 45%;"
        @click="exportExcel()"
        color="primary"
        :label="$t('exportFile.export')"
      />
    </div>
  </q-card>
</template>

<script>
import { LocalStorage, Platform } from 'quasar'
import draggable from 'vuedraggable'
import request from '@/boot/axios'
import { jsonToExcel } from '@/utils/json-to-excel'
// import { QSpinnerGears } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
const processDataOfModuleTypes = ['task', 'order', 'opportunity', 'resume']// 获取的modelList需要特殊处理的，需要在自己的action有方法名processDataOfExportExcel
export default {
  name: 'ExportExcel',
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
    query: {
      type: Array,
      default: () => { return [] },
      required: false,
      description: '导出数据的条件,后台拼出的query条件'
    },
    search: {
      type: String,
      defaule: '',
      required: false,
      description: '用户可选字段'
    },
    filter: {
      type: String,
      default: '',
      required: false,
      description: '导出数据的条件,后台拼出的filter条件'
    },
    fields: {
      type: Array,
      defaule: () => { return [] },
      required: true,
      description: '用户可选字段[Name,{Langage:Json_}]'
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
    sheetName: {
      type: String,
      default: '',
      required: false,
      description: 'sheet名称'
    },
    tableHeader: {
      type: Object,
      default: () => { return { name: '', style: '' } },
      required: false,
      description: '导出的excel表格头部内容，默认和文件名称一致.有名称和style两个属性'
    },
    showHeader: {
      type: Boolean,
      default: true,
      required: false,
      description: '是否显示头部'
    },
    packageDataExtra: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '额外的属性'
    },
    getDataParameter: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '自己可定义传递的参数'
    }
  },
  data () {
    return {
      fieldsOfTranslate: {}, // 用户可选属性和翻译的对象
      userChoiceFields: [], // 用户已选字段
      draggableData: [],
      dragOptions: {
        animation: 300,
        // delay: 200,
        scroll: true,
        scrollSensitivity: '500',
        // 样式
        ghostClass: 'ghost',
        chosenClass: 'chosen'
      }
    }
  },
  computed: {
    exportFileName () {
      return this.fileName || this.$t('exportFile.fileName', { exportType: `${this.$t(`${this.moduleType}.title`)}.xlsx` })
    },
    exportSheetName () {
      return this.sheetName || this.$t('exportFile.fileName', { exportType: this.$t(`${this.moduleType}.title`) })
    }
  },
  mounted () {
    let storage = LocalStorage.getItem('exportChoiceFields')
    let translateField = []// 所有的属性集合
    _(this.fields).forEach(function (f) {
      if (typeof (f) === 'object') {
        translateField.push(_.keys(f)[0])
      } else {
        translateField.push(f)
      }
    })
    const isStorage = storage && storage[this.moduleType]
    // 1|初始化已选数据
    // remark|如果缓存中有则显示缓存中已勾选，如果缓存中没有，则全选
    if (isStorage && storage[this.moduleType].choiced) {
      let moduleTypeStorage = storage[this.moduleType].choiced
      const diff = _.difference(moduleTypeStorage, translateField)// 前面有，后面没有
      diff.length > 0 && _.remove(moduleTypeStorage, function (n) {
        return diff.includes(n)
      })
      this.userChoiceFields.push(...moduleTypeStorage)
    }
    // 2、初始化排序
    const translate = this.$t(`${this.moduleType}.model`)
    let arrOrderFields = []
    if (isStorage && storage[this.moduleType].orderFields) {
      arrOrderFields = storage[this.moduleType].orderFields// 数组 Tel、Name
      this.fieldsOfTranslate = _.pick(translate, arrOrderFields)

      const diff1 = _.difference(arrOrderFields, translateField)// 前面有，后面没有
      if (diff1.length > 0) {
        this.fieldsOfTranslate = _.omit(this.fieldsOfTranslate, diff1)// 删除
        _.remove(arrOrderFields, function (n) {
          return diff1.includes(n)
        })
      }

      const diff2 = _.difference(translateField, arrOrderFields)// 前面有，后面没有
      if (diff2.length > 0) {
        this.fieldsOfTranslate = _.merge(this.fieldsOfTranslate, _.pick(translate, diff2))
        diff2.map(df => {
          let index = _.findIndex(translateField, field => df === field)
          arrOrderFields.splice(index, 0, df)
        })
      }
    } else {
      arrOrderFields = translateField
      this.fieldsOfTranslate = _.pick(translate, arrOrderFields)
    }
    _.forEach(arrOrderFields, (key, index) => {
      this.draggableData.push({ label: this.fieldsOfTranslate[key], key: key, children: [], id: index })
    })
  },
  methods: {
    exportExcel () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(this.$t('exportFile.weChatDoesNotCurrentlySupportExports'))
        return false
      }
      this.$q.loading.show({
        message: '<b>正在下载请稍等...</b>'
      })
      // 先按照用户指定顺序将数据顺序排正
      let orderUserChoice = _.filter(this.draggableData, item => {
        return this.userChoiceFields.includes(item.key)
      })
      this.userChoiceFields = _.map(orderUserChoice, 'key')
      // 防呆校验，如果没选字段，则不能校验
      if (this.userChoiceFields.length === 0) {
        showWarningMessage(this.$t('exportFile.pleaseChoiceFields'))
        return false
      }
      // 先将人员选择的字段存起来，下次点击直接默认选中
      this.storageFieldsLocalCache()
      // 获取数据
      // 如果modelList有数据，则无需从后台再次获取，直接导出
      if (this.modelList.length > 0) {
        // 可能后续需做处理，将前台字段转成后台字段
        const object = require(`src/store/${this.moduleType}/model.js`).default
        this.packageExcelData(object.to(this.modelList))
      } else {
        this.getExportData()
      }
    },
    // 将字段存储起来
    storageFieldsLocalCache () {
      let storage = LocalStorage.getItem('exportChoiceFields')// choiced\orderFields属性
      let updateStorage = { ...storage }
      updateStorage[this.moduleType] = { choiced: [], orderFields: {} }
      updateStorage[this.moduleType]['choiced'] = this.userChoiceFields
      updateStorage[this.moduleType]['orderFields'] = _.map(this.draggableData, 'key')
      LocalStorage.set('exportChoiceFields', updateStorage)
    },
    // 获取导出的数据
    getExportData () {
      let fields = []
      _(this.fields).forEach(f => {
        if (typeof (f) === 'object' && this.userChoiceFields.includes(_.keys(f)[0])) {
          fields.push(_.values(f)[0])
        } else if (this.userChoiceFields.includes(f)) {
          fields.push(f)
        }
      })
      let parameter = {}
      if (Object.keys(this.getDataParameter).length) {
        parameter = _.cloneDeep(this.getDataParameter)
      } else {
        parameter = {
          query: this.query.length === 0 ? '' : JSON.stringify(this.query),
          filter: this.filter,
          search: this.search,
          orderBy: this.orderBy,
          fields: fields.join(',')
        }
      }
      return request.get(`${this.moduleType}s/${this.loadDataAction}`, parameter)
        .then(res => {
          if (res && res.data) {
            this.packageExcelData(res.data)
          } else {
            return []
          }
        })
        .catch(error => {
          error.userMessage && showWarningMessage(this.$t(`${this.moduleType}.error.${error.userMessage}`))
          return []
        })
    },
    // 组装需要导出的excel数据
    packageExcelData (list) {
      if (processDataOfModuleTypes.includes(this.moduleType)) {
        this.$store.dispatch(`${this.moduleType}/processDataOfExportExcel`, {
          list: list,
          fields: this.userChoiceFields,
          extra: this.packageDataExtra
        }).then((res) => {
          this.exportData(res)
        })
      } else {
        this.exportData(list)
      }
    },
    exportData (list) {
      let data = _.map(list, item => {
        let pickProperty = {}
        _(this.userChoiceFields).forEach(key => {
          pickProperty[key] = item[key]
        })
        return pickProperty
      })
      if (data.length === 0) {
        showWarningMessage(this.$t('exportFile.noData'))
        return false
      }
      let options = {
        name: this.exportFileName,
        sheetName: this.exportSheetName,
        data,
        keyMap: _.pick(this.fieldsOfTranslate, this.userChoiceFields),
        filters: [],
        title: [
          { name: this.tableHeader.name || this.exportFileName, style: this.tableHeader.style, colspan: this.userChoiceFields.length }
        ]
      }
      !this.showHeader && (options = _.omit(options, 'title'))
      this.$q.loading.hide()
      jsonToExcel(options)
    }
  },
  components: {
    draggable
    // QDraggableTree: () => import('components/base/q-draggable-tree/QDraggableTree')
  }
}
</script>

<style scoped lang='scss'>
/deep/ .q-tree {
  color: black;
}
.ghost {
  margin-left: "40px";
  background-color: #ecf9fd;
  // border: 0.15rem dashed $grey-5;
}
.chosen {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
// /deep/ .q-tree__node.q-tree__node--link.q-treeview-node--leaf {
//   display: inline-flex !important;
// }
</style>
