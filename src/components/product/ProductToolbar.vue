<template>
  <q-page-sticky
    :expand="$q.screen.lt.sm"
    :position="$q.platform.is.mobile ? 'bottom-right' : 'bottom'"
    :offset="$q.platform.is.mobile ? [18, 18] : [0, 0]"
    class="rounded-borders"
    style="z-index:1001;"
  >
    <q-toolbar
      v-if="!$q.platform.is.mobile"
      :class="['bg-white','justify-center','text-primary','shadow-up-2',{'rounded-borders':!$q.screen.lt.sm}]"
      style="min-width:400px;"
    >
      <div :class="$q.screen.lt.sm?'fit row justify-evenly thin-toolbar':'q-px-md q-gutter-x-md'">
        <q-btn
          flat
          stack
          size="sm"
          icon="compare_arrows"
          label="PK"
          @click="dispatchAction('pk')"
        />

        <q-btn
          v-if="model.classification==='machinetool'"
          flat
          stack
          size="sm"
          icon="input"
          :label="$t('product.toolbarBtns.configList')"
          @click="dispatchAction('configList')"
        />

        <q-btn
          v-if="model.classification==='machinetool'&&pageType==='detail'"
          flat
          stack
          size="sm"
          icon="extension"
          :label="$t('product.toolbarBtns.config')"
          @click="dispatchAction('config')"
        >
          <q-badge
            id="myProductConfig"
            color="red"
            floating
          >{{latestAccessoryIds.length}}</q-badge>
        </q-btn>

        <q-btn
          v-if="model.classification==='machinetool'&&pageType==='list'"
          rounded
          unelevated
          color="positive"
          icon="devices"
          :label="$t('product.toolbarBtns.selection')"
          style="height:36px;margin-top:auto;margin-bottom:auto;"
          @click="dispatchAction('selection')"
        />

        <q-btn
          v-if="model.classification==='machinetool'&&pageType==='detail'"
          rounded
          unelevated
          color="positive"
          icon="playlist_add_check"
          :label="$t('product.toolbarBtns.check')"
          style="height:36px;margin-top:auto;margin-bottom:auto;"
          @click="dispatchAction('check')"
        />
      </div>
    </q-toolbar>
    <q-fab
      v-else
      vertical-actions-align="right"
      color="primary"
      text-color="white"
      icon="add"
      direction="up"
    >
      <q-fab-action
        label-position="left"
        color="blue-grey-8"
        text-color="white"
        @click="dispatchAction('pk')"
        icon="compare_arrows"
        label="PK"
        padding="sm"
      />
      <q-fab-action
        label-position="left"
        v-if="model.classification==='machinetool'&&pageType==='detail'"
        color="blue-grey-8"
        text-color="white"
        @click="dispatchAction('config')"
        icon="extension"
        :label="$t('product.toolbarBtns.config')"
        padding="sm"
      >
        <q-badge
          id="myProductConfig"
          color="red"
          floating
        >{{latestAccessoryIds.length}}</q-badge>
      </q-fab-action>
      <q-fab-action
        label-position="left"
        v-if="model.classification==='machinetool'&&pageType==='list'"
        color="positive"
        text-color="white"
        @click="dispatchAction('selection')"
        icon="devices"
        :label="$t('product.toolbarBtns.selection')"
        padding="sm"
      />
      <q-fab-action
        label-position="left"
        v-if="model.classification==='machinetool'&&pageType==='detail'"
        color="positive"
        text-color="white"
        @click="dispatchAction('check')"
        icon="playlist_add_check"
        :label="$t('product.toolbarBtns.check')"
        padding="sm"
      />
    </q-fab>

    <!-- process form -->
    <q-dialog
      :value="showWorkPiece"
      @input="val=>ignoreInputChange?(ignoreInputChange=false):setShowWorkPiece(val)"
      no-route-dismiss
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card :style="dialogStyle">
        <product-dialog-close-btn
          v-if="$q.screen.lt.sm"
          :callBack="()=>{ignoreInputChange=true;setShowWorkPiece(false)}"
        />
        <work-piece-form />
      </q-card>
    </q-dialog>

    <!-- config list -->
    <q-dialog
      v-model="showConfigList"
      no-route-dismiss
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card :style="dialogStyle">
        <product-dialog-close-btn
          v-if="$q.screen.lt.sm"
          :callBack="()=>{showConfigList=false}"
        />
        <machinetool-config-list
          :id="model.id"
          :accessoryIds="latestAccessoryIds"
          showRemoveConfig
          showSaveConfig
          @popConfig="popMyConfig"
        />
      </q-card>
    </q-dialog>
  </q-page-sticky>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ProductToolbar',
  components: {
    WorkPieceForm: () => import('components/product/selection/WorkPieceForm'),
    MachinetoolConfigList: () => import('components/product/machinetool/MachinetoolConfigList'),
    ProductDialogCloseBtn: () => import('components/product/ProductDialogCloseBtn')
  },
  props: {
    model: { type: Object, default: () => { }, desc: '产品model' },
    productAnchorTab: { type: Object, default: () => { }, desc: '锚点滚动组件对象' }
  },
  data () {
    return {
      showConfigList: false,
      ignoreInputChange: false,
      latestAccessoryIds: [],
      dialogStyle: {
        maxHeight: '80vh',
        width: '850px',
        maxWidth: '850px'
      }
    }
  },
  watch: {
    checkAccessoryIds (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init(this.checkAccessoryIds)
      }
    }
  },
  computed: {
    ...mapState('product', ['checkAccessoryIds', 'showWorkPiece']),
    // 产品列表页或详情页
    pageType () {
      return this.model.tplCode === '' ? 'detail' : 'list'
    }
  },
  methods: {
    ...mapMutations('product', ['setShowWorkPiece', 'setCheckAccessoryIds']),
    init (ids) {
      this.latestAccessoryIds = ids
      this.setCheckAccessoryIds(this.latestAccessoryIds)
    },
    dispatchAction (actionName) {
      switch (actionName) {
        case 'selection':
        case 'check':
          this.setShowWorkPiece(true)
          break
        case 'pk':
          this.$router.push({
            name: 'productPK',
            params: { classification: this.model.classification, id: this.model.id || 0 }
          })
          break
        case 'config':
          // 选型配置为空时，滚动到指定位置，否则弹出选型配置
          if (this.checkAccessoryIds.length > 0) {
            this.showConfigList = true
          } else {
            this.productAnchorTab.scrollToView('machinetool-accessorys')
          }
          break
        case 'configList':
          this.$router.push({ name: 'productSelection' })
          break
      }
    },
    popMyConfig (accessoryId) {
      let newAccessoryIds = _.difference(this.latestAccessoryIds, [accessoryId])
      this.init(newAccessoryIds)
    }
  },
  created () {
    this.init(this.checkAccessoryIds)
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-toolbar .q-btn .q-btn__content.column .block {
  padding-top: 5px;
}

/deep/.thin-toolbar .q-btn .q-btn__wrapper {
  padding: 4px 10px;
}

/deep/.q-fab__actions .q-btn {
  margin: 6px;
}
</style>
