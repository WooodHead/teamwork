<!--
@Name：导入第二步，导入数据
@Author：陆欢
@date：2021/01/04
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <xlsx-read
      :file="file"
      :options="{cellDates:true}"
    >
      <xlsx-json @parsed="xlsxJsonParse"></xlsx-json>
    </xlsx-read>

    <!-- loading结果显示 -->
    <template>
      <div align="center">
        <q-spinner-gears
          align="center"
          size="50px"
          color="primary"
        />
        <div
          align="center"
          class="q-mt-sm"
        >{{$t('excelImport.dataImporting')}}</div>
      </div>
      <!-- <q-banner class="bg-grey-3  text-subtitle1 q-mt-sm">
        <template v-slot:avatar>
          <q-icon
            name="info"
            color="info"
          />
        </template>
        {{$t('excelImport.itNeedSomeTimeAndNotClosePage')}}
      </q-banner> -->
    </template>
  </div>
</template>

<script>
import { XlsxRead, XlsxJson } from 'vue-xlsx'
export default {
  name: 'ImportLoading',
  props: {
    file: {
      type: [File, Object, null],
      required: true,
      description: '转换成modelList的file文件'
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '导入资源,例如：project'
    },
    objectID: {
      type: Number,
      default: 0,
      required: false,
      description: '资源的ID，例如：ProjectID'
    },
    importType: {
      type: String,
      default: 'person',
      required: false,
      description: '导入类型,例如：person、document'
    },
    repeatDataWay: {
      type: String,
      default: 'person',
      required: false,
      description: '选择数据重复时的处理方式：none、add、update'
    },
    extraProperty: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '导入模板的额外属性'
    }
  },
  methods: {
    xlsxJsonParse (excelModelList) {
      const header = excelModelList[1]
      const noInherit = _.pickBy(excelModelList[0], (value, key) => { return value === 'noInherit' })
      const noInheritKey = _.keys(noInherit)
      let errorList = [header]
      let modelList = _.drop(excelModelList, 2)
      const totalLength = modelList.length
      // 1、补全excel生成的modelList字段
      this.supplementInfomentOfExcelModelList(header, modelList, noInheritKey)
      // 2、找出必填项校验没有填的数据放入错误数组中
      this.findErrorDataOfNoWrite(header, errorList, modelList)
      // 3、找出数据格式不正确的数据
      // this.findDataOfErrorFormat(header, errorList, modelList)
      // 4、往各个表中批量新增数据
      this.batchAdd(header, errorList, modelList, totalLength)
    },
    supplementInfomentOfExcelModelList (header, modelList, noInheritKey) {
      const arrKeys = _.keys(header)
      _.map(modelList, (item, index) => {
        // 比较所有的和当前的
        const arrDiffKeys = _.differenceBy(arrKeys, _.keys(item))
        if (arrDiffKeys.length > 0) {
          // 将没有的字段补全
          _(arrDiffKeys).forEach(function (key) {
            if (noInheritKey.includes(key)) {
              item[key] = ''
            } else {
              item[key] = (index === 0 ? '' : modelList[index - 1][key])
            }
          })
        }
        return item
      })
    },
    findErrorDataOfNoWrite (header, errorList, modelList) {
      const requireKeys = _.filter(_.keys(header), (item) => { return header[item].includes('必填') })
      if (requireKeys.length > 0) {
        let data = _.remove(modelList, (item) => {
          const noWrite = _.filter(requireKeys, (key) => { return item[key] === '' })
          if (noWrite.length > 0) {
            const diffKeys = _.difference(requireKeys, _.keys(_.pick(item, requireKeys)))
            _(diffKeys).forEach(function (key) {
              item[key] = '【必填项，请填写】'
            })
          }
          return noWrite.length !== 0
        })
        data.length > 0 && errorList.push(...data)
      }
    },
    findDataOfErrorFormat (header, errorList, modelList) {
      const objectOfImportType = require(`src/store/${this.importType}/model.js`)
      const checkFormFields = objectOfImportType.default.excelCheckFormFieldsType()
      if (checkFormFields.length > 0) {
        _.remove(modelList, (item) => {
          // let isRemove = false
          for (let i = 0; i < checkFormFields.length; i++) {
            const e = checkFormFields[i]
            const key = _.keys(e)[0]
            const errorTips = e[key].errorTips
            const rules = e[key].rules
            const value = item[key]
            // 自己写函数型
            if (typeof (rules) === 'function') {
              let isRight = rules(value)
              if (!isRight) {
                item[key] = item[key] + errorTips
                break
              }
            }
            // 数字型校验
            if (typeof (rules) === 'string' && rules === 'number' && typeof (value) !== 'number') {
              item[key] = item[key] + errorTips
              break
            }
          }
        })
      }
    },
    batchAdd (header, errorList, modelList, totalLength) {
      if (modelList.length > 0) {
        this.$store.dispatch(`${this.importType}/batchAddExcelData`,
          {
            modelList,
            repeatDataWay: this.repeatDataWay,
            fieldsInExcel: _.keys(header),
            category: this.category,
            objectID: this.objectID,
            extraProperty: this.extraProperty
          })
          .then(res => {
            // todo将数据写入error中
            if (res) {
              errorList.push(...res)
            }
            this.$emit('stepTwoParse', { errorList, modelList, totalLength })
          })
      } else {
        this.$emit('stepTwoParse', { errorList, modelList, totalLength })
      }
    }
  },
  components: {
    XlsxRead,
    XlsxJson
  }
}
</script>

<style scoped>
</style>
