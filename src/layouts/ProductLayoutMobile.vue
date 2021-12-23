<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="bg-grey-1">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"> </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </q-page-container>

    <q-footer
      v-show="footerVisible"
      bordered
      class="ground-glass"
      :class="layoutTextColor"
    >
      <q-tabs
        dense
        align="justify"
        active-color="blue-8"
        indicator-color="transparent"
      >
        <q-tab
          v-for="nav in productNavs"
          :key="nav.name"
          :name="nav.name"
          :icon="nav.icon"
          :label="nav.label"
          :alert="nav.alert"
          @click.stop="navClick(nav)"
        />
      </q-tabs>
    </q-footer>
    <q-drawer
      v-if="leftDrawerOpen"
      v-model="leftDrawerOpen"
      side="left"
      behavior="mobile"
      :breakpoint="767"
      :width="300"
      show-if-above
      bordered
      overlay
      content-class="bg-grey-1"
    >
      <q-scroll-area
        class="full-width full-height"
        :thumb-style="thumbStyle"
      >
        <product-tree-switch
          @selected-event="switchProductTo"
        />
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import init from '@/utils/init'
export default {
  name: 'ProductLayoutMobile',
  provide: function () {
    return {
      layoutTextColor: this.layoutTextColor
    }
  },
  data () {
    return {
      layoutTextColor: 'text-blue-grey-8',
      TimeFn: null,
      leftDrawerOpen: false,
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  computed: {
    ...mapState('layout', ['footerVisible', 'productNavs']),
    ...mapGetters('product', ['quickLinks'])
  },
  methods: {
    ...mapMutations('layout', ['setFooterVisible']),
    ...mapActions('product', ['loadQuickLinks', 'loadProduct']),
    switchProductTo (e) {
      e.id !== +this.$route.params.id &&
        this.$router.push({ name: 'productDetail', params: { id: e.id } })
    },
    navClick (nav) {
      this[`${nav.name}Click`](nav)
    },
    productTreeClick () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    productHomeClick (nav) {
      this.$router.push(nav.to)
    },
    productPKClick () {
      this.loadProduct(+this.$route.params.id)
        .then(res => {
          if (res) {
            this.$router.push({
              name: 'productPK',
              params: { classification: res.classification, id: this.$route.params.id || 0 }
            })
          }
        })
    }
  },
  created () {
    init.call(this)
  },
  mounted () {
    this.loadQuickLinks()
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        if (newVal.name === 'productHome') {
          this.setFooterVisible(false)
        } else {
          this.setFooterVisible(true)
        }
      }
    }
  },
  components: {
    ProductTreeSwitch: () => import('components/product/ProductTreeSwitch')
  }
}
</script>

<style lang="scss" scoped></style>
