<!-- 简历工作/实践情况组件 -->
<template>
  <q-list>
    <q-expansion-item
      v-model="expanded"
      :label="$t('resume.basic.workExperience')"
      header-class="text-primary text-subtitle1 text-bold"
      expand-icon-class="text-primary text-bold"
    >
      <div class="row q-py-sm">
        <div
          class="col-12 q-py-xs"
          v-for="(workExperience, index) in workExperiences"
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
              <div class="text-subtitle1 resume_bold q-pb-xs">{{workExperience.company}}</div>
              <div class="row">
                <div class="col-auto">
                  {{workExperience.department}} · {{workExperience.position}}
                </div>
                <div class="col text-right">
                  {{formatDate(workExperience.startTime&&workExperience.startTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
                  {{workExperience.endTime==='1000-01-01 00:00:00'?$t('resume.education.upToNow'):'- '+formatDate(workExperience.endTime&&workExperience.endTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
                </div>
              </div>
            </q-card-section>
            <q-card-section
              class="q-py-sm text-grey-7"
              :class="$q.screen.lt.sm?'q-px-sm':''"
            >
              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.workExperience.industry')}}
                </span>
                <span>
                  {{workExperience.industry}}
                </span>
              </div>
              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.workExperience.content')}}
                </span>
                <span>
                  {{workExperience.content}}
                </span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'ResumeWorkExperience',
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
    workExperiences () {
      if (!_.isEmpty(this.resume)) {
        return _.reverse(_.sortBy(this.resume.workExperiences, 'startTime'))
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
