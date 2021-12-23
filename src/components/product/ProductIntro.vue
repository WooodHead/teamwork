<template>
  <div>
    <brief :product="product" />

    <q-list>
      <div
        v-for="param in techParamsFlat"
        :key="param.label"
      >
        <div v-if="!param.isHeader">
          <q-item
            dense
            class="q-px-none"
          >
            <q-item-section class="key">{{param.name}}</q-item-section>
            <q-item-section
              side
              class="value"
            >{{param.value}}</q-item-section>
          </q-item>
        </div>
      </div>
    </q-list>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProductIntro',
  components: {
    Brief: () => import('components/product/template/Brief')
  },
  props: {
    param: {
      type: Object,
      required: true,
      default: function () {
        return {
          objectID: 0
        }
      }
    }
  },
  data () {
    return {
      product: {}
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('product', ['products']),
    ...mapGetters('product', ['productTechParamsFlat', 'productKeyTechParamsFlat']),
    techParamsFlat () {
      let that = this
      const pProduct = this.products.find(p => p.id === this.product.parentId)
      if (pProduct) {
        Object.assign(this.product, { TplCode: pProduct.tplCode })
        return _.slice(that.productTechParamsFlat(that.product), 0, 6)
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapActions('product', ['loadProduct']),
    init () {
      let that = this
      this.loadProduct(+this.param.objectID).then(res => {
        res && that.loadProduct(res.parentId).then(() => {
          that.product = res
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 左边宽度不定,右边宽度自动填满剩余空间
// 参考：https://www.cnblogs.com/qddyh/p/10463340.html
.key {
  font-size: 1rem;
  font-weight: 400;
  flex: 0 0 auto;
}
.value {
  font-family: none;
  color: $dark;
  flex: 1 1 auto;
  font-size: xx-small;
}
</style>
