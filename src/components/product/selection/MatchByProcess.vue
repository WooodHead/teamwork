<template>
  <q-card
    :class="['card-grow-in-page','q-pb-xl',{'relative-position':$q.screen.gt.sm}]"
    :flat="$q.screen.lt.sm"
  >
    <!-- 标题 -->
    <tw-header-card title="选型" />

    <q-card-section :class="['q-pt-none',{'q-px-sm':$q.screen.lt.sm}]">
      <div :class="{ 'q-px-xl': !$q.screen.lt.sm }">
        <q-infinite-scroll
          @load="onLoad"
          :offset="250"
          ref="productScroll"
        >
          <product-card-list
            fromSelection
            :items="curPageProducts"
          />
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MatchByProcess',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ProductCardList: () => import('components/product/card/ProductCardList')
  },
  data () {
    return {
      curPageProducts: []
    }
  },
  computed: {
    ...mapState('product', ['page', 'productMatchs'])
  },
  watch: {
    productMatchs (newVal, oldVal) {
      this.$refs.productScroll.reset()
      this.$refs.productScroll.resume()
      this.$refs.productScroll.trigger()
    }
  },
  methods: {
    onLoad (index, done) {
      this.curPageProducts = this.productMatchs.slice(0, this.page.limit * index)
      if (this.page.limit * index > this.productMatchs.length) {
        done(true)
      } else {
        done()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
