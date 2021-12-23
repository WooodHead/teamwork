<template>
  <q-card
    :flat="$q.screen.lt.sm"
    :class="['card-grow-in-page',{'q-px-md':$q.screen.lt.sm}]"
  >
    <!-- 标题 -->
    <tw-header-card :title="$t('productDev.exportHour')" />

    <div class="q-px-xxl padding-bottom20">
      <tw-banner-no-result
        icon="warning"
        color="warning"
        info="本次导出为“研发工时导出”。工时不可重复结算，未结算的工时不可导出。"
      />
    </div>

    <q-card-section class="q-pt-none q-px-xxl">
      <tw-select-tree
        isOrganize
        multiple
        filled
        emit-value
        :nodes="selectOrganizesTree"
        :model.sync="organizes"
        tickStrategy="strict"
        node-key="id"
        label-key="name"
        position="bottom"
        label="选择机构"
        lazy-rules
        :rules="[val => val && val.length > 0 || '请选择机构']"
      />

      <q-input
        filled
        v-model="year"
        label="年份"
        mask="####"
        :rules="[val => val && val.length > 0 || '请选择年份']"
        input-class="text-bold"
      >
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <tw-year-popup :year.sync="year" />
          </q-icon>
        </template>
      </q-input>

      <select-month
        :value="selectedMonthNum"
        @select="setMonth"
        class="padding-bottom20"
      />

      <div class="row q-col-gutter-md">
        <div class="col">
          <q-input
            filled
            v-model="monthModel.beginDate"
            label="结算开始日期"
            readonly
          />
        </div>
        <div class="col">
          <q-input
            filled
            v-model="monthModel.endDate"
            :readonly="endDateReadOnly"
            label="结算截止日期"
            mask="date"
            :rules="['date']"
            @click="!endDateReadOnly&&$refs.qDateProxy.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                :class="['cursor-pointer', {'no-pointer-events':endDateReadOnly}]"
              >
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="monthModel.endDate"
                    :options="validEndDate"
                    minimal
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <q-card-section class="q-pa-none">
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            color="primary"
            label="结算"
            :disable="!canCount"
            @click="onCountHour()"
          />
          <q-btn
            outline
            color="primary"
            label="导出"
            class="q-ml-sm"
            :disable="!canExport"
            @click="onExportHour()"
          />
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>

</template>

