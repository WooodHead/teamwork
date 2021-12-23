<template>
  <widget-layout
    :isEmpty="!totalHours"
    :isSetting="false"
    widget="workHour"
    :category="category"
    :id="objectID"
  >
    <template
      v-if="totalHours"
      slot="content"
    >
      <q-card-section :class="$q.screen.gt.xs?'q-py-xl':'q-py-md'">
        <div class="text-h6 ">{{$t('workHour.allHours')}}</div>
        <div
          class="text-accent text-h4 q-mt-md"
          style="word-break:break-all;"
        >{{Math.abs(totalHours.toFixed(1))}}</div>
      </q-card-section>
    </template>
  </widget-layout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'WidgetWorkHour',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('workHour', ['resource', 'sumHourList', 'sumHoursByOwnerList']),
    totalWorkHours () {
      return (this.sumHourList.sumWorkHours && this.sumHourList) || this.inServiceTotalWorkHours
    },
    totalHours () {
      return this.totalWorkHours.sumWorkHours + this.totalWorkHours.sumOnRoadHours
    },
    inServiceTotalWorkHours () {
      if (this.sumHoursByOwnerList.length) {
        let inService = _.filter(this.sumHoursByOwnerList, p => this.selectPersons[p.ownerID] && p.objectType === this.category && p.objectID === +this.objectID)
        let total = {
          sumWorkHours: _.sumBy(inService, 'sumWorkHours'),
          sumOnRoadHours: _.sumBy(inService, 'sumOnRoadHours')
        }
        this.setSumHourList(total)
        return total
      } else {
        return {
          sumWorkHours: 0,
          sumOnRoadHours: 0
        }
      }
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout')
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations('workHour', ['setSumHourList', 'setEmptySumHoursByOwnerList', 'setEmptyQueryTime']),
    ...mapActions('workHour', ['loadSumHoursByOwner']),
    init () {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, +this.objectID).then(res => {
        if (res) {
          // 如果资源的详情页已经获取了累计值，则不用再次获取
          if (this.category !== this.resource.objectType || +this.objectID !== +this.resource.objectID) {
            this.setSumHourList({
              sumWorkHours: 0,
              sumOnRoadHours: 0
            })
            this.setEmptySumHoursByOwnerList()
            this.setEmptyQueryTime()
            this.getSumHoursByOwner()
          }
        }
      })
    },
    getSumHoursByOwner () {
      let query = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'OwnerType', Value: 'person', Oper: 'eq' }
      ]
      this.loadSumHoursByOwner({ query: query })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
