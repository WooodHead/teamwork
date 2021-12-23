<template>
  <div>
    <q-table
      title='文件校验表'
      :data="tableRows"
      :columns="tableColumns"
      color="amber"
      hide-bottom
      :pagination.sync="pagination"
      row-key="index"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-purple"
            style="font-size: 1.0em;font-weight:bold;"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="infoCheck"
            :props="props"
          >
            {{ props.row.infoCheck }}
          </q-td>
          <q-td
            key="rusult"
            :props="props"
          >
            <div v-if="props.row.IsError">{{props.row.rusult}}</div>
            <div
              v-else-if="props.row.index === 1 && !props.row.IsError"
              class="text-red"
            >
              {{errorRow(props.rowIndex)}}
              <q-btn
                v-if="isFileExist"
                outline
                size="10px"
                rounded
                color="primary"
                label="覆盖"
                @click="OverwriteData()"
              >
              </q-btn>
            </div>
            <div
              v-else-if="props.row.index === 5 && !props.row.IsError"
              class="text-red"
            >
              {{isProExist?errorRow(props.rowIndex):'该物料代码不存在'}}
              <q-btn
                v-if="!isProExist"
                outline
                size="10px"
                rounded
                color="primary"
                label="添加"
                @click="MaterialAdd()"
              >
              </q-btn>
            </div>
            <div
              v-else
              class="text-red"
            >
              {{errorRow(props.rowIndex)}}
            </div>
          </q-td>
          <q-td
            key="IsError"
            :props="props"
          >
            <q-badge
              v-if="props.row.IsError"
              color="green"
            >
              正常
            </q-badge>
            <q-badge
              v-else
              color="red"
            >
              异常
            </q-badge>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row q-pa-sm justify-between">
      <q-btn
        outline
        color="secondary"
        label="返回"
        @click="returnHome"
      />
      <q-btn
        :disable="thirdstep"
        color="primary"
        label="下一步"
        @click="sendMsg()"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import Model from '@/store/material/model'
import { showSuccessMessage } from '@/utils/show-message'

