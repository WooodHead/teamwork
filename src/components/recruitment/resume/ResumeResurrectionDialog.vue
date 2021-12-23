<template>
  <q-card class="card-grow-in-page">
    <q-card-section>
      <div>简历复活</div>
      <!-- 验证是否可复活简历 -->
      <div
        class="row justify-center q-my-md"
        v-if="isLoading"
      >
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
      <!-- 验证结果处理 -->
      <div
        v-else
        class="q-pt-md"
      >
        <!-- 可复活简历 -->
        <div v-if="isCanResurrection">
          <!-- 1. 沟通提示 -->
          <div v-if="!isShowInput">
            <div class="text-subtitle1 text-weight-bold">复活简历前，请确保与应聘者沟通一致！</div>
            <div class="text-right q-gutter-md q-pt-sm">
              <q-btn
                outline
                v-close-popup
                color="primary"
                label="取消"
              />
              <q-btn-dropdown
                split
                color="primary"
                label="电话沟通"
                @click="openURL('tel:'+tel)"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="isShowInput = true"
                  >
                    <q-item-section>
                      <q-item-label>沟通一致</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
          <!-- 沟通后，确定复活岗位、城市、面试官、状态 -->
          <div v-else>
            <q-form @submit="onSubmit">
              <q-select
                filled
                v-model="model.PlanID"
                :options="selectOptions.plans"
                label="招聘计划"
                emit-value
                map-options
                clearable
                :rules="[val => !!val || '请选择招聘计划']"
              />
              <q-select
                filled
                v-model="model.JobID"
                :options="selectOptions.jobs"
                label="岗位"
                emit-value
                map-options
                clearable
                :rules="[val => !!val || '请选择岗位']"
                use-input
                @filter="filterJobOption"
              />
              <q-select
                filled
                v-model="model.City"
                :options="selectOptions.citys"
                label="城市"
                emit-value
                map-options
                clearable
                :rules="[val => !!val || '请选择城市']"
                use-input
                @filter="filterCityOption"
              />
              <q-select
                filled
                v-model="model.InterviewerID"
                :options="interviewers"
                label="面试官"
                emit-value
                map-options
                clearable
                :rules="[val => !!val || '请选择面试官']"
                use-input
                @filter="filterInterviewerOption"
              >

                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.label" />
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div class="text-grey-7 q-pl-sm">复活位置</div>
              <div>
                <q-radio
                  name="shape"
                  v-model="model.Status"
                  :val="10"
                  label="待测评"
                />
                <q-radio
                  name="shape"
                  v-model="model.Status"
                  :val="20"
                  label="待邀约"
                />
              </div>
              <div class="text-right q-gutter-md q-my-md">
                <q-btn
                  outline
                  v-close-popup
                  color="primary"
                  label="取消"
                />
                <q-btn
                  type="submit"
                  color="primary"
                  label="复活"
                />
              </div>
            </q-form>
          </div>
        </div>
        <!-- 不能复活简历 -->
        <div
          v-else
          class="text-subtitle1 text-weight-bold"
        >
          {{isCanResurrectionTip}}
        </div>
      </div>

    </q-card-section>

  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
