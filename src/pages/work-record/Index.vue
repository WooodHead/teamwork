<template>
  <q-page
    class="column items-center"
    :class="$q.screen.gt.sm?'q-pa-sm':'q-py-sm'"
  >
    <!-- 面包屑区域 -->
    <tw-breadcrumbs
      v-if="!$q.platform.is.mobile"
      data-html2canvas-ignore
    />
    <q-card
      v-if="inHome"
      class="card-grow-in-page"
      :flat="$q.screen.lt.sm"
    >
      <tw-header-card
        :class="{'header-card':$q.platform.is.mobile}"
        :title="$t('workRecord.module')"
        :actions="headerMenus"
        :add="{label: $t('workRecord.beginWork'),click: addEvent}"
      >
        <template
          #add
          v-if="$q.platform.is.mobile"
        >
          <work-record-mobile-add
            v-show="!(search || fromToDate)"
            :task="task"
          ></work-record-mobile-add>
        </template>
        <template #menu>
          <tw-menu
            :menus="menus"
            @exportReport="toExportReport"
            @workRecordList="toWorkRecordList"
            @workRecordCalendar="toWorkRecordCalendar"
            @personalWorkRecordCalendar="toPersonalWorkRecordCalendar"
            @workRecordDashboard="toWorkRecordDashboard"
          />
        </template>
      </tw-header-card>
      <q-card-section class="q-px-xxl q-pt-none">
        <tw-search-sort
          :search.sync="newSearch"
          class="q-pb-md"
        >
          <template #searchPrepend>
            <q-icon
              v-if="search || fromToDate"
              name="close"
              @click="searchUpdate('')"
              class="cursor-pointer"
            />
            <q-icon name="search" />
          </template>
          <template #searchAppend>
            <div
              class="text-body2"
              v-if="fromToDate"
            >
              {{searchDateTitle}}
            </div>
            <q-icon
              name="event"
              class="cursor-pointer"
              :title="$t('task.detail.selectDate')"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fromToDate"
                  mask="YYYY-MM-DD"
                  range
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </tw-search-sort>
        <work-record-list />
      </q-card-section>
    </q-card>
    <!-- 导出报表 -->
    <q-dialog
      v-model="showExportReportDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <export-report />
    </q-dialog>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'Index',
  data () {
    return {
      inHome: false,
      showExportReportDialog: false,
      menus: ['workRecordDashboard', 'personalWorkRecordCalendar'],
      headerMenus: ['add', 'menu']
    }
  },
  computed: {
    ...mapState('task', ['search', 'tasks']),
    newSearch: {
      get () {
        return this.search
      },
      set (value) {
        this.searchUpdate(value)
      }
    },
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
    searchDateTitle () {
      if (this.fromToDate) {
        return this.fromToDate.from + '~' + this.fromToDate.to
      } else {
        return ''
      }
    },
    task () {
      return _.find(this.tasks, p =>
        p.objectType === 'person' && p.objectId === +this.$myinfo.id && p.type === 'item' && !p.finished
      ) || null
    }
  },
  mounted () {
    if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isSeniorManager ||
      this.$myinfo.auth.role.isOrganizeManager) {
      this.menus = ['exportReport', 'workRecordList', 'workRecordCalendar', 'workRecordDashboard', 'personalWorkRecordCalendar']
    }
  },
  methods: {
    ...mapMutations('task', ['setSearch', 'setEmptyTasks', 'initPage', 'setFromToDate']),
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapActions('task', ['loadTask']),
    searchUpdate (value) {
      this.setEmptyTasks()
      this.setSearch(value)
      this.initPage()
      this.setFromToDate()
    },
    addEvent () {
      this.$router.push({ name: 'workRecordAdd' })
    },
    fromToDateUpdate (value) {
      this.setEmptyTasks()
      this.setFromToDate(value)
      this.initPage()
    },
    toExportReport () {
      this.showExportReportDialog = true
    },
    toWorkRecordList () {
      this.$router.push({ name: 'workRecordList' })
    },
    toWorkRecordCalendar () {
      this.$router.push({ name: 'workRecordCalendar' })
    },
    toPersonalWorkRecordCalendar () {
      this.$router.push({ name: 'personWorkRecordCalendar' })
    },
    toWorkRecordDashboard () {
      this.$router.push({ name: 'workRecordDashboard' })
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (route) {
        this.inHome = route.name === 'workRecordHome'
        if (this.$q.platform.is.mobile) return
        if (!route.path.includes('work-record')) {
          return
        }
        this.setModuleBreadcrumbs()
        this.clearWidgetBreadcrumbs()
        const id = +this.$route.params.id || 0
        let workrecord = {}
        if (id) workrecord = await this.loadTask(+id)

        if (route.name === 'workRecordHistory') {
          Object.keys(workrecord).length && this.pushWidgetBreadcrumb({
            id: 'workRecordDetail',
            title: workrecord.name || '',
            to: {
              name: 'workRecordDetail',
              params: { id: +id }
            }
          })
        } else if (route.name === 'workRecordDetail') {
          if (route.path.includes('person-calendar')) {
            this.pushWidgetBreadcrumb({
              id: 'personWorkRecordCalendar',
              title: this.$t('workRecord.personCalendar'),
              to: {
                name: 'personWorkRecordCalendar'
              }
            })
          } else if (route.path.includes('calendar')) {
            this.pushWidgetBreadcrumb({
              id: 'workRecordCalendar',
              title: this.$t('workRecord.dashboard.workRecordCalendar'),
              to: {
                name: 'workRecordCalendar'
              }
            })
          } else if (route.path.includes('list')) {
            this.pushWidgetBreadcrumb({
              id: 'workRecordList',
              title: this.$t('workRecord.dashboard.viewDetail'),
              to: {
                name: 'workRecordList'
              }
            })
          }
        }
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwSearchSort: () => import('components/base/TwSearchSort'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    WorkRecordList: () => import('components/work-record/WorkRecordList'),
    TwMenu: () => import('components/base/TwMenu'),
    WorkRecordMobileAdd: () => import('components/work-record/WorkRecordMobileAdd'),
    ExportReport: () => import('components/work-record/dashboard/ExportReport')
  }
}
</script>
<style  lang="scss" scoped>
.header-card /deep/.q-card__section {
  display: block;
  padding-bottom: 0px;
  padding-top: 8px;
}
</style>
