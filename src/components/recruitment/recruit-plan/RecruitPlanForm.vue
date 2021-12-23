<template>
  <tw-form
    ref="myForm"
    @primary="onSubmit"
    @secondary="onSave"
    :title="openType === 'edit' ? '编辑招聘计划' : '新建招聘计划'"
  >
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-input
          filled
          v-model="recModel.title"
          input-class="text-center"
          class="text-h6"
          :placeholder="请输入计划标题"
          lazy-rules
          :rules="[
            val => (!!val && !!val.trim()) || $t('recruitPlan.formTitleTips')
          ]"
          ref="title"
          autofocus
          debounce="500"
        />
      </div>
      <div
        class="col-12 col-sm-6"
        :class="$q.platform.is.mobile ? 'q-pt-none' : ''"
      >
        <q-input
          input-class="left"
          v-model="recModel.startDate"
          filled
          :label="$t('recruitPlan.startDate')"
          mask="date"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :value="recModel.startDate"
                  @input="startDateInput($event)"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          input-class="left"
          v-model="recModel.endDate"
          filled
          :label="$t('recruitPlan.endDate')"
          mask="date"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :value="recModel.endDate"
                  @input="endDateInput($event)"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12">
        <q-input
          filled
          v-model="recModel.notes"
          type="textarea"
          :label="$t('recruitPlan.notes')"
        />
      </div>
    </div>
  </tw-form>
</template>

<script>
import RecruitPlan from '@/store/recruit-plan/model'
import { mapActions, mapMutations } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'RecruitPlanForm',
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      recModel: new RecruitPlan(),
      recruitPlans: [] // 避免再次请求后台，先存入缓存中
    }
  },
  created () {
    // 初始化编辑
    if (this.openType === 'edit') {
      this.loadRecruitPlan(this.id).then(res => {
        this.recModel = _.cloneDeep(res)
        this.initBreadcrumb()
      })
      this.initBreadcrumb()
    }
    this.loadRecruitPlans({
      query: [{ Key: 'IsDelete', Value: 0, Oper: 'eq' }]
    }).then(res => {
      this.recruitPlans = res
    })
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initBreadcrumb()
      }
    }
  },
  methods: {
    ...mapActions('recruitPlan', [
      'loadRecruitPlans',
      'loadRecruitPlan',
      'addRecruitPlan',
      'updateRecruitPlan'
    ]),
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs'
    ]),
    startDateInput (value) {
      this.recModel.startDate = value
      this.$refs.qDateProxy.hide()
    },
    endDateInput (value) {
      this.recModel.endDate = value
      this.$refs.qDateProxy.hide()
    },
    onSubmit () {
      var startd = Date.parse(this.recModel.startDate)
      var endd = Date.parse(this.recModel.endDate)
      if (this.openType === 'add' && endd > startd) {
        this.recModel.closed = 0
        this.addRecruitPlan(this.recModel).then(res => {
          if (res) {
            this.$router.push({
              name: 'recruitPlan'
            })
          }
        })
      } else if (this.openType === 'edit' && endd > startd) {
        this.updateRecruitPlan(this.recModel).then(res => {
          if (res) {
            this.$router.push({
              name: 'recruitPlanDetail',
              params: {
                id: this.id
              }
            })
          }
        })
      } else {
        showWarningMessage(this.$t(`recruitPlan.timeCheck`))
      }
    },
    onSave () {
      this.$nextTick(() => {
        this.recModel = {}
        if (this.openType === 'add') {
          this.$router.push({
            name: 'recruitPlan'
          })
        } else {
          this.$router.push({
            name: 'recruitPlanDetail',
            params: {
              id: this.id
            }
          })
        }
      })
    },
    // 面包屑处理
    initBreadcrumb (route) {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushWidgetBreadcrumb({
        id: `recruitPlan`,
        title: this.$t('recruitPlan.title'),
        to: {
          name: 'recruitPlan'
        }
      })
      this.openType === 'edit' &&
        this.recModel &&
        this.pushWidgetBreadcrumb({
          id: `recruitPlanDetail`,
          title: this.recModel.title,
          to: {
            name: 'recruitPlanDetail',
            params: {
              id: +this.id
            }
          }
        })
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped></style>
