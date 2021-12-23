<template>
  <q-card
    flat
    bordered
    class="q-pa-none cursor-pointer product-common-card"
  >
    <div class="relative-position">
      <q-btn
        v-if="showRelationDel && $myinfo.auth.role.isProductManager"
        icon="clear"
        round
        dense
        flat
        color="grey-7"
        class="absolute-top-right"
        style="z-index: 10"
        @click="$emit('delRelation')"
      />
      <div
        v-else-if="item.tplCode !== '' && $myinfo.auth.role.isProductManager"
        class="absolute-top-right"
        style="z-index: 10"
        @click.stop=""
      >
        <tw-menu
          flat
          :menus="newMenus"
          @edit="onEdit"
          @publish="onPublish"
          @dropPublish="onPublish"
          @delete="onDelete"
          @changeCover="onChangeCover"
        />
      </div>
      <div @click="$router.push({ name: 'productDetail', params: { id: item.id } })">
        <q-img
          contain
          :ratio="1.4"
          :src="getUrl(item.imgUrl)"
          spinner-color="primary"
          class="bg-white"
          style="border-radius: 4px;"
        />
        <div
          v-if="item.maturity===1"
          class="product-new"
        ></div>
        <div
          v-if="item.isPublish === 0"
          class="absolute-top q-pa-sm"
        >
          <q-badge
            color="orange"
            :label="$t('product.fields.isPublish0')"
          />
        </div>
      </div>
    </div>

    <q-card-section
      class="q-pa-sm"
      @click="$router.push({ name: 'productDetail', params: { id: item.id } })"
    >
      <div v-if="item.classification==='machinetool'">
        <q-item-label
          :title="item.title"
          lines="2"
          class="q-mb-xs text-h2-g text-weight-bold"
        >{{item.title}}</q-item-label>
        <div
          v-if="Object.keys(item.params).length"
          class="q-pb-sm ellipsis-2-lines"
        >
          <product-badge-group :product="item" />
        </div>
        <q-item-label
          :title="item.notes"
          caption
          lines="2"
          class="text-body-g item-notes"
          style="line-height: 1.3 !important;"
        >{{item.notes?item.notes:'-'}}</q-item-label>
      </div>
      <div v-else>
        <q-item-label
          :title="item.title"
          lines="2"
          class="q-mb-xs text-h2-g text-weight-bold"
        >
          <span title="item.title">{{item.specModel|| item.title}}</span>
        </q-item-label>
        <div class="q-pb-sm ellipsis-2-lines">
          <product-badge-group :product="item" />
        </div>
        <q-item-label
          caption
          lines="2"
          class="text-body-g item-notes"
          style="line-height: 1.3 !important;"
        >
          {{Object.keys(item.params).length > 0 ? productKeyTechParamsFlat(item) : ''}}
        </q-item-label>
      </div>
    </q-card-section>

    <div
      v-if="fromSelection&&item.proportion!==100"
      class="absolute-top-right"
    >
      <q-knob
        readonly
        show-value
        v-model="item.proportion"
        size="md"
        :thickness="0.3"
        color="green-7"
        track-color="grey-3"
        class="q-ma-xs text-green-7"
        @click.stop.native="$refs.matchNotesPanel.showMatchNotes=true"
      />
    </div>

    <!-- 匹配度 -->
    <match-notes-panel
      :id="item.id"
      :process="process"
      accessoryIds="all"
      :modelName="item.title"
      :class="{'dialog-width':!$q.platform.is.mobile}"
      ref="matchNotesPanel"
    />

    <!-- 上传封面 -->
    <tw-uploader
      v-show="false"
      accept="image/*"
      folder="product"
      class="q-mt-md"
      @uploaded="uploaded"
      ref="coverUploaderRef"
    />
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { getUrl } from '@/boot/file'
export default {
  name: 'ProductCard',
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwUploader: () => import('components/base/file-uploader/TwUploader'),
    ProductBadgeGroup: () => import('components/product/ProductBadgeGroup'),
    MatchNotesPanel: () => import('components/product/selection/MatchNotesPanel')
  },
  props: {
    fromSelection: { type: Boolean, default: false },
    showRelationDel: { type: Boolean, default: false },
    item: { type: Object, required: true },
    menus: { type: Array, default: () => [] }
  },
  computed: {
    ...mapState('product', ['process']),
    ...mapGetters('product', ['productKeyTechParamsFlat']),
    newMenus () {
      let curMenus = _.cloneDeep(this.menus)
      curMenus.splice(1, 0, this.item.isPublish ? 'dropPublish' : 'publish')
      return curMenus
    }
  },
  methods: {
    ...mapActions('product', ['updateProductField', 'deleteProduct']),
    getUrl,
    onEdit () {
      this.$router.push({
        name: 'productEdit',
        params: { openType: 'edit', id: this.item.id }
      })
    },

    onPublish () {
      showConfirm(
        `确定要${this.item.isPublish ? '撤销' : ''}发布吗？`,
        () => {
          this.updateProductField({
            Id: this.item.id,
            IsPublish: this.item.isPublish ? 0 : 1
          })
        },
        () => {}
      )
    },

    onDelete () {
      // 如果有子产品，会一并删除
      showConfirm(this.$t('product.notifies.confirmDelete'),
        () => this.deleteProduct(this.item.id))
    },

    onChangeCover () {
      this.$refs.coverUploaderRef.$refs.qUploader.pickFiles()
    },

    uploaded (files) {
      this.updateProductField({
        Id: this.item.id,
        ImgUrl: files[0].PathName
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.product-common-card {
  position: static;
  width: calc((100% - 61px) / 5) !important;
  margin-right: 15px;
  border-radius: 4px;
  background-color: $primary5;
  &:nth-child(5n) {
    margin-right: 0;
  }
}
.product-common-card:before {
  content: "";
  display: block;
  padding-top: 0 !important;
}
.item-notes {
  font-size: 12px;
}
@media (max-width: $breakpoint-sm-max) {
  .product-common-card {
    width: calc((100% - 31px) / 3) !important;
    &:nth-child(5n) {
      margin-right: 15px;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
@media (max-width: $breakpoint-xs-max) {
  .product-common-card {
    width: calc((100% - 16px) / 2) !important;
    &:nth-child(3n) {
      margin-right: 15px;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}

.white-space {
  white-space: pre-wrap;
}

.dialog-width {
  width: 700px;
  min-height: 500px;
  max-width: 80vw;
}

.product-new {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 0;
  height: 0;
  border: 30px solid;
  border-color: transparent transparent $auxiliary4;
  transform: rotate(45deg);
  &::after {
    position: absolute;
    content: "NEW";
    bottom: -30px;
    left: -15px;
    right: -15px;
    text-align: center;
    color: white;
    font-size: 14px;
  }
}
</style>
