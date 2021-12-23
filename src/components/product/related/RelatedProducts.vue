<template>
  <div class="q-pa-md">
    <!-- 关联产品 -->
    <div v-if="relatedProducts.length > 0">
      <product-item-group-list
        v-if="view === 'itemGroup'"
        showRecommend
        :items="relatedProducts"
        :relations="curRelations"
        @delRelation="onDelRelation"
      />
      <product-item-list
        v-else-if="view === 'item'"
        :items="relatedProducts"
        @delRelation="onDelRelation"
      />
      <product-card-list
        v-else
        showRelationDel
        :items="relatedProducts"
        @delRelation="onDelRelation"
      />
    </div>

    <tw-banner-no-result v-else :info="noRelatedNotes" class="q-mt-sm" />

    <!-- 产品资源选择弹窗 -->
    <product-select-panel
      exposeIdsOnly
      :category1="category1"
      :category2="category2"
      :arrClassification="arrClassification"
      :panelTitle="panelTitle"
      :id="id"
      :exceptIds="exceptIds"
      :tickedIds="[]"
      :class="{ 'dialog-width': !$q.platform.is.mobile }"
      @callBack="multiSelect"
      ref="productSelectPanel"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'

export default {
  name: 'RelatedSampleList',

  components: {
    ProductItemGroupList: () =>
      import('components/product/item/ProductItemGroupList'),
    ProductItemList: () => import('components/product/item/ProductItemList'),
    ProductCardList: () => import('components/product/card/ProductCardList'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    ProductSelectPanel: () => import('components/product/ProductSelectPanel')
  },

  props: {
    id: { type: Number, required: true },
    category1: { type: String, default: 'product' },
    category2: { type: String, default: 'product' },
    arrClassification: { type: Array, default: () => [] },
    view: { type: String, default: 'card' },
    isPathRelation: { type: Boolean, default: false, desc: '是否继承上级' },
    panelTitle: { type: String, default: '选择产品' },
    noRelatedNotes: { type: String, default: '暂无关联产品！' }
  },

  data () {
    return {
      curRelations: [],
      relatedProducts: []
    }
  },

  computed: {
    ...mapGetters('product', ['products']),

    exceptIds () {
      return _.map(this.relatedProducts, 'id')
    }
  },

  methods: {
    ...mapActions('product', ['loadPathRelationsWithProducts']),
    ...mapActions('resource', [
      'loadResourceRelations',
      'addRelationsWithoutDel',
      'deleteRelationByOptions'
    ]),

    init () {
      this.isPathRelation
        ? this.setPathRelations()
        : this.setResourceRelations()
    },

    setPathRelations () {
      this.loadPathRelationsWithProducts({
        id: this.id,
        category1: this.category1,
        category2: this.category2
      }).then(res => {
        if (res) {
          this.setIsRecommend(res.products)
          this.curRelations = res.relations
          this.relatedProducts = res.products
        }
      })
    },

    setResourceRelations () {
      this.loadResourceRelations({
        category1: this.category1,
        id1: this.id,
        category2: this.category2,
        fields: 'Select'
      }).then(res => {
        this.curRelations = res.relationData.filter(
          r =>
            ((r.category1 === this.category1 &&
              r.id1 === this.id &&
              r.category2 === this.category2) ||
              (r.category2 === this.category1 &&
                r.id2 === this.id &&
                r.category1 === this.category2)) &&
            r.type === 'correlation'
        )
        // selectIds要排除自身
        const selectIds = _.difference(_.map(this.curRelations, 'selectId'), [
          this.id
        ])
        this.relatedProducts = (res.categoryData || []).filter(p =>
          selectIds.includes(p.id)
        )
      })
    },

    multiSelect (selectedIds) {
      const newRelations = _.map(selectedIds, selectedId => {
        return {
          category1: this.category1,
          id1: this.id,
          category2: this.category2,
          id2: selectedId,
          type: 'correlation',
          path: ''
        }
      })
      this.addRelationsWithoutDel(newRelations).then(res => {
        if (res) {
          const selectedItems = _.map(selectedIds, selectedId =>
            _.find(this.products, p => p.id === selectedId)
          )
          const cloneItems = _.cloneDeep(selectedItems)
          this.setIsRecommend(cloneItems)

          this.curRelations.push(...newRelations)
          this.relatedProducts.push(...cloneItems)
        }
      })
    },

    onDelRelation (delId) {
      let msg = '确定要删除关联吗？'
      if (this.isPathRelation) {
        // 寻找关联的上级id
        const curRelation = _.find(this.curRelations, { id2: delId })
        const isDirectRelation = curRelation && curRelation.id1 === this.id
        msg = isDirectRelation
          ? '确定要删除该应用案例吗？'
          : '该应用案例继承自上级，确定要删除上级关联的应用案例吗？'
      }
      showConfirm(
        msg,
        () => {
          const id1 = this.isPathRelation ? curRelation.id1 : this.id
          this.delRelation(id1, delId)
        },
        () => {}
      )
    },

    delRelation (id1, id2) {
      this.deleteRelationByOptions({
        category1: this.category1,
        id1,
        category2: this.category2,
        id2,
        type: 'correlation'
      }).then(res => {
        if (res) {
          Vue.delete(this.curRelations, _.findIndex(this.curRelations, { id2 }))
          Vue.delete(
            this.relatedProducts,
            _.findIndex(this.relatedProducts, { id: id2 })
          )
        }
      })
    },

    setIsRecommend (items) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        item.params && (item.params.isRecommend = 0)
      }
    }
  },

  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.dialog-width {
  width: 700px;
  max-width: 80vw;
}
</style>
