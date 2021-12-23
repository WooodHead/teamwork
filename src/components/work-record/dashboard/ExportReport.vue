<template>
  <q-card
    :style="$q.screen.gt.sm?'width:55%':''"
    class="q-pb-md"
  >
    <q-card-section class="q-pb-none">
      <q-toolbar>
        <q-toolbar-title>
          {{$t('workRecord.dashboard.exportReport')}}
        </q-toolbar-title>
        <q-btn
          flat
          v-close-popup
          round
          dense
          icon="close"
        />
      </q-toolbar>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div :class="['q-gutter-sm',{'items-center':$q.screen.gt.sm}]">
        <div class="row">
          <q-input
            v-model="date"
            outlined
            type="month"
            :label="$t('workRecord.dashboard.selectMonth')"
            :style="$q.screen.lt.sm?'width:100%':'width:50%'"
          />
        </div>
        <div class="export-border">
          <div
            class="q-pt-sm text-caption text-grey-7"
            style="padding-left:12px;"
          >{{$t('workRecord.dashboard.exportDimension')}}</div>
          <div style="padding:0px 5px;">
            <q-radio
              v-if="isSysOrSeniorManager"
              v-model="dimension"
              val="group"
              :label="$t('workRecord.dashboard.groupDimension')"
            />
          </div>
          <div style="padding:0px 5px;">
            <q-radio
              v-if="isSysOrSeniorManager"
              v-model="dimension"
              val="region"
              :label="$t('workRecord.dashboard.regionDimension')"
            />
          </div>
          <div style="padding:0px 5px;">
            <q-radio
              v-if="isSysOrSeniorManager"
              v-model="dimension"
              val="branch"
              :label="$t('workRecord.dashboard.branchDimension')"
            />
          </div>
          <div style="padding:0px 5px;">
            <q-radio
              v-model="dimension"
              val="org"
            >
              <tw-select-tree
                outlined
                :nodes="orgsAndChild"
                :model.sync="selectOrgIdByOrgManager"
                node-key="id"
                label-key="name"
                is-organize
                position="bottom"
                style="flex: auto;padding-top:6px;"
                label="请选择机构"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '请选择机构']"
              />
            </q-radio>
          </div>
        </div>
        <div class="export-border">
          <div
            class="q-pt-sm text-caption text-grey-7"
            style="padding-left:12px;"
          >{{$t('workRecord.dashboard.exportType')}}</div>
          <div style="padding:0px 5px;">
            <q-option-group
              :options="typeOptions"
              type="radio"
              v-model="typeGroup"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <!-- 导出按钮 -->
    <q-card-section>
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
          :filename="fileName"
          :options="{bookType:'xlsx'}"
        >
          <q-btn
            class="q-px-sm"
            @click="exportWorkRecordExcel()"
            color="primary"
            :label="$t('exportFile.export')"
          />
        </xlsx-download>
      </xlsx-workbook>
    </q-card-section>
  </q-card>
