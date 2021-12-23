<template>
  <q-card
    :flat="$q.screen.lt.sm"
    :class="['card-grow-in-page',{'q-px-md':$q.screen.lt.sm}]"
  >
    <!-- 标题 -->
    <tw-header-card :title="$t('project.exportProjectHour')" />
    <q-card-section class="q-pt-none q-px-xxl">
      <div :class="['q-gutter-sm',{'items-center':$q.screen.gt.sm}]">
        <div class="text-bold q-my-sm q-py-sm">
          导出月份
        </div>
        <div class="row">
          <q-input
            :style="$q.screen.lt.sm?'width:95%':'width:50%'"
            v-model="date"
            outlined
            type="month"
            :label="$t('project.selectMonth')"
          />
        </div>
        <div class="text-bold q-my-sm q-pt-sm">
          项目类型
        </div>
        <div class="flex q-gutter-sm btn-style">
          <q-btn
            v-for="value in projTypes"
            :key="value"
            flat
            align="left"
            class="text-weight-regular text-caption"
            :padding="$q.platform.is.mobile ? '2px 8px' : ''"
            :class="(selectedProjType && selectedProjType === value) ? 'bg-primary' : 'bg-grey-2'"
            text-color='black'
            :title="value"
            @click="selectProjType(value)"
          >
            <div class="ellipsis">{{value}}</div>
          </q-btn>
        </div>
        <div class="text-bold q-my-sm q-pt-sm">
          是否显示参与机构
        </div>
        <div class="row">
          <q-btn
            v-for="value in group"
            :key="value"
            flat
            align="left"
            class="text-weight-regular text-caption"
            :padding="$q.platform.is.mobile ? '2px 8px' : ''"
            :class="(selectGroup && selectGroup===value) ? 'bg-primary' : 'bg-grey-2'"
            text-color='black'
            :title="value"
            @click="setIsExCooperateOrgs(value)"
            style="margin-right:40px;"
          >
            <div class="ellipsis">{{value}}</div>
          </q-btn>
        </div>
        <!-- 导出按钮 -->
        <q-card-section class="q-pt-sm q-px-none">
          <q-btn
            class="q-px-sm"
            @click="exportWorkRecordExcel()"
            color="primary"
            :label="$t('exportFile.export')"
          />
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { date, Platform, Notify } from 'quasar'
import { mapState, mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
import { jsonToExcel } from '@/utils/json-to-excel'
const { formatDate } = date, currentDay = new Date()
export default {
  name: 'ExportProjectHour',
  data () {
    return {
      date: formatDate(new Date(currentDay.getFullYear(), currentDay.getMonth(), 1), 'YYYY-MM'),
      initHoursList: [],
      exportHoursList: [],
      columnArray: [],
      selectedProjType: '',
      isOnRoadHour: false,
      // 是否导出参与机构
      isExCooperateOrgs: false,
      excelTitle: [],
      group: ['否', '是'],
      selectGroup: '否'
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    fileName () {
      return this.$t('project.projectHourCalendar') + '_' + formatDate(new Date(this.date), 'YYYY.MM')
    },
    sheetName () {
      return this.$t('months')[+this.date.split('-')[1] - 1]
    },
    daysOfSelectMonth () {
      let time = new Date(this.date)
      let lastDay = new Date(time.getFullYear(), time.getMonth() + 1, 0), days = []
      for (var i = 1; i <= lastDay.getDate(); i++) {
        days[i - 1] = i + '日'
      }
      return days
    },
    projTypes () {
      const types = this.dictionary['project'] ? this.dictionary['project']['ProjType'] : []
      return _.map(types, t => t.dictValue)
    }
  },
  mounted () {
    this.loadDictionarys('project')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapActions('workHour', ['loadSumHoursOfProjectByDate']),
    async init () {
      let time = new Date(this.date)
      let query = [
        { Key: 'ObjectType', Value: 'project', Oper: 'eq' },
        'and',
        { Key: 'OwnerType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'Date', Value: formatDate(new Date(time.getFullYear(), time.getMonth(), 1), 'YYYY-MM-DD'), Oper: 'ge' },
        'and',
        { Key: 'Date', Value: formatDate(new Date(time.getFullYear(), time.getMonth() + 1, 1), 'YYYY-MM-DD'), Oper: 'lt' }
      ]
      if (this.selectedProjType) {
        query.push(...['and', { 'Key': 'ProjType', 'Value': this.selectedProjType, 'Oper': 'eq' }])
      }
      return this.loadSumHoursOfProjectByDate({ query: query, psonId: +this.$myinfo.id }).then(
        (res) => {
          this.initHoursList = _.cloneDeep(res)
          let cooperateOrgCols = []
          _.forEach(this.initHoursList, item => {
            item.OwnerOrgID = this.$store.state.person.selectPersons[+item.OwnerID].organizeId
            item.OwnerOrgName = this.$store.state.person.selectPersons[+item.OwnerID].orgShortName
          })
          if (this.isExCooperateOrgs) {
            // 获取所有的参与机构
            _.forEach(_.groupBy(this.initHoursList, r => { return r.ObjectID }), item => {
              if (item[0].Members) {
                _.forEach(JSON.parse(item[0].Members), mem => {
                  let orgName = this.$store.state.person.selectPersons[+mem].orgShortName
                  cooperateOrgCols.push(orgName)
                })
              }
            })
          }
          // 导出的列
          let daysOfSelectMonth = _.cloneDeep(this.daysOfSelectMonth)
          // 判断要导出的项目是否有路途用时
          let exportProjs = _.cloneDeep(res)
          let ff = _.filter(exportProjs, r => r.SumOnRoadHours > 0)
          // 若所有项目均没有路途用时，则不显示该列，否则显示
          if (ff.length) {
            this.columnArray = _.concat('项目名称', '所属机构', '工时', '合计(h)', _.uniq(cooperateOrgCols), daysOfSelectMonth)
            this.isOnRoadHour = true
          } else {
            this.columnArray = _.concat('项目名称', '所属机构', '合计(h)', _.uniq(cooperateOrgCols), daysOfSelectMonth)
            this.isOnRoadHour = false
          }
          // 导出的行
          let groupBy = _.groupBy(this.initHoursList, r => { return r.ObjectID }), rowArray = [], rowArr = []
          _.forEach(groupBy, proj => {
            let projCooperateOrgHours = []
            proj.ProjSumWorkHours = _.sumBy(proj, 'SumWorkHours')
            proj.ProjSumOnRoadHours = _.sumBy(proj, 'SumOnRoadHours')
            _.forEach(_.groupBy(proj, p => { return p.OwnerOrgID }), org => {
              projCooperateOrgHours.push({
                orgID: org[0].OwnerOrgID,
                orgName: org[0].OwnerOrgName,
                orgSumWorkHours: _.sumBy(org, 'SumWorkHours'),
                orgSumOnRoadHours: _.sumBy(org, 'SumOnRoadHours')
              })
            })
            proj.ProjCooperateOrgHours = projCooperateOrgHours
            rowArr.push({
              orgID: proj[0].OrganizeID,
              projID: proj[0].ProjectID,
              projName: proj[0].ProjName,
              projSumWorkHours: proj.ProjSumWorkHours,
              projSumOnRoadHours: proj.ProjSumOnRoadHours,
              projCooperateOrgs: proj.ProjCooperateOrgHours,
              projWorkHours: proj
            })
          })
          if (this.columnArray.indexOf('工时') >= 0) {
            rowArray = _.orderBy(_.concat(rowArr, rowArr), ['projID'], 'asc')
          } else {
            rowArray = rowArr
          }
          let that = this, data = {}, columnsCount = this.columnArray.length, rowsCount = rowArray.length
          // 拼接数据
          this.exportHoursList = []
          _.forEach(rowArray, (r, index1) => {
            _.forEach(this.columnArray, (c, index2) => {
              if (this.isOnRoadHour) {
                if (index2 !== 0 && index2 !== 1) {
                  data[c] = this.dataSourceCeil(c, r, index2, index1, columnsCount, rowsCount)
                } else {
                  if (index1 % 2 === 0) {
                    data[c] = this.dataSourceCeil(c, r, index2, index1, columnsCount, rowsCount)
                  }
                }
              } else {
                data[c] = this.dataSourceCeil(c, r, index2, index1, columnsCount, rowsCount)
              }
            })
            that.exportHoursList.push(data)
            data = {}
          })
        })
    },
    dataSourceCeil (column, row, columnIndex, rowIndex, columnsCount, rowsCount) {
      let projName = row.projName
      let orgName = this.$store.state.organize.selectOrganizes[+row.orgID] ? this.$store.state.organize.selectOrganizes[+row.orgID].shortName : ''
      // 有路途用时
      if (this.isOnRoadHour) {
        if (columnIndex === 0 && rowIndex % 2 === 0) {
          // 第一列项目名称，一个项目占两行
          return '<td rowspan=2>' + projName + '</td>'
        } else if (columnIndex === 1 && rowIndex % 2 === 0) {
          // 第二列项目所属机构
          return '<td rowspan=2>' + orgName + '</td>'
        } else if (columnIndex === 2) {
          // 第三列工作时长、路途用时，奇数行：工作时长，偶数行：路途用时
          return rowIndex % 2 === 0 ? '工作时长' : '路途用时'
        } else if (columnIndex === 3) {
          // 第四列合计列
          return rowIndex % 2 === 0 ? row.projSumWorkHours : row.projSumOnRoadHours
        } else if (columnIndex > 3 && columnIndex < (columnsCount - this.daysOfSelectMonth.length)) {
          // 参与机构列
          if (row.projCooperateOrgs.length) {
            let org = _.filter(row.projCooperateOrgs, r => r.orgName === column)
            if (org && org[0]) {
              return rowIndex % 2 === 0 ? org[0].orgSumWorkHours : org[0].orgSumOnRoadHours
            }
          }
        } else if (columnIndex >= (columnsCount - this.daysOfSelectMonth.length) && columnIndex < columnsCount) {
          // 各项目每天的工时统计数据
          let proj = _.filter(row.projWorkHours, r => +r.Date.substr(8, 2) === +column.replace('日', ''))
          if (proj.length) {
            return rowIndex % 2 === 0 ? _.sumBy(proj, 'SumWorkHours') : _.sumBy(proj, 'SumOnRoadHours')
          }
        }
        this.isExCooperateOrgs
          ? this.excelTitle = [
            { name: '项目基本信息', colspan: 4 },
            { name: '参与机构', colspan: columnsCount - this.daysOfSelectMonth.length - 4 },
            { name: '日期', colspan: this.daysOfSelectMonth.length }]
          : this.excelTitle = [
            { name: '项目基本信息', colspan: 4 },
            { name: '日期', colspan: this.daysOfSelectMonth.length }]
      } else {
        if (columnIndex === 0) {
          return projName
        } else if (columnIndex === 1) {
          return orgName
        } else if (columnIndex === 2) {
          // 合计列
          return row.projSumWorkHours
        } else if (columnIndex > 2 && columnIndex < (columnsCount - this.daysOfSelectMonth.length)) {
          // 参与机构列
          if (row.projCooperateOrgs.length) {
            let org = _.filter(row.projCooperateOrgs, r => r.orgName === column)
            if (org && org[0]) {
              return rowIndex % 2 === 0 ? org[0].orgSumWorkHours : org[0].orgSumOnRoadHours
            }
          }
        } else if (columnIndex >= (columnsCount - this.daysOfSelectMonth.length) && columnIndex < columnsCount) {
          // 各项目每天的工时统计数据
          let proj = _.filter(row.projWorkHours, r => +r.Date.substr(8, 2) === +column.replace('日', ''))
          if (proj.length) {
            return rowIndex % 2 === 0 ? _.sumBy(proj, 'SumWorkHours') : _.sumBy(proj, 'SumOnRoadHours')
          }
        }
        this.isExCooperateOrgs
          ? this.excelTitle = [
            { name: '项目基本信息', colspan: 3 },
            { name: '参与机构', colspan: columnsCount - this.daysOfSelectMonth.length - 3 },
            { name: '日期', colspan: this.daysOfSelectMonth.length }]
          : this.excelTitle = [
            { name: '项目基本信息', colspan: 3 },
            { name: '日期', colspan: this.daysOfSelectMonth.length }]
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
      Promise.all([this.init()]).then(() => {
        let options = {
          name: this.fileName,
          sheetName: this.sheetName,
          data: this.exportHoursList,
          keyMap: this.columnArray, // 列名
          title: this.excelTitle
        }
        this.$q.loading.hide()
        if (this.initHoursList.length) {
          jsonToExcel(options)
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
    },
    selectProjType (value) {
      this.selectedProjType = value
    },
    setIsExCooperateOrgs (value) {
      value === '是' ? this.isExCooperateOrgs = true : this.isExCooperateOrgs = false
      this.selectGroup = value
    }
  },
  watch: {
    date: {
      deep: true,
      handler: function (newV, oldV) {
        this.exportHoursList = []
      }
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang='scss' scoped>
.btn-style /deep/.q-btn__wrapper {
  padding: 4px 10px;
}
</style>