import { openURL } from 'quasar'
export default {
  name: 'ResumeResurrectionDialog',
  props: {
    resumeID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    interviewee: {
      type: String,
      required: false,
      default: ''
    },
    tel: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      isCanResurrection: false,
      isCanResurrectionTip: '无法复活！',
      isShowInput: false,
      isLoading: true,
      recruitNeeds: [], // 招聘需求
      recruitPlans: [], // 招聘计划
      jobs: [], // 岗位
      interviewers: [], // 面试官 
      allInterviewers: [],
      model: {
        ResumeID: +this.resumeID,
        PlanID: '',
        JobID: '',
        Interviewee: this.interviewee,
        InterviewerID: '',
        InterviewTime: '2000-01-01 00:00:00',
        City: '',
        Status: 10,
        InterviewCount: 0,
        InStorage: 0
      },
      filterJob: '',
      filterCity: ''
    }
  },
  methods: {
    openURL,
    ...mapActions('resume', ['canResurrection', 'addDelivery']),
    ...mapActions('recruitPlanNeed', ['loadUsableRecruitPlanNeeds']),
    ...mapActions('job', ['loadJobs']),
    ...mapActions('recruitPlan', ['loadRecruitPlans']),
    ...mapActions('interviewer', ['loadInterviewers']),
    // 简历复活
    onSubmit () {
      if (this.model.Status === 20) {
        this.model.InterviewCount = 1
      } else {
        this.model.InterviewCount = 0
      }
      this.addDelivery(this.model).then(res => {
        if (res) {
          this.$emit('ok')
          showSuccessMessage(this.$t('resume.actionSucceed'))
        } else {
          this.$q.notify({
            message: this.$t('resume.actionFail'),
            color: 'negative'
          })
        }
      })
    },
    // 过滤岗位
    filterJobOption (val, update) {
      update(() => {
        this.filterJob = val
      })
    },
    // 过滤城市
    filterCityOption (val, update) {
      update(() => {
        this.filterCity = val
      })
    },
    // 过滤面试官
    filterInterviewerOption (val, update) {
      if (val === '') {
        update(() => {
          this.interviewers = this.allInterviewers
        })
      } else {
        update(() => {
          let valNew = val.toLowerCase()
          this.interviewers = this.allInterviewers.filter(v => v.label.toLowerCase().indexOf(valNew) > -1)
        })
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    selectOptions () {
      let recruitNeeds = _.filter(this.recruitNeeds, r => {
        return (!this.model.PlanID || +r.planID === +this.model.PlanID) && (!this.model.JobID || +r.jobID === +this.model.JobID) && (!this.model.City || r.city === this.model.City)
      })
      // 招聘计划
      let planIds = _.uniq(_.map(recruitNeeds, r => {
        return r.planID
      }))
      let plans = _.map(_.filter(this.recruitPlans, recruitPlan => {
        return _.includes(planIds, recruitPlan.id)
      }), p => {
        return {
          label: p.title,
          value: p.id
        }
      })
      // 岗位
      let jobIds = _.uniq(_.map(recruitNeeds, r => {
        return r.jobID
      }))
      let jobs = _.map(_.filter(this.jobs, job => {
        return _.includes(jobIds, job.id)
      }), j => {
        return {
          label: j.title,
          value: j.id
        }
      })
      let filterVal = this.filterJob.toLowerCase()
      jobs = jobs.filter(v => v.label.toLowerCase().indexOf(filterVal) > -1)
      // 城市
      let citys = _.uniq(_.map(recruitNeeds, r => {
        return r.city
      }))
      filterVal = this.filterCity.toLowerCase()
      citys = citys.filter(v => v.toLowerCase().indexOf(filterVal) > -1)
      let tempOpts = {
        plans,
        jobs: jobs,
        citys: citys
      }
      return tempOpts
    }
  },
  mounted () {
    this.canResurrection(this.resumeID).then(res => {
      if (res) {
        this.loadUsableRecruitPlanNeeds().then(needs => {
          this.isCanResurrection = !!(needs && needs.length)
          this.recruitNeeds = needs
          if (!this.isCanResurrection) {
            this.isCanResurrectionTip = '无进行中的招聘计划,无法复活！'
          }
          this.isLoading = false
        })
      } else {
        this.isCanResurrection = false
        this.isCanResurrectionTip = '该简历尚存在活跃的志愿,无法复活！'
        this.isLoading = false
      }
    })
    // 获取岗位名称
    this.loadJobs({
      query: [
        { Key: 'IsPublish', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ],
      byPage: false
    }).then(res => {
      this.jobs = res
    })
    // 获取招聘计划
    this.loadRecruitPlans({
      query: [
        { Key: 'IsDelete', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'Closed', Value: 1, Oper: 'eq' }
      ]
    }).then(res => {
      this.recruitPlans = res
    })
    // 获取面试官
    this.loadInterviewers({}).then(res => {
      let interviewers = _.map(_.keys(_.groupBy(res, 'psonID')), pid => {
        return {
          label: this.selectPersons && this.selectPersons[+pid] && this.selectPersons[+pid].name,
          value: +pid,
          description: this.selectPersons && this.selectPersons[+pid] && this.selectPersons[+pid].organizeName
        }
      })
      this.interviewers = interviewers
      this.allInterviewers = interviewers
    })
  }
}
</script>

<style>
</style>
