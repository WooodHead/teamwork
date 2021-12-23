<template>
  <resource-layout
    category='order'
    :objectID='+id'
    :categoryModel="model"
  >
    <template
      #titleBadge
      v-if="model.status"
    >
      <q-badge
        align="top"
        class="q-pa-xs q-mr-md"
        :color="status(model.status).color"
      >{{status(model.status).title}}</q-badge>
    </template>
    <template #subtitle>
      <div class="q-gutter-sm">
        <q-badge
          outline
          align="middle"
          color="secondary"
        >
          {{model.orderNo}}
        </q-badge>
        <q-badge
          v-if="model.expectedDeliveryDate"
          :title="$t('order.expectedDeliveryDate')"
          outline
          align="middle"
          color="secondary"
        >
          {{model.expectedDeliveryDate}}
        </q-badge>
        <q-badge
          v-if="model.amount"
          outline
          :title="$t('order.amount')"
          align="middle"
          color="secondary"
        >
          {{model.amount}}元
        </q-badge>
      </div>
    </template>
    <template slot="prepend">
      <q-card-section class="q-px-xxl q-pt-none">
        <!-- 步进器-->
        <order-stepper
          v-if="model.status"
          class="q-pb-md"
          :model="model"
        />
        <!-- 关联资源 -->
        <order-relation :model="model" />
      </q-card-section>
    </template>
  </resource-layout>

</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'OrderDetail',
  props: {
    id: { type: [String, Number], required: true }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    model () {
      return this.$store.getters['order/order'](+this.id)
    },
    status () {
      return step => {
        return this.$store.getters['order/status'](step)
      }
    },
    customerTypeData () {
      return this.dictionary['customer'] ? this.dictionary['customer']['customerType'] : []
    }
  },
  mounted () {
    this.loadDictionarys('customer')
  },
  components: {
    // KeyValueLayout: () => import('layouts/KeyValueLayout'),
    ResourceLayout: () => import('layouts/ResourceLayout'),
    OrderStepper: () => import('components/order/OrderStepper'),
    OrderRelation: () => import('components/order/OrderRelation')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys'])
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-stepper__header--alternative-labels .q-stepper__tab,
/deep/.q-stepper__tab {
  min-height: 0;
  padding: 0;
}
/deep/.q-stepper__content {
  display: none;
}
</style>
