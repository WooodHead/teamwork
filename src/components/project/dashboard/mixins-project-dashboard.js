export default {
  props: {
    chart: {
      type: Object,
      required: false,
      default: () => { return {} }
    },
    uid: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  mounted () {
    this.$store.dispatch('project/loadProjectDashboardData', { chart: this.chart, uid: this.uid })
  },
  methods: {
    item (params) {
      if (params.data.value !== 0) {
        this.$router.push({
          name: 'projectDashboardDetail',
          params: {
            chart: this.chart,
            clickedChart: { name: params.name, data: params.data }
          }
        })
      }
    }
  },
  watch: {
    chart (newVal, oldVal) {
      let newValues = _.values(newVal.model)
      let oldValues = _.values(oldVal.model)
      let result = newValues.length === oldValues.length && newValues.every(a => oldValues.some(b => a === b)) && oldValues.every(_b => newValues.some(_a => _a === _b))

      let newTitle = newVal.title ? newVal.title : 'title'
      this.initOption && (this.initOption.title.text = newTitle)

      if (!result) {
        let key = `${this.uid}-${this.chart.name}`
        this.$store.commit('project/removeDashboardRankKey', key)
        this.$store.dispatch('project/loadProjectDashboardData', { chart: this.chart, uid: this.uid })
      }
    }
  }
}
