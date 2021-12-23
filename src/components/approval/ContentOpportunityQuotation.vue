<template>
  <q-card class="borderLine q-pa-lg">
    <!-- 显示零件图 -->
    <div v-if="partsDocuments.length">
      <span class="text-grey-7">零件图</span>
      <div class="q-px-lg q-py-md">
        <template>
          <template v-if="Array.isArray(partsDocuments)">
            <attach-card
              v-for="doc in partsDocuments"
              :key="doc.id"
              :attach="doc"
              simple
            />
          </template>
          <attach-card
            v-else
            :attach="partsDocuments"
            simple
          />
        </template>
      </div>
    </div>
    <!-- 显示商机基本信息 -->
    <!-- 客户名称 -->
    <div class="row q-pt-md q-px-sm">
      <div :class="{'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class="text-grey-7">客户名称</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <span>{{customer &&customer.title}}</span>
        <!-- 客户等级 -->
        <q-badge
          style="margin-left: 5px;"
          v-if="customGradeName.length>0"
          align="top"
          :color="customGradeColor"
        >{{customGradeName}}
        </q-badge>
      </div>
    </div>
    <div class="row q-pt-md q-px-sm">
      <div :class="{'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class=" text-grey-7">商机名称</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <span>{{opportunity.title}}</span>
      </div>
    </div>
    <div class="row  q-pt-md q-px-sm">
      <div :class="{'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class=" text-grey-7">项目报价</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <span style="color:orange;">￥{{quotation.amount}}</span>
      </div>
    </div>
    <div class="row  q-pt-md q-px-sm">
      <div :class="{'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class="text-grey-7">报价说明</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <span>{{quotation.notes}}</span>
      </div>
    </div>
    <div class="row q-pt-md q-px-sm">
      <div :class="{'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class=" text-grey-7">报价人</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <span>{{quotation.modifyBy}}</span>
      </div>
    </div>
    <div class="row q-pt-md q-px-sm">
      <div :class="{'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class=" text-grey-7">报价时间</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <span>{{quotation.modifyTime}}</span>
      </div>
    </div>
    <q-separator class="q-my-sm" />
    <div
      class="row "
      v-if="quotationBillsDocuments.length"
    >
      <div :class="{'q-px-sm':true,'spanTitle':$q.platform.is.desktop,'col':$q.platform.is.mobile}">
        <span class=" text-grey-7">报价单</span>
      </div>
      <div :class="{'col-auto':$q.platform.is.mobile}">
        <template v-if="Array.isArray(quotationBillsDocuments)">
          <attach-card
            v-for="doc in quotationBillsDocuments"
            :key="doc.id"
            :attach="doc"
            simple
          />
        </template>
        <attach-card
          v-else
          :attach="quotationBillsDocuments"
          simple
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ContentOpportunityQuotation',
  props: {
    opportunityID: {
      type: [Number, String],
      required: true,
      description: '商机Id'
    }
  },
  data () {
    return {
      partsDocuments: [],
      quotationBillsDocuments: [],
      quotation: {}, // 报价对象
      opportunity: {},
      customer: {} // 客户对象
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('customer', ['grade']),
    customTitle () {
      return this.customer && this.customer.title
    },
    customGradeName () {
      return (this.customer && this.grade[this.customer.grade] && this.grade[this.customer.grade].name) || ''
    },
    customGradeColor () {
      return (this.customer && this.grade[this.customer.grade] && this.grade[this.customer.grade].color) || ''
    }
  },
  methods: {
    ...mapActions('document', ['loadTagDocument']),
    ...mapActions('customer', ['loadCustomer']),
    ...mapActions('opportunity', ['loadOpportunity']),
    ...mapActions('quotation', ['loadQuotationByOpportunityID']),
    init () {
      // 获取零件图文档
      this.loadTagDocument({ category: 'opportunity', objectID: +this.opportunityID, tag: this.$store.state.quotation.partsPicTag, treeLevel: 3 }).then(res => {
        this.partsDocuments = res
      })
      // 获取报价文档
      this.loadTagDocument({ category: 'opportunity', objectID: +this.opportunityID, tag: this.$store.state.quotation.quotationBillsTag, treeLevel: 3 }).then(res => {
        this.quotationBillsDocuments = res
      })
      this.loadOpportunity(+this.opportunityID).then(res => {
        this.opportunity = res
      })
      // 获取报价单
      this.loadQuotationByOpportunityID(+this.opportunityID).then(res => {
        if (res) {
          this.quotation = res
          let customerID = this.quotation.customerID || 0
          this.loadCustomer(customerID).then(res => {
            this.customer = res
          })
        }
      })
    }
  },
  components: {
    AttachCard: () => import('components/attach/AttachCard.vue')
  }
}
</script>

<style lang="scss" scoped >
.spanTitle {
  width: 100px;
  display: inline-block;
}
</style>