</template>
<script>
import { date, Platform, Notify } from 'quasar'
import { mapState, mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
const { formatDate } = date, currentDay = new Date()
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from 'vue-xlsx'
export default {
  name: 'ExportReport',
  data () {
    return {
      date: formatDate(new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1), 'YYYY-MM'),
      initTaskChartList: [],
      exportTaskChartList: [],
      columnArray: [],
      typeGroup: this.$t('workRecord.dashboard.classify'),
      typeOptions: [
        { label: this.$t('workRecord.dashboard.workRecordItem'), value: this.$t('workRecord.dashboard.record') },
        { label: this.$t('workRecord.dashboard.workRecordClassify'), value: this.$t('workRecord.dashboard.classify') }

      ],
      dimension: '',
      parentOrgID: +this.$myinfo.organizeId,
      psonID: +this.$myinfo.id,
      sheets: [],
      sheetsChart: [],
      selectOrgIdByOrgManager: +this.$myinfo.organizeId
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapState('organize', ['selectOrganizes']),
    ...mapState('person', ['selectPersons']),
    orgsAndChild () {
      return this.$store && this.$store.getters['organize/selectOrganizesChildTreeByOrganizeIds'](this.isSysOrSeniorManager ? '1' : this.$myinfo.organizeIds)
    },
    fileName () {
      let dimensionStr = this.$myinfo.organizeName
      if (this.dimension === 'group' || this.isGroup) {
        dimensionStr = this.$t('workRecord.dashboard.groupDimension')
      } else if (this.dimension === 'region') {
        dimensionStr = this.$t('workRecord.dashboard.regionDimension')
      } else if (this.dimension === 'branch') {
        if (this.isSysOrSeniorManager) {
          dimensionStr = this.$t('workRecord.dashboard.branchDimension')
        }
      } else {
        dimensionStr = (Object.keys(this.selectOrganizes).length && this.selectOrganizes[this.selectOrgIdByOrgManager] &&
          this.selectOrganizes[this.selectOrgIdByOrgManager].shortName) || ''
      }
      //   return dimensionStr + this.typeGroup + '_' + this.$t('months')[+this.date.split('-')[1] - 1] + '.xlsx'
      return dimensionStr + this.typeGroup + '_' + this.date.split('-')[0] + '年' + this.date.split('-')[1] + '月' + '.xlsx'
    },
    sheetName () {
      return this.$t('months')[+this.date.split('-')[1] - 1]
    },
    workRecordType () {
      return this.dictionary['workRecord'] ? this.dictionary['workRecord']['type'] : []
    },
    recordClassify () {
      return this.dictionary['workRecord'] ? this.dictionary['workRecord']['classify'] : []
    },
    isSysOrSeniorManager () {
      return this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager
    },
    isGroup () {
      return this.dimension === 'org' && this.selectOrgIdByOrgManager === 1
    },
    isRegion () { // 选择的是否是某大区
      return this.selectOrganizes[this.selectOrgIdByOrgManager].type === 2 && this.selectOrganizes[this.selectOrgIdByOrgManager].level === 2 && this.selectOrganizes[this.selectOrgIdByOrgManager].parentId === 1
    }
  },
  mounted () {
    if (this.isSysOrSeniorManager) {
      this.dimension = 'group'
    } else {
      this.dimension = 'org'
      if (this.isRegion) {
        this.typeGroup = this.$t('workRecord.dashboard.classify')
      } else {
        this.typeGroup = this.$t('workRecord.dashboard.record')
      }
    }
  },
  methods: {
    ...mapActions('taskchart', ['loadWorkRecordExportTaskCharts']),
    ...mapActions('dictionary', ['loadDictionarys']),
    init () {
      this.loadDictionarys('workRecord')
      if (this.isSysOrSeniorManager) {
        this.parentOrgID = 0
        if (this.dimension && this.dimension === 'group') {
          this.parentOrgID = this.$myinfo.organizeId
        }
      }
      let objectType = 'organize'
      if (this.dimension === 'branch' || (this.dimension === 'org' && !this.isGroup && !this.isRegion)) {
        objectType = 'person'
      }
      let query = [
        { Key: 'Type', Value: 'workRecord', Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'and',
        { Key: 'StatusType', Value: this.date, Oper: 'eq' }
      ]
      return this.loadWorkRecordExportTaskCharts({ query: query, parentId: this.dimension === 'org' ? this.selectOrgIdByOrgManager : this.parentOrgID, psonId: this.psonID, dimension: this.isGroup ? 'group' : (this.isRegion ? 'region' : this.dimension) })
        .then(
          (res) => {
            if (this.dimension === 'org' && !this.isGroup && !this.isRegion) {
              res.forEach(item => {
                item.ObjectName = (Object.keys(this.selectPersons).length && this.selectPersons[+item.objectId] &&
                  this.selectPersons[+item.objectId].name) || ''
              })
              if (this.typeGroup && this.typeGroup === this.$t('workRecord.dashboard.classify')) {
                this.mainTypeExcel(res)
              } else if (this.typeGroup && this.typeGroup === this.$t('workRecord.dashboard.record')) {
                this.detailTypeExcel(res)
              }
              this.sheetsChart.push([{ name: this.sheetName, data: [...this.exportTaskChartList] }])
            } else if (this.dimension === 'branch') {
              let allBranches = []
              let orgKeys = Object.keys(this.selectOrganizes)
              if (orgKeys) {
                _.forEach(orgKeys, key => {
                  if (this.selectOrganizes[key].type === 2 && this.selectOrganizes[key].level === 3 &&
                    this.selectOrganizes[+this.selectOrganizes[key].id].parentId &&
                    this.selectOrganizes[this.selectOrganizes[+this.selectOrganizes[key].id].parentId].type === 2 &&
                    this.selectOrganizes[this.selectOrganizes[+this.selectOrganizes[key].id].parentId].level === 2) {
                    allBranches.push(this.selectOrganizes[key])
                  }
                })
              }
              res.forEach(item => {
                item.ObjectName = (Object.keys(this.selectPersons).length && this.selectPersons[+item.objectId] &&
                  this.selectPersons[+item.objectId].name) || ''
                // 部分员工直接属于分公司，部分员工属于机构
                item.orgId = (Object.keys(this.selectPersons).length && this.selectPersons[+item.objectId] &&
                  this.selectPersons[+item.objectId].organizeId) || 0
                item.orgName = (Object.keys(this.selectOrganizes).length && this.selectOrganizes[+item.orgId] &&
                  this.selectOrganizes[+item.orgId].name) || ''
              })
              // 若直接属于分公司的员工没有台账记录，则该分公司不会在查询结果中出现，同时也就无法导出该分公司下机构的数据
              // 所以首先要获取所有的分公司
              //   let groupBySheet = _.groupBy(res.filter(item => item.parentOrgLevel === 2), r => { return r.orgId })
              _.forEach(allBranches, item => {
                if (res.filter(r => item.childPath.split(',').includes(r.orgId + '')).length > 0) {
                  if (this.typeGroup && this.typeGroup === this.$t('workRecord.dashboard.classify')) {
                    this.mainTypeExcel(res.filter(r => item.childPath.split(',').includes(r.orgId + '')))
                  } else if (this.typeGroup && this.typeGroup === this.$t('workRecord.dashboard.record')) {
                    this.detailTypeExcel(res.filter(r => item.childPath.split(',').includes(r.orgId + '')))
                  }
                  this.sheetsChart.push([{ name: item.shortName, data: [...this.exportTaskChartList] }])
                }
              })
            } else {
              // 获取所有的Sheets, 匹配父节点
              res.forEach(item => {
                item.parentId = (Object.keys(this.selectOrganizes).length && this.selectOrganizes[+item.objectId] &&
                  this.selectOrganizes[+item.objectId].parentId) || 0
                item.parentName = (Object.keys(this.selectOrganizes).length && this.selectOrganizes[+item.parentId] &&
                  this.selectOrganizes[+item.parentId].shortName) || ''
                item.ObjectName = (Object.keys(this.selectOrganizes).length && this.selectOrganizes[+item.objectId] &&
                  this.selectOrganizes[+item.objectId].shortName) || ''
              })
              let groupBySheet = _.groupBy(res, r => { return r.parentId })
              _.forEach(groupBySheet, item => {
                if (this.typeGroup && this.typeGroup === this.$t('workRecord.dashboard.classify')) {
                  this.mainTypeExcel(res.filter(r => r.parentId === item[0].parentId))
                } else if (this.typeGroup && this.typeGroup === this.$t('workRecord.dashboard.record')) {
                  this.detailTypeExcel(res.filter(r => r.parentId === item[0].parentId))
                }
                this.sheetsChart.push([{ name: item[0].parentName ? item[0].parentName : item[0].ObjectName, data: [...this.exportTaskChartList] }])
              })
            }
          })
    },
    mainTypeExcel (res) {
      this.initTaskChartList = _.cloneDeep(res)
      // 导出的行
      let rowArray = this.recordClassify.map(r => r.dictKey)
      // 导出的列
      let exportCols = _.uniq(this.initTaskChartList.map(r => r.ObjectName))
      this.columnArray = _.concat('序号', '工作类别', '', '平均', exportCols)
      let that = this, data = {}, columnsCount = this.columnArray.length, rowsCount = rowArray.length
      // 拼接数据
      this.exportTaskChartList = []
      _.forEach(rowArray, (r, index1) => {
        _.forEach(this.columnArray, (c, index2) => {
          let val = this.recordClassify.filter(p => p.dictKey === r)[0]
          data[c] = this.mainDataSourceCeil(c, r, index2, index1, columnsCount, rowsCount, val ? val.dictValue : '')
        })
        that.exportTaskChartList.push(data)
        data = {}
      })
    },
    detailTypeExcel (res) {
      this.initTaskChartList = _.cloneDeep(res)
      // 导出的行
      let rowArray = this.workRecordType.map(r => r.dictKey + '、' + r.dictValue)
      _.remove(rowArray, r => _.includes(r, 'W') || _.includes(r, 'X') || _.includes(r, 'Y') || _.includes(r, 'Z'))
      rowArray = _.concat(rowArray, 'W、D+F+G+H+I+R路途用时', 'X、其他项目路途用时', 'Y、当月去客户数（D+F+G+H+I+R客户数）', 'Z、请假', '合计')
      // 导出的列
      let exportCols = _.uniq(this.initTaskChartList.map(r => r.ObjectName))
      this.columnArray = _.concat('序号', '工作项目', exportCols, '合计', '百分比')
      let that = this, data = {}, columnsCount = this.columnArray.length, rowsCount = rowArray.length
      // 拼接数据
      this.exportTaskChartList = []
      _.forEach(rowArray, (r, index1) => {
        _.forEach(this.columnArray, (c, index2) => {
          data[c] = this.detailDataSourceCeil(c, r, index2, index1, columnsCount, rowsCount)
        })
        that.exportTaskChartList.push(data)
        data = {}
      })
      // 计算总合计单元格
      this.workRecordTotals = _.sumBy(this.initTaskChartList, m => { return m.status && m.status.SumHours })
      this.exportTaskChartList[rowsCount - 1]['合计'] = this.workRecordTotals
      // 计算百分比列
      _.map(this.exportTaskChartList, r => {
        if (!['Y', 'Z'].includes(_.split(_.trim(r['工作项目']), '、', 1)[0])) { // Y Z不计算百分比
          if (!this.workRecordTotals || (r['合计'] / this.workRecordTotals) === 0) r['百分比'] = '0.00%'
          else if ((r['合计'] / this.workRecordTotals) === 1) r['百分比'] = ''
          else r['百分比'] = ((r['合计'] / this.workRecordTotals) * 100).toFixed(2) + '%'
          return r
        }
      })
      // 将合计行移到第一行
      this.exportTaskChartList.splice(0, 0, this.exportTaskChartList[this.exportTaskChartList.length - 1])
      this.exportTaskChartList.pop()
      // 去客户平均路途用时、台账人数、平均每人当月工时(后三行数据某些单元格不需要数据，但由于导出功能限制，其余列也必须赋值)
      let w = _.find(this.exportTaskChartList, r => { return _.includes(r['工作项目'], 'W') })['合计']
      let y = _.find(this.exportTaskChartList, r => { return _.includes(r['工作项目'], 'Y') })['合计']
      let rowArrayOfLastThree = ['去客户平均路途用时', '台账人数', '平均每人当月工时']
      _.forEach(rowArrayOfLastThree, (r, index1) => {
        _.forEach(this.columnArray, c => {
          if (c === '序号') data[c] = 1
          else if (c === '工作项目') data[c] = r
          else if (c === '合计') {
            if (index1 === 0) data[c] = y === 0 ? 0 : (w / y).toFixed(2)
            if (index1 === 1) data[c] = exportCols.length
            if (index1 === 2) data[c] = exportCols.length === 0 ? 0.00 : (this.workRecordTotals / exportCols.length).toFixed(2)
          } else data[c] = ''
        })
        that.exportTaskChartList.push(data)
        data = {}
      })
      // 重新排序
      _.map(this.exportTaskChartList, (r, index) => {
        r['序号'] = index + 1
        return r
      })
    },
    mainDataSourceCeil (colomn, row, columnIndex, rowIndex, columnsCount, rowsCount, colThreeval) {
      if (columnIndex === 0) {
        // 第一列序号
        return rowIndex + 1
      } else if (columnIndex === 1) {
        // 第二列工作类别
        return row
      } else if (columnIndex === 2) {
        return colThreeval.replaceAll(',', '+')
      } else if (columnIndex === 3) {
        // 平均:各类别所占比例
        let rowCountVal = 0
        colThreeval.split(',').forEach(item => {
          _.sumBy(this.initTaskChartList, m => {
            rowCountVal += (m.status.BusinessTypeHours && m.status.BusinessTypeHours[item] && m.status.BusinessTypeHours[item][0]) || 0
          })
        })
        return (columnsCount - 4 === 0) ? 0 : (rowCountVal / (columnsCount - 4)).toFixed(1)
      } else if (columnIndex > 3 && columnIndex < columnsCount) {
        // 各大区数据
        let colCount = 0
        colThreeval.split(',').forEach(item => {
          _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => {
            colCount += (m.status.BusinessTypeHours && m.status.BusinessTypeHours[item] && m.status.BusinessTypeHours[item][0]) || 0
          })
        })
        return colCount
      }
    },
    detailDataSourceCeil (colomn, row, columnIndex, rowIndex, columnsCount, rowsCount) {
      if (columnIndex === 0) {
        // 第一列序号
        return rowIndex + 1
      } else if (columnIndex === 1) {
        // 第二列工作项目
        return rowIndex === rowsCount - 1 ? '合计' : row
      } else if (columnIndex > 1 && columnIndex < columnsCount - 2) {
        // 中间列各大区数据
        if (rowIndex === rowsCount - 1) { // 合计行
          return _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => { return m.status.SumHours })
        } else {
          if (_.split(_.trim(row), '、', 1)[0] === 'W') {
            // W行计算路途用时
            return _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => { return m.status.SumOutOnRoadHours })
          } else if (_.split(_.trim(row), '、', 1)[0] === 'X') {
            // 其他类型路途用时
            return _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => { return m.status.SumNotOutOnRoadHours })
          } else if (_.split(_.trim(row), '、', 1)[0] === 'Y') {
            // 访问客户次数
            return _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => { return m.status.ToCustomerCount })
          } else if (_.split(_.trim(row), '、', 1)[0] === 'Z') {
            // 请假提单子的类型是X，统计为Z
            return _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => { return (m.status.BusinessTypeHours && m.status.BusinessTypeHours['X'] && m.status.BusinessTypeHours['X'][0]) || 0 })
          } else {
            return _.sumBy(_.filter(this.initTaskChartList, r => r.ObjectName === colomn), m => { return (m.status.BusinessTypeHours && m.status.BusinessTypeHours[_.split(_.trim(row), '、', 1)[0]] && m.status.BusinessTypeHours[_.split(_.trim(row), '、', 1)[0]][0]) || 0 })
          }
        }
      } else if (columnIndex === columnsCount - 2) {
        // 倒数第二列合计
        if (rowIndex === rowsCount - 1) { // 合计行
          return 0
        } else {
          if (_.split(_.trim(row), '、', 1)[0] === 'W') {
            // W行计算路途用时合计值
            return _.sumBy(this.initTaskChartList, m => { return m.status.SumOutOnRoadHours })
          } else if (_.split(_.trim(row), '、', 1)[0] === 'X') {
            // X其他类型路途用时合计值
            return _.sumBy(this.initTaskChartList, m => { return m.status.SumNotOutOnRoadHours })
          } else if (_.split(_.trim(row), '、', 1)[0] === 'Y') {
            // 访问客户次数
            return _.sumBy(this.initTaskChartList, m => { return m.status.ToCustomerCount })
          } else if (_.split(_.trim(row), '、', 1)[0] === 'Z') {
            // 请假提单子的类型是X，统计为Z
            return _.sumBy(this.initTaskChartList, m => { return (m.status.BusinessTypeHours && m.status.BusinessTypeHours['X'] && m.status.BusinessTypeHours['X'][0]) || 0 })
          } else {
            return _.sumBy(this.initTaskChartList, m => { return (m.status.BusinessTypeHours && m.status.BusinessTypeHours[_.split(_.trim(row), '、', 1)[0]] && m.status.BusinessTypeHours[_.split(_.trim(row), '、', 1)[0]][0]) || 0 })
          }
        }
      }
    },
    exportWorkRecordExcel () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(this.$t('exportFile.weChatDoesNotCurrentlySupportExports'))
        return false
      }
      this.$q.loading.show({
        message: '<b>正在下载请稍等...</b>'
      })
      this.sheets = []
      this.sheetsChart = []
      Promise.all([this.init()]).then(() => {
        this.$q.loading.hide()
        if (this.sheetsChart) {
          _.forEach(this.sheetsChart, item => {
            if (this.dimension) {
              if (this.dimension === 'group' || this.isGroup) { // 只有一个sheet
                this.sheets.push({ name: this.sheetName, data: item[0].data })
              } else if (this.dimension === 'org' && !this.isGroup && !this.isRegion) {
                _.forEach(item, p => {
                  this.sheets.push({ name: this.sheetName, data: p.data })
                })
              } else {
                this.sheets.push({ name: item[0].name.replace(/[/?*[\]]/g, ''), data: item[0].data })
              }
            }
          })
        }
        // 存在可以导出的数据
        if (this.sheets.length) {
          Promise.all([this.$refs.download.load()]).then(() => {
            this.$refs.download.download(this.sheets)
          })
        } else {
          Notify.create({
            color: 'warning',
            textColor: 'white',
            icon: 'warning',
            message: this.$t('exportFile.noData'),
            timeout: '900'
          })
        }
      })
    }
  },
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
    TwSelectTree: () => import('components/base/TwSelectTree')
  }
}
</script>

<style lang='scss' scoped>
.export-border {
  border: solid 1px lightgray;
  border-radius: 4px;
}
</style>
