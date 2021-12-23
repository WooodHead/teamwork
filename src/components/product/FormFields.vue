<template>
  <div>
    <q-input
      filled
      autofocus
      v-model="fields.title"
      input-class="text-center text-h5"
      lazy-rules
      :placeholder="$t('product.titlePlaceHoder')"
      :rules="[val => !!val || $t('product.rules.titleTips')]"
    />

    <q-input
      filled
      v-model="fields.notes"
      type="textarea"
      :label="notesLabel"
    />

    <div v-if="openType === 'add' || (curProduct && curProduct.tplCode === '')">
      <!-- 上级分类 -->
      <q-select
        filled
        v-model="parentProduct"
        :options="parentOptions"
        optionLabel="title"
        optionValue="id"
        label="上级分类"
        :rules="[val => !!val || '选择上级分类']"
        class="g-margin-top20"
      />

      <!-- 产品系列公共参数，机床有[轴数]；附件有[规格、物料编码、品牌] -->
      <machinetool
        v-if="fields.classification==='machinetool'"
        :fields="fields"
      />
      <accessory
        v-else-if="fields.classification!=='sample'"
        :fields="fields"
      />

      <!-- 【产品技术参数】动态组件，依据产品tplCode切换 -->
      <component
        v-if="fields.params.TplCode"
        :is="allTemplates[fields.params.TplCode]"
        :fields="fields"
      ></component>

      <!-- 无技术参数模板提醒 -->
      <div
        v-if="noTpl"
        class="text-warning"
      >{{$t('product.noTpl')}}</div>
    </div>

  </div>
</template>

<script>
import { format } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
import allTemplates from 'components/product/template/index'
import Product from '@/store/product/model'
const { capitalize } = format
export default {
  name: 'FormFields',
  components: {
    Machinetool: () => import('components/product/template/Machinetool'),
    Accessory: () => import('components/product/template/Accessory')
  },
  props: {
    openType: { type: String, default: 'add' },
    id: [Number, String]
  },
  data () {
    return {
      parentProduct: null,
      allTemplates: allTemplates,
      ignoreParentSwitch: false,
      ignoreAxisCountSwitch: false
    }
  },
  watch: {
    // 父级模板控制技术参数模板切换
    parentProduct (newVal, oldVal) {
      if (!this.ignoreParentSwitch && newVal) {
        let oldTplCode = _.cloneDeep(this.fields.params.TplCode)

        this.fields.level = newVal.level + 1
        this.fields.parentId = newVal.id
        this.fields.path = newVal.path + ','

        if (newVal.tplCode !== this.fields.params.TplCode) {
          this.fields.params.TplCode = newVal.tplCode
          if (this.openType !== 'add' && this.curProduct &&
            (this.fields.params.axisCount === this.curProduct.params.axisCount) &&
            (this.fields.parentId === this.curProduct.parentId)
          ) {
            this.ignoreAxisCountSwitch = true
            this.setFields(Object.assign({}, this.fields, { params: _.cloneDeep(this.curProduct.params) }))
          } else {
            this.fields.tplCode = ''
            let newFields = Product.additional(newVal.tplCode, this.fields)
            // 如果当前轴数与模板轴数不匹配，不做模板切换
            if (newFields.params.axisCount &&
              newFields.params.axisCount !== this.fields.params.axisCount) {
              this.fields.params.TplCode = oldTplCode
            } else {
              this.setFields(Object.assign({}, newFields))
            }
          }
        }
      } else {
        this.ignoreParentSwitch && (this.ignoreParentSwitch = false)
      }
    },
    // 轴数控制机床技术参数模板切换
    'fields.params.axisCount' (newVal, oldVal) {
      // 排除首次初始化oldVal===undefined
      if (!this.ignoreAxisCountSwitch && newVal > 0) {
        // 如果是产品编辑或复制，切换回原轴数时自动加载原技术参数
        if (this.openType !== 'add' &&
          this.curProduct &&
          (newVal === this.curProduct.params.axisCount) &&
          (this.fields.parentId === this.curProduct.parentId)) {
          this.fields.params.TplCode = newVal === 5 ? 'FiveAxis' : 'ThreeAxis'
          this.setFields(Object.assign({}, this.fields, { params: _.cloneDeep(this.curProduct.params) }))
        } else {
          delete this.fields.params
          let newFields = Product.additional(newVal === 5 ? 'FiveAxis' : 'ThreeAxis', this.fields)
          this.setFields(Object.assign({}, newFields))
        }
      } else {
        this.ignoreAxisCountSwitch && (this.ignoreAxisCountSwitch = false)
      }
    }
  },
  computed: {
    ...mapState('product', ['products', 'fields']),
    notesLabel () {
      return this.fields.classification === 'sample'
        ? this.$t('product.fields.highLights')
        : this.$t('product.fields.notes')
    },
    curProduct () {
      let that = this
      return this.products.find(p => p.id === +that.id)
    },
    parentOptions () {
      let that = this
      return _.filter(this.products, p => p.classification === that.fields.classification &&
        p.tplCode !== 'Default' &&
        p.tplCode !== '')
    },
    noTpl () {
      return this.fields.parentId > 0 &&
        (!this.fields.params.TplCode ||
          !Object.keys(this.allTemplates).includes(this.fields.params.TplCode))
    }
  },
  methods: {
    ...mapMutations('product', ['setFields']),
    ...mapActions('product', ['loadProducts', 'loadProduct']),
    capitalize,
    initParentSelect () {
      // 获取产品前两级数据，填充下拉产品树
      let query = [
        { Key: 'Classification', Value: this.fields.classification, Oper: 'eq' },
        'and',
        { Key: 'TplCode', Value: 'Default', Oper: 'ne' },
        'and',
        { Key: 'TplCode', Value: '', Oper: 'ne' }
      ]
      this.loadProducts({ query })
        .then(res => {
          let that = this
          const curProd = this.products.find(p => p.id === +that.id)
          if (this.openType === 'add') {
            if (!['Default', ''].includes(curProd.tplCode)) {
              this.parentProduct = curProd
            }
          } else {
            this.parentProduct = this.products.find(p => p.id === that.curProduct.parentId)
          }
        })
    },
    setDefaultFiveAxis () {
      // 如果是机床产品，新增的默认是五轴产品
      let newFields = Product.additional('FiveAxis', this.fields)
      this.setFields(Object.assign({}, newFields))
    }
  },
  created () {
    if (this.openType === 'add') {
      this.setFields(new Product())
    }

    this.loadProduct(+this.id).then(res => {
      // 1、编辑具体产品，此时id是待编辑产品id；新建具体产品，此时id是待新建产品所属型号的id
      if (this.openType === 'add') {
        this.fields.tplCode = ''
        if (res.classification === 'machinetool') {
          this.setDefaultFiveAxis()
        } else {
          this.setFields(Product.additional(null, { classification: res.classification }))
        }
      } else {
        this.ignoreParentSwitch = true
        let cloneFields = _.cloneDeep(res)
        // 复制的产品属性复位
        if (this.openType === 'copy') {
          cloneFields.id = 0
          cloneFields.isPublish = 0
        }
        // 修正刀库适用刀柄string to array
        if (cloneFields.params.TplCode === 'ToolMagazine') {
          let oldApplicableShank = cloneFields.params.ApplicableShank
          !_.isArray(oldApplicableShank) &&
            (cloneFields.params.ApplicableShank = oldApplicableShank.split(','))
        }
        this.setFields(Object.assign({}, this.fields, cloneFields))
      }

      this.initParentSelect()
    })
  }
}
</script>

<style lang="scss" scoped></style>
