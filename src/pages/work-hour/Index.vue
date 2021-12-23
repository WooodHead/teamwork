<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <q-card
      v-if="inHome"
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <tw-header-card
        :title="$t('workHour.title')"
        :actions="actions"
        :add="{
          label: $t('workHour.workHours'),
          click: addEvent
        }"
      >
        <template #menu>
          <tw-menu
            :menus="menus"
            @export="onExport"
          />
        </template>
      </tw-header-card>
      <div class="q-px-xxl q-pb-xl">
        <div
          class="row items-center justify-center q-mb-sm"
          v-if="['project', 'productDev'].includes(this.category)"
        >
          <div v-if="$custom.hasWorkHourBar">
            <span class="text-subtitle1 text-red">{{$t('workHour.hint')}}</span>
            <span
              :class="{'emoji-font':$q.platform.is.win}"
              class="q-ml-xs"
            > 👊</span>
          </div>
        </div>
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
                dense
                stretch
                :title="$t('schedule.returnToToday')"
                :label="$t('schedule.today')"
                @click="returnToToday"
              />
            </div>
            <q-space />
            <div
              class="row justify-center items-center text-h6"
              style="word-break:break-all;"
            >
              <span v-if="$q.screen.gt.sm">{{showTotalNote()}}</span>
              <span v-else>{{$t('workHour.totalHours') + '：'+Math.abs(totalHoursShowByMobile.toFixed(1))}}</span>
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
            <q-calendar
              ref="calendar"
              v-model="selectedDate"
              view="week-scheduler"
              :weekdays="[1,2,3,4,5,6,0]"
              short-weekday-label
              :resources="workHoursList"
              :resource-height="$q.screen.lt.sm&&!isSettingRoad?'70':'90'"
              :resource-width="$q.screen.lt.sm?'50':'100'"
              resource-key="psonName"
              @click:date2="onClickDate"
              :locale="$q.lang.getLocale()"
              no-scroll
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
              <template #scheduler-resource="{ resource /*, index */ }">
                <div class=" column items-center justify-center">
                  <div class=" row items-center justify-center">
                    <tw-avatar
                      :id="resource.psonId"
                      size="md"
                    />
                    <span
                      v-if="$q.screen.gt.sm"
                      class="text-caption q-ml-xs"
                    >{{resource.psonName}}</span>
                  </div>

                  <div
                    style="word-break:break-all;"
                    class="text-caption q-mt-xs"
                  >
                    <div v-if="$q.screen.gt.sm">
                      <div v-if="resource.onePsonSumWorkHours">
                        {{$t('workHour.workHour') + '：'}}{{ Math.abs(resource.onePsonSumWorkHours.toFixed(1))}}
                      </div>
                      <div v-if="isSettingRoad &&resource.onePsonSumOnRoadHours">
                        {{$t('workHour.onRoadHour') + '：'}}{{Math.abs(resource.onePsonSumOnRoadHours.toFixed(1))}}
                      </div>
                    </div>
                    <div v-else>
                      <span v-if="resource.onePsonSumWorkHours+resource.onePsonSumOnRoadHours"> {{ Math.abs((resource.onePsonSumWorkHours+resource.onePsonSumOnRoadHours).toFixed(1))}}</span>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 显示弹出代理 -->
              <template #scheduler-resource-day="{ timestamp, /* index, */ resource }">
                <div
                  class="fit row items-center justify-center"
                  :style="((resource&&resource.psonId===$myinfo.id)||
                  model.leaderID===$myinfo.id ||
                   manDayTasks(timestamp.date,category,objectID,resource.psonId).length>0)?'cursor:pointer':'cursor:default'"
                  :ref="(resource&&resource.psonId===$myinfo.id)?`${resource.psonId}${timestamp.date}`:''"
                  @click="clickHours(manDayTasks(timestamp.date,category,objectID,resource.psonId))"
                >
                  <span
                    v-if="resource&&resource.onePsonHours&&resource.onePsonHours[timestamp.date]"
                    class="text-h6"
                    style="word-break:break-all;"
                  >
                    <div
                      v-if="resource.onePsonHours[timestamp.date].hours"
                      :title="$t('workHour.workHour')"
                    >
                      <q-icon
                        v-if="$q.screen.gt.sm&&isSettingRoad"
                        name="timer"
                      />
                      {{ Math.abs(resource.onePsonHours[timestamp.date].hours.toFixed(1)) }}
                    </div>
                    <div
                      v-if="isSettingRoad &&resource.onePsonHours[timestamp.date].onRoadHours"
                      :title="$t('workHour.onRoadHour')"
                    >
                      <q-icon
                        v-if="$q.screen.gt.sm"
                        name="local_taxi"
                      />
                      {{Math.abs(resource.onePsonHours[timestamp.date].onRoadHours.toFixed(1)) }}
                    </div>
                  </span>
                  <!-- 有任务显示• -->
                  <div
                    class="row justify-center task-avatar"
                    style="bottom: 2px;position: absolute;width:100%;"
                  >
                    <q-avatar
                      rounded
                      v-for="(task, index) in manDayTasks(timestamp.date,category,objectID,resource.psonId).slice(0,maxOneDay)"
                      :key=index
                      text-color="primary"
                      :title="task.name"
                    >•</q-avatar>
                  </div>
                </div>

                <q-popup-edit
                  v-if="(resource&&resource.psonId===$myinfo.id)||model.leaderID===$myinfo.id ||manDayTasks(timestamp.date,category,objectID,resource.psonId).length>0"
                  value
                  :anchor="$q.screen.gt.sm?'center left':'center middle'"
                  @before-show="beforeShowPsonHour(resource.onePsonHours[timestamp.date])"
                >
                  <div
                    v-if="(resource&&resource.psonId===$myinfo.id) || model.leaderID===$myinfo.id"
                    class="q-px-sm q-mt-md"
                    style="max-width: 300px;"
                  >
                    <q-input
                      dense
                      type="number"
                      autofocus
                      :placeholder="$t('workHour.workHourInput')"
                      v-model="workHour"
                      :rules="[val => isValid(val) || errorMessage]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="timer" />
                      </template>
                    </q-input>

                    <q-input
                      v-if="isSettingRoad"
                      dense
                      type="number"
                      :placeholder="$t('workHour.onRoadHourInput')"
                      v-model="roadHour"
                      :rules="[val => isValid(val) || errorMessage]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="local_taxi" />
                      </template>
                    </q-input>

                    <form-action
                      align="left"
                      v-close-popup
                      :action="formAction"
                      @submit="onSubmit(timestamp.date,resource.onePsonHours[timestamp.date],resource.psonId)"
                      @reset="onReset(timestamp.date,resource.onePsonHours[timestamp.date],resource.psonId)"
                    />
                  </div>
                  <div
                    v-if="manDayTasks(timestamp.date,category,objectID,resource.psonId).length>0"
                    class="q-mt-md"
                    :style="$q.screen.gt.sm?'max-width:30vw':'width:100%;'"
                  >
                    <q-separator class="q-mb-sm" />
                    <span class="text-weight-bold">{{$t('workHour.todayTask')}}</span>
                    <q-item class="column cursor-pointer text-left text-caption q-gutter-sm">
                      <widget-task-item
                        v-for="task in curTaskList"
                        :key="task.id"
                        :task="task"
                      />
                    </q-item>
                  </div>

                </q-popup-edit>
              </template>
            </q-calendar>
          </div>
        </div>
      </div>
    </q-card>

    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { format, Platform, Notify } from 'quasar'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import WorkHour from '@/store/work-hour/model'
