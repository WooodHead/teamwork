<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 顶栏 -->
      <product-header-card
        v-if="$q.platform.is.mobile"
        title="产品选型"
      />

      <!-- 轮播 -->
      <tw-carousel-notice
        :showConfig="$myinfo.auth.role.isProductManager"
        objectType="product"
        :objectId="0"
        :height="$q.screen.lt.sm?'152px':'286px'"
      />
      <!-- 功能入口卡片 -->
      <div class="fit row q-gutter-y-md justify-evenly q-my-sm">
        <div
          v-for="item in quickLinks"
          :key="item.id"
          class="span-stype"
        >
          <product-catalog-card :element="item" />
        </div>
      </div>

    </q-card>

    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PageProduct',
  components: {
    ProductHeaderCard: () => import('components/product/ProductHeaderCard'),
    TwCarouselNotice: () => import('components/base/TwCarouselNotice'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    ProductCatalogCard: () => import('components/product/card/ProductCatalogCard')
  },
  data () {
    return {
      product: {
        classification: 'machinetool'
      }
    }
  },
  computed: {
    ...mapGetters('product', ['quickLinks'])
  },
  methods: {
    ...mapActions('product', ['loadQuickLinks'])
  },
  mounted () {
    this.loadQuickLinks()
  }
}
</script>

<style lang='scss' scoped>
  @media (max-width: $breakpoint-xs-max) {
    .span-stype {
      width: 43%;
    }
  }
</style>
