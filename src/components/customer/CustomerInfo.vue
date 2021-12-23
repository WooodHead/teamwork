<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card :title="$t('customer.customerInfo')" />
    <q-card-section
      v-if="modelList.length"
      class="q-pt-none"
      :class="!$q.platform.is.mobile?'q-px-xl':'q-px-xs'"
    >
      <q-item-label
        header
        class="text-weight-bolder text-black text-subtitle1"
      >基本信息</q-item-label>
      <q-list class="row full-width">
        <q-item class="full-width">
          <q-item-section>
            <div
              class="row"
              style="background-color: #eef7fe;"
            >
              <div
                v-for="(item,index) in modelList"
                :key="index"
                :class="`row col-12 col-md-${item.col}`"
              >
                <div
                  class="text-left q-pa-sm col-auto"
                  v-html="item.label+'：'"
                ></div>
                <div class="text-left q-pa-sm col">
                  <a
                    v-if="item.link"
                    style="text-decoration: none;color: #128bed;"
                    target="_blank"
                    :href="item.link"
                    rel="nofollow"
                  >{{item.value}}</a>
                  <span v-else>{{item.value}}</span>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section
      v-if="modelExtra.length"
      class="q-pt-none"
      :class="!$q.platform.is.mobile?'q-px-xl':'q-px-xs'"
    >
      <q-item-label
        header
        class="text-weight-bolder text-black text-subtitle1"
      >其它信息</q-item-label>
      <q-list class="row full-width">
        <q-item class="full-width">
          <q-item-section>
            <div
              class="row"
              style="border-left: #e4eef6 1px solid;border-bottom: #e4eef6 1px solid;"
            >
              <div
                v-for="(item,index) in modelExtra"
                :key="index"
                :class="`row col-12 col-md-${item.col}`"
                style="border-top: #e4eef6 1px solid;border-right: #e4eef6 1px solid;"
              >
                <div
                  class="text-left q-pa-sm col-4"
                  style="background-color: #eef7fe; "
                >{{item.label}}</div>
                <div class="text-left q-pa-sm">
                  <a
                    v-if="item.link"
                    style="text-decoration: none;color: #128bed;"
                    target="_blank"
                    :href="item.link"
                    rel="nofollow"
                  >{{item.value}}</a>
                  <span v-else>{{item.value}}</span>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CustomerArchives',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('customer', ['customer']),
    model () {
      return this.customer(this.objectID)
    },
    modelList () {
      let modelList = [
        { label: '客户名称', value: this.model.title, link: '', desc: '', col: '6' },
        { label: '客户类型', value: this.dictValue({ field: 'customerType', dictKey: this.model.customerType }), link: '', desc: '', col: '6' },
        { label: '所属人&emsp;', value: this.$store.state.person.selectPersons[this.model.leaderID] ? this.$store.state.person.selectPersons[this.model.leaderID].name : '', link: '', desc: '', col: '6' },
        { label: '行业类型', value: this.model.applyIndustry, link: '', desc: '', col: '6' },
        { label: '客户级别', value: this.model.grade, link: '', desc: '', col: '6' },
        { label: '客户地址', value: (this.model.province + '' + this.model.city + '' + this.model.district + '' + this.model.address) || '', link: '', desc: '', col: '6' }
      ]
      if (!_.isEmpty(this.model.extra) && this.model.extra.ContactInfo) modelList.push({ label: '电话', value: this.model.extra.ContactInfo.PhoneNumber, link: '', desc: '', col: '6' })
      if (!_.isEmpty(this.model.extra) && this.model.extra.ContactInfo && this.model.extra.ContactInfo.WebSite && this.model.extra.ContactInfo.WebSite.length) modelList.push({ label: '官网', value: this.model.extra.ContactInfo.WebSite[0].Url, link: this.model.extra.ContactInfo.WebSite[0].Url, desc: '', col: '6' })
      return modelList
    },
    modelExtra () {
      return !_.isEmpty(this.model.extra)
        ? [
          { label: '统一社会信用代码', value: this.model.extra.CreditCode, link: '', desc: '一般指法人和其他组织统一社会信用代码，相当于让法人和其他组织拥有了一个全国统一的“身份证号”。标准规定统一社会信用代码用18位阿拉伯数字或大写英文字母表示，分别是1位登记管理部门代码、1位机构类别代码、6位登记管理机关行政区划码、9位主体标识码、1位校验码。', col: '6' },
          { label: '企业名称', value: this.model.extra.Name, link: '', desc: '', col: '6' },
          { label: '法定代表人', value: this.model.extra.OperName, link: '', desc: '', col: '4' },
          { label: '登记状态', value: this.model.extra.Status, link: '', desc: '', col: '4' },
          { label: '成立日期', value: this.model.extra.TermStart, link: '', desc: '', col: '4' },
          { label: '注册资本', value: this.model.extra.RegistCapi, link: '', desc: '', col: '4' },
          { label: '实缴资本', value: this.model.extra.RecCap, link: '', desc: '实缴资本信息来源于：2020年报，结果仅供参考', col: '4' },
          { label: '核准日期', value: this.model.extra.CheckDate, link: '', desc: '', col: '4' },
          { label: '组织机构代码', value: this.model.extra.OrgNo, link: '', desc: '组织机构代码是对中华人民共和国内依法注册、依法登记的机关、企事业单位、社会团体，以及其他组织机构颁发一个在全国范围内唯一的、始终不变的代码标识，由八位数字（或大写拉丁字母）本体代码和一位数字（或大写拉丁字母）校验码组成。', col: '4' },
          { label: '工商注册号', value: this.model.extra.No, link: '', desc: '', col: '4' },
          { label: '纳税人识别号', value: this.model.extra.CreditCode, link: '', desc: '纳税人识别号是税务登记证上的号码，通常简称为“税号”，每个企业的纳税人识别号都是唯一的，由15位、17位、18或者20位码（字符型）组成。', col: '4' },
          { label: '企业类型', value: this.model.extra.EconKind, link: '', desc: '', col: '4' },
          { label: '营业期限', value: `${this.model.extra.TermStart} 至 无固定期限`, link: '', desc: '', col: '4' },
          { label: '纳税人资质', value: '-', link: '', desc: '', col: '4' },
          { label: '所属行业', value: this.model.extra.Industry ? this.model.extra.Industry.Industry : '', link: '', desc: '', col: '4' },
          { label: '所属地区', value: this.model.extra.Area ? this.model.extra.Area.Province : '', link: '', desc: '', col: '4' },
          { label: '登记机关', value: this.model.extra.BelongOrg, link: '', desc: '', col: '4' },
          { label: '人员规模', value: this.model.extra.PersonScope, link: '', desc: '', col: '4' },
          { label: '参保人数', value: this.model.extra.InsuredCount, link: '', desc: '参保人数信息来源于：2020年报，结果仅供参考', col: '4' },
          { label: '曾用名', value: _.join(_.map(this.model.extra.OriginalName, 'Name'), ','), link: '', desc: '', col: '4' },
          { label: '英文名', value: this.model.extra.EnglishName, link: '', desc: '', col: '6' },
          { label: '进出口企业代码', value: this.model.extra.IXCode, link: '', desc: '进出口企业代码是商务部颁发的进出口企业备案证书右上角的代码，表明企业具有一定的进出口商品的资格。', col: '6' },
          { label: '注册地址', value: this.model.extra.Address, link: '', desc: '', col: '12' },
          { label: '经营范围', value: this.model.extra.Scope, link: '', desc: '', col: '12' }
        ]
        : []
    }
  },
  methods: {
    dictValue ({ field, dictKey }) {
      let dict = this.$store.state.dictionary.dictionary[this.category]
      if (dict) {
        return _.find(dict[field], f => f.dictKey === String(dictKey)) ? _.find(dict[field], f => f.dictKey === String(dictKey)).dictValue : ''
      } else {
        return ''
      }
    }
  },
  mounted () {
    if (_.isEmpty(this.model)) {
      this.$store.dispatch('customer/loadCustomer', this.objectID)
    }
    this.$store.dispatch(`dictionary/loadDictionarys`, this.category)
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped >
</style>