import QCalendar from '@quasar/quasar-ui-qcalendar'
import { jsonToExcel } from '@/utils/json-to-excel'
const { capitalize } = format, CURRENT_DAY = new Date()
function today () {
  return QCalendar.parseDate(CURRENT_DAY).date
}

export default {
  name: 'Index',
  props: {
    category: {
      type: String,
      required: true,
      default: 'project'// project、team、productDev、organize
    },
    objectID: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwAvatar: () => import('components/base/TwAvatar'),
    FormAction: () => import('components/base/TwFormAction'),
    WidgetTaskItem: () => import('components/task/WidgetTaskItem'),
    TwMenu: () => import('components/base/TwMenu')
  },
  data () {
    return {
      modelPsonIds: [],
      selectedDate: QCalendar.parseDate(CURRENT_DAY).date,
      workHour: '',
      roadHour: '',
      oldWorkHour: 0, // 用于工时变更时计算总数
      oldRoadHour: '',
      openType: 'add',
      queryDate: { startTime: '', endTime: '' },
      errorMessage: '',
      selectTaskIds: [],
      maxOneDay: 9,
      isSettingRoad: false,
      formAction: [
        { label: this.$t('label.ok'), action: 'submit' },
        { label: this.$t('label.clear'), action: 'reset' }
      ],
      menus: ['export'],
      exportFileColumnArray: [this.$t('workHour.resourcePsonName'), this.$t('workHour.sumHours')]
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('workHour', ['workHours', 'resource', 'sumHourList', 'queryTime', 'sumHoursByOwnerList']),
    ...mapState('task', ['tasks']),
    ...mapGetters('task', ['manDayTasks']),
    ...mapGetters('member', ['membersFilterInService']),
    inHome () {
      // 如果不判断，在其他界面也会进入inServiceTotalHours方法，会导致累计数显示错误
      return this.$route.name === 'workHour'
    },
    allPsonIds () {
      const ownerIds = this.sumHoursByOwnerList.map(r => { return r.ownerID })
      const allIds = _.union(this.modelPsonIds, ownerIds)
      return _.filter(allIds, f => this.selectPersons[f])
    },
    // 最终的resources列表
    workHoursList () {
      if (this.allPsonIds.length) {
        let list = [], filterWorkHourList = [], filterSumHourList = []
        _.forEach(this.allPsonIds, m => {
          filterWorkHourList = _.filter(this.workHours, p => p.ownerID === +m && p.objectType === this.category && p.objectID === +this.objectID)
          filterSumHourList = _.filter(this.sumHoursByOwnerList, p => p.ownerID === +m && p.objectType === this.category && p.objectID === +this.objectID)
          list.push(Object.assign({}, {
            psonId: +m,
            psonName: (this.selectPersons[+m] && this.selectPersons[+m].name) || '',
            onePsonHours: _.keyBy(filterWorkHourList, 'date'),
            onePsonSumWorkHours: _.sumBy(filterSumHourList, 'sumWorkHours'),
            onePsonSumOnRoadHours: _.sumBy(filterSumHourList, 'sumOnRoadHours')
          }))
        })
        return list
      } else {
        return []
      }
    },
    // 累计总数
    totalWorkHours: {
      get () {
        return (this.sumHourList.sumWorkHours && this.sumHourList) || this.inServiceTotalHours
      },
      set (val) {
        this.setSumHourList(val)
      }
    },
    // 累计总数。一般从state里面获取，强刷时才会执行
    inServiceTotalHours () {
      if (this.sumHoursByOwnerList.length) {
        let inService = _.filter(this.sumHoursByOwnerList, p => this.selectPersons[p.ownerID] && p.objectType === this.category && p.objectID === +this.objectID)
        let total = {
          sumWorkHours: _.sumBy(inService, 'sumWorkHours'),
          sumOnRoadHours: _.sumBy(inService, 'sumOnRoadHours')
        }
        this.setSumHourList(total)
        return total
      } else {
        return {
          sumWorkHours: 0,
          sumOnRoadHours: 0
        }
      }
    },
    resources () {
      const { category, objectID } = this
      return { category, objectID }
    },
    showAddButton () {
      return _.filter(this.allPsonIds, m => m === this.$myinfo.id).length
    },
    // 当天的任务列表
    curTaskList () {
      if (['team', 'organize'].includes(this.category)) {
        return _.filter(this.tasks, m => (_.indexOf(this.selectTaskIds, m.id) >= 0))
      } else {
        return _.filter(this.tasks, m => m.objectType === this.category && m.objectId === +this.objectID && (_.indexOf(this.selectTaskIds, m.id) >= 0))
      }
    },
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
    },
    totalHoursShowByMobile () {
      return this.totalWorkHours.sumWorkHours + this.totalWorkHours.sumOnRoadHours
    },
    actions () {
      if (this.showAddButton) {
        return ['add', 'menu']
      } else {
        return ['menu']
      }
    },
    exportFileName () {
      return this.model.title + this.$t('workHour.hoursStatics')
    },
    exportHourLists () {
      let lists = _.cloneDeep(this.workHoursList)
      let initLists = [], exportLists = [], data = {}
      initLists.push({
        resourceName: this.model.title,
        sumHours: typeof (this.totalWorkHours) === 'object' ? (this.totalWorkHours.sumWorkHours + this.totalWorkHours.sumOnRoadHours) : this.totalWorkHours
      })
      _.forEach(lists, item => {
        initLists.push(Object.assign({}, {
          resourceName: item.psonName,
          sumHours: item.onePsonSumWorkHours + item.onePsonSumOnRoadHours
        }))
      })
      let rowArray = _.cloneDeep(initLists)
      _.forEach(rowArray, row => {
        _.forEach(this.exportFileColumnArray, (c, columnIndex) => {
          if (columnIndex === 0) {
            data[c] = row.resourceName
          } else if (columnIndex === 1) {
            data[c] = row.sumHours
          }
        })
        exportLists.push(data)
        data = {}
      })
      return exportLists
    }
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', ['clearWidgetBreadcrumbs', 'pushWidgetBreadcrumb']),
    ...mapActions('workHour', ['loadWorkHours', 'addWorkHour', 'updateWorkHour', 'loadSumHoursByOwner']),
    ...mapMutations('workHour', ['setEmptyWorkHours', 'setSumHourList', 'setEmptySumHoursByOwnerList', 'setEmptyQueryTime', 'updateSumHoursByOwnerList']),
    ...mapActions('task', ['loadTasks', 'loadListOfMembers']),
    addEvent () {
      let name = this.$myinfo.id + this.selectedDate
      this.$refs[name] && this.$refs[name].click()
    },
    init () {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, +this.objectID).then(res => {
        if (res) {
          if (res.membersObject && Object.keys(res.membersObject).length) {
            this.modelPsonIds = _.uniq([res.membersObject.leader].concat(res.membersObject.member.map(Number)))
          } else {
            // 一般情况model里会有membersObject，如果没有就使用members
            this.modelPsonIds = res.members.map(Number)
          }

          if (_.indexOf(this.modelPsonIds, this.$myinfo.id) > 0) {
            this.modelPsonIds.splice(this.modelPsonIds.findIndex(f => f === this.$myinfo.id), 1)
            this.modelPsonIds.unshift(this.$myinfo.id)
          }
          // 自定义内容
          if (res.widgets.workHour.road) this.isSettingRoad = true

          // 如果资源的详情页已经获取了累计值，则不用再次获取
          if (this.category !== this.resource.objectType ||
            +this.objectID !== +this.resource.objectID) {
            this.setSumHourList({
              sumWorkHours: 0,
              sumOnRoadHours: 0
            })
            this.setEmptySumHoursByOwnerList()
            this.setEmptyQueryTime()
            this.loadSumHourListByOwner()
          }
          // 如果该资源的这个时间段查询过，则不需要再次获取
          if (!(this.category === this.resource.objectType &&
            +this.objectID === +this.resource.objectID &&
            _.indexOf(this.queryTime.startTime, this.queryDate.startTime) >= 0 &&
            _.indexOf(this.queryTime.endTime, this.queryDate.endTime) >= 0)) {
            this.loadWorkHourList()
            this.loadTaskList()
          }
        }
      })
    },
    // 获取工时列表
    loadWorkHourList () {
      let query = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'OwnerType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'Date', Value: this.queryDate.startTime, Oper: 'ge' },
        'and',
        { Key: 'Date', Value: this.queryDate.endTime, Oper: 'le' }
      ]
      this.loadWorkHours({ query: query })
    },
    // 获取累计总数。一般从state里面获取，强刷时才会执行
    loadSumHourListByOwner () {
      let query = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'OwnerType', Value: 'person', Oper: 'eq' }
      ]
      this.loadSumHoursByOwner({ query: query, fields: 'Sum' })
    },
    // 获取任务列表
    loadTaskList () {
      const query = [
        [
          [
            { Key: 'StartTime', Value: this.queryDate.startTime, Oper: 'ge' },
            'and',
            { Key: 'StartTime', Value: this.queryDate.endTime, Oper: 'le' }
          ],
          'or',
          [
            { Key: 'EndTime', Value: this.queryDate.startTime, Oper: 'ge' },
            'and',
            { Key: 'EndTime', Value: this.queryDate.endTime, Oper: 'le' }
          ],
          'or',
          [
            { Key: 'StartTime', Value: this.queryDate.startTime, Oper: 'le' },
            'and',
            { Key: 'EndTime', Value: this.queryDate.endTime, Oper: 'ge' }
          ],
          'or',
          [
            { Key: 'FinishedTime', Value: this.queryDate.startTime, Oper: 'ge' },
            'and',
            { Key: 'FinishedTime', Value: this.queryDate.endTime, Oper: 'le' }
          ]
        ]
      ]
      if (['project', 'productDev'].includes(this.category)) {
        query.push(...['and',
          { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
          'and',
          { Key: 'Type', Value: 'item', Oper: 'eq' }
        ])
        this.loadTasks({ query: query, fields: 'Select' })
      } else if (['team', 'organize'].includes(this.category)) {
        this.loadListOfMembers({
          objectID: +this.objectID,
          objectType: this.category,
          query: query
        })
      }
    },
    //  左上角显示日期
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
    // 个人工时显示前过滤
    beforeShowPsonHour (value) {
      if (value) {
        this.workHour = value.hours || ''
        this.oldWorkHour = value.hours
        this.roadHour = value.onRoadHours || ''
        this.oldRoadHour = value.onRoadHours
        this.openType = 'update'
      } else {
        this.workHour = ''
        this.oldWorkHour = ''
        this.roadHour = ''
        this.oldRoadHour = ''
        this.openType = 'add'
      }
    },
    // 判断填写的工时是否有效
    isValid (val) {
      if (val) {
        if (val < 0) {
          this.errorMessage = this.$t('rule.positiveNum')
          return false
        } else if (_.indexOf(_.toString(val), '.') < 0) {
          if (_.toString(val).length > 11) {
            this.errorMessage = this.$t('rule.atlatestNCharacters', { number: 11 })
            return false
          }
        } else if (_.indexOf(_.toString(val), '.') >= 0) {
          let length = _.toString(val).split('.')[1] && _.toString(val).split('.')[1].length
          if (length > 1) {
            this.errorMessage = this.$t('rule.oneDecimalPointNum')
            return false
          }
        }
      }
      return true
    },
    showTotalNote () {
      let notes = ''
      if (!this.isSettingRoad) {
        const total = Math.abs((this.totalWorkHours.sumWorkHours + this.totalWorkHours.sumOnRoadHours).toFixed(1))
        notes = this.$t('workHour.totalWorkHours') + '：' + Math.abs(total.toFixed(1))
      } else {
        notes = this.$t('workHour.totalWorkHours') + '：' + Math.abs(this.totalWorkHours.sumWorkHours.toFixed(1))
      }
      if (this.isSettingRoad && this.totalWorkHours.sumOnRoadHours) {
        notes += '\t\t' + this.$t('workHour.onRoadHour') + '：' + Math.abs(this.totalWorkHours.sumOnRoadHours.toFixed(1))
      }
      return notes
    },
    // 保存方法
    onSubmit (date, workHourModel, psonId) {
      if (this.isValid()) {
        if (this.openType === 'add') {
          if (+this.workHour || +this.roadHour) {
            let hoursModel = new WorkHour({
              objectType: this.category,
              objectID: +this.objectID,
              date: date,
              ownerType: 'person',
              ownerID: +psonId,
              hours: +this.workHour,
              onRoadHours: +this.roadHour
            })
            this.addWorkHour(hoursModel)
            this.updateSumHoursByOwnerList({
              psonId: +psonId,
              objectType: this.category,
              objectID: +this.objectID,
              workHour: [0, +this.workHour],
              onRoadHour: [0, +this.roadHour]
            })
            this.totalWorkHours = {
              sumWorkHours: this.sumHourList.sumWorkHours + (+this.workHour),
              sumOnRoadHours: this.sumHourList.sumOnRoadHours + (+this.roadHour)
            }
          }
        } else {
          Object.assign(workHourModel,
            {
              hours: +this.workHour,
              onRoadHours: +this.roadHour
            })
          this.updateWorkHour(workHourModel)
          this.updateSumHoursByOwnerList({
            psonId: +psonId,
            objectType: this.category,
            objectID: +this.objectID,
            workHour: [+this.oldWorkHour, +this.workHour],
            onRoadHour: [+this.oldRoadHour, +this.roadHour]
          })
          this.totalWorkHours = {
            sumWorkHours: this.sumHourList.sumWorkHours - (+this.oldWorkHour) + (+this.workHour),
            sumOnRoadHours: this.sumHourList.sumOnRoadHours - (+this.oldRoadHour) + (+this.roadHour)
          }
        }
      }
    },
    onReset (date, workHourModel, psonId) {
      this.workHour = ''
      this.roadHour = ''
      this.onSubmit(date, workHourModel, psonId)
      this.oldWorkHour = 0
      this.oldRoadHour = 0
    },
    // 点击获取任务列表页
    clickHours (val) {
      if (val && val.length) {
        this.selectTaskIds = val.map(r => r.id)
        let task = []
        // 判断当前state中是否能查全，若能全部查出来，则不用再次从后台获取
        if (['team', 'organize'].includes(this.category)) {
          task = _.filter(this.tasks, m => (_.indexOf(this.selectTaskIds, m.id) >= 0))
        } else {
          task = _.filter(this.tasks, m => m.objectType === this.category && m.objectId === +this.objectID && (_.indexOf(this.selectTaskIds, m.id) >= 0))
        }
        if (!(task && task.length === this.selectTaskIds.length)) {
          let query = [{ Key: 'TaskID', Value: this.selectTaskIds.join(','), Oper: 'in' }]
          this.loadTasks({ query: query, fields: 'View' })
        }
      }
    },
    // 导出人员工时
    onExport () {
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
          name: this.exportFileName,
          sheetName: this.exportFileName,
          data: this.exportHourLists,
          keyMap: this.exportFileColumnArray // 列名
        }
        this.$q.loading.hide()
        if (this.exportHourLists.length) {
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
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    resources: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
        if (newVal && oldVal && !(newVal.category === oldVal.category && +newVal.objectID === +oldVal.objectID)) {
          this.setEmptyWorkHours()
          this.init()
        }
      }
    },
    queryDate: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (oldVal && newVal && newVal.startTime !== oldVal.startTime && oldVal.startTime) {
          // 如果该资源的这个时间段查询过，则不需要再次获取
          if (_.indexOf(this.queryTime.startTime, this.queryDate.startTime) < 0 && _.indexOf(this.queryTime.endTime, this.queryDate.endTime) < 0) {
            this.loadWorkHourList()
            this.loadTaskList()
          }
        }
      }
    },
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        if (this.$q.platform.is.mobile) return
        let newRoute = newVal, oldRoute = oldVal
        if (newRoute && oldRoute) {
          if (newRoute.params &&
            newRoute.params.category === this.resources.category &&
            +newRoute.params.objectID === +this.resources.objectID &&
            newRoute.path !== oldRoute.path) {
            this.setModuleBreadcrumbs()
          }
        }
        if (!newRoute.path.includes('work-hour')) {
          return
        }
        this.clearWidgetBreadcrumbs()
      }
    }
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
/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
</style>
