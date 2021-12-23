<!-- 推荐面试官弹窗 -->
<template>
  <q-card class="card-grow-in-page">
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold">{{$t('resume.actions.ChooseInterviewer')}}</div>
    </q-card-section>

    <q-card-section v-if="isLoading">
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </q-card-section>

    <q-card-section
      class="q-pt-none"
      v-else-if="initPersonScope.length"
    >

      <person-select-panel
        :flat="true"
        :isVirtualScroll="false"
        :multiple="false"
        :isSearchSort="false"
        :initPersonScope="initPersonScope"
        @select="selectedInterviewer"
      />
    </q-card-section>

    <q-card-section v-else>暂无面试官可推荐</q-card-section>

  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ResumeDialogPush',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0,
      description: '简历投递ID'
    },
    pushScop: {
      type: Array,
      required: false,
      default () {
        return []
      },
      description: '面试官选择范围'
    }
  },
  data () {
    return {
      showPushDialog: false,
      // 面试官
      otherInterviewers: [],
      filterdInterviewers: [],
      // 选择的面试官
      interviewerID: 0,
      initPersonScope: this.pushScop,
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('resume', ['isInterviewer', 'myinfo']),
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    }
  },
  methods: {
    ...mapActions('resume', ['updateResumePush']),
    ...mapActions('interviewer', ['loadInterviewers']),
    selectedInterviewer (person) {
      let fields = {}
      fields.Id = this.resumeDeliveryID
      fields.InterviewerID = person.id
      fields.InterviewerName = person.name
      fields.IsPush = 1
      // 历史面试官维护
      if (this.isInterviewer) {
        let interviewerArr = this.resumeView.historyInterviewers.split(',').filter(i => i !== '')
        this.myinfo.id && !interviewerArr.includes(this.myinfo.id + '') && interviewerArr.push(this.myinfo.id)
        fields.HistoryInterviewers = interviewerArr.join()
      }
      this.updateResumePush(fields).then(res => {
        this.$emit('confirmPush')
      })
    }
  },
  mounted () {
    if (!(this.initPersonScope && this.initPersonScope.length)) {
      this.isLoading = true
      this.loadInterviewers({}).then(res => {
        this.initPersonScope = this.myinfo.id ? _.pull(_.keys(_.groupBy(res, 'psonID')), this.myinfo.id + '') : _.keys(_.groupBy(res, 'psonID'))
        this.isLoading = false
      })
    } else {
      this.isLoading = false
    }
  },
  components: {
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  }
}

</script>

<style lang='scss' scoped>
</style>
