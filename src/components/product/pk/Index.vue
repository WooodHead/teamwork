<!--  -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
    :style="{'position:relative':!$q.screen.lt.sm}"
  >
    <!-- 标题 -->
    <tw-header-card
      title="产品PK"
      :actions="actions"
      :add="{label:$t('product.selectProduct'),click:()=>$refs.productSelectPanel.showConfig=true}"
    >
      <template #right>
        <q-btn
          :disable="lastSelectedProduct&&lastSelectedProduct.length<2"
          color="primary"
          rounded
          unelevated
          label="开始PK"
          @click='productPk(lastSelectedProduct)'
        />
      </template>
    </tw-header-card>

    <product-select-panel
      exposeIdsOnly
      :arrClassification="[classification]"
      panelTitle="选择要加入PK的产品"
      :id="0"
      :tickedIds="initSelectedProduct"
      defaultExpandAll
      @callBack="multiSelect"
      ref="productSelectPanel"
    />

    <!-- 产品PK选择产品 -->
    <q-card-section
      class="q-px-xxl"
      v-if="selectedProduct"
    >
      <q-list>
        <q-item
          tag="label"
          dense
          v-ripple
          v-for="(item,index) of selectedProductList"
          :key="index"
        >
          <q-item-section
            side
            top
          >
            <q-checkbox
              v-model="item.isCheck"
              keep-color
              left-label
              :color='item.color'
              :val="item.isCheck"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label :class="`text-${item.color}`">{{item.label}}</q-item-label>
          </q-item-section>
          <q-item-section
            side
            bottom
          >
            <q-btn
              flat
              round
              icon="clear"
              @click="onDelete(index)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <div
        v-if="selectedProductList.length==0"
        style="width:300px"
        class="text-h6 text-grey-5 q-mx-auto q-mt-md"
      >
        {{$t("product.noProductPk")}}
      </div>
    </q-card-section>

    <q-card-section
      class="text-red q-px-xxl"
      v-if="showPkPanel"
    >
      {{$t('product.annotation')}}
    </q-card-section>

    <!-- 各模块PK -->
    <q-card-section
      class="q-px-xxl"
      v-if="showPkPanel"
    >

      <tw-anchor-tab
        :anchors="pageAnchors()"
        :offsetHeight="60"
      >
        <!-- 技术参数 -->
        <template v-slot:tech-params>
          <product-tech-params
            fromPK
            :techParamsFlat='techParamsFlat'
          />
        </template>

        <!-- 机床附件配置 -->
        <template v-slot:machinetool-accessorys>
          <machinetool-config-list
            :accessoryIds="accessoryIds"
            :objectsPK="objectsPK"
          />
        </template>

      </tw-anchor-tab>
    </q-card-section>

  </q-card>
</template>

