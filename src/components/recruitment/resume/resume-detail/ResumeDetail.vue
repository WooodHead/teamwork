<template>
  <div class="q-pb-xl">
    <!-- 基本信息 -->
    <resume-basic-info :resumeDeliveryID="resumeDeliveryID" />
    <!-- 教育信息 -->
    <resume-education :resumeDeliveryID="resumeDeliveryID" />
    <!-- 语言情况 -->
    <resume-language :resumeDeliveryID="resumeDeliveryID" />
    <!-- 工作情况 -->
    <resume-work-experience :resumeDeliveryID="resumeDeliveryID" />
    <!-- 项目情况 -->
    <resume-project :resumeDeliveryID="resumeDeliveryID" />
    <!-- 证书情况 -->
    <resume-certificate :resumeDeliveryID="resumeDeliveryID" />
    <!-- 文娱情况 -->
    <resume-entertainment :resumeDeliveryID="resumeDeliveryID" />
    <!-- 作品情况 -->
    <resume-displaywork :resumeDeliveryID="resumeDeliveryID" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'resumeDetail',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('resume', ['statusCount', 'selectedStatus']),
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    }
  },
  methods: {
    ...mapActions('resume', ['loadResume', 'loadResumeView', 'loadStatusCount', 'updateResumeInterviewerID']),
    ...mapMutations('resume', ['setSelectedStatus']),
    loadData (resumeDeliveryID) {
      // 在这里统一获取数据
      if (_.isEmpty(this.resumeView) || this.resumeView.resumeDeliveryID !== resumeDeliveryID) {
        this.loadResumeView(resumeDeliveryID)
          .then(res => {
            this.setCurrentStatus()
            this.loadResume(+res.resumeID)
          })
      } else {
        this.setCurrentStatus()
        this.loadResume(this.resumeView.resumeID)
      }
      if (_.isEmpty(this.statusCount)) {
        this.loadStatusCount()
      }
    },
    setCurrentStatus () {
      let frontStatusKey = this.$store.getters['resume/getFrontStatusKey'](+this.resumeDeliveryID)
      this.setSelectedStatus(frontStatusKey || 'waitScreening')
    },
    updateDetailRoute (params) {
      this.$router.push({
        name: 'resumeDetail',
        params: {
          resumeDeliveryID: params[0]
        }
      })
      this.loadData(params[0])
    }
  },
  mounted () {
    this.loadData(+this.resumeDeliveryID)
  },
  components: {
    ResumeBasicInfo: () => import('components/recruitment/resume/resume-detail/ResumeBasicInfo'),
    ResumeEducation: () => import('components/recruitment/resume/resume-detail/ResumeEducation'),
    ResumeLanguage: () => import('components/recruitment/resume/resume-detail/ResumeLanguage'),
    ResumeWorkExperience: () => import('components/recruitment/resume/resume-detail/ResumeWorkExperience'),
    ResumeProject: () => import('components/recruitment/resume/resume-detail/ResumeProject'),
    ResumeCertificate: () => import('components/recruitment/resume/resume-detail/ResumeCertificate'),
    ResumeEntertainment: () => import('components/recruitment/resume/resume-detail/ResumeEntertainment'),
    ResumeDisplaywork: () => import('components/recruitment/resume/resume-detail/ResumeDisplaywork')
  }
}

</script>

<style lang="scss" scoped>
/deep/.resume_info_key {
  // text-align: right;
  width: 6rem;
  flex-shrink: 0;
  font-weight: bold;
  color: #616161 !important;
}
/deep/.resume_bold {
  font-weight: bold;
  color: #616161 !important;
}
/deep/.resume_info_row {
  padding-bottom: 0.5rem;
}
</style>
