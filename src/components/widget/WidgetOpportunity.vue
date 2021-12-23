<template>
  <div>
    <widget-layout
      :category="category"
      :id="objectID"
      widget="opportunity"
      :isEmpty="this.modelList.length === 0"
    >
      <template slot="content">
        <q-list>
          <q-item
            v-for="item in modelList"
            :key="item.id"
          >
            <q-item-section avatar>
              <tw-avatar
                size="md"
                :id="item.leaderID"
              />
            </q-item-section>

            <q-item-section class="text-left">
              <div class="row q-gutter-xs">
                <div>
                  <q-item-label
                    lines="1"
                    class="text-bold"
                  >{{item.title}}</q-item-label>
                </div>
                <div>
                  <opportunity-status-badge
                    :status="item.status"
                    :isLost="item.isLost"
                  />
                </div>
              </div>
              <q-item-label
                caption
                lines="2"
              >
                {{item.processType + '|' + item.expectedDeliveryDate}}
              </q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
      </template>
    </widget-layout>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'WidgetOpportunity',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar'),
    OpportunityStatusBadge: () => import('components/opportunity/OpportunityStatusBadge')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: false }
  },
  data () {
    return {
      modelList: []
    }
  },
  watch: {

  },
  computed: {
    search: {
      get () {
        return this.$store.getters['opportunity/search']
      },
      set (val) {
        val
          ? this.$store.commit('opportunity/setSearch', val)
          : this.$store.commit('opportunity/setSearch', '')
      }
    }
  },
  methods: {
    ...mapActions('opportunity', ['loadOpportunitys'])
  },
  created () {
    this.modelList = []
    this.search = ''
    const condition = {
      query: [
        { Key: 'CustomerID', Value: this.objectID, Oper: 'eq' }
      ]
    }
    this.loadOpportunitys(condition).then(data => {
      data.forEach(item => {
        let opportunity = {}
        opportunity.title = item.title
        opportunity.status = item.status ? item.status : ''
        opportunity.processType = item.processType ? item.processType.split(':')[1] : ''
        opportunity.expectedDeliveryDate = item.expectedDeliveryDate ? formatDate(item.expectedDeliveryDate, 'YYYY-MM-DD') : ''
        opportunity.customerName = item.customerName
        opportunity.leaderName = item.leaderName
        opportunity.leaderID = item.leaderID ? item.leaderID : ''
        opportunity.isLost = item.isLost
        opportunity.id = item.id
        this.modelList.push(opportunity)
      })
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
