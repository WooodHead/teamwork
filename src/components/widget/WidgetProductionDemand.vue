<template>
  <widget-layout
    :isEmpty="validDemands.length===0"
    :category="category"
    :id="objectID"
    widget="productionDemand"
  >
    <template slot="content">
      <q-list>
        <q-item
          v-for="demand in validDemands"
          :key="demand.id"
        >
          <q-item-section avatar>
            <tw-avatar
              size="md"
              :id="demand.leaderID"
            />
          </q-item-section>

          <q-item-section class="text-left">
            <q-item-label
              lines="1"
              class="text-bold"
            >{{demand.title}}</q-item-label>
            <q-item-label
              caption
              lines="2"
            >
              {{formatDate(demand.createTime && demand.createTime.replace(/-/g, '/'),'YYYY-MM-DD')}}
              <span v-html="demand.notes"></span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </widget-layout>
</template>

<script>
import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
const { formatDate } = date
export default {
  name: 'WidgetProductionDemand',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: false }
  },
  data () {
    return {}
  },
  watch: {
    objectID (newVal, oldVal) {
      this.init()
    }
  },
  computed: {
    ...mapGetters('allocation', ['allocations']),
    validDemands () {
      return this.allocations({ category: this.category, objectID: this.objectID })
    }
  },
  methods: {
    ...mapActions('allocation', ['loadAllocations']),
    formatDate,
    init () {
      let query = [
        { Key: 'Archived', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'ManufacturerID', Value: this.objectID, Oper: 'eq' }
      ]
      this.loadAllocations({ query, limit: 5, offset: 0, byPage: true })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
</style>