<script>
import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { jsonToExcel } from '@/utils/json-to-excel'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'ProductDevExportHour',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwYearPopup: () => import('components/base/TwYearPopup'),
    SelectMonth: () => import('components/product-dev/export/SelectMonth')
  },
  data () {
    return {
      organizes: [],
      year: '',
      // monthList结构: [{ id: 1, counted: false, beginDate: '2020/12/31', endDate: '2021/1/31' }]
      monthList: [],
      selectedMonthNum: (new Date()).getMonth() + 1
    }
  },
  watch: {
    organizes (newVal, oldVal) {
      this.setMonthList({ organizeIds: this.strOrganizeIds, year: this.year })
    },
    year (newVal, oldVal) {
      this.setMonthList({ organizeIds: this.strOrganizeIds, year: newVal })
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree']),
    strOrganizeIds () {
      return _.sortBy(this.organizes).join(',')
    },
    monthModel () {
      let that = this
      return this.monthList.find(m => m.id === that.selectedMonthNum) || {}
    },
    endDateReadOnly () {
      // 结算过的非当前月份 只读
      // 当年大于当前月份 只读
      const curYear = (new Date()).getFullYear()
      const curMonthNum = (new Date()).getMonth() + 1
      return this.year < curYear
        ? this.monthModel.counted
        : ((this.monthModel.id < curMonthNum && this.monthModel.counted) ||
          this.selectedMonthNum > curMonthNum)
    },
    canCount () {
      // 未结算的月份可以结算一次
      // 结算过的历史月份不能重复结算
      // 当前月份可以重复结算
      const curMonthNum = (new Date()).getMonth() + 1
      return this.monthModel.endDate &&
        (!this.monthModel.counted || this.selectedMonthNum === curMonthNum)
    },
    canExport () {
      // 结算过的月份才可以导出
      return this.monthModel.counted
    }
  },
  methods: {
    ...mapActions('productDev', ['getMonthList', 'countHour', 'exportHour']),
    assembleMonthList (data) {
      // 一次性把12个月的数据组装完毕
      let res = []
      let iMonth = null

      // 记住结算过的月份截止日期，+1天，作为之后未结算的开始日期
      iMonth = data.find(m => m.id === -12)
      let lastCountedEndDate = iMonth ? iMonth.endDate : `${this.year - 1}/12/15`

      for (let i = 0; i < 12; i++) {
        iMonth = data.find(m => m.id === i + 1)
        if (!iMonth) {
          res.push({
            id: i + 1,
            counted: false,
            beginDate: date.formatDate(date.addToDate(lastCountedEndDate, { days: 1 }), 'YYYY/MM/DD'),
            endDate: ''
          })
        } else {
          lastCountedEndDate = iMonth.endDate
          res.push(iMonth)
        }
      }
      this.monthList = res
    },
    setMonthList ({ organizeIds, year }) {
      if (organizeIds.length > 0) {
        this.getMonthList({ organizeIds, year })
          .then(res => {
            this.assembleMonthList(res)
          })
      } else {
        this.monthList = []
      }
    },
    setMonth (monthNum) {
      this.selectedMonthNum = monthNum
    },
    validEndDate (endDate) {
      return new Date(endDate) > new Date(this.monthModel.beginDate) &&
        date.formatDate(endDate, 'YYYY/MM/DD') < date.formatDate(new Date(), 'YYYY/MM/DD')
    },
    onCountHour () {
      const organizeIds = this.strOrganizeIds
      const year = this.year
      const month = this.selectedMonthNum
      const beginDate = this.monthModel.beginDate
      const endDate = this.monthModel.endDate
      if (organizeIds && beginDate && endDate) {
        this.countHour({ organizeIds, year, month, beginDate, endDate })
          .then(res => {
            // 更新本月数据
            const selectedMonth = this.monthList.find(m => m.id === month)
            if (selectedMonth) {
              Object.assign(selectedMonth, { counted: true, endDate })
            }

            // 更新本月以后的结算起始日期
            if (month < 12) {
              for (let i = month + 1; i < 12; i++) {
                let iMonth = this.monthList.find(m => m.id === i)
                if (iMonth.counted) {
                  break
                } else {
                  Object.assign(iMonth, { beginDate: date.formatDate(date.addToDate(endDate, { days: 1 }), 'YYYY/MM/DD') })
                }
              }
            }
            showSuccessMessage('结算成功')
          })
      }
    },
    onExportHour () {
      // 确保机构ids有序，作为是否结算的依据
      const payload = {
        organizeIds: this.strOrganizeIds,
        year: this.year.toString(),
        month: this.monthModel.id
      }
      this.exportHour(payload)
        .then(res => {
          // console.log(res)
          this.exportToExcel(res.status)
        })
    },
    exportToExcel (hours) {
      // 提取column name
      const prodColumnNames = Object.values(hours.dicProdIdTitle)
      const projColumnNames = Object.values(hours.dicProjIdTitle)

      // 处理产品与游离项目重名问题（给重名项目添加空格后缀）
      const interNames = _.intersection(prodColumnNames, projColumnNames)
      interNames.forEach(n => {
        const nIndex = projColumnNames.findIndex(p => p === n)
        projColumnNames[nIndex] = n + ' '
      })

      // columns
      let keyMap = {} // column title object
      let columnKeyId = {} // column field->id object
      let prodIdKey = {} // column productDev id->field object
      let projIdKey = {} // column project id->field object
      let columnPercentKey = {} // column field->percentField object
      const productDevLength = prodColumnNames.length
      const projectLength = projColumnNames.length
      keyMap['field0001'] = '人员名单'
      // 产品工时列
      let prodIndex = 0
      for (let prodId in hours.dicProdIdTitle) {
        prodId = +prodId
        let fieldKey = `field${(prodIndex + 2).toString().padStart(4, '0')}`
        let fieldPercentKey = `field${(productDevLength + projectLength + prodIndex + 3).toString().padStart(4, '0')}`
        keyMap[fieldKey] = hours.dicProdIdTitle[prodId].toString()
        keyMap[fieldPercentKey] = `${hours.dicProdIdTitle[prodId].toString()}工时占比`

        columnKeyId[fieldKey] = prodId
        prodIdKey[prodId] = fieldKey
        columnPercentKey[fieldKey] = fieldPercentKey

        prodIndex++
      }
      // 游离项目工时列
      let projIndex = 0
      for (let projId in hours.dicProjIdTitle) {
        projId = +projId
        let fieldKey = `field${(productDevLength + projIndex + 2).toString().padStart(4, '0')}`
        let fieldPercentKey = `field${(2 * productDevLength + projectLength + projIndex + 3).toString().padStart(4, '0')}`
        keyMap[fieldKey] = hours.dicProjIdTitle[projId].toString()
        keyMap[fieldPercentKey] = `${hours.dicProjIdTitle[projId].toString()}工时占比`

        columnKeyId[fieldKey] = projId
        projIdKey[projId] = fieldKey
        columnPercentKey[fieldKey] = fieldPercentKey

        projIndex++
      }
      // 本月工时合计列
      keyMap[`field${(productDevLength + projectLength + 2).toString().padStart(4, '0')}`] = '本月工时合计'

      // 产品成员
      const prodIdPsonIDs = {}
      for (let prodId in hours.dicProdIdPsonIDs) {
        let psonIds = hours.dicProdIdPsonIDs[prodId]
        prodIdPsonIDs[prodId] = psonIds ? psonIds.split(',').map(Number) : []
      }
      // 游离项目成员
      let projIdPsonIDs = {}
      for (let projId in hours.dicProjIdPsonIDs) {
        let psonIds = hours.dicProjIdPsonIDs[projId]
        projIdPsonIDs[projId] = psonIds ? psonIds.split(',').map(Number) : []
      }
      // set unit value
      // condition: if productDev
      const idPsonIDs = { productDev: prodIdPsonIDs, project: projIdPsonIDs }
      function setUnit (row, condition, psonId, field) {
        const type = condition ? 'productDev' : 'project'
        if (idPsonIDs[type][columnKeyId[field]].includes(psonId)) {
          row[field] = 0
          row[columnPercentKey[field]] = 0
        } else {
          row[field] = ''
          row[columnPercentKey[field]] = ''
        }
      }

      // rows
      const data = []
      const persons = this.$store.state.person.selectPersons
      for (let p of hours.listPsonID) {
        let row = {}
        // 不导出找不到用户的行
        if (persons[p]) { row['field0001'] = persons[p].name } else { continue }

        // 填充单元格
        // 除参与的产品和项目外，所有单元格都置空
        // 标记产品或游离项目成员（单元格>=0即是成员）
        const totalHourNum = productDevLength + projectLength + 2
        Object.keys(keyMap).sort().forEach((km, index) => {
          if (index > 0 && index < totalHourNum - 1) {
            setUnit(row, index < productDevLength + 1, p, km)
          } else if (index === totalHourNum - 1) {
            row[km] = ''
          }
        })

        // 填充有工时的产品和游离项目
        const psonHour = hours.listPsonHour.find(ph => ph.psonID === p)
        if (psonHour !== void 0) {
          psonHour.details.forEach(detail => {
            if (detail.type === 'productDev') {
              row[prodIdKey[detail.id]] = detail.hour
              row[columnPercentKey[prodIdKey[detail.id]]] = detail.percent
            } else {
              row[projIdKey[detail.id]] = detail.hour
              row[columnPercentKey[projIdKey[detail.id]]] = detail.percent
            }
          })
          row[`field${totalHourNum.toString().padStart(4, '0')}`] = psonHour.totalHour
        }
        let rowClone = {}
        Object.keys(row).sort().forEach(r => {
          rowClone[r] = row[r]
        })
        data.push(rowClone)
      }

      const headStyle = 'background-color:#BDD7EE;border:thin solid #C3CBDD;'
      let options = {
        name: `工时统计(${this.year}.${this.monthModel.id})`,
        data,
        keyMap,
        title: [
          { name: '', colspan: 1, style: headStyle },
          { name: `${this.$t('productDev.title')}（所占工时）`, colspan: productDevLength + projectLength + 1, style: headStyle },
          { name: `各项${this.$t('productDev.title')}工时占比（分项工时/总工时）`, colspan: productDevLength + projectLength, style: headStyle }
        ],
        headStyle
      }
      jsonToExcel(options)
    }
  }
}
// 导出数据的结构
// const hours = {
//   id: 1,
//   type: 'devHour',
//   objectType: '2021', // year
//   objectID: 1, // month
//   statusType: '2021/3/15-2021/4/15', // countDate
//   status: {
//     organizeIds: [81, 82], // organize range
//     listPsonID: [], // psonIds
//     dicProdIdTitle: {}, // productDev id-title object
//     dicProjIdTitle: {}, // project id-title object
//     dicProdIdPsonIDs: {}, // productDev id-psonIds object
//     dicProjIdPsonIDs: {}, // project id-psonIds object
//     listPsonHour: [
//       {
//         psonID: 22,
//         psonName: '张三',
//         totalHour: 12, // 员工月度总工时
//         details: [
//           {
//             id: '', // 产品or项目id
//             type: '', // 产品or项目
//             name: '', // 产品or项目名称
//             hour: '', // 产品or项目工时
//             percent: '' // 产品or项目月度工时占比
//           }
//         ]
//       },
//       {
//         psonID: 23,
//         psonName: '李四',
//         totalHour: 12,
//         details: [
//           {
//             id: '',
//             type: '',
//             name: '',
//             hour: '',
//             percent: ''
//           }
//         ]
//       }
//     ]
//   }
// }
</script>

<style lang="scss" scoped>
.padding-bottom20 {
  padding-bottom: 20px;
}
</style>
