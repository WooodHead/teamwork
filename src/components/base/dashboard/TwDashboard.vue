<!-- 仪表盘组件 -->
<template>
  <div class="q-py-sm">
    <div class="row justify-between q-col-gutter-md">
      <!-- 仪表盘 -->
      <div
        v-for="(chart, key) in charts"
        :key="key"
        :class="key === 'addButtonKey' ? 'col-12 col-sm-6' : chartsWidth[chart.name] || 'col-12 col-sm-6'"
      >
        <!-- 更多按钮 -->
        <tw-menu
          v-if="key !== addKey"
          flat
          class="float-right"
          style="z-index:100;"
          :menus="menus"
          @edit="onEdit(key, chart)"
          @delete="onDelete(key)"
          :style="$q.platform.is.mobile ? 'margin-top:8px;margin-right:8px;' : 'margin-top:12px;margin-right:12px;'"
        />
        <q-card
          flat
          bordered
          v-if="key !== addKey"
        >
          <!-- 图形组件 -->
          <component
            :is="`${chart.name}`"
            :uid="key"
            :chart="chart"
            :class="$q.platform.is.mobile ? 'q-pa-sm' : 'q-pa-md'"
          />
        </q-card>
        <!-- 添加按钮 -->
        <q-card
          flat
          bordered
          v-if="key === addKey"
          class="position-relative"
        >
          <q-btn
            flat
            :ripple="false"
            @click="onAdd()"
            class="flex items-center justify-center full-width"
            style="height:100%;"
            :style="$q.platform.is.desktop?'min-height: 400px;':'min-height: 100px;'"
          >
            <div class="text-center">
              <q-icon
                size="xl"
                name="add"
              />
              <div>
                <div>新建图表</div>
              </div>
            </div>
          </q-btn>
          <a
            v-if="!isDefault"
            class="absolute-bottom-right"
            :style="$q.platform.is.mobile ? 'bottom:8px;right:8px;' : 'bottom:16px;right:16px;'"
            href="javascript:void(0);"
            @click.capture.stop="onResetDefault()"
          >
            恢复默认图表
          </a>
        </q-card>
      </div>
    </div>
    <!-- 条件组件 -->
    <q-dialog v-model="showCondition">
      <dashboard-condition
        :category="category"
        :uid="currentUid"
        :chart="selectChart"
        :title="editTitle"
        :model="editModel"
        :conditionNeedMap="conditionNeedMap"
        :isEdit="isEdit"
        :isDefault="isDefault"
        @submit="getCharts"
        @cancel="onCancel()"
      />
    </q-dialog>
  </div>
</template>

<script>

import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
import { format, LocalStorage } from 'quasar'
const { capitalize } = format
import { mapActions } from 'vuex'
const addButtonKey = 'addButtonKey'

