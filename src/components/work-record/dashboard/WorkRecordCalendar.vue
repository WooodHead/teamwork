<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <q-card-section class="q-px-xxl">
      <div
        class="q-pt-sm q-gutter-sm"
        style="font-size:14px"
        :class="$q.screen.lt.sm?'':'row'"
      >
        <!-- 都是task模块的，选择的人/机构会影响台账列表 -->
        <tw-select-person
          class="col"
          v-model="person"
          @reset="resetPerson"
          mode="download"
          outlined
          rounded
          dense
          :label="$t('base.selectPerson')"
        >
        </tw-select-person>
        <tw-select-tree
          class="col"
          outlined
          rounded
          dense
          clear
          :nodes="orgsAndChild"
          :model.sync="organizeId"
          @reset="resetOrganize"
          node-key="id"
          label-key="name"
          is-organize
          position="bottom"
          label="请选择机构"
        />
      </div>
    </q-card-section>
    <q-separator
      class="q-mx-md"
      color="dark"
      style="height:2px"
    />
    <q-card-section class="q-px-xxl">
      <div class="calendar-panel">
        <q-toolbar class="row bg-primary text-white calender-toolbar">
          <div class="row items-center">
            <q-btn
              flat
              round
              :title="$t('workHour.prev')"
              icon="navigate_before"
              @click="calendarPrev"
            />
            <q-btn
              flat
              stretch
              :title="$t('schedule.returnToToday')"
              :label="$t('schedule.today')"
              @click="returnToToday"
            />
          </div>
          <q-space />
          <!-- 标题栏上的总工时 -->
          <div
            v-if="totalWorkHours"
            class="row justify-center items-center text-h6"
            style="word-break:break-all;"
            :title="$t('workRecord.dashboard.workingAndOnRoadHour')"
          >
            <span v-if="$q.screen.gt.sm">{{$t('workRecord.dashboard.sumHours')}}：</span>
            {{totalWorkHours.totalWorkHour}} + {{totalWorkHours.totalOnRoadHour}}
          </div>
          <q-space />
          <div class="row justify-end items-center">
            <q-btn
              flat
              round
              :title="$t('workHour.next')"
              icon="navigate_next"
              @click="calendarNext"
            />
          </div>
        </q-toolbar>
        <div class="calendar">
          <q-infinite-scroll
            @load="onLoadData"
            :offset="250"
            ref="infiniteScroll"
          >
            <q-calendar
              ref="calendar"
              v-model="selectedDate"
              view="week-scheduler"
              :weekdays="[1,2,3,4,5,6,0]"
              short-weekday-label
              :resources="calendarResources"
              resource-key="psonName"
              :resource-height="$q.screen.lt.sm?'70':'78'"
              :resource-width="$q.screen.lt.sm?'50':'100'"
              @click:date2="onClickDate"
              :locale="$q.lang.getLocale()"
              no-scroll
              sticky
              class="text-center"
            >
              <!-- 左上角显示选择日期的年、月 -->
              <template #scheduler-resources-header="scope">
                <div class="full-height column justify-center items-center">
                  <div>
                    <span class="text-h6 text-weight-bolder">{{ showHeaderDate(scope).month }}</span>
                    <span class="q-ml-sm">{{$q.lang.getLocale().includes('zh') ?$t('workHour.month'):''}}</span>
                  </div>
                  <span class="text-subtitle1">{{ showHeaderDate(scope).year }}</span>
                </div>
              </template>
              <!-- 左列显示人员名称和头像 -->
              <template #scheduler-resource="{ resource /*, index */  }">
                <div :class="['row items-center', $q.screen.lt.sm?' justify-center':'justify-start q-pl-md']">
                  <div class="q-mt-md">
                    <tw-avatar
                      :id="resource.psonId"
                      size="md"
                    />
                    <span
                      v-if="$q.screen.gt.sm"
                      class="text-caption q-ml-xs"
                    >{{resource.psonName}}</span>
                  </div>
                </div>
                <div
                  v-if="resource.personSumHourMonthly &&
                    resource.personSumHourMonthly[0]"
                  style="word-break:break-all;"
                  class="text-caption q-mt-xs"
                  :title="$t('workRecord.dashboard.workingAndOnRoadHour')"
                >
                  <!-- 个人工时累计 -->
                  <span v-if="$q.screen.gt.sm">{{$t('workRecord.dashboard.sumHours')}}:</span>
                  {{resource.personSumHourMonthly[0].SumWorkHours }} + {{resource.personSumHourMonthly[0].SumOnRoadHours}}
                </div>
              </template>
              <!-- 显示弹出代理 -->
              <template #scheduler-resource-day="{ timestamp, /* index, */ resource }">
                <div
                  v-if="resource && resource.personOneDayRecords[timestamp.date] && resource.personOneDayWorkHours[timestamp.date]"
                  class="fit row items-center justify-center"
                  :style="'cursor:default'"
                >
                  <span
                    class="text-h6"
                    style="word-break:break-all;"
                  >{{ resource.personOneDayWorkHours[timestamp.date][0].oneDayTotalHour===0 ? '0' : resource.personOneDayWorkHours[timestamp.date][0].oneDayTotalHour }}
                  </span>
                  <!-- 有任务显示• -->
                  <div
                    class="row justify-center task-avatar"
                    style="bottom: 2px;position: absolute;width:100%;"
                  >
                    <q-avatar
                      rounded
                      v-for="(task, index) in dotsShow(resource,timestamp.date)"
                      :key=index
                      text-color="primary"
                      :title="task.name"
                    >•</q-avatar>
                  </div>
                </div>
                <q-popup-edit
                  v-if="resource && resource.personOneDayRecords[timestamp.date]"
                  v-model="resource.personOneDayRecords[timestamp.date]"
                  :anchor="'center left'"
                  :style="$q.screen.gt.sm?'max-width:35vw':'min-width:100%;max-width:100%'"
                >
                  <template>
                    <div
                      class="row"
                      v-if="resource.personOneDayRecords[timestamp.date]"
                    >
                      <q-space />
                      <q-btn
                        icon="close"
                        flat
                        round
                        dense
                        v-close-popup
                      />
                    </div>
                    <div class="q-px-md">
                      <div v-if="resource.personOneDayRecords[timestamp.date]">
                        <span class="text-weight-bold">{{$t('workRecord.dashboard.workRecordsToday')}}</span>
                        <q-item
                          class="column cursor-pointer text-left text-caption q-gutter-sm"
                          style="padding-left:0px;"
                        >
                          <work-record-item
                            v-for="task in dotsShow(resource,timestamp.date)"
                            :key="task.id"
                            :task="task"
                          />
                        </q-item>
                      </div>
                    </div>
                  </template>
                </q-popup-edit>
              </template>
            </q-calendar>
            <!-- 加载中 -->
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots
                  color="primary"
                  size="40px"
                />
              </div>
            </template>
          </q-infinite-scroll>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { Math } from 'core-js'
