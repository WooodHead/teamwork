<!-- 简历教育信息组件 -->
<template>
  <q-expansion-item
    v-model="expanded"
    expand-separator
    :label="$t('resume.basic.education')"
    header-class="text-primary text-subtitle1 text-bold"
  >
    <q-separator />
    <div class="row q-py-sm">
      <div
        class="col-12 q-pa-sm"
        v-for="(education, index) in educations"
        :key="index"
      >
        <q-card>
          <q-card-section class="bg-blue-grey-1 text-grey-7 q-py-sm">
            <div class="text-subtitle1 text-bold q-pb-xs">{{education.college}}</div>
            <div class="row">
              <div class="col-auto q-gutter-x-xs">
                <q-badge
                  outline
                  color="grey-7"
                  :label="education.degreeCategory"
                />
                <q-badge
                  outline
                  color="grey-7"
                  :label="education.collegeStyle"
                />
              </div>
              <div class="col text-subtitle2 text-right">
                {{formatDate(education.startTime, 'YYYY.MM.DD')}}
                {{education.endTime==='1000-01-01 00:00:00'?$t('resume.education.upToNow'):'- '+formatDate(education.endTime, 'YYYY.MM.DD')}}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-py-sm text-grey-7 row">
            <div class="row no-wrap  resume_info_row col-12 col-md-6">
              <span class="resume_info_key">
                {{$t('resume.education.department')}}
              </span>
              <span>
                {{education.department}}
              </span>
            </div>
            <div class="row no-wrap  resume_info_row col-12 col-md-6">
              <span class="resume_info_key">
                {{$t('resume.education.major')}}
              </span>
              <span>
                {{education.major}}
              </span>
            </div>
            <div class="row no-wrap resume_info_row col-12 col-md-6">
              <span class="resume_info_key">
                {{$t('resume.education.background')}}
              </span>
              <span>
                {{education.background}}
              </span>
            </div>
            <div class="row no-wrap  resume_info_row col-12 col-md-6">
              <span class="resume_info_key">
                {{$t('resume.education.degree')}}
              </span>
              <span>
                {{education.degree}}
              </span>
            </div>
            <div class="row no-wrap resume_info_row col-12 col-md-6">
              <span class="resume_info_key">
                {{$t('resume.education.admissionsCategory')}}
              </span>
              <span>
                {{education.admissionsCategory}}
              </span>
            </div>
            <div class="row no-wrap col-12 col-md-6">
              <span class="resume_info_key">
                {{$t('resume.education.paperTitle')}}
              </span>
              <span>
                {{education.paperTitle}}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-expansion-item>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'ResumeEducation',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      // 是否默认展开
      expanded: true
    }
  },
  methods: {
    formatDate
  },
  computed: {
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    },
    resume () {
      return this.$store.getters['resume/resume'](+this.resumeView.resumeID)
    },
    educations () {
      if (!_.isEmpty(this.resume)) {
        return _.reverse(_.sortBy(this.resume.educations, 'startTime'))
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
