<template>
  <div class="q-pb-md">
    <!-- 叶子产品 -->
    <span class="absolute-top-left q-pl-sm">
      <!-- materialCode[物料编码] -->
      <span
        class="text-caption"
        v-if="product.classification !=='sample' "
      >{{product.materialCode}}</span>
      <!-- isPublish0[正在维护中] -->
      <span
        v-if="product.isPublish===0"
        class="text-secondary"
      >{{$t('product.fields.isPublish0')}}</span>
    </span>

    <!-- content -->
    <div class="q-px-xxl">
      <!-- 轮播图 -->
      <tw-carousel
        :showConfig="$myinfo.auth.role.isProductManager"
        :coverUrl="product.imgUrl"
        objectType="product"
        :objectId="product.id"
        @uploaded="uploadedHomeCarousel"
      />

      <!-- 基础信息 -->
      <brief :product="product" />

      <tw-anchor-tab
        :anchors="pageAnchors"
        :offsetHeight="60"
        ref="productAnchorTab"
      >
        <!-- 技术参数 -->
        <template v-slot:tech-params>
          <product-tech-params :techParamsFlat="techParamsFlat" />
        </template>

        <!-- 机床附件配置 -->
        <template v-slot:machinetool-accessorys>
          <related-products
            view="itemGroup"
            :id="product.id"
            :arrClassification="['spindle', 'toolmagazine', 'measure', 'accessory','automation','software']"
            :noRelatedNotes="$t('product.noConfigListNotes')"
            :panelTitle="$t('product.accessoryConfig')"
            ref="machinetoolConfigList"
          />
        </template>
        <template v-slot:machinetool-accessorys-anchor-right>
          <div
            v-if="$myinfo.auth.role.isProductManager"
            class="text-right q-pr-md"
          >
            <q-btn
              flat
              dense
              round
              icon="settings"
              :title="$t('product.tabs.machinetoolAccessorys')"
              color="secondary"
              @click="$refs.machinetoolConfigList.$refs.productSelectPanel.showConfig=true"
            />
          </div>
        </template>

        <!-- 附件关联的机床 -->
        <template v-slot:accessory-machinetools>
          <related-products
            :view="product.classification==='sample'?'card':'item'"
            :id="product.id"
            :category1="product.classification==='sample' ? 'sample' : 'product'"
            category2="product"
            :arrClassification="['machinetool']"
            :noRelatedNotes="$t('product.noRelatedListNotes')"
            :panelTitle="$t('product.relatedMachinetool')"
            ref="accessoryRelatedList"
          />
        </template>
        <template v-slot:accessory-machinetools-anchor-right>
          <div
            v-if="$myinfo.auth.role.isProductManager"
            class="text-right q-pr-md"
          >
            <q-btn
              flat
              dense
              round
              icon="link"
              :title="product.classification==='sample'?$t('product.tabs.sampleMachinetools'):$t('product.tabs.accessoryMachinetools')"
              color="secondary"
              @click="$refs.accessoryRelatedList.$refs.productSelectPanel.showConfig=true"
            />
          </div>
        </template>

        <!--关联样品/应用案例-->
        <template v-slot:related-sample>
          <related-products
            :isPathRelation="product.classification==='machinetool'"
            :id="product.id"
            category1="product"
            :category2="product.classification==='sample' ? 'product' : 'sample'"
            :arrClassification="['sample']"
            :noRelatedNotes="product.classification==='sample'?$t('product.noRelatedSampleNotes'):$t('product.noRelatedUseSampleNotes')"
            :panelTitle="$t('product.relateSample')"
            :class="{'q-px-sm':!$q.screen.gt.sm}"
            ref="relatedSample"
          />
        </template>
        <template v-slot:related-sample-anchor-right>
          <div
            v-if="$myinfo.auth.role.isProductManager"
            class="text-right q-pr-md"
          >
            <q-btn
              flat
              dense
              round
              icon="link"
              :title="product.classification==='sample'?$t('product.tabs.relateSample'):$t('product.relateUseSample')"
              color="secondary"
              @click="$refs.relatedSample.$refs.productSelectPanel.showConfig=true"
            />
          </div>
        </template>

        <!-- 相关文件 -->
        <template v-slot:file-download>
          <folder-content
            category="product"
            :objectID="product.id"
            class="q-mt-md"
            ref="folderContent"
          />
        </template>
        <template v-slot:file-download-anchor-right>
          <folder-add-menu
            v-if="$myinfo.auth.role.isProductManager"
            category="product"
            :objectID="product.id"
            :id="productDocID"
            :excludeMenus="['folder']"
            :unelevated="false"
            :rounded="false"
            :round="true"
            :flat="true"
            :dense="true"
            label=""
            title="新建"
            textColor="secondary"
            class="q-mr-md"
          />
        </template>
      </tw-anchor-tab>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ProductDetailOfLeaf',
  components: {
    TwCarousel: () => import('components/base/TwCarousel'),
    Brief: () => import('components/product/template/Brief'),
    TwAnchorTab: () => import('components/base/TwAnchorTab'),
    ProductTechParams: () => import('components/product/ProductTechParams'),
    FolderAddMenu: () => import('components/document/folder/FolderAddMenu'),
    FolderContent: () => import('components/document/folder/FolderContent.vue'),
    RelatedProducts: () => import('components/product/related/RelatedProducts')
  },
  props: {
    product: { type: Object, required: true },
    selectionId: { type: [Number, String], default: 0 }
  },
  data () {
    return {
      anchors: [
        { id: 10, label: this.$t('product.tabs.techParams'), containerId: 'tech-params' },
        { id: 20, label: this.$t('product.tabs.machinetoolAccessorys'), containerId: 'machinetool-accessorys' },
        { id: 30, label: this.$t('product.tabs.relateSample'), containerId: 'related-sample' },
        { id: 35, label: this.$t('product.tabs.useSamples'), containerId: 'related-sample' },
        { id: 40, label: this.$t('product.tabs.accessoryMachinetools'), containerId: 'accessory-machinetools' },
        { id: 45, label: this.$t('product.tabs.sampleMachinetools'), containerId: 'accessory-machinetools' },
        { id: 50, label: this.$t('product.tabs.fileDownload'), containerId: 'file-download' }
      ],
      anchorGroup: {
        machinetool: [10, 20, 35, 50],
        sample: [10, 30, 45],
        others: [10, 40, 50]
      },
      productDocID: 0
    }
  },
  watch: {
    $route (to, from) {
      if (to.fullPath !== from.fullPath) {
        this.init()
      }
    }
  },
  computed: {
    ...mapState('product', ['page', 'productDetails', 'productMatchs', 'checkAccessoryIds']),
    ...mapGetters('product', ['products', 'productTechParamsFlat', 'productAccessoryRelations', 'productAccessoryIds']),
    ...mapGetters('resource', ['resourceRelations', 'categoryRelations']),
    ...mapGetters('file', ['files']),
    techParamsFlat () {
      return this.productTechParamsFlat(this.product)
    },
    pageAnchors () {
      let that = this
      let curAnchorGroup = ['machinetool', 'sample'].includes(this.product.classification)
        ? this.product.classification
        : 'others'
      return _.filter(this.anchors, anchor => that.anchorGroup[curAnchorGroup].includes(anchor.id))
    },
    accessoryIds () {
      return this.productAccessoryIds(this.product.id)
    },
    lstFile () {
      return _.filter(this.files, f =>
        f.objectType === 'product' &&
        f.objectId === this.product.id)
    }
  },
  methods: {
    ...mapMutations('product', ['resetPage', 'setCheckAccessoryIds']),
    ...mapMutations('productSelection', ['setProcessJson']),
    ...mapActions('product', ['loadProduct', 'loadProducts', 'deleteProduct', 'loadProductAccessoryIds']),
    ...mapActions('productSelection', ['loadProductSelection']),
    ...mapActions('file', ['addFile']),
    init () {
      let query = []
      query.push({ Key: 'ParentID', Value: this.product.parentId, Oper: 'eq' })
      this.loadProducts({ query })

      // // 获取产品配置的附件ids，仅设置标配
      // this.product.classification === 'machinetool' &&
      //   this.loadProductAccessoryIds(this.product.id)
      //     .then(res => {
      //       if (+this.selectionId === 0) {
      //         let relations = this.productAccessoryRelations(this.product.id)
      //         let checkedIds = _.map(_.filter(relations, r => r.extra.standard === 1), 'selectId')
      //         this.setCheckAccessoryIds(checkedIds)
      //       }
      //     })

      // 如果是选型编辑，初始化附件及工艺参数
      if (+this.selectionId > 0) {
        this.loadProductSelection(+this.selectionId)
          .then(res => {
            this.setCheckAccessoryIds(res.selectionJson.accessoryIds)
            this.setProcessJson(res.processJson)
          })
      }

      // 产品文档
      // 切换产品，要重新触发文档加载（因为文档模块内部仅监听category变化触发）
      this.$refs.folderContent && this.$refs.folderContent.restart()
      // 归档路由需要category, objectID
      Object.assign(this.$router.currentRoute.params, { category: 'product', objectID: this.product.id })
    },
    uploadedHomeCarousel (files) {
      let that = this
      _.forEach(files, file => {
        let fileOrderNumber = String(++this.lstFile.length)
        that.addFile({
          url: file.PathName,
          title: file.Title,
          ext: file.Extension,
          size: file.Size,
          objectType: 'product',
          objectId: +that.product.id,
          usedBy: 'carousel',
          orderNumber: fileOrderNumber
        })
      })
    },
    uploadedFileDownload (files) {
      // 组装数据 写入后台
      let that = this
      _.forEach(files, file => {
        that.addFile({
          url: file.PathName,
          title: file.Title,
          ext: file.Extension,
          size: file.Size,
          objectType: 'product',
          objectId: +that.product.id,
          orderNumber: file.lastModified
        }).then(resAdd => {
          // 删除上传区对应文件
          that.$refs.fileUploader.removeFileUploaded(`${file.Title}${file.Extension}`)
        })
      })
    },
    addMyConfig (accessoryId) {
      this.setCheckAccessoryIds(_.uniq([...this.checkAccessoryIds, accessoryId]))
    },
    popMyConfig (accessoryId) {
      this.setCheckAccessoryIds(_.difference(this.checkAccessoryIds, [accessoryId]))
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
</style>
