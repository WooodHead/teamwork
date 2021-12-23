<template>
  <q-card
    :flat="$q.screen.lt.sm"
    :class="['card-grow-in-page', {'q-pa-xl':$q.screen.gt.sm}]"
  >
    <!-- 审批头部操作区 -->
    <approval-header
      v-if="message&&Object.keys(message.extra).length"
      category="opportunity"
      :objectID="id"
      type="quotation"
      :EventGuid="message.extra.EventGuid"
      :WFGuid="message.extra.WF_Guid"
      :done="!!message.done"
      :WFResult="message.extra.WF_Result"
      @approvalPassed="quotaPassed($event)"
    />
    <!-- 审批的内容区 -->
    <q-card-section>
      <content-opportunity-quotation :opportunityID="+id" />
    </q-card-section>
    <!-- 审批的详情页区 -->
    <q-card-section>
      <opportunity-detail :id="+id" />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OpportunityQuotationApproval',
  props: {
    id: {
      type: [Number, String],
      required: true,
      description: '资源Id'
    }
  },
  data () {
    return {
      message: { extra: {} }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('opportunity', ['refreshOpportunity']),
    ...mapActions('message', ['loadMessageBy']),
    init () {
      let query = [{ 'Key': 'Route.Path', 'Value': this.$route.path, 'Oper': 'eq' },
        'and', { 'Key': 'ReceiveBy', 'Value': _.toString(this.$myinfo.id), 'Oper': 'search' },
        'and', { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }]
      this.loadMessageBy({ query }).then(res => {
        if (res) {
          this.message = res
        }
      })
    },
    /**
     * 报价审批通过后
     * */
    quotaPassed (val) {
      this.refreshOpportunity(+this.id) // 刷新商机状态
    }
  },
  components: {
    ApprovalHeader: () => import('components/approval/ApprovalHeader'),
    ContentOpportunityQuotation: () => import('components/approval/ContentOpportunityQuotation'),
    OpportunityDetail: () => import('components/opportunity/OpportunityDetail')
  }
}
</script>

<style lang="scss" scoped>
</style>
