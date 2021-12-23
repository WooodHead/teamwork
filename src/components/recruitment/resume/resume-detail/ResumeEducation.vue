<!-- 简历教育信息组件 -->
<template>
  <q-expansion-item
    v-model="expanded"
    :label="$t('resume.basic.education')"
    header-class="text-primary text-subtitle1 text-bold"
    expand-icon-class="text-primary text-bold"
  >
    <div class="row q-py-sm">
      <div
        class="col-12 q-py-xs"
        v-for="(education, index) in educations"
        :key="index"
      >
        <q-card
          class="no-shadow"
          bordered
        >
          <q-card-section
            class="text-grey-7 q-py-sm"
            :class="$q.screen.lt.sm?'q-px-sm':''"
          >
            <div class="text-subtitle1 resume_bold q-pb-xs">{{education.college}}</div>
            <div class="row">
              <div class="col-auto q-gutter-x-xs">
                <q-badge
                  color="blue-grey-4"
                  :label="education.degreeCategory"
                />
                <q-badge
                  color="blue-grey-4"
                  :label="education.collegeStyle"
                />
              </div>
              <div class="col text-right">
                {{formatDate(education.startTime&&education.startTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
                {{education.endTime==='1000-01-01 00:00:00'?$t('resume.education.upToNow'):'- '+formatDate(education.endTime&&education.endTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
              </div>
            </div>
          </q-card-section>
          <q-card-section
            class="q-py-sm text-grey-7 row"
            :class="$q.screen.lt.sm?'q-px-sm':''"
          >

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
                {{$t('resume.education.admissionsCategory')}}
              </span>
              <span>
                {{education.admissionsCategory}}
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
