<!--  -->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
    :style="{'position:relative':!$q.screen.lt.sm}"
  >
    <product-header-card
      :title="model.title"
      :actions="['menu']"
    >
      <template
        v-if="!model.archived"
        slot="menu"
      >
        <tw-menu
          :flat="$q.platform.is.mobile"
          :menus="menus"
          @edit="onEdit"
          @delete="onDelete"
          @archive="onArchive"
          @export="onExport"
        />
      </template>
    </product-header-card>

    <!-- 归档说明区 -->
    <q-card-section
      v-if="model.archived"
      class="q-px-xxl"
    >
      <tw-archive-notes
        :id="model.id"
        type="productSelection"
        label="产品配置"
        :archiveTime="model.archiveTime"
        :archiveBy="model.archiveBy"
      />
    </q-card-section>

    <q-card-section class="q-px-xxl">
      <div>
        <!-- 工件信息 -->
        <div class="row items-center text-h5 q-pt-none">
          <q-separator class="col gradient-right-to-left" />
          <span class="q-px-md">{{$t('product.selection.workpieceInfo')}}</span>
          <q-separator class="col gradient-left-to-right" />
        </div>
        <!--工件信息展示组件-->
        <product-tech-params
          v-if="workpieceInfoFlat&&workpieceInfoFlat.length"
          :techParamsFlat="workpieceInfoFlat"
          showMore
        />
      </div>
      <div>
        <!-- 机床信息 -->
        <div class="row items-center text-h5 q-pt-md">
          <q-separator class="col gradient-right-to-left" />
          <span class="q-px-md">{{$t('product.selection.machinetoolInfo')}}</span>
          <q-separator class="col gradient-left-to-right" />
        </div>
        <!-- 机床信息展示组件-->
        <q-img
          v-if="product"
          contain
          :src="selectionProductImgUrl"
          style="max-height:500px;"
        />
        <brief
          v-if="product"
          :product="product"
        />
      </div>
      <tw-anchor-tab :anchors="anchors">
        <!-- 技术参数 -->
        <template v-slot:tech-params>
          <!--技术参数展示组件-->
          <product-tech-params
            v-if="techParamsFlat&&techParamsFlat.length"
            :techParamsFlat="techParamsFlat"
          />
        </template>
        <!-- 附件配置 -->
        <template v-slot:machinetool-accessorys>
          <!--附件配置展示组件-->
          <machinetool-config-list
            v-if="Object.keys(model).length>0"
            :accessoryIds="model.selectionJson.accessoryIds"
            :class="{'q-px-sm':!$q.screen.gt.sm}"
            ref="configList"
          />
        </template>
      </tw-anchor-tab>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getUrl } from '@/boot/file'
import { showConfirm } from '@/utils/show-confirm'
import { exportExcel } from 'components/product/export/index'
export default {
  name: 'SelectionDetail',
  components: {
    ProductHeaderCard: () => import('components/product/ProductHeaderCard'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwMenu: () => import('components/base/TwMenu'),
    TwAnchorTab: () => import('components/base/TwAnchorTab'),
    Brief: () => import('components/product/template/Brief'),
    ProductTechParams: () => import('components/product/ProductTechParams'), // 技术参数组件
    MachinetoolConfigList: () => import('components/product/machinetool/MachinetoolConfigList') // 附件配置组件
  },
  props: {
    id: { type: [Number, String], required: true }
  },
  data () {
    return {
      isShowEdit: false,
      accessoryIds: [],
      menus: ['edit', 'delete', 'archive', { group: ['export'] }],
      workpieceInfoFlat: null,
      anchors: [
        { id: 1, label: this.$t('product.selection.techParams'), containerId: 'tech-params' },
        { id: 2, label: this.$t('product.selection.machinetoolAccessorys'), containerId: 'machinetool-accessorys' }
      ],
      product: null,
      techParamsFlat: null
    }
  },
  computed: {
    ...mapState('productSelection', ['selections']),
    ...mapGetters('productSelection', ['productSelection', 'selectionWorkpieceInfoFlat']),
    ...mapGetters('product', ['productTechParamsFlat']),
    model () {
      return this.$store.getters['productSelection/productSelection'](+this.id)
    },
    selectionProductImgUrl () {
      return getUrl(this.product ? this.product.imgUrl : '')
    }
  },
  methods: {
    ...mapMutations('product', ['setShowWorkPiece']),
    ...mapActions('product', ['loadProduct']),
    ...mapActions('productSelection', ['loadProductSelection', 'deleteProductSelection', 'archiveProductSelection']),
    init () {
      let that = this
      that.loadProductSelection(+that.id).then(res => {
        that.workpieceInfoFlat = that.selectionWorkpieceInfoFlat(res)
        that.loadProduct(this.model.selectionJson.machinetoolId)
          .then(prod => {
            that.product = prod
            that.techParamsFlat = that.productTechParamsFlat(prod)
          })
      })
    },
    // 跳转至编辑页
    onEdit () {
      // 跳转到产品详情页
      this.$router.push({
        name: 'workPieceEdit',
        params: {
          id: this.model.selectionJson.machinetoolId,
          selectionId: +this.id,
          accessoryIdsFromSelection: this.model.selectionJson.accessoryIds
        }
      })

      // 清空上次选型结果
      this.$store.state.product.productMatchs = []

      // 拉出工艺表单
      this.setShowWorkPiece(true)
    },
    // 通过id删除我的配置单
    onDelete () {
      let that = this
      showConfirm(this.$t('product.notifies.confirmDelete'),
        () => {
          that.deleteProductSelection(+that.id)
        },
        () => { })
    },
    // 归档
    onArchive () {
      this.archiveProductSelection(+this.id)
    },
    onExport () {
      const configs = this.$refs.configList.lstAccessory
      exportExcel(this.product, this.techParamsFlat, configs)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>
