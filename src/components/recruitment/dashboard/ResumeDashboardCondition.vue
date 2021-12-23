<!-- 筛选条件 -->
<template>
  <div class="row q-col-gutter-sm">
    <!-- 招聘计划 -->
    <q-select
      dense
      class="col-12"
      :class="isCard ? '':'col-md-4'"
      v-model="newModel.planids"
      :options="planOptions"
      option-value="value"
      option-label="label"
      :label="$t('recruitment.modules.recruitPlan')"
      @input="updateModel"
      multiple
      clearable
      emit-value
      map-options
      use-input
      use-chips
      @filter="filterPlanOption"
      filled
    >
      <template v-slot:prepend>
        <q-icon
          name="app:tw-icon-recruit-plan"
          class="cursor-pointer"
          color="light-blue-8"
          size="25px"
        >
        </q-icon>
      </template>
    </q-select>
    <!-- 开始时间 -->
    <q-input
      dense
      class="col-12"
      :class="isCard ? '':'col-md-4'"
      v-model="newModel.startDate"
      :label="$t('recruitment.dashboard.startDate')"
      @input="updateModel"
      clearable
      filled
    >
      <template v-slot:prepend>
        <q-icon
          name="date_range"
          class="cursor-pointer"
          color="light-blue-8"
        >
        </q-icon>
      </template>
      <q-popup-proxy
        ref="startDate"
        content-class="my-date-popup"
      >
        <q-date
          v-model="newModel.startDate"
          no-unset
          mask="YYYY-MM-DD"
          @input="updateModel"
        >
        </q-date>
      </q-popup-proxy>
    </q-input>
    <!-- 结束时间 -->
    <q-input
      dense
      class="col-12"
      :class="isCard ? '':'col-md-4'"
      v-model="newModel.endDate"
      :label="$t('recruitment.dashboard.endDate')"
      @input="updateModel"
      clearable
      filled
    >
      <template v-slot:prepend>
        <q-icon
          name="date_range"
          class="cursor-pointer"
          color="light-blue-8"
        >
        </q-icon>
      </template>
      <q-popup-proxy
        ref="endDate"
        content-class="my-date-popup"
      >
        <q-date
          v-model="newModel.endDate"
          no-unset
          mask="YYYY-MM-DD"
          @input="updateModel"
          :landscape="false"
        >
        </q-date>
      </q-popup-proxy>
    </q-input>
    <!-- 招聘岗位 -->
    <q-select
      dense
      class="col-12"
      :class="isCard ? '':'col-md-4'"
      v-model="newModel.jobids"
      :options="jobOptions"
      :label="$t('recruitment.dashboard.hireJob')"
      @input="updateModel"
      multiple
      clearable
      emit-value
      map-options
      use-input
      use-chips
      @filter="filterJobOption"
      filled
    >
      <template v-slot:prepend>
        <q-icon
          name="app:tw-icon-job"
          class="cursor-pointer"
          color="light-blue-8"
          size="25px"
        >
        </q-icon>
      </template>
    </q-select>
    <!-- 招聘城市 -->
    <q-select
      dense
      class="col-12"
      :class="isCard ? '':'col-md-4'"
      v-model="newModel.citys"
      :options="cityOptions"
      :label="'招聘城市'"
      @input="updateModel"
      multiple
      clearable
      emit-value
      map-options
      use-input
      use-chips
      @filter="filterCityOption"
      filled
    >
      <template v-slot:prepend>
        <q-icon
          name="room"
          class="cursor-pointer"
          color="light-blue-8"
          size="25px"
        >
        </q-icon>
      </template>
    </q-select>
    <!-- 毕业院校 -->
    <q-select
      dense
      class="col-12"
      :class="isCard ? '':'col-md-4'"
      v-model="newModel.schools"
      :options="schoolOptions"
      :label="'毕业院校'"
      @input="updateModel"
      multiple
      clearable
      emit-value
      map-options
      use-input
      use-chips
      @filter="filterSchoolOption"
      filled
    >
      <template v-slot:prepend>
        <q-icon
          name="school"
          class="cursor-pointer"
          color="light-blue-8"
          size="25px"
        >
        </q-icon>
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import { schools } from '@/utils/library'
const allSchoolOptions = Object.values(schools).reduce((prev, next) => {
  return prev.concat(next)
})
export default {
  name: 'RecruitmentDashboardCondition',
  props: {
    model: {
      type: Object,
      require: true,
      description: '条件model'
    },
    isCard: {
      type: Boolean,
      require: false,
      default: false,
      description: '是否卡片，用来适配PC端和移动端的宽度'
    }
  },
  data () {
    return {
      newModel: _.cloneDeep(this.model),
      // 招聘计划
      planOptions: [],
      allPlanOptions: [],
      // 岗位
      jobOptions: [],
      allJobOptions: [],
      // 城市
      cityOptions: [],
      allCityOptions: [],
      // 学校
      allSchoolOptions,
      schoolOptions: allSchoolOptions
    }
  },
  methods: {
    ...mapActions('recruitPlan', ['loadRecruitPlans']),
    ...mapActions('recruitPlanNeed', ['loadRecruitPlanNeeds']),
    ...mapActions('interviewer', ['loadInterviewers']),
    // 更新条件
    updateModel () {
      // 关闭日历
      this.$refs.startDate.hide()
      this.$refs.endDate.hide()
      // 更新条件
      this.$emit('update:model', this.newModel)
    },
    // 过滤岗位选项
    filterJobOption (val, update) {
      if (val === '') {
        update(() => {
          this.jobOptions = this.allJobOptions
        })
      } else {
        update(() => {
          let valNew = val.toLowerCase()
          this.jobOptions = this.allJobOptions.filter(v => v.label.toLowerCase().indexOf(valNew) > -1)
        })
      }
    },
    // 过滤计划选项
    filterPlanOption (val, update) {
      if (val === '') {
        update(() => {
          this.planOptions = this.allPlanOptions
        })
      } else {
        update(() => {
          let valNew = val.toLowerCase()
          this.planOptions = this.allPlanOptions.filter(v => v.label.toLowerCase().indexOf(valNew) > -1)
        })
      }
    },
    // 过滤城市选项
    filterCityOption (val, update) {
      if (val === '') {
        update(() => {
          this.cityOptions = this.allCityOptions
        })
      } else {
        update(() => {
          let valNew = val.toLowerCase()
          this.cityOptions = this.allCityOptions.filter(v => v.label.toLowerCase().indexOf(valNew) > -1)
        })
      }
    },
    // 过滤学校选项
    filterSchoolOption (val, update) {
      if (val === '') {
        update(() => {
          this.schoolOptions = this.allSchoolOptions
        })
      } else {
        update(() => {
          let valNew = val.toLowerCase()
          this.schoolOptions = this.allSchoolOptions.filter(v => v.toLowerCase().indexOf(valNew) > -1)
        })
      }
    },
    // 初始化条件
    init () {
      // 获取招聘计划
      this.loadRecruitPlans({
        byPage: false,
        query: [{ Key: 'Closed', Value: '1,2', Oper: 'in' }
        ],
        orderby: 'CreateTime DESC'
      }).then(plans => {
        // 初始化计划选项
        this.planOptions = []
        this.allPlanOptions = []
        _.forEach(plans, (plan, key) => {
          this.planOptions.push({
            label: plan.title,
            value: plan.id
          })
          this.allPlanOptions.push({
            label: plan.title,
            value: plan.id
          })
        })
        // 初始化岗位、部门、城市选项
        let currentUser = LocalStorage.getItem('myself')
        if (plans && plans.length && currentUser && (_.includes(currentUser.roleCodes.split(','), 'HRSpecialist') || _.includes(currentUser.roleCodes.split(','), 'SystemAdministrator'))) {
          // 人事专员(招聘计划需求中获取)
          this.loadRecruitPlanNeeds({
            byPage: false,
            query: [
              { Key: 'PlanID', Value: _.map(plans, 'id').join(','), Oper: 'in' }
            ],
            returnData: true
          }).then(recruitPlanNeeds => {
            this.initOptions(recruitPlanNeeds)
          })
        } else if (currentUser && _.includes(currentUser.roleCodes.split(','), 'Interviewer')) {
          // 面试官（面试官配置）
          this.loadInterviewers({
            query: [
              { Key: 'PsonID', Value: currentUser.id, Oper: 'eq' }
            ]
          }).then(interviewers => {
            this.initOptions(interviewers)
          })
        }
      })
    },
    // 初始化岗位、部门、城市选项
    initOptions (options) {
      // 岗位
      this.jobOptions = []
      this.allJobOptions = []
      // 城市
      this.cityOptions = []
      this.allCityOptions = []
      _.forEach(options, (option, key) => {
        // 岗位
        option.jobID && this.jobOptions.push({
          label: option.jobName,
          value: option.jobID
        })
        option.jobID && this.allJobOptions.push({
          label: option.jobName,
          value: option.jobID
        })
        // 城市
        option.city && this.cityOptions.push({
          label: option.city,
          value: option.city
        })
        option.city && this.allCityOptions.push({
          label: option.city,
          value: option.city
        })
      })
      // 去重
      this.jobOptions = _.uniqBy(this.jobOptions, function (e) {
        return e.label + '--' + e.value
      })
      this.allJobOptions = _.uniqBy(this.allJobOptions, function (e) {
        return e.label + '--' + e.value
      })
      this.cityOptions = _.uniqBy(this.cityOptions, function (e) {
        return e.value
      })
      this.allCityOptions = _.uniqBy(this.allCityOptions, function (e) {
        return e.value
      })
    }
  },
  watch: {
    // 组件复用时更新条件model
    model: {
      deep: true,
      immediate: false,
      handler (newVal, oldVal) {
        if (!_.isEmpty(oldVal) && JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          this.newModel = _.cloneDeep(newVal)
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
.my-date-popup {
  min-width: auto !important;
}
</style>
