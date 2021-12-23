<!-- 简历文娱情况信息组件 -->
<template>
  <q-expansion-item
    v-model="expanded"
    :label="$t('resume.basic.entertainment')"
    header-class="text-primary text-subtitle1 text-bold"
    expand-icon-class="text-primary text-bold"
  >
    <div class="row q-py-sm">
      <div
        class="col-12 q-py-xs"
        v-for="(entertainment, index) in entertainments"
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
            <div class="row">
              <div class="text-subtitle1 resume_bold col-auto q-gutter-x-xs">
                {{entertainment.name}}
              </div>
              <div class="col text-right">
                {{formatDate(entertainment.startTime&&entertainment.startTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
              </div>
            </div>
          </q-card-section>
          <q-card-section
            class="q-py-sm text-grey-7"
            :class="$q.screen.lt.sm?'q-px-sm':''"
          >
            <div class="row no-wrap">
              <span>
                {{entertainment.description}}
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
  name: 'ResumeEntertainment',
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
    entertainments () {
      if (!_.isEmpty(this.resume)) {
        return _.reverse(_.sortBy(this.resume.entertainments, 'startTime'))
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