import { mapState, mapMutations, mapActions } from 'vuex'
import QCalendar from '@quasar/quasar-ui-qcalendar'
const CURRENT_DAY = new Date()
function today () {
  return QCalendar.parseDate(CURRENT_DAY).date
}
export default {
  name: 'WorkRecordCalendar',
  data () {
    return {
      selectedDate: QCalendar.parseDate(CURRENT_DAY).date,
      queryDate: { startTime: '', endTime: '' },
      monthToalDate: { startTime: '', endTime: '' },
      maxOneDay: 9,
      orgId: 0,
      psonId: +this.$myinfo.id,
      psonIds: []
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('task', ['sumHoursOnePersonByMonth', 'sumHoursByMonth']),
    person: {
      get () {
        return this.$store.state.task.calendarPson || {
          id: null,
          name: '',
          type: 'all'
        }
      },
      set (value) {
        this.personUpdate(value)
      }
    },
    organizeId: {
      get () {
        return this.$store.state.task.calendarOrg
      },
      set (value) {
        this.organizeUpdate(value)
      }
    },
    orgsAndChild () {
      let organizeIds = (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) ? '1' : this.$myinfo.organizeIds
      return this.$store && this.$store.getters['organize/selectOrganizesChildTreeByOrganizeIds'](organizeIds)
    },
    workRecordCalendarPageList () {
      return this.$store.getters['task/workRecordCalendarPageList']()
    },
    calendarResources () {
      let resources = []
      let endDate = date.formatDate(date.addToDate(new Date(this.queryDate.endTime), { days: 1 }), 'YYYY-MM-DD')
      // 只筛选当前显示范围内的台账记录（workRecordCalendarPageList中包含所有查询过的台账记录）
      let curCalendarList = _.filter(this.workRecordCalendarPageList, r => r.queryTimeRange === (this.queryDate.startTime + '~' + endDate))
      if (this.psonIds.length) {
        _.forEach(this.psonIds, id => {
          let personOneDayRecords = [], personOneDayWorkHours = []
          if (curCalendarList.length) { // 最多有一条记录（一个查询范围一条记录）
            let curPsonData = _.filter(curCalendarList[0].curCalendarList, cal => cal.psonId === id)
            if (curPsonData && curPsonData[0]) {
              personOneDayRecords = curPsonData[0].personOneDayRecords
              personOneDayWorkHours = curPsonData[0].personOneDayWorkHours
            }
          }
          resources.push(Object.assign({}, {
            psonId: id,
            psonName: (this.selectPersons[+id] && this.selectPersons[+id].name) || '',
            personOneDayRecords: personOneDayRecords,
            personOneDayWorkHours: personOneDayWorkHours,
            personSumHourMonthly: this.sumHoursOnePersonByMonth.filter(r => r.ObjectID === id && r.yearMonth === new Date(this.selectedDate.replace(/-/g, '/')).getFullYear() + '-' + (new Date(this.selectedDate.replace(/-/g, '/')).getMonth() + 1) + '')
          }))
        })
      }
      return resources
    },
    // 当前月累计总数
    totalWorkHours () {
      let totalObj = {
        totalHour: 0,
        totalWorkHour: 0,
        totalOnRoadHour: 0
      }
      let totalSumHours = _.cloneDeep(this.sumHoursByMonth), orgIds = ''
      if (this.organizeId) { // 有机构查询条件
        orgIds = this.organizeId + ''
      } else {
        orgIds = (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) ? '1' : this.$myinfo.organizeIds
      }
      let childPaths = _.filter(this.$store.state.organize.selectOrganizes, o => (orgIds.split(',').indexOf(String(o.id)) >= 0)).map(r => { return r.childPath })
      let allOrgIds = _.uniq(_.join(childPaths, ',').split(',')).map(r => { return _.toNumber(r) })
      totalSumHours = totalSumHours.filter(r => allOrgIds.indexOf(r.OrganizeID) >= 0)
      if (totalSumHours.length > 0) {
        const time = new Date(this.selectedDate.replace(/-/g, '/'))
        let yy = time.getFullYear(), month = time.getMonth() + 1
        let sumHours = totalSumHours.filter(r => r.yearMonth === yy + '-' + month)
        if (sumHours.length > 0) {
          // 将各个机构的台账工时累加
          totalObj.totalHour = Math.abs(_.sumBy(sumHours, 'SumHours').toFixed(1))
          totalObj.totalWorkHour = Math.abs(_.sumBy(sumHours, 'SumWorkHours').toFixed(1))
          totalObj.totalOnRoadHour = Math.abs(_.sumBy(sumHours, 'SumOnRoadHours').toFixed(1))
        }
      }
      return totalObj
    }
  },
  methods: {
    ...mapState('task', ['queryTime', 'querySumMonthTime']),
    ...mapActions('task', ['loadWorkRecordCalendarList', 'loadPersonSumHoursByMonth', 'loadSumHoursByMonth']),
    ...mapMutations('task', ['setEmptyCalendarTasks', 'initCalendarPage', 'setCalendarPson', 'setCalendarOrg', 'setEmptyQueryTime', 'setEmptyQuerySumMonthTime', 'setEmptySumHoursOnePersonByMonth']),
    resetPerson () {
      let person = {
        id: null,
        name: '',
        type: 'all'
      }
      this.resetList()
      this.setCalendarPson(person)
    },
    personUpdate (value) {
      this.resetList()
      this.setCalendarPson(value)
    },
    resetOrganize () {
      this.resetList()
      this.setCalendarOrg(0)
    },
    organizeUpdate (value) {
      this.resetList()
      this.setCalendarOrg(value)
    },
    resetList () {
      this.setEmptyQueryTime()
      //   this.setEmptyQuerySumMonthTime()
      //   this.setEmptySumHoursOnePersonByMonth()
      this.setEmptyCalendarTasks()
      this.initCalendarPage()
    },
    onLoadData (index, done) {
      this.GetPsons()
      this.getPsonCalendarTasks(() => {
        setTimeout(() => {
          if (this.$store.state['task'].calendarPage.nextPageToken === -1) {
            done(true)
          } else {
            done()
          }
        }, 1000)
      })
    },
    // 分页获取人员台账日历数据
    getPsonCalendarTasks (callBack) {
      if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
        this.orgId = 1
        this.psonId = 0
      } else {
        this.orgId = 0
        this.psonId = +this.$myinfo.id
      }
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'Type', Value: 'item', Oper: 'eq' },
        'and',
        { Key: 'BeginTime', Value: this.queryDate.startTime, Oper: 'ge' },
        'and',
        { Key: 'FinishedTime', Value: date.formatDate(date.addToDate(new Date(this.queryDate.endTime), { days: 1 }), 'YYYY-MM-DD'), Oper: 'lt' }
      ]
      let showPsonIds = this.GetPsonsOderByOrgId()
      if (showPsonIds) {
        query.push('and', { Key: 'AssignedTo', value: showPsonIds.join(','), oper: 'in' })
      }
      let aa = this.$store.state['task'].queryTime
      if (this.person && this.person.id) { // 有人员查询条件，重新加载后台
        this.loadWorkRecordCalendarList({ query: query, orgId: this.orgId, psonId: this.psonId })
          .then(res => {
            callBack && callBack()
          })
      } else {
        // 因为切换上下周时，清空了this.psonIds和翻页，所以，对于查询过的时间段，前20个不会访问后台，20个往后会再次从后台拿数据
        if ((_.indexOf(aa.startTime, this.queryDate.startTime) < 0 &&
          _.indexOf(aa.endTime, this.queryDate.endTime) < 0) ||
          (this.$store.state['task'].calendarPage.nextPageToken !== -1 &&
            this.$store.state['task'].calendarPage.offset > 0)) {
          this.loadWorkRecordCalendarList({ query: query, orgId: this.orgId, psonId: this.psonId })
            .then(res => {
              callBack && callBack()
            })
        } else {
          callBack && callBack()
        }
      }
    },
    // 获取当前用户有权限查看的人员信息
    GetPsons () {
      let organizeIds = ''
      if (this.organizeId) { // 有机构查询条件
        this.orgId = +this.organizeId
        organizeIds = this.organizeId + ''
      } else {
        organizeIds = (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) ? '1' : this.$myinfo.organizeIds
      }
      let childPaths = _.filter(this.$store.state.organize.selectOrganizes, o => organizeIds.split(',').indexOf(String(o.id)) >= 0).map(r => { return r.childPath })
      let allOrganizeIds = _.uniq(_.join(childPaths, ',').split(',')).map(r => { return _.toNumber(r) })
      let selectPsons = []
      if (this.person && this.person.id) { // 有人员查询条件
        // 判断该人是否属于该机构
        selectPsons = _.values(this.selectPersons).filter(item => allOrganizeIds.indexOf(item.organizeId) >= 0 && item.id === this.person.id)
      } else {
        selectPsons = _.values(this.selectPersons).filter(item => allOrganizeIds.indexOf(item.organizeId) >= 0)
      }
      // 过滤掉离职人员
      let selectInservicePsons = selectPsons.filter(m => m.isInService)
      let psonsOrderByOrgID = _.orderBy(selectInservicePsons, ['OrganizeId'], ['asc'])
      return psonsOrderByOrgID
    },
    // 获取台账日历左侧的人员信息
    GetPsonsOderByOrgId () {
      let limitpsonIDs = []
      let psonsOrderByOrgID = this.GetPsons()
      limitpsonIDs = psonsOrderByOrgID.slice(this.$store.state['task'].calendarPage.offset, this.$store.state['task'].calendarPage.offset + this.$store.state['task'].calendarPage.limit + 1).map(r => { return r.id })
      if (limitpsonIDs.length > this.$store.state['task'].calendarPage.limit) {
        this.$store.state['task'].calendarPage.nextPageToken = limitpsonIDs.pop()
        this.psonIds = this.psonIds.concat(_.difference(limitpsonIDs, this.psonIds))
        this.$store.state['task'].calendarPage.offset += limitpsonIDs.length
      } else {
        this.psonIds = this.psonIds.concat(_.difference(limitpsonIDs, this.psonIds))
        this.$store.state['task'].calendarPage.nextPageToken = -1
      }
      return limitpsonIDs
    },
    // 按月统计每个人员的总工时
    personTotalWorkHoursMonthly () {
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'Type', Value: 'item', Oper: 'eq' },
        'and',
        { Key: 'BeginTime', Value: this.monthToalDate.startTime, Oper: 'ge' },
        'and',
        { Key: 'FinishedTime', Value: date.formatDate(date.addToDate(new Date(this.monthToalDate.endTime), { days: 1 }), 'YYYY-MM-DD'), Oper: 'lt' }
      ]
      let aa = this.$store.state['task'].querySumMonthTime
      if (_.indexOf(aa.startTime, this.monthToalDate.startTime) < 0 &&
        _.indexOf(aa.endTime, this.monthToalDate.endTime) < 0) {
        this.loadPersonSumHoursByMonth({ query: query })
      }
    },
    // 按月统计机构下所有员工的总工时
    TotalHoursByMonth () {
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'Type', Value: 'item', Oper: 'eq' },
        'and',
        { Key: 'BeginTime', Value: this.monthToalDate.startTime, Oper: 'ge' },
        'and',
        { Key: 'FinishedTime', Value: date.formatDate(date.addToDate(new Date(this.monthToalDate.endTime), { days: 1 }), 'YYYY-MM-DD'), Oper: 'lt' }
      ]
      let aa = this.$store.state['task'].querySumMonthTime
      if (_.indexOf(aa.startTime, this.monthToalDate.startTime) < 0 &&
        _.indexOf(aa.endTime, this.monthToalDate.endTime) < 0) {
        this.loadSumHoursByMonth({ query: query })
      }
    },
    // 左上角显示日期
    showHeaderDate (scope) {
      if (scope && scope[0].date !== this.queryDate.startTime) {
        // 给查询条件的开始时间和结束时间赋值
        this.queryDate = {
          startTime: scope[0].date,
          endTime: scope[scope.length - 1].date
        }
      }
      const time = new Date(this.selectedDate.replace(/-/g, '/')),
        yy = time.getFullYear(), mm = time.getMonth() + 1
      let curMonthFirst = new Date(time.getFullYear(), time.getMonth(), 1)
      let curMonthLast = new Date(time.getFullYear(), time.getMonth() + 1, 0)
      this.monthToalDate = {
        startTime: curMonthFirst.getFullYear() + '-' + (curMonthFirst.getMonth() + 1) + '-' + curMonthFirst.getDate(),
        endTime: curMonthLast.getFullYear() + '-' + (curMonthLast.getMonth() + 1) + '-' + curMonthLast.getDate()
      }
      return { year: yy, month: mm }
    },
    // 点击今天按钮
    returnToToday () {
      this.selectedDate = today()
    },
    // 下周
    calendarNext () {
      this.$refs.calendar.next()
    },
    // 上周
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    // 日期选择
    onClickDate ({ scope }) {
      this.selectedDate = scope.timestamp.date
    },
    reloadScroll () {
      this.$refs.infiniteScroll.reset() // 设置滚动索引为0
      this.$refs.infiniteScroll.resume() // 重新开启加载
      this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
    },
    dotsShow (resource, date) {
      return resource.personOneDayRecords[date].slice(0, 9)
    }
  },
  mounted () {
    this.psonIds = []
    this.resetList()
  },
  watch: {
    queryDate: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (oldVal && newVal && newVal.startTime !== oldVal.startTime && oldVal.startTime) {
          this.psonIds = []
          let aa = this.$store.state['task'].queryTime
          // 如果该资源的这个时间段查询过，则不需要再次获取
          if (_.indexOf(aa.startTime, this.queryDate.startTime) < 0 &&
            _.indexOf(aa.endTime, this.queryDate.endTime) < 0) {
            // this.psonIds = []
            this.initCalendarPage()
            this.reloadScroll()
          } else {
            this.initCalendarPage()
            this.GetPsonsOderByOrgId()
          }
        }
      }
    },
    monthToalDate: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (oldVal && newVal && newVal.startTime !== oldVal.startTime && newVal.startTime) {
          if (_.indexOf(this.querySumMonthTime.startTime, this.monthToalDate.startTime) < 0 &&
            _.indexOf(this.querySumMonthTime.endTime, this.monthToalDate.endTime) < 0) {
            this.TotalHoursByMonth()
            this.personTotalWorkHoursMonthly()
          }
        }
      }
    },
    person: {
      deep: true,
      handler (newValue, oldValue) {
        this.psonIds = []
        this.initCalendarPage()
        this.reloadScroll()
      }
    },
    organizeId: {
      deep: true,
      handler (newValue, oldValue) {
        this.psonIds = []
        this.initCalendarPage()
        this.reloadScroll()
      }
    },
    $route: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.psonIds = []
        this.resetList()
      }
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwAvatar: () => import('components/base/TwAvatar'),
    WorkRecordItem: () => import('components/work-record/WorkRecordItem')
  }
}
</script>

<style lang="scss" scoped>
.calendar-panel {
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
}
.calender-toolbar {
  border: #e0e0e0 1px solid;
  border-bottom: none;
}
.calendar {
  border: #e0e0e0 1px solid;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}
/deep/.q-calendar-scheduler__head-weekday,
/deep/.q-calendar-scheduler .q-calendar-scheduler__resource {
  justify-content: center;
}
/deep/.q-active-date {
  color: blue;
  background: #ccccff !important;
}
.q-calendar .task-avatar .q-avatar {
  width: auto;
  height: auto;
}
/* 去掉input尾部上下小箭头*/
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield;
}
</style>
