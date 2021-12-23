<template>
  <q-card
    flat
    bordered
    class="cursor-pointer opportunity-card"
    :class="{'archived':model.archived}"
    @click="$router.push({name: `customerDetail`, params: { id: Number(model.customerID) }})"
    style="overflow:hidden"
  >
    <!-- <q-card-section class="q-pb-none"> -->
    <q-card-section class="q-pt-sm q-pb-xs">
      <div class="text-center text-subtitle2 text-weight-bold ellipsis">客户</div>
    </q-card-section>
    <q-card-section
      class="q-py-none"
      v-if="$q.screen.gt.xs"
    >
      <q-separator />
    </q-card-section>

    <q-card-section>
      <!-- 标题 -->
      <div
        class="q-py-sm text-subtitle2 text-weight-bold ellipsis"
        :title="customerModel &&customerModel.title"
      >
        {{customerModel &&customerModel.title}}
      </div>
      <!-- 描述 -->
      <div
        class="text-caption ellipsis-2-lines"
        v-html="htmlToText(customerModel &&customerModel.notes)"
        :title="htmlToText(customerModel &&customerModel.notes)"
      >
      </div>
      <!-- 客户成员 -->
      <q-card-section
        v-if="customerModel && customerModel.members && customerModel.members.length"
        class="q-pt-sm row no-wrap q-gutter-x-xs"
      >
        <template v-if="customerModel.members.length<8">
          <tw-avatar
            v-for="person in members"
            :key="`opportunity_${customerModel.id}_${person}`"
            :id="person"
            size="sm"
          />
        </template>
        <template v-else>
          <tw-avatar
            v-for="person in members.slice(0,6)"
            :key="`opportunity_${customerModel.id}_${person}`"
            :id="person"
            size="sm"
          />
          <q-avatar
            text-color="grey-7"
            style="border:1px solid #757575;letter-spacing:-1px;text-indent:-5px"
            size="sm"
            font-size="0.8rem"
          ><span>+{{customerModel &&customerModel.members.length-6}}</span></q-avatar>
        </template>
      </q-card-section>
    </q-card-section>
    <!-- </q-card-section> -->
  </q-card>
</template>
<script>
import htmlToText from '@/utils/html-to-text'
import Opportunity from '@/store/opportunity/model'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'CustomerCard',
  props: {
    model: {
      type: Object,
      default: new Opportunity()
    }
  },
  data () {
    return {
      customerModel: {}
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('member', ['membersFilterInService']),
    members () {
      return this.membersFilterInService(this.customerModel.members)
    },
    customerTypeData () {
      return this.dictionary['customer'] ? this.dictionary['customer']['customerType'] : []
    }
  },
  created () {
    this.loadCustomer(this.model.customerID || 0).then(res => {
      this.customerModel = res
    })
    this.loadDictionarys('customer')
  },
  methods: {
    htmlToText,
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapActions('customer', ['loadCustomer'])
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
.widget-card:before {
  content: "";
  display: block;
  padding-top: 90px !important;
}
@media (min-width: $breakpoint-xs-max) {
  .widget-card {
    width: 230px !important;
    display: block;
  }
}
</style>
