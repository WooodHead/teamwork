<!-- 项目、产品、商机 -->
<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span>
        {{activity.actor}}{{$t(`approval.${activity.description}`, {type: $t(`${activity.widget.type}.title`)})}}
      </span>
    </div>
    <!-- 立项/结项报告、说明、审批意见 -->
    <div
      v-if="detail"
      class="q-ml-sm text-caption"
    >
      <template v-if="$custom.isJDXAStyleOfProjectManage">
        <!-- 是否研发类项目 -->
        <div v-if="detail.Classify">
          <span class="text-weight-bold">{{$t('approval.isScientificProject')}}：</span>
          {{detail.Classify}}
        </div>
        <!-- 是否形成销售 -->
        <div v-if="detail.Saled">
          <span class="text-weight-bold">{{$t('approval.isSaled')}}：</span>
          {{detail.Saled}}
        </div>
        <!-- 关联产品 -->
        <div v-if="detail.RelatedProductDev">
          <span class="text-weight-bold">{{$t('productDev.relate')}}：</span>
          {{detail.RelatedProductDev}}
        </div>
      </template>
      <!-- 立项/结项时间 -->
      <div v-if="activity.objectType !=='opportunity'">
        <span
          v-if="detail.Time"
          class="text-weight-bold"
        >
          {{activity.action==='start'?$t('approval.approvalDate'):$t('approval.finishDate')}}：</span>
        {{ detail.Time}}
      </div>
      <div v-else>
        <span
          v-if="detail.Price"
          class="text-weight-bold"
        >{{ $t('opportunity.quotation.totalAmount')}}：</span>
        {{ detail.Price}}
      </div>
      <!-- 立项/结项报告 -->
      <div v-if="detail.Doc&&detail.Doc.length">
        <div
          class="text-weight-bold"
          v-if="activity.objectType !=='opportunity'"
        >
          {{activity.action==='start'?$t('approval.startDocument'):$t('approval.finishDocument')}}：
        </div>
        <div v-else>
          <span
            v-if="detail.Price"
            class="text-weight-bold"
          >{{ $t('opportunity.quotationBills')}}：</span>
        </div>
        <div
          v-for="doc in detail.Doc"
          :key="doc.DocID"
        > <a
            class="text-primary"
            href="javascript:void(0);"
            @click="toDocumentDetail(doc)"
            v-html="doc.Title"
          > </a>
        </div>
      </div>
      <!-- 立项/结项申请说明 -->
      <div v-if="detail.Notes">
        <span class="text-weight-bold">{{activity.action==='start'?$t('approval.approvalNotes'):$t('approval.finishNotes')}}：</span>
        <span
          style="word-wrap: break-word;white-space:pre-wrap;"
          v-html="detail.Notes"
        ></span>
      </div>
      <!-- 审批意见 -->
      <div v-if="detail.Comment">
        <span class="text-weight-bold">{{$t('approval.approvalReason')}}：</span>
        <span
          style="word-wrap: break-word;white-space:pre-wrap;"
          v-html="detail.Comment"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'ApprovalActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    detail () {
      // 立项/结项/审批/报价
      if (this.activity.description.indexOf('Approval') !== -1 ||
        this.activity.description.indexOf('AddQuotationApply') !== -1 ||
        this.activity.description.indexOf('Done') !== -1) {
        if (this.activity.widget && this.activity.widget.detail) {
          let detail = _.isObject(this.activity.widget.detail) ? this.activity.widget.detail : JSON.parse(this.activity.widget.detail)
          if (detail.Time) detail.Time = formatDate(detail.Time, 'YYYY-MM-DD')
          return detail
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  methods: {
    toDocumentDetail (doc) {
      this.$router.push({
        name: `${doc.Classify}Detail`,
        params: {
          category: this.activity.objectType,
          objectID: +this.activity.objectId,
          id: +doc.DocID
        }
      })
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
