<template>
  <div>
    <q-item clickable @click="onDetail">
      <q-item-section class="key">{{ item.title }}</q-item-section>
      <q-item-section side>
        <q-btn
          v-if="$myinfo.auth.role.isProductManager"
          icon="clear"
          round
          dense
          flat
          color="grey-7"
          @click.stop="$emit('delRelation')"
        />
      </q-item-section>
    </q-item>

    <!-- 关联详情弹窗 -->
    <q-dialog v-model="showDetail">
      <q-card style="max-width:80vw;min-width:60vw;">
        <product-dialog-close-btn
          v-if="$q.screen.lt.sm"
          :callBack="
            () => {
              showDetail = false
            }
          "
        />
        <q-card-section class="q-pa-none">
          <q-img :src="getUrl(item.imgUrl)" />
          <brief showDetailBtn :product="item" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { getUrl } from '@/boot/file'

export default {
  name: 'ProductItem',

  components: {
    ProductDialogCloseBtn: () =>
      import('components/product/ProductDialogCloseBtn'),
    Brief: () => import('components/product/template/Brief')
  },

  props: {
    item: { type: Object, default: () => {} }
  },

  data () {
    return {
      showDetail: false
    }
  },

  methods: {
    getUrl,
    onDetail () {
      this.showDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
.key {
  font-size: 1rem;
  font-weight: 400;
}

.dialog-width {
  width: 700px;
  max-width: 80vw;
}
</style>
