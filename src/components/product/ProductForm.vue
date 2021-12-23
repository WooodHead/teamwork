<template>
  <tw-form
    :secondary="secondary"
    :primaryLabel="$t('product.release')"
    :secondaryLabel="$t('action.saveDraft')"
    @primary="onSubmit('release')"
    @secondary="onSubmit('save')"
  >
    <form-fields :id="id" :openType="openType" />
  </tw-form>
</template>

<script>
import { LocalStorage, date } from 'quasar'
import { mapState, mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'ProductForm',
  components: {
    TwForm: () => import('components/base/TwForm'),
    FormFields: () => import('components/product/FormFields')
  },
  props: {
    openType: { type: String, default: 'add' },
    id: [Number, String]
  },
  data () {
    return {
      secondary: false
    }
  },
  computed: {
    ...mapState('product', ['products', 'fields']),
    ...mapGetters('product', ['productTechParamsFlat'])
  },
  methods: {
    ...mapActions('product', [
      'loadProduct',
      'addProduct',
      'updateProduct',
      'batchAddHistory',
      'loadProductAccessoryIds'
    ]),
    ...mapActions('resource', ['addResourceRelations']),
    getHistorysObj (newProduct, oldProduct) {
      // 变更结果
      let newHistory = []
      // 基础属性比较
      for (let key in oldProduct) {
        oldProduct[key] !== newProduct[key] &&
          !_.isObject(oldProduct[key]) &&
          newHistory.push({
            Actor: LocalStorage.getItem('myself').name,
            Action: 'update',
            ActTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
            Name: 'product',
            Extra: {
              Title: this.$t(`product.fields.${key}`),
              OldContent: oldProduct[key]
            }
          })
      }
      // 技术参数比较
      let newParamsFlat = this.productTechParamsFlat(newProduct)
      let oldParamsFlat = this.productTechParamsFlat(oldProduct)
      _.forEach(oldParamsFlat, (item, key) => {
        item.value !== newParamsFlat[key].value &&
          newHistory.push({
            Actor: LocalStorage.getItem('myself').name,
            Action: 'update',
            ActTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
            Name: 'product',
            Extra: { Title: item.name, OldContent: item.value }
          })
      })

      return newHistory
    },
    onSubmit (btnType) {
      window.RichTextEditting = false
      let that = this
      if (btnType === 'release') {
        showConfirm(
          this.$t('product.notifies.confirmRelease'),
          () => {
            that.save(btnType)
          },
          () => {}
        )
      } else {
        this.save(btnType)
      }
    },
    save (btnType) {
      let that = this
      this.fields.isPublish = btnType === 'release' ? 1 : 0
      // 有两种情况：编辑和添加，其中添加又分两种
      if (this.openType === 'edit') {
        let oldProduct = _.cloneDeep(_.find(this.products, { id: +this.id }))
        this.updateProduct(this.fields).then(res => {
          if (res) {
            that.toDetail(res.id)

            let historys = that.getHistorysObj(that.fields, oldProduct)
            if (historys.length > 0) {
              try {
                that.batchAddHistory({ historys, id: +this.id })
              } catch (error) {
                console.log(error)
              }
            }
          }
        })
      } else {
        // 1、添加产品
        if (this.openType === 'copy') {
          // 移除copy的路径末端节点
          let curProduct = _.find(this.products, p => p.id === +this.id)
          this.fields.id = +this.id
          this.fields.path = curProduct.path.slice(
            0,
            curProduct.path.lastIndexOf(',') + 1
          )
        }
        this.addProduct(this.fields).then(res => {
          res && that.toDetail(res.id)
        })
      }
    },
    toDetail (id) {
      this.$router.push({
        name: 'productDetail',
        params: { id: +id }
      })
    }
  },
  created () {
    if (this.openType === 'edit') {
      this.loadProduct(+this.id).then(res => {
        // 仅第三级产品有草稿选项
        this.secondary = res.isPublish === 0
      })
    } else {
      this.secondary = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
