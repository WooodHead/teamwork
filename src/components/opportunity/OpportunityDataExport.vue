<!--商机\订单列表导出-->
<template>
  <q-card>
    <div v-show="!showExport">
      <q-card-section>
        <div
          v-if="this.listPageType.key === 'allList'"
          class="text-h6"
        >确认导出所有商机吗？</div>
        <div
          v-else-if="this.listPageType.key === 'myList'"
          class="text-h6"
        >确认导出我的商机吗？</div>
        <div
          v-else-if="this.listPageType.key === 'customerList'"
          class="text-h6"
        >确认导出客户的所有商机吗？</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          :label="$t('action.confirm')"
          class="text-bold"
          @click="showExport = true"
        />
        <q-btn
          outline
          color="primary"
          type="reset"
          class="q-ml-sm"
          :label="$t('action.cancel')"
          v-close-popup
        />
      </q-card-actions>
    </div>
    <q-dialog v-model="showExport">
      <export-excel
        v-if="showExport"
        moduleType="opportunity"
        :fields="fields"
        :query="listPageType.selectCondition.query"
        :search="listPageType.selectCondition.search"
        loadDataAction='GetList'
        :fileName="fileName"
        :tableHeader="{name:fileName,style:'font-weight:bold;font-size:25px;'}"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OpportunityDataExport',
  props: {
    category: { type: String },
    modelList: { type: Array }
  },
  data () {
    return {
      showExport: false
    }
  },
  computed: {
    ...mapGetters('opportunity', ['listPageType']),
    fields () {
      return [
        'Title',
        'CustomerName',
        'ProcessType',
        'TransactionPrice',
        'Status',
        'ExpectedDeliveryDate',
        'LeaderID'
      ]
    },
    fileName () {
      return (this.listPageType.key === 'allList') ? this.$t('opportunity.header.allOpportunity') : this.$t('opportunity.header.myOpportunity')
    }
  },
  components: {
    ExportExcel: () => import('components/export/ExportExcel')
  }
}
</script>

<style lang='scss' scoped>
</style>
