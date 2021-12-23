<template>
  <q-card class="card-grow-in-page relative-position">
    <product-header-card
      :title="product.title"
      :actions="actions"
      :add="{ label: $t('product.add'), click: addingEvent }"
    >
      <template v-if="isLeaf && $myinfo.auth.role.isProductManager" slot="menu">
        <tw-menu
          :flat="$q.platform.is.mobile"
          :menus="menus"
          @edit="onEdit"
          @publish="onPublish"
          @dropPublish="onPublish"
          @delete="onDelete"
          @copy="onCopy"
          @move="onMove"
          @publicLink="publicLink"
          @export="onExport"
          @history="onHistory"
        />
      </template>

      <template slot="right">
        <!-- 占位 保持对称 -->
        <q-btn
          v-if="actions.includes('add')"
          rounded
          unelevated
          no-caps
          icon="add"
          label="新建产品"
          class="invisible"
        />
      </template>
    </product-header-card>

    <product-detail-of-leaf
      v-if="isLeaf"
      :product="product"
      :selectionId="selectionId"
      ref="leafDetail"
    />

    <product-detail-of-parent
      v-if="isParent"
      class="q-pt-md"
      :product="product"
    />
    <!-- <product-toolbar
      :model="product"
      :productAnchorTab="$refs.productAnchorTab"
      :class="{ 'q-mb-sm': !$q.screen.lt.sm }"
    /> -->
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage } from '@/utils/show-message'
import { exportExcel } from 'components/product/export/index'
export default {
  name: 'ProductDetail',
  components: {
    ProductHeaderCard: () => import('components/product/ProductHeaderCard'),
    TwMenu: () => import('components/base/TwMenu'),
    ProductDetailOfLeaf: () => import('components/product/ProductDetailOfLeaf'),
    ProductDetailOfParent: () =>
      import('components/product/ProductDetailOfParent')
  },
  props: {
    id: { type: [Number, String], required: true },
    selectionId: { type: [Number, String], default: 0 }
  },
  data () {
    return {
      isLeaf: false,
      isParent: false,
      pageTitle: ''
    }
  },
  watch: {
    $route (to, from) {
      if (to.fullPath !== from.fullPath) {
        this.isLeaf = false
        this.isParent = false
        this.init()
      }
    },
    pageTitle (val) {
      this.$route.meta.label = val
      document.title = `${val} | TeamWork`
    }
  },
  computed: {
    ...mapState('product', ['productDetails']),
    ...mapGetters('resource', ['resourceRelations', 'categoryRelations']),
    menus () {
      const newMenus = [
        'edit',
        'delete',
        'copy',
        'move',
        { group: ['publicLink', 'export'] },
        { group: ['history'] }
      ]
      newMenus.splice(1, 0, this.product.isPublish ? 'dropPublish' : 'publish')
      return newMenus
    },
    actions () {
      let actions = []
      if (this.$myinfo.auth.role.isProductManager) {
        actions.push('add')
        this.isLeaf && actions.push('menu')
      }
      return actions
    },
    product () {
      return (
        _.find(this.productDetails, { id: +this.id }) || {
          title: '',
          classification: ''
        }
      )
    }
  },
  methods: {
    ...mapActions('product', [
      'loadProduct',
      'updateProductField',
      'deleteProduct'
    ]),
    ...mapMutations('product', ['setCurrentProductClassification']),
    init () {
      !isNaN(this.id) &&
        this.loadProduct(+this.id).then(res => {
          this.isLeaf = res.tplCode === ''
          this.isParent = !this.isLeaf

          this.pageTitle = res.specModel || res.title

          this.setCurrentProductClassification(res.classification)
        })
    },
    addingEvent () {
      // 叶子节点时取parentId，否则取当前id
      let params = {
        openType: 'add',
        id: this.isLeaf ? this.product.parentId : this.product.id
      }
      this.$router.push({ name: 'productAdd', params })
    },
    onEdit () {
      this.$router.push({
        name: 'productEdit',
        params: { openType: 'edit', id: +this.id }
      })
    },
    onPublish () {
      showConfirm(
        `确定要${this.product.isPublish ? '撤销' : ''}发布吗？`,
        () => {
          this.updateProductField({
            Id: +this.id,
            IsPublish: this.product.isPublish ? 0 : 1
          })
        },
        () => {}
      )
    },
    onDelete () {
      let that = this
      let item = this.product
      showConfirm(
        this.$t('product.notifies.confirmDelete'),
        () => {
          // 如果是附件产品，判断是否是某些机床的附件，如果是则不能删除
          // 当前页面本来就需要展示关联产品，已加载过关联数据，直接取值即可
          if (item.classification !== 'machinetool') {
            let relations = that.resourceRelations({
              category1: 'product',
              id1: item.id,
              category2: 'product'
            })

            if (relations.length > 0) {
              let relatedMachinetools = that.categoryRelations({
                category: 'product',
                ids: _.map(relations, 'selectId')
              })
              // 提醒附件关联了哪些机床
              // 排除已被删除的机床关联关系
              if (relatedMachinetools.length > 0) {
                showWarningMessage(
                  that.$t('product.notifies.hasRelationsDelete', {
                    machinetoolNames: _.map(relatedMachinetools, 'title').join(
                      ','
                    )
                  })
                )
              } else {
                that.execDelete(item)
              }
            } else {
              that.execDelete(item)
            }
          } else {
            that.execDelete(item)
          }
        },
        () => {}
      )
    },
    onCopy () {
      this.$router.push({
        name: 'productEdit',
        params: { openType: 'copy', id: +this.id }
      })
    },
    onMove () {
      this.$router.push({ name: 'productMove', params: { id: +this.id } })
    },
    execDelete (p) {
      this.deleteProduct(p.id)
      this.isLeaf && this.$router.back()
    },
    publicLink () {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'product',
          param: encodeURIComponent(
            JSON.stringify({ objectID: +this.id, objectType: this.category })
          ),
          title: this.product.title
        }
      })
    },
    onExport () {
      let techParamsFlat = this.$refs.leafDetail.techParamsFlat
      let configs =
        this.product.classification === 'machinetool'
          ? this.$refs.leafDetail.$refs.machinetoolConfigList.lstAccessory
          : this.product.classification === 'sample'
            ? this.$refs.leafDetail.$refs.relatedSample.relatedSample
            : this.$refs.leafDetail.$refs.accessoryRelatedList.relatedProducts
      exportExcel(this.product, techParamsFlat, configs)
    },
    onHistory () {
      this.$router.push({
        name: 'productHistory',
        params: {
          id: +this.id,
          type: 'product'
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.pc-title {
  font-size: 21px;
  font-weight: normal;
  letter-spacing: 0.01em;
}
</style>
