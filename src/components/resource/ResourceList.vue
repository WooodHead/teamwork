<template>
  <q-list
    dense
    padding
    class="rounded-borders"
    style="width:100%"
  >
    <public-resource-list
      v-for="model in modelList"
      :key="model.id"
      :psonID="model.leaderID"
      :title="model.title"
      :organizeName="groupName(model)"
      @click.native="openDetail(model)"
    />
  </q-list>
</template>

<script>
import { date } from 'quasar'
// import TwCarouselSwitchVue from '../base/file-uploader/TwCarouselSwitch.vue'
export default {
  name: 'ResourceList',
  props: {
    category: { type: String, required: true },
    modelList: { type: Array, required: true }
  },
  data () {
    return {
      // 排序值与model中的字段名称对应关系
      IsShow: false,
      sortDic: {
        order: {
          OrderNo: item => { return item['orderNo'] },
          Status: item => { return this.$store.state.order.status[item['status']].title },
          ExpectedDeliveryDate: item => { return date.formatDate(item['expectedDeliveryDate'], 'YYYY-MM-DD') }
        },
        opportunity: {
          Title: item => { return item['title'] },
          ProcessType: item => { return this.dictValue({ module: 'opportunity', field: 'processType', dictKey: item['processType'].split(':')[0] }) },
          Status: item => { return this.$store.state.opportunity.status[item['status']].title },
          TransactionPrice: item => { return item['transactionPrice'] },
          ExpectedDeliveryDate: item => { return date.formatDate(item['expectedDeliveryDate'], 'YYYY-MM-DD') }
        },
        productDev: {
          'CONVERT(Type USING gbk)': item => { return item['type'] },
          ProductDevNum: item => { return item['productDevNum'] },
          Status: item => { return this.$t(`state.${item['status']}`) },
          BeginDate: item => { return date.formatDate(item['beginDate'], 'YYYY-MM-DD') },
          PredictEndDate: item => { return date.formatDate(item['predictEndDate'], 'YYYY-MM-DD') }
        },
        project: {
          ProjLevel: item => { return (item['projLevel'] && item['projLevel'].split(':').length >= 2) ? item['projLevel'].split(':')[1] : item['projLevel'] },
          ProjNum: item => { return item['projNum'] },
          Status: item => { return this.$t(`state.${item['status']}`) },
          BeginDate: item => { return date.formatDate(item['beginDate'], 'YYYY-MM-DD') },
          PredictEndDate: item => { return date.formatDate(item['predictEndDate'], 'YYYY-MM-DD') }
        },
        team: {
          'CONVERT(Type USING gbk)': item => { return item['type'] }
        },
        customer: {
          CustomerName: item => { return item['title'] },
          CustomerType: item => { return this.dictValue({ module: 'customer', field: 'customerType', dictKey: item['customerType'] }) },
          Grade: item => { return this.dictValue({ module: 'customer', field: 'grade', dictKey: item['grade'] }) }
        },
        manufacturer: {
          'CONVERT(OrganizeName USING gbk)': item => { return '' },
          Classify: item => { return item['classify'] === 'internal' ? '内控' : '外协' },
          Level: item => {
            let val = item['level']
            return (val && val.includes(':')) ? val.split(':')[1] : val
          }
        }
      }
    }
  },
  computed: {
    // 获取排序字段值在sortDic中的对应值
    curSortDicVal () {
      return this.sortDic[this.category] &&
        this.sortDic[this.category][this.$store.state[this.category].sort]
    },
    dictValue () {
      return ({ module, field, dictKey }) => {
        let dict = this.$store.getters[`dictionary/dictionary`]({ module, field, dictKey })
        if (dict) {
          return dict.dictValue
        } else {
          return '-'
        }
      }
    }
  },
  methods: {
    // 排序分组名称，凡未在sortDic中列出的排序，都默认取部门名称
    groupName (item) {
      return this.curSortDicVal
        ? (this.curSortDicVal(item) || '')
        : (item.organizeID ? this.$store.state.organize.selectOrganizes[item.organizeID] && this.$store.state.organize.selectOrganizes[item.organizeID].name : '')
    },
    openDetail (model) {
      this.$router.push({
        name: `${this.category}Detail`,
        params: { id: Number(model.id) }
      })
    }
  },
  components: {
    PublicResourceList: () => import('components/resource/PublicResourceList')
  },
  mounted () {
    this.$store.dispatch(`dictionary/loadDictionarys`, { Type: this.category })
  }
}
</script>

<style lang="scss" scoped>
</style>
