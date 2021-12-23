<!-- 简历项目情况组件 -->
<template>
  <q-list>
    <q-expansion-item
      v-model="expanded"
      :label="$t('resume.basic.project')"
      header-class="text-primary text-subtitle1 text-bold"
      expand-icon-class="text-primary text-bold"
    >
      <div class="row q-py-sm">
        <div
          class="col-12 q-py-xs"
          v-for="(project, index) in projects"
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
              <div class="text-subtitle1 resume_bold q-pb-xs">{{project.name}}</div>
              <div class="row">
                <div class="col-auto">
                  {{project.role}}
                </div>
                <div class="col text-right">
                  {{formatDate(project.startTime&&project.startTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
                  {{project.endTime==='1000-01-01 00:00:00'?$t('resume.education.upToNow'):'- '+formatDate(project.endTime&&project.endTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
                </div>
              </div>
            </q-card-section>
            <q-card-section
              class="q-py-sm text-grey-7 row"
              :class="$q.screen.lt.sm?'q-px-sm':''"
            >
              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.project.source')}}
                </span>
                <span>
                  {{project.source}}
                </span>
              </div>
              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.project.personNumber')}}
                </span>
                <span>
                  {{project.personNumber}}
                </span>
              </div>
              <div class="row no-wrap resume_info_row col-12">
                <span class="resume_info_key">
                  {{$t('resume.project.introduction')}}
                </span>
                <span>
                  {{project.introduction}}
                </span>
              </div>
              <div class="row no-wrap col-12">

                <span class="resume_info_key">
                  {{$t('resume.project.duty')}}
                </span>
                <span>
                  {{project.duty}}
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
  name: 'ResumeProject',
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
    projects () {
      if (!_.isEmpty(this.resume)) {
        return _.reverse(_.sortBy(this.resume.projects, 'startTime'))
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
