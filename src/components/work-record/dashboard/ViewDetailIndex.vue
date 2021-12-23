<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section class="q-px-xxl">
      <div
        class="q-pt-sm q-gutter-sm"
        style="font-size:14px"
        :class="$q.screen.lt.sm?'':'row'"
      >
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
        <q-input
          v-model="searchDateTitle"
          outlined
          rounded
          dense
          class="col"
          :placeholder="$t('search.startEndDate')"
          @click="showDate"
        >
          <template v-slot:append>
            <q-icon
              v-if="fromToDate"
              size="xs"
              name="close"
              @click.capture="resetFromToDate"
              class="cursor-pointer"
            />
            <q-icon
              flat
              name="event"
              class="cursor-pointer text-dark"
              title="选择日期"
            >
              <q-popup-proxy
                ref="date"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fromToDate"
                  mask="YYYY-MM-DD"
                  minimal
                  range
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
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
        <q-btn
          unelevated
          rounded
          class="q-px-sm"
          @click="click"
          color="primary"
          :label="$t('exportFile.export')"
        />
      </div>
    </q-card-section>
    <q-separator
      inset
      spaced
    />
    <!-- 工时记录列表 -->
    <q-card-section class="q-px-xxl q-pt-sm">
      <view-detail-list
        :person="person"
        :organizeId="organizeId"
        :fromToDate="fromToDate"
      />
    </q-card-section>
    <q-dialog v-model="exportExcel">
      <export-excel
        moduleType="task"
        loadDataAction="getworkrecordtasklist"
        :getDataParameter="queryList"
        :fields="exportFields"
        :packageDataExtra="{getComment:false}"
        :fileName="$t('workRecord.dashboard.viewDetail')"
        :sheetName="$t('workRecord.dashboard.viewDetail')"
        :tableHeader="{name:$t('workRecord.dashboard.viewDetail'),style:'color:white;font-weight:bold;font-size:35px;background-color:#1976D2;text-decoration:underline;'}"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { mapMutations } from 'vuex'
export default {
  name: 'ViewDetailIndex',
  data () {
    return {
      orgId: 0,
      psonId: +this.$myinfo.id,
      exportExcel: false,
      queryList: {},
      exportFields: ['TaskName', 'AssignedTo', 'BusinessType', 'Source', 'BeginTime', 'FinishedTime', 'WorkHour', 'OnRoadHour', 'Address', 'Description']
    }
  },
  computed: {
    organizeId: {
      get () {
        return this.$store.state.task.organizeId
      },
      set (value) {
        this.organizeUpdate(value)
      }
    },
    searchDateTitle () {
      if (this.fromToDate) {
        return this.fromToDate.from + '~' + this.fromToDate.to
      } else {
        return ''
      }
    }, // 搜索人员
    person: {
      get () {
        return this.$store.state.task.person || {
          id: null,
          name: '',
          type: 'all'
        }
      },
      set (value) {
        this.personUpdate(value)
      }
    },
    // 搜索日期
    fromToDate: {
      get () {
        return this.$store.state.task.fromToDate
      },
      set (value) {
        let date = {
          from: '',
          to: ''
        }
        if (!value.from) {
          date.from = value
          date.to = value
        } else {
          date = value
        }
        this.fromToDateUpdate(date)
      }
    },
    orgsAndChild () {
      let organizeIds = (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) ? '1' : this.$myinfo.organizeIds
      return this.$store && this.$store.getters['organize/selectOrganizesChildTreeByOrganizeIds'](organizeIds)
    }
  },
  methods: {
    ...mapMutations('task', ['setEmptyTasks', 'initPage', 'setFromToDate', 'setPerson', 'setOrganize']),
    resetPerson () {
      let person = {
        id: null,
        name: '',
        type: 'all'
      }
      this.resetList()
      this.setPerson(person)
    },
    resetOrganize () {
      this.resetList()
      this.setOrganize(0)
    },
    resetFromToDate () {
      this.resetList()
      this.setFromToDate(null)
    },
    fromToDateUpdate (value) {
      this.resetList()
      this.setFromToDate(value)
    },
    personUpdate (value) {
      this.resetList()
      this.setPerson(value)
    },
    organizeUpdate (value) {
      this.resetList()
      this.setOrganize(value)
    },
    showDate () {
      this.$refs.date.show()
    },
    resetList () {
      this.setEmptyTasks()
      this.initPage()
    },
    click () {
      if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager) {
        this.orgId = 1
        this.psonId = 0
      }
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' }
      ]
      if (this.person && this.person.id) {
        query.push('and', { Key: 'ObjectID', value: +this.person.id, oper: 'eq' })
      }
      if (this.organizeId) {
        this.orgId = +this.organizeId
      }
      if (this.fromToDate && this.fromToDate.from) {
        query.push(
          'and',
          [
            [
              { Key: 'Type', Value: 'item', Oper: 'eq' },
              'and',
              { Key: 'BeginTime', Value: this.fromToDate.from, oper: 'ge' },
              'and',
              { Key: 'BeginTime', Value: date.formatDate(date.addToDate(new Date(this.fromToDate.to), { days: 1 }), 'YYYY-MM-DD'), oper: 'lt' }
            ],
            'or',
            [
              { Key: 'Type', Value: 'list', Oper: 'eq' },
              'and',
              [
                { Key: 'DATE_FORMAT(BeginTime,\'%Y-%m\')', Value: date.formatDate(this.fromToDate.from, 'YYYY-MM'), oper: 'eq' },
                'or',
                { Key: 'DATE_FORMAT(BeginTime,\'%Y-%m\')', Value: date.formatDate(this.fromToDate.to, 'YYYY-MM'), oper: 'eq' }
              ]
            ]
          ]
        )
      }
      this.queryList = { query: JSON.stringify(query), orgId: this.orgId, psonId: this.psonId }
      this.exportExcel = true
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson'),
    ViewDetailList: () => import('components/work-record/dashboard/ViewDetailList'),
    ExportExcel: () => import('components/export/ExportExcel'),
    TwSelectTree: () => import('components/base/TwSelectTree')
  }
}
</script>