export default {
  name: 'CheckMaterialFile',
  props: {
    fileName: {
      type: String,
      required: true,
      default: ''
    },
    modelList: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },
  inject: ['reload'],
  data () {
    return {
      Notes: '',
      isFileExist: false,
      isProExist: true,
      thirdstep: false,
      matMain: new Model.MatMain(),
      mat: new Model.Mat(),
      tableRows: [],
      tableColumns: [
        { name: 'infoCheck', align: 'center', label: '信息校验', field: 'infoCheck' },
        { name: 'rusult', align: 'center', label: '校验结果', field: 'rusult' },
        { name: 'IsError', align: 'center', label: '是否异常', field: 'IsError' }
      ],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 6,
        rowsNumber: 6
      }
    }
  },
  async created () {
    await this.checkFileName()
    this.checkColumns()
    this.checkType()
    this.checkFroductName()
    await this.checkCode()
    this.checkPerson()
  },
  mounted () {
    // 默认选中第一个sheet
    this.salaryTab = Object.keys(this.modelList)[0]
  },
  computed: {
    ...mapState('material', ['columns', 'matType', 'error', 'bomType', 'importType'])
  },
  methods: {
    ...mapActions('material', ['IsRepeat', 'IsMaterial', 'addMaterial', 'deleteBomData']),
    ...mapActions('product', ['addProduct']),
    ...mapMutations('material', ['updateFile']),
    // 返回主界面
    returnHome () {
      this.$router.push({
        name: 'materialHome'
      })
    },
    sendMsg () {
      this.updateFile(this.matMain)
      this.$emit('next')
    },
    // 返回相应的异常信息
    errorRow (index) {
      return _.values(this.error)[index]
    },
    // 添加物料
    MaterialAdd () {
      this.mat.Notes = this.Notes
      this.addMaterial(this.mat).then(res => {
        if (res.ID > 0) {
          // 添加成功、刷新表格
          this.tableRows[4].IsError = true
          this.thirdstep = false
          this.isProExist = true
          this.tableRows.forEach(item => {
            if (!item.IsError) {
              this.thirdstep = true
            }
          })
          this.matMain.MaterialID = res.ID
          showSuccessMessage('添加成功')
        }
      })
    },
    // 检查文件名称是否已经导入
    async checkFileName () {
      const info = { infoCheck: '', rusult: '', IsError: true, index: 1 }
      info.infoCheck = '文件名称'
      info.rusult = this.fileName
      this.matMain.FileName = this.fileName
      await this.IsRepeat(this.fileName).then(res => {
        if (res > 0) {
          this.BomID = res
          info.IsError = false
          this.isFileExist = true
          this.thirdstep = true
        }
        this.tableRows.push(info)
      })
    },
    // 检查文件导入模板列
    checkColumns () {
      const info = { infoCheck: '', rusult: '', IsError: true, index: 2 }
      info.infoCheck = '数据模板列'
      let header = this.modelList[0]
      let values = _.pickBy(header, (value, key) => { return value })
      let columnNames = _.keys(values)
      this.columns.forEach(item => {
        if (columnNames.find(ele => ele.replace(/\s*/g, '') === item)) {
          info.rusult = info.rusult.concat(item + '、')
        } else if (item !== '序号' && item !== '材料') {
          info.IsError = false
          this.thirdstep = true
        }
      })
      this.tableRows.push(info)
    },
    // 校验明细表类型
    checkType () {
      const info = { infoCheck: '', rusult: '', IsError: true, index: 3 }
      info.infoCheck = '明细表类型'
      let header = this.modelList[this.modelList.length - 5]
      let values = _.pickBy(header, (value, key) => { return value })
      let columnNames = _.values(values)
      info.rusult = columnNames.length === 2 ? columnNames[0].trim() : ''
      const index = _.values(this.matType).indexOf(columnNames[0].trim())
      if (index > -1) {
        this.matMain.MaterialType = parseInt(Object.keys(this.matType)[index])
      } else {
        info.IsError = false
        this.thirdstep = true
      }
      this.tableRows.push(info)
    },
    // 校验产品名称
    checkFroductName () {
      const info = { infoCheck: '', rusult: '', IsError: true, index: 4 }
      info.infoCheck = '产品名称'
      let header = this.modelList[this.modelList.length - 4]
      let values = _.pickBy(header, (value, key) => { return value })
      let columnNames = _.values(values)
      info.rusult = columnNames.length === 1 ? columnNames[0] : ''
      this.mat.Name = info.rusult
      this.matMain.Name = info.rusult
      this.matMain.AutoFileName = info.rusult
      if (columnNames.length !== 1) {
        info.IsError = false
        this.thirdstep = true
      }
      this.tableRows.push(info)
    },
    // 校验产品代码及配置码
    async checkCode () {
      const proCode = { infoCheck: '产品代码', rusult: '', IsError: true, index: 5 }
      const proDeployCode = { infoCheck: '机械配置码', rusult: '', IsError: true, index: 6 }
      let header = this.modelList[this.modelList.length - 2]
      let values = _.pickBy(header, (value, key) => { return value })
      let columnNames = _.values(values)
      let Codes = []
      if (typeof columnNames[columnNames.length - 1] === 'string') {
        Codes = columnNames[columnNames.length - 1].split(' ')
      }
      if (new RegExp('^[0-9]').test(Codes[Codes.length - 1])) {
        proCode.rusult = Codes[Codes.length - 1] ? Codes[Codes.length - 1] : ''
        this.mat.Code = proCode.rusult
        this.matMain.Code = proCode.rusult

        if (!Codes[Codes.length - 1]) {
          proCode.IsError = false
          this.thirdstep = true
        }
        // 产品配置码
        if (Codes.length > 1) {
          proDeployCode.IsError = true
          proDeployCode.rusult = Codes[0] ? Codes[0] : ''
          this.mat.DeployCode = proDeployCode.rusult
          this.matMain.DeployCode = proDeployCode.rusult
          if (!Codes[0]) {
            proDeployCode.IsError = false
            this.thirdstep = true
          }
        }
      } else {
        proCode.rusult = ''
        proCode.IsError = false
        this.thirdstep = true
      }
      // 判断该物料是否存在
      await this.IsMaterial(this.mat).then(res => {
        if (res === 0) {
          proCode.IsError = false
          this.isProExist = false
          this.thirdstep = true
        } else {
          this.matMain.MaterialID = res
        }
      })
      this.tableRows.push(proCode)
      if (proDeployCode.rusult.length) {
        this.tableRows.push(proDeployCode)
      }
    },
    // 解析导入主表其它属性
    checkPerson () {
      this.matMain.BomType = this.importType
      this.matMain.ProductType = this.bomType[this.importType]
      let header = this.modelList[this.modelList.length - 2]
      let values = _.pickBy(header, (value, key) => { return value })
      let columnNames = _.values(values)
      this.matMain.PrepareByID = 0
      this.matMain.PrepareBy = columnNames[1]
      this.matMain.PrepareTime = columnNames[2]
      this.matMain.BuditByID = 0
      this.matMain.BuditBy = columnNames[4]
      this.matMain.BuditTime = columnNames[5]
      header = this.modelList[this.modelList.length - 1]
      values = _.pickBy(header, (value, key) => { return value })
      columnNames = _.values(values)
      this.matMain.CheckByID = 0
      this.matMain.CheckBy = columnNames[1]
      this.matMain.CheckTime = columnNames[2]
      this.matMain.ApprovalByID = 0
      this.matMain.ApprovalBy = columnNames[4]
      this.matMain.ApprovalTime = columnNames[5]
      this.matMain.Version = columnNames[6]
      this.mat.Version = columnNames[6]
      this.matMain.AutoFileName = this.matMain.AutoFileName + this.matType[this.matMain.MaterialType] + this.matMain.Version
      // 获取备注
      header = this.modelList[this.modelList.length - 3]
      values = _.pickBy(header, (value, key) => { return value })
      columnNames = _.values(values)
      this.Notes = columnNames[columnNames.length - 1]
    },
    // 覆盖
    OverwriteData () {
      if (this.BomID > 0) {
        this.deleteBomData(this.BomID).then(res => {
          if (res) {
            // 覆盖成功
            this.tableRows[0].IsError = true
            this.isFileExist = false
            this.thirdstep = false
            this.tableRows.forEach(item => {
              if (!item.IsError) {
                this.thirdstep = true
              }
            })
            showSuccessMessage('覆盖成功')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
