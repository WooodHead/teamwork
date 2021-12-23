<!-- 简历语言情况组件 -->
<template>
  <q-list>
    <q-expansion-item
      v-model="expanded"
      :label="$t('resume.basic.language')"
      header-class="text-primary text-subtitle1 text-bold"
      expand-icon-class="text-primary text-bold"
    >
      <div class="row q-py-sm">
        <div
          class="col-12 q-py-xs"
          v-for="(language, index) in languages"
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
              <div class="text-subtitle1 resume_bold">
                {{language.kind}}
              </div>
            </q-card-section>
            <q-card-section
              class="q-py-sm text-grey-7 row"
              :class="$q.screen.lt.sm?'q-px-sm':''"
            >

              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.language.level')}}
                </span>
                <span>
                  {{language.level}}
                </span>
              </div>
              <div class="row no-wrap  resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.language.listen')}}
                </span>
                <span>
                  {{language.listen}}
                </span>
              </div>
              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.language.certificate')}}
                </span>
                <span>
                  {{language.certificate}}
                </span>
              </div>
              <div class="row no-wrap resume_info_row col-12 col-md-6">
                <span class="resume_info_key">
                  {{$t('resume.language.score')}}
                </span>
                <span>
                  {{language.score}}
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
export default {
  name: 'ResumeLanguage',
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
  computed: {
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    },
    resume () {
      return this.$store.getters['resume/resume'](+this.resumeView.resumeID)
    },
    languages () {
      if (!_.isEmpty(this.resume)) {
        return this.resume.languages
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
