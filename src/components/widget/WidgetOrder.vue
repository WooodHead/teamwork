<template>
  <div>
    <widget-layout
      :category="category"
      :id="objectID"
      widget="order"
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
                  <q-badge
                    align="top"
                    class="a-pa-xs a-mr=md"
                    :color="status[item.status].color"
                  >{{status[item.status].title}}</q-badge>
                </div>
              </div>
              <q-item-label
                caption
                lines="2"
              >
                {{item.classification + '|' + item.expectedDeliveryDate}}
              </q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
      </template>
    </widget-layout>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'WidgetOrder',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar')
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
    ...mapState('order', ['status']),
    search: {
      get () {
        return this.$store.getters['order/search']
      },
      set (val) {
        val
          ? this.$store.commit('order/setSearch', val)
          : this.$store.commit('order/setSearch', '')
      }
    }
  },
  methods: {
    ...mapActions('order', ['loadOrders'])
  },
  created () {
    this.modelList = []
    this.search = ''
    const condition = {
      query: [
        { Key: 'CustomerID', Value: this.objectID, Oper: 'eq' }
      ]
    }
    this.loadOrders(condition).then(data => {
      data.forEach(item => {
        let order = {}
        order.title = item.title
        order.status = item.status ? item.status : ''
        order.classification = item.classification
        order.expectedDeliveryDate = item.expectedDeliveryDate ? formatDate(item.expectedDeliveryDate, 'YYYY-MM-DD') : ''
        order.customerName = item.customerName
        order.leaderID = item.leaderID ? item.leaderID : ''
        order.amount = item.amount
        order.id = item.id
        this.modelList.push(order)
      })
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
