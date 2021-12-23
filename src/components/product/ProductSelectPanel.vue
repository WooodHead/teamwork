<template>
  <q-dialog
    v-model="showConfig"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="full-width">
      <!-- 头部信息 -->
      <q-card style="position:sticky;top:0;z-index:999;">
        <modal-header>{{panelTitle}}</modal-header>
      </q-card>

      <!-- show product tree -->
      <tw-tree
        v-if="nodes.length"
        nodeKey="id"
        labelKey="title"
        :nodes="nodes"
        :ticked="tickedIds"
        :defaultExpandAll="defaultExpandAll"
        @selected-event="selectedEvent"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage, date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { listToTreeStable } from '@/utils/list-to-tree'
// 不具有第3级节点的所有1、2级节点全部禁用
function reduceNode (node) {
  let children = node.children || []
  if (children.length === 0 && node.tplCode !== '') {
    node.disabled = true
  } else {
    _.forEach(children, n => reduceNode(n))
  }
}
export default {
  name: 'ProductSelectPanel',
  components: {
    ModalHeader: () => import('components/base/TwDialogHeader'),
    TwTree: () => import('components/base/TwTree')
  },
  props: {
    category1: { type: String, default: 'product' },
    category2: { type: String, default: 'product' },
    exposeIdsOnly: { type: Boolean, default: false, desc: '仅导出ids，不做关联' },
    arrClassification: { type: Array, required: true },
    panelTitle: { type: String, required: true },
    id: { type: Number, required: true },
    exceptIds: { type: Array, default: () => [] },
    tickedIds: { type: Array, default: () => [] },
    defaultExpandAll: { type: Boolean, default: false }
  },
  data () {
    return {
      showConfig: false,
      oriTickedIds: []
    }
  },
  watch: {
    showConfig (newVal, oldVal) {
      newVal && this.init()
    }
  },
  computed: {
    ...mapGetters('product', ['products']),
    nodes () {
      // 复制源数据
      let cloneProducts = _.cloneDeep(
        _.filter(this.products,
          p => p.isPublish &&
            this.arrClassification.includes(p.classification) &&
            !this.exceptIds.includes(p.id)
        )
      )

      // 如果是机床附件配置，丰富附件title
      let curProduct = _.find(this.products, { id: this.id })
      curProduct && curProduct.classification === 'machinetool' &&
        _.forEach(cloneProducts, cp => {
          if (cp.tplCode === '') {
            cp.title = cp.specModel
          }
        })

      // list to tree
      let treeNodes = listToTreeStable(cloneProducts)
      _.forEach(treeNodes, tn => reduceNode(tn))
      return treeNodes
    }
  },
  methods: {
    ...mapActions('product', ['loadProducts', 'batchAddHistory', 'loadProduct', 'updateProductField']),
    ...mapActions('resource', ['addResourceRelations', 'deleteResourceRelations']),
    init () {
      // 记录初始tickedIds
      this.oriTickedIds = Array.from(new Set(this.tickedIds || []))
      // 加载列表数据
      let query = []
      _.forEach(this.arrClassification, (value, index, arr) => {
        query.push({ Key: 'Classification', Value: value, Oper: 'eq' })
        if (index + 1 < arr.length) {
          query.push('or')
        }
      })
      this.loadProducts({ query })
    },
    selectedEvent (tickedNodes) {
      // 去除tickedNodes的null和undefined
      let tickedNodesFilter = _.filter(tickedNodes, tn => tn !== null && tn !== void 0)

      if (this.exposeIdsOnly) {
        this.$emit('callBack', _.map(tickedNodesFilter, 'id'))
      } else {
        let that = this
        if (tickedNodesFilter.length > 0) {
          // 批量新建关联关系
          let relations = _.map(tickedNodesFilter,
            tn => {
              return {
                category1: this.category1,
                id1: that.id,
                category2: this.category2,
                id2: tn.id,
                type: 'correlation',
                path: '',
                extra: { 'standard': 0, 'recommend': 0 }
              }
            })

          this.addResourceRelations(relations)
            .then(res => {
              // 插入历史记录
              let curIds = _.map(relations, 'id2')
              // 变更
              if (!_.isEqual(curIds, that.oriTickedIds)) {
                that.addHistorys()
              }
            })
        } else {
          this.deleteResourceRelations({
            category1: this.category1,
            objectId: this.id,
            category2: this.category2,
            type: 'correlation'
          }).then(res => {
            if (res) {
              // 插入历史记录
              that.addHistorys()
            }
          })
        }
      }
      this.showConfig = false
    },
    addHistorys () {
      let that = this
      let oldTitles = '-'
      if (that.oriTickedIds.length > 0) {
        oldTitles = _.join(
          _.map(that.oriTickedIds, ti => {
            let oriTickedProduct = _.find(that.products, { id: ti })
            return oriTickedProduct ? oriTickedProduct.title : ''
          }),
          '、')
      }
      let curProduct = _.find(that.products, { id: that.id })
      let modifyTitle = curProduct.classification === 'machinetool'
        ? that.$t('product.accessoryConfig')
        : curProduct.classification === 'sample'
          ? that.$t('product.relateSample')
          : that.$t('product.relatedMachinetool')
      let historys = [{
        Actor: LocalStorage.getItem('myself').name,
        Action: 'update',
        ActTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        Name: 'product',
        Extra: { Title: modifyTitle, OldContent: oldTitles }
      }]
      that.batchAddHistory({ historys, id: that.id })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