export default {
  name: 'TwDashboard',
  props: {
    category: {
      type: String,
      default: 'resume',
      required: true,
      description: '业务类型'
    },
    isDefault: {
      type: Boolean,
      default: false,
      required: false,
      description: '默认仪表盘/个人仪表盘'
    },
    conditionNeedMap: {
      type: Boolean,
      default: false,
      required: false,
      description: '是否需要额外处理条件model'
    }
  },
  data () {
    return {
      addKey: addButtonKey,
      charts: [],
      chartsWidth: {},
      menus: ['edit', 'delete'],
      showCondition: false,
      selectChart: null,
      isEdit: false,
      editModel: {},
      editTitle: '',
      currentUid: ''
    }
  },
  computed: {
    privateBoard () {
      return this.$store.getters['dashboard/privateBoard'](LocalStorage.getItem('myself').id, this.category)
    },
    defaultBoard () {
      return this.$store.getters['dashboard/defaultBoard'](this.category)
    },
    options () {
      return this.$store.getters[`${this.category}/${this.category}DashboardType`]
    }

  },
  methods: {
    capitalize,
    ...mapActions('dashboard', ['loadDashboardData', 'DeleteChart', 'UpdateChart', 'ResetCharts']),
    loadData () {
      this.loadDashboardData(this.category)
        .then(res => {
          this.getCharts(res)
          this.$emit('down', res)
        })
    },
    initCondition () {
      this.isEdit = false
      this.editModel = {}
      this.currentUid = '0'
      this.selectChart = null
    },
    onAdd () {
      this.initCondition()
      this.showCondition = true
    },
    async onEdit (uid, chart) {
      this.isEdit = true
      this.currentUid = uid
      this.editTitle = chart.title
      if (this.conditionNeedMap) {
        this.editModel = await this.$store.dispatch(`${this.category}/conditionToFront`, chart.model)
      } else {
        this.editModel = chart.model
      }
      let option = this.options.find(i => i.key === chart.name)
      this.selectChart = option

      this.showCondition = true
    },
    async onSelectChart (chart) {
      this.editTitle = chart.label
      let model = _.values(this.defaultBoard.charts).find(v => v.name === chart.key).model
      if (this.conditionNeedMap) {
        this.editModel = await this.$store.dispatch(`${this.category}/conditionToFront`, model)
      } else {
        this.editModel = model
      }
    },
    onDelete (uid) {
      this.currentUid = uid
      this.$q.dialog({
        title: '确认删除吗？',
        cancel: true,
        persistent: false
      }).onOk(() => {
        this.onDeleteChart()
      }).onCancel(() => {
        this.onCancel()
      })
    },
    onDeleteChart () {
      this.$q.loading.show()
      this.DeleteChart({
        isDefault: this.isDefault ? 1 : 0,
        id: this.isDefault ? this.defaultBoard.id : (this.privateBoard ? this.privateBoard.id : this.defaultBoard.id),
        uid: this.currentUid,
        category: this.category
      }).then(res => {
        this.$q.loading.hide()
        res ? showSuccessMessage('删除成功') : showWarningMessage('删除失败')
      })
    },
    onCancel () {
      this.showCondition = false
      this.initCondition()
    },
    getCharts (data) {
      let board = {}
      if (data instanceof Array) {
        let privateBoard = data.find(a => a.psonID !== 0)
        let defaultBoard = data.find(a => a.psonID === 0)
        board = this.isDefault ? defaultBoard : (privateBoard || defaultBoard)
      } else {
        board = data
      }
      if (!_.isEmpty(board)) {
        this.charts = _.cloneDeep(board.charts)
      }
      // 添加按钮
      this.charts[this.addKey] = {}
    },
    onResetDefault () {
      this.$q.dialog({
        title: '恢复默认图表',
        message: '该操作会删除所有已编辑的图表，确认恢复吗？',
        cancel: true,
        persistent: false
      }).onOk(() => {
        this.resetDefault()
      }).onCancel(() => {
      })
    },
    resetDefault () {
      this.onCancel()
      this.$q.loading.show()
      this.ResetCharts({
        psonID: LocalStorage.getItem('myself').id,
        category: this.category
      }).then(res => {
        this.$q.loading.hide()
        this.getCharts(res)
        showSuccessMessage('操作成功')
      })
    }
  },
  watch: {
    'privateBoard.charts': {
      handler (newVal, oldVal) {
        if (!this.isDefault && newVal) {
          this.charts = this.privateBoard ? _.cloneDeep(this.privateBoard.charts) : _.cloneDeep(this.defaultBoard.charts)
          this.charts[this.addKey] = {}
        }
      },
      deep: true
    },
    'defaultBoard.charts': {
      handler (newVal, oldVal) {
        if (this.isDefault && newVal) {
          this.charts = _.cloneDeep(this.defaultBoard.charts)
          this.charts[this.addKey] = {}
        }
      },
      deep: true
    }
  },
  mounted () {
    this.options.map(o => { this.chartsWidth[o.key] = o.width })
    this.loadData()
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    // 条件
    DashboardCondition: () => import('components/base/dashboard/DashboardCondition'),
    // 图形
    ResumeDashboardFlow: () => import('components/recruitment/dashboard/ResumeDashboardFlow'),
    ResumeEduDistribution: () => import('components/recruitment/dashboard/ResumeEduDistribution'),
    ResumeDashboardProcess: () => import('components/recruitment/dashboard/ResumeDashboardProcess'),
    ResumeDashboardDeliveryTrend: () => import('components/recruitment/dashboard/ResumeDashboardDeliveryTrend'),
    ProjectOverviewDashboard: () => import('components/project/dashboard/ProjectOverviewDashboard'),
    ProjectSetUpSuccessDashboard: () => import('components/project/dashboard/ProjectSetUpSuccessDashboard'),
    ProjectEndSuccessDashboard: () => import('components/project/dashboard/ProjectEndSuccessDashboard'),
    SeverityDistributionDashboard: () => import('components/project/dashboard/SeverityDistributionDashboard'),
    AccumulateAddedTrendDashboard: () => import('components/project/dashboard/AccumulateAddedTrendDashboard'),
    PeriodDistributionDashboard: () => import('components/project/dashboard/PeriodDistributionDashboard')
  }
}

</script>

<style lang='scss' scoped>
</style>