<script>
import { allColor } from '@/utils/random-color'
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'
export default {
  data () {
    return {
      showPkPanel: false, // 显示产品PK
      selectedProduct: [], // 从选择框中被选产品、初始化被选的产品、list上展示的产品
      selectedProductList: [], // 被选产品，包含属性（id,isCheck,label,color）
      allProducts: [],
      paramLists: [],
      techParamsFlat: [],
      selectedProductIds: [],
      machConfigList: [],
      allColor: allColor(),
      machinetoolConfigParam: {},
      classification: this.$route.params.classification,
      anchors: [
        { id: 20, label: this.$t('product.tabs.techParams'), containerId: 'tech-params' },
        { id: 30, label: this.$t('product.tabs.machinetoolAccessorys'), containerId: 'machinetool-accessorys' },
        { id: 40, label: this.$t('product.tabs.accessoryMachinetools'), containerId: 'accessory-machinetools' },
        { id: 50, label: this.$t('product.tabs.fileDownload'), containerId: 'file-download' }
      ],
      anchorGroup: {
        machinetool: [30, 20],
        others: [20]
      },
      actions: ['add', 'other']
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwAnchorTab: () => import('components/base/TwAnchorTab'),
    ProductTechParams: () => import('components/product/ProductTechParams'),
    MachinetoolConfigList: () => import('components/product/machinetool/MachinetoolConfigList'),
    ProductSelectPanel: () => import('components/product/ProductSelectPanel')
  },
  computed: {
    ...mapGetters('product', ['products', 'productTechParamsFlat', 'productAccessoryIds']),
    ...mapGetters('resource', ['resourceRelations']),
    lastSelectedProduct: {
      get () {
        return _.filter(this.selectedProductList, { isCheck: true })
      }
    },

    initSelectedProduct: {
      get () {
        return _.map(this.selectedProduct, 'id')
      }
    },

    accessoryIds () {
      let res = []
      _.forEach(this.selectedProductIds, p => {
        res.push(...this.productAccessoryIds(p))
      })
      return _.uniq(res)
    },

    objectsPK () {
      let that = this
      let res = []
      _.forEach(this.selectedProductList, p => {
        if (p.isCheck) {
          res.push({
            id: p.id,
            title: p.label,
            color: p.color,
            accessoryIds: that.productAccessoryIds(p.id)
          })
        }
      })
      return res
    }

  },
  mounted () {
    this.init()
  },
  watch: {
    selectedProductList: {
      deep: true,
      handler (newValue, oldValue) {
        let sp = []
        _.forEach(newValue, nv => {
          sp.push({ id: nv.id, isCheck: nv.isCheck })
        })
        this.selectedProduct = _.cloneDeep(sp)
        this.$q.localStorage.set(this.classification + 'SelectedProduct', this.selectedProduct)
      }
    }
  },
  methods: {
    ...mapActions('product', ['loadProducts', 'loadProduct', 'loadProductAccessoryIds']),
    init () {
      let that = this
      // 获取allProducts所有产品数据
      let query = [
        { Key: 'Classification', Value: that.classification, Oper: 'eq' },
        'and',
        { Key: 'TplCode', Value: '', Oper: 'eq' }
      ]

      this.loadProducts({ query }).then(res => {
        that.allProducts = _.cloneDeep(this.products.filter(p => res.some(r => r.id === p.id)))

        // 初始化selectedProduct
        // 1.从后台获取
        that.selectedProduct = that.$q.localStorage.getItem(that.classification + 'SelectedProduct') || []
        that.updateSelectedProductList(that.selectedProduct)
        // 2.如果Pk页面是第三级页面，将当前产品加入selectedProduct
        let fp = _.filter(that.products, ['id', +that.$route.params.id])
        let m = _.filter(that.selectedProduct, ['id', +that.$route.params.id]) || []
        if (fp.length > 0 && fp[0].tplCode === '' && m.length < 1) {
          that.selectedProduct.push({ id: +that.$route.params.id, isCheck: true })
          that.updateSelectedProductList(that.selectedProduct)
          that.$q.localStorage.set(that.classification + 'SelectedProduct', that.selectedProduct)
        }
      }

      )
    },
    // 合并技术参数
    mergeTechParam (paramLists) {
      let newArr = []
      let teamArr = []
      let listData = paramLists
      for (let i = 0; i < listData.length; i++) {
        if (!teamArr.includes(listData[i]['name'])) {
          newArr.push({
            id: listData[i]['id'],
            name: listData[i]['name'],
            valueObj: [{ value: listData[i]['value'], color: listData[i]['color'], title: listData[i]['title'] }],
            isHeader: !!listData[i]['isHeader']
          })
          teamArr.push(listData[i]['name'])
        } else {
          for (let n = 0; n < newArr.length; n++) {
            if (newArr[n]['name'] === listData[i]['name']) {
              let obj = { value: listData[i]['value'], color: listData[i]['color'], title: listData[i]['title'] }
              newArr[n].valueObj.push(obj)
              break
            }
          }
        }
      }
      _.map(newArr, el => {
        let differ = _.uniqBy(el.valueObj, 'value')
        if (differ.length === 1) {
          differ[0].color = 'black'
          el.newValue = differ
        } else {
          el.newValue = el.valueObj
        }
      }
      )
      return newArr
    },

    productPk (productArr) {
      // 1.获取技术参数的数据
      let that = this
      this.showPkPanel = true
      let seleProducts = []// 带有所有属性和颜色的被选产品数组

      _.forEach(productArr, sp => {
        let filterP = _.filter(that.allProducts, ['id', sp.id])[0]
        filterP.color = sp.color
        seleProducts.push(filterP)
      })
      // 将对比产品的所有技术参数放在paramLists中
      let paramLists = []

      _.forEach(seleProducts, (el, index) => {
        paramLists = _.concat(paramLists, _.forEach(that.productTechParamsFlat(_.filter(that.allProducts, ['id', el.id])[0]),
          item => {
            item.title = el.title
            item.color = el.color
          }))
      })

      // 重新组装产品技术参数
      this.techParamsFlat = this.mergeTechParam(paramLists)

      // 2. 获取产品附件
      this.machinetoolConfigParam = {}
      this.selectedProductIds = _.map(productArr, 'id')
      for (let i = 0; i < this.selectedProductIds.length; i++) {
        that.loadProductAccessoryIds(this.selectedProductIds[i]).then(res => {
          that.machinetoolConfigParam[this.selectedProductIds[i]] = res
        })
      }
    },

    pageAnchors () {
      let that = this
      let curAnchorGroup = this.classification === 'machinetool' ? 'machinetool' : 'others'
      return _.filter(this.anchors, anchor => that.anchorGroup[curAnchorGroup].includes(anchor.id))
    },

    multiSelect (selectedP) {
      let that = this
      // 更新selectedProduct
      this.selectedProduct = []
      let sp = this.$q.localStorage.getItem(this.classification + 'SelectedProduct') || []
      _.forEach(selectedP, el => {
        let num = -1
        if (sp.length > 0) {
          num = _.findIndex(sp, ['id', el])
        }
        if (num > -1) {
          that.selectedProduct.push(sp[num])
        } else {
          that.selectedProduct.push({ id: el, isCheck: true })
        }
      })

      // 更新selectedProductList
      this.updateSelectedProductList(this.selectedProduct)
    },

    onDelete (val) {
      let that = this
      // 1.删除selectedProduct 和 selectedProductList
      Vue.delete(that.selectedProduct, that.selectedProduct.findIndex((item, index) => index === val))
      Vue.delete(that.selectedProductList, that.selectedProductList.findIndex((item, index) => index === val))

      that.$q.localStorage.set(that.classification + 'SelectedProduct', that.selectedProduct)
      that.selectedProduct = that.$q.localStorage.getItem(that.classification + 'SelectedProduct')
    },

    updateSelectedProductList (paramObject) {
      let that = this
      this.selectedProductList = []
      _.forEach(paramObject, (p, index) => {
        let fp = _.filter(this.products, ['id', p.id])
        if (fp[0].specModel) {
          that.selectedProductList.push({ id: p.id, isCheck: p.isCheck, label: fp[0].title + '(' + fp[0].specModel + ')', color: that.allColor[index] })
        } else {
          that.selectedProductList.push({ id: p.id, isCheck: p.isCheck, label: fp[0].title, color: that.allColor[index] })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.tabs {
  position: sticky;
  top: 100px;
  z-index: 9999;
  padding-right: 0px;
}
@media screen and (max-width: 930px) {
  .phone-tabs {
    right: 0px;
    left: auto;
  }
}
.test.q-item__section--main {
  width: auto;
  min-width: 0;
  max-width: 100%;
  flex: 3000 0 0%;
}
.qribbon-avatar [class*="horizontal--right"].decorate-rounded-out {
  border-top-left-radius: 45px;
  border-bottom-left-radius: 45px;
  padding-left: 5px;
}
</style>
