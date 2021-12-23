<!-- 简历获奖证书组件 -->
<template>
  <q-list>
    <q-expansion-item
      v-model="expanded"
      :label="$t('resume.basic.certificate')"
      header-class="text-primary text-subtitle1 text-bold"
      expand-icon-class="text-primary text-bold"
    >
      <div class="row q-py-sm">
        <div
          class="col-12 q-py-xs"
          v-for="(certificate, index) in certificates"
          :key="index"
        >
          <q-card
            class="no-shadow"
            bordered
          >
            <q-card-section
              class="row text-grey-7 q-py-sm"
              :class="$q.screen.lt.sm?'q-px-sm':''"
            >
              <div class="text-subtitle1 resume_bold col">
                {{certificate.name}}
              </div>
              <div class="col-auto text-right">
                {{formatDate(certificate.startTime&&certificate.startTime.replace(/-/g, '/'), 'YYYY.MM.DD')}}
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
  name: 'ResumeCertificate',
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
    certificates () {
      if (!_.isEmpty(this.resume)) {
        return this.resume.certificates
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
