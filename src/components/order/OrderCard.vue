<template>
  <q-card
    flat
    bordered
    class="cursor-pointer widget-card base-card"
    :class="{'archived':model.archived}"
    @click="openDetail"
  >
    <q-card-section class="q-pb-sm">
      <!-- 订单单号、订单状态 -->
      <div class="flex items-center q-mb-sm">
        <span class="col text-h2-g text-weight-bold ellipsis">{{model.title}}</span>
        <q-space />
        <q-badge
          :color="status(model.status).color"
          align="top"
          class="q-pa-xs"
        >
          {{status(model.status).title}}
        </q-badge>
      </div>
      <!-- 业务类别、客户名称 -->
      <div class="text-body-g text-text1">
        <p class="q-mb-xs">客户名称：{{model.customerName}}</p>
        <p class="q-mb-xs">商机类型：{{model.classification?(model.classification.split(':')[1]?model.classification.split(':')[1]:model.classification):''}}</p>
        <p class="q-mb-xs">金额：￥{{model.amount}}</p>
      </div>
      <q-separator
        v-if="model.leaderID"
        class="q-my-sm"
      />
      <div
        v-if="model.leaderID"
        class="text-body-g text-text1"
      >
        <p class="q-mb-xs text-weight-bold">预计交期：<span class="text-primary1">{{model.expectedDeliveryDate}}</span></p>
        <p class="q-mb-xs">负责人：{{leaderName}}</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Order from '@/store/order/model'
export default {
  name: 'OrderCard',
  props: {
    model: {
      type: Object,
      default: new Order()
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapGetters('member', ['membersFilterInService']),
    members () {
      if (Object.keys(this.model).length) {
        return this.membersFilterInService(this.model.members)
      } else {
        return this.model.members
      }
    },
    orderBadgeColor () {
      return 'primary1'
    },
    status () {
      return step => {
        return this.$store.getters['order/status'](step)
      }
    },
    person () {
      return this.selectPersons[this.model.leaderID] || {}
    },
    leaderName () {
      return this.person.name || ''
    }
  },
  methods: {
    openDetail () {
      this.$router.push({
        name: `orderDetail`,
        params: { id: Number(this.model.id) }
      })
    }
  },
  watch: {

  },
  components: {
  }
}
</script>

<style scoped lang="scss">
</style>
