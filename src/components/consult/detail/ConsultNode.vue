<template>
  <tw-stepper
    class="stepper-nocontent"
    :step="step"
    :alternativeLabels="!$q.screen.gt.sm"
    :stepList="stepList()"
  />
</template>
<script>
export default {
  name: 'ConsultNode',
  props: {
    step: {
      type: Number,
      default: 0
    },
    exceptFinishTime: {
      type: String,
      default: ''
    },
    progress: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    stepList () {
      return [
        {
          name: 0,
          title: this.$t('consult.consultDetail.submited')
        },
        {
          name: 1,
          title: this.step >= 2 ? this.$t('consult.consultDetail.accepted') : this.$t('consult.consultDetail.toAccept'),
          caption: this.$q.screen.gt.sm ? (this.acceptTimeConsumes() > 0 ? (this.$t('consult.consultDetail.acceptTimeConsumes') + this.timeStamp(this.acceptTimeConsumes())) : '') : ''
        },
        {
          name: 2,
          title: this.toDoNode(),
          caption: this.$q.screen.gt.sm ? (this.doTimeConsumes() > 0 ? (this.$t('consult.consultDetail.doTimeConsumes') + this.timeStamp(this.doTimeConsumes())) : '') : ''
        },
        {
          name: 3,
          title: this.step >= 4 ? this.$t('consult.consultDetail.confirmed') : this.$t('consult.consultDetail.toConfirm'),
          caption: this.$q.screen.gt.sm ? (this.exceptFinishTime ? (this.$t('consult.consultAdd.dueDate') + '：' + this.exceptFinishTime) : '') : ''
        }
      ]
    },
    toDoNode () {
      if (this.step === 2) {
        return this.$t('consult.consultDetail.doing')
      } else if (this.step >= 3) {
        return this.$t('consult.consultDetail.done')
      } else {
        return this.$t('consult.consultDetail.todo')
      }
    },
    timeStamp (minites) {
      let day = parseInt(minites / 60 / 24)
      let hour = parseInt(minites / 60 % 24)
      let min = parseInt(minites % 60)
      let all = ''
      if (day > 0) {
        all = day + this.$t('date.day')
      }
      if (hour > 0) {
        all += hour + this.$t('date.hour')
      }
      if (min > 0) {
        all += parseFloat(min) + this.$t('date.minite')
      }
      return all
    },
    acceptTimeConsumes () {
      // 受理时长
      let time = this.progress.filter(n => { return n.status === 2 })
      return time.length ? time[0].timeConsuming : 0
    },
    doTimeConsumes () {
      // 处理时长
      let time = this.progress.filter(n => { return n.status === 3 })
      return time.length ? time[0].timeConsuming : 0
    },
    allTimeConsumes () {
      // 总共办理时长
      return _.sum(this.progress.map(n => n.timeConsuming)) || 0
    }
  },
  components: {
    TwStepper: () => import('components/base/TwStepper')
  },
  watch: {
    step: {
      deep: true,
      handler: function (newV, oldV) {
        this.stepList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
