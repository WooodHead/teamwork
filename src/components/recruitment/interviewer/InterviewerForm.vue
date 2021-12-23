<template>
  <tw-form
    ref="myForm"
    @primary="addModelList"
    :primaryLabel="$t('interviewer.isAddOrRemove')"
    :buttonDisable="!canOp"
  >
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <tw-select-person
          filled
          v-model="psonId"
          emit-value
          :label="$t('interviewer.interviewerName')"
          lazy-rules
          :rules="[val => val > 0 || $t('interviewer.selectInterviewer')]"
        />
      </div>

      <!-- 已有数据 -->
      <q-list
        class="col-12"
        v-for="(item, index) in modelList"
        :key="item.id === 0 ? index + '-only' : item.id"
      >
        <interviewer-item
          :item="item"
          :psonID="psonId"
          :openType="item.id === 0 ? 'add' : 'edit'"
          @changeIsFristEnter="isFristEnter = true"
        />
      </q-list>
      <!-- 新增数据 -->
      <q-list v-if="isAdd" class="col-12">
        <interviewer-item
          :item="model"
          :psonID="psonId"
          :openType="'add'"
          @end="isAdd=false"
          @changeIsFristEnter="isFristEnter = true"
        />
      </q-list>
    </div>
  </tw-form>
</template>

<script>
import Interviewer from '@/store/interviewer/model'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'InterviewerForm',
  props: {
    openType: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      model: new Interviewer(),
      psonId: 0, // 面试官id
      isFristEnter: false, // 是否首次进入页面
      isAdd: this.openType === 'add'
    }
  },
  computed: {
    ...mapGetters('interviewer', ['byIdInterviewer']),
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      )
    },
    modelList () {
      return this.byIdInterviewer(this.psonId).objList
    }
  },
  mounted () {
    this.init()
    this.initBreadcrumb()
  },
  methods: {
    ...mapActions('interviewer', ['loadInterviewers']),
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs'
    ]),
    // 初始化
    init () {
      if (this.openType === 'edit') {
        // 编辑页面初始化
        this.psonId = Number(this.$route.params.psonID)
        // 获取面试官下的面试信息
        this.loadInterviewers({
          query: [
            {
              Key: 'PsonID',
              Value: Number(this.$route.params.psonID),
              Oper: 'eq'
            }
          ]
        })
      }
    },
    addModelList () {
      this.isAdd = true
      if (this.isFristEnter === false || this.modelList.length === 0) {
        this.model = new Interviewer()
      } else { 
        this.model.psonID = this.modelList[this.modelList.length - 1].psonID
        this.model.organizeID = this.modelList[this.modelList.length - 1].organizeID
        this.model.organizeName = this.modelList[this.modelList.length - 1].organizeName
        this.model.jobID = this.modelList[this.modelList.length - 1].jobID
        this.model.jobName = this.modelList[this.modelList.length - 1].jobName
        this.model.city = this.modelList[this.modelList.length - 1].city
      }
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
        id: `interviewer`,
        title: this.$t('interviewer.interviewerManage'),
        to: {
          name: 'interviewer'
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
  components: {
    TwForm: () => import('components/base/TwForm'),
    TwSelectPerson: () => import('components/base/TwSelectPerson'),
    InterviewerItem: () =>
      import('components/recruitment/interviewer/InterviewerItem')
  }
}
</script>

<style scoped></style>
