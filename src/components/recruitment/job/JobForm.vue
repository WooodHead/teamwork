<template>
  <tw-form
    ref="myForm"
    :secondary="isCanSave"
    :primaryLabel="$t('action.submitEdit')"
    :secondaryLabel="$t('action.saveDraft')"
    @primary="onSubmit"
    @secondary="onSave"
    :title="openType === 'edit' ? '编辑岗位' : '新增岗位'"
  >
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-input
          v-model="submitModel.title"
          input-class="text-center"
          class="text-h6"
          :placeholder="$t('job.titlePlaceholder')"
          lazy-rules
          :rules="[val => (!!val && !!val.trim()) || $t('job.formTitleTips')]"
          ref="title"
          autofocus
          debounce="500"
          filled
        />
      </div>
      <div class="col-12 q-pt-none">
        <div class="row items-center q-py-sm bg-grey-3">
          <div
            v-for="(k, index) in jobKind"
            :key="index"
            class="row col-6"
          >
            <q-radio
              v-model="submitModel.kind"
              :val="k.kind"
              :label="k.label"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <tw-select-edit
          filled
          module="job"
          field="category"
          :label="$t('dictionary.category')"
          :value="submitModel.category"
          @input="jobCategorySelect"
        />
      </div>
      <div class="col-12 col-sm-6">
        <tw-select-edit
          filled
          module="job"
          field="workingYears"
          :label="$t('dictionary.workingYears')"
          :value="submitModel.workingYears"
          @input="jobWorkingYearsSelect"
        />
      </div>
      <div class="col-12 col-sm-6">
        <tw-select-edit
          filled
          module="job"
          field="educationDegree"
          :label="$t('dictionary.educationDegree')"
          :value="submitModel.educationDegree"
          @input="jobEducationDegreeSelect"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          filled
          v-model="submitModel.major"
          :label="$t('job.major')"
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="submitModel.requirements"
          type="textarea"
          :placeholder="$t('job.requirements')"
          filled
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="submitModel.detailRequirements"
          type="textarea"
          :placeholder="$t('job.detailRequirements')"
          filled
        />
      </div>
    </div>
  </tw-form>
</template>

<script>
import { debounce } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
import Job from '@/store/job/model'
export default {
  name: 'JobForm',
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
      isCanSave: true,
      submitModel: new Job()
    }
  },
  created () {
    let that = this
    if (that.openType === 'edit') {
      that.loadJob(+that.id).then(res => {
        that.submitModel = _.cloneDeep(res)
        if (that.submitModel.isPublish) {
          that.isCanSave = false
        }
        that.initBreadcrumb()
      })
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs',
      'deleteWidgetBreadcrumb'
    ]),
    ...mapActions('job', ['addJob', 'loadJob', 'updateJob']),
    // 通过防抖函数防止表单短时间内重复提交
    onSubmit: debounce(
      function () {
        this.submitData('submit')
      },
      3000,
      true
    ),
    onSave: debounce(
      function () {
        this.submitData('save')
      },
      3000,
      true
    ),
    submitData (submitType) {
      let that = this
      // 草稿或发布
      that.submitModel.isPublish = submitType === 'submit' ? 1 : 0
      // 组织机构名称
      // let organizes = _.filter(that.selectOrganizes, n => _.isArray(that.submitModel.organizeIDs) ? that.submitModel.organizeIDs.includes(n.id) : that.submitModel.organizeIDs === n.id)
      // that.submitModel.organizeNames = _.map(organizes, 'shortName')
      if (that.openType === 'add') {
        // 新增
        that.addJob(that.submitModel).then(res => {
          res && this.routeTo(res)
        })
      } else {
        // 修改
        that.updateJob(that.submitModel).then(res => {
          res && this.routeTo(res)
        })
      }
    },
    routeTo (job) {
      if (job.isPublish) {
        this.$router.push({
          name: 'jobDetail',
          params: {
            id: +job.id
          }
        })
      } else {
        this.$router.push({
          name: 'draftJobs'
        })
      }
    },
    jobCategorySelect (val) {
      this.submitModel.category = val.dictValue
    },
    jobWorkingYearsSelect (val) {
      this.submitModel.workingYears = val.dictValue
    },
    jobEducationDegreeSelect (val) {
      this.submitModel.educationDegree = val.dictValue
    },
    // 面包屑处理
    initBreadcrumb () {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushWidgetBreadcrumb({
        id: `jobList`,
        title: this.$t('job.module'),
        to: {
          name: 'job'
        }
      })
      this.submitModel.isPublish === 0 &&
        this.pushWidgetBreadcrumb({
          id: `draftJobs`,
          title: '草稿箱',
          to: {
            name: 'draftJobs'
          }
        })
      this.openType === 'edit' &&
        this.submitModel &&
        this.pushWidgetBreadcrumb({
          id: `jobDetail`,
          title: this.submitModel.title,
          to: {
            name: 'jobDetail',
            params: {
              id: +this.submitModel.id
            }
          }
        })
    }
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
  computed: {
    ...mapState('job', ['jobKind'])
    // ...mapGetters('organize', ['selectOrganizesTree', 'selectOrganizes'])
  },
  components: {
    // TwSelectTree: () => import('components/base/TwSelectTree'),
    // FormAction: () => import('components/base/TwFormAction'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-btn--rounded {
  border-radius: 3px;
}
</style>
