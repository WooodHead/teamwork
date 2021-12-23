<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section class="row q-my-lg">
      <q-input
        v-model="date"
        class="absolute-top-right q-px-lg"
        :class="$q.screen.lt.sm?'col-12':'col-3'"
        outlined
        type="month"
        :label="$t('workRecord.statisticMonth')"
      />
    </q-card-section>
    <q-card-section>
      <districtLayer :dataSource="dataSource" />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate, addToDate } = date
export default {
  name: 'WorkRecordDistrictLayer',
  data () {
    return {
      dataSource: [],
      date: formatDate(Date.now(), 'YYYY-MM')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('task', ['loadTasks']),
    init () {
      let query = [
        { Key: 'Type', Value: 'item', Oper: 'eq' },
        'and',
        { Key: 'BeginTime', Value: formatDate(this.date, 'YYYY-MM-DD'), Oper: 'ge' },
        'and',
        { Key: 'BeginTime', Value: formatDate(addToDate(this.date, { month: 1 }), 'YYYY-MM-DD'), Oper: 'lt' }
      ]
      this.loadTasks({ query: query }).then(res => {
        this.dataSource = []
        if (res && res.length) {
          let initAddress = _.groupBy(res.filter(r => r.address && r.address.type && r.address.type !== 'none' && r.address.value), m => { return m.address.value.pcode })
          let initAddressKeys = _.keys(initAddress), addressValue = {}
          _.forEach(initAddressKeys, r => {
            addressValue = initAddress[r][0].address && initAddress[r][0].address.value
            addressValue.sumByPcode = _.sumBy(initAddress[r], r => { return r.workHour })
            this.dataSource.push(addressValue)
          })
        }
      })
    }
  },
  components: {
    DistrictLayer: () => import('components/districtLayer/DistrictLayer')
  },
  watch: {
    date: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        newVal && oldVal && this.init()
      }
    }
  }
}
</script>
