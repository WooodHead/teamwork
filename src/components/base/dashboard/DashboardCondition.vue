<!-- 仪表盘条件 -->
<template>
  <q-card
    style="min-width:300px"
    :style="$q.platform.is.mobile?'max-height:'+ ($q.screen.height * 0.7) + 'px;':''"
  >
    <q-card-section>
      <q-form
        @submit="onSubmit()"
        @reset="onCancel()"
      >
        <!-- 选择图表类型 -->
        <q-list v-if="!selectChart">
          <q-item
            clickable
            v-ripple
            v-for="option in options"
            :key="option.key + new Date()"
          >
            <q-item-section @click="onSelectChart(option)">
              {{option.label}}
            </q-item-section>
          </q-item>
        </q-list>
        <!-- 图表名称 -->
        <q-input
          filled
          clearable
          v-if="selectChart"
          v-model="editTitle"
          ref="dashboardChartTitle"
          lazy-rules
          :rules="chartTitleRule"
          :placeholder="'类型：' + selectChart.label"
        />
        <div
          v-if="selectChart"
          class="q-pt-sm"
        >
          <!-- 条件组件 -->
          <component
            :is="`${capitalize(category)}DashboardCondition`"
            :model.sync="editModel"
            :type="selectChart"
            :isCard="true"
          />
          <!-- buttons -->
          <div class="text-right q-gutter-x-md q-mt-md">
            <q-btn
              flat
              type="reset"
              color="primary"
              :label="$t('action.cancel')"
            />
            <q-btn
              flat
              type="submit"
              color="primary"
              :label="$t('action.confirm')"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { showSuccessMessage } from '@/utils/show-message'
import { format, LocalStorage } from 'quasar'
const { capitalize } = format
import { mapActions } from 'vuex'
export default {
  name: 'DashboardCondition',
  props: {
    category: {
      type: String,
      required: true,
      default: 'resume',
      description: '业务类型'
    },
    uid: {
      type: String,
      required: true,
      description: '图形唯一标识符'
    },
    chart: {
      type: Object,
      required: false,
      default () {
        return {}
      },
      description: '当前图形'
    },
    title: {
      type: String,
      required: false,
      description: '图形名称'
    },
    model: {
      type: Object,
      required: false,
      default () {
        return {}
      },
      description: '当前条件'
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否编辑'
    },
    isDefault: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否默认仪表盘'
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
      selectChart: this.chart,
      editTitle: this.title,
      editModel: this.model,
      currentUid: this.uid,
      chartTitleRule: [
        val => !_.isEmpty(val) || '请输入图表名称',
        val => this.isTitleUniq() || '名称重复'
      ]
    }
  },
  computed: {
    options () {
      return this.$store.getters[`${this.category}/${this.category}DashboardType`]
    },
    privateBoard () {
      return this.$store.getters['dashboard/privateBoard'](LocalStorage.getItem('myself').id, this.category)
    },
    defaultBoard () {
      return this.$store.getters['dashboard/defaultBoard'](this.category)
    }
  },
  methods: {
    capitalize,
    ...mapActions('dashboard', ['AddChart', 'UpdateChart']),
    async onSelectChart (chart) {
      this.editTitle = ''
      this.selectChart = chart
      let model = _.values(this.defaultBoard && this.defaultBoard.charts).find(v => v.name === chart.key).model
      if (this.conditionNeedMap) {
        this.editModel = await this.$store.dispatch(`${this.category}/conditionToFront`, model)
      } else {
        this.editModel = model
      }
    },
    onCancel () {
      this.$nextTick(() => {
        this.$refs.dashboardChartTitle.resetValidation()
        this.$emit('cancel')
      })
    },
    async onSubmit () {
      let psonID = LocalStorage.getItem('myself').id
      let submitData = {
        isDefault: this.isDefault ? 1 : 0,
        id: this.isDefault ? this.defaultBoard.id : (this.privateBoard ? this.privateBoard.id : this.defaultBoard.id),
        category: this.category,
        name: this.selectChart.key,
        title: this.editTitle,
        where: ''
      }
      let maxOrderNumber = this.$store.getters['dashboard/maxOrderNumber'](this.isDefault, psonID, this.category)
      submitData.orderNumber = this.isEdit ? this.currentUid + '' : this.increateOrderNumber(maxOrderNumber + '')
      if (this.conditionNeedMap) {
        submitData.model = await this.$store.dispatch(`${this.category}/conditionToEnd`, this.editModel)
      } else {
        submitData.model = this.editModel
      }
      this.onCancel()
      if (this.isEdit) {
        this.update(submitData)
      } else {
        this.add(submitData)
      }
    },
    add (data) {
      this.$q.loading.show()
      this.AddChart(data)
        .then(res => {
          this.$q.loading.hide()
          showSuccessMessage('添加成功')
          this.$emit('submit', res)
        })
    },
    update (data) {
      this.$q.loading.show()
      this.UpdateChart(data)
        .then(res => {
          this.$q.loading.hide()
          showSuccessMessage('编辑成功')
          this.$emit('submit', res)
        })
    },
    increateOrderNumber (num) {
      // 获取非最后一个字符
      let notLastNumber = num.substring(0, num.length - 1)
      // 最后一个字符
      let lastNumber = num.charAt(num.length - 1)
      if (+lastNumber === 9) {
        return num + '1'
      } else {
        return notLastNumber + (+lastNumber + 1)
      }
    },
    isTitleUniq () {
      let findArrange = []
      if (this.isDefault) {
        findArrange = _.values(_.omit(this.defaultBoard.charts, +this.uid))
      } else {
        if (this.privateBoard) {
          findArrange = _.values(_.omit(this.privateBoard.charts, +this.uid))
        } else {
          findArrange = _.values(_.omit(this.defaultBoard.charts, +this.uid))
        }
      }
      return _.findIndex(findArrange, item => item.title === this.editTitle) === -1
    }
  },
  components: {
    ResumeDashboardCondition: () => import('components/recruitment/dashboard/ResumeDashboardCondition'),
    ProjectDashboardCondition: () => import('components/project/dashboard/ProjectDashboardCondition')
  }
}

</script>

<style lang='scss' scoped>
</style>
