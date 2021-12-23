<template>
  <!-- <q-layout> -->
  <q-header
    bordered
    class="ground-glass"
    v-if="$q.platform.is.mobile"
  >
    <q-toolbar class="q-pa-xs">
      <q-btn
        v-if="$q.platform.is.mobile"
        dense
        flat
        round
        color="primary"
        icon="navigate_before"
        :class="{'invisible':noBack}"
        @click="goBack()"
      />
      <q-toolbar-title
        v-if="$q.platform.is.mobile"
        class="row no-wrap items-center justify-center q-px-sm text-subtitle1"
        :class="layoutTextColor"
      >
        <span class="ellipsis">{{title}}</span>
        <slot name="titleAppend">
        </slot>
      </q-toolbar-title>
      <q-space v-if="!$q.platform.is.mobile" />
      <!-- 菜单 -->
      <slot name="menu">
        <tw-menu :class="{'invisible':noMenu}" />
      </slot>

    </q-toolbar>
  </q-header>
  <!-- </q-layout> -->
</template>

<script>
/**
 * 页面级的头部工具栏，使用时直接放置在card中，不要包裹q-card-section
 */
export default {
  name: 'TwHeader',
  inject: ['layoutTextColor'],
  props: {
    noBack: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    noMenu: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu')
  },
  methods: {
    goBack () {
      this.$route.meta.goBack
        ? this.$router.push({ name: this.$route.meta.goBack })
        : window.history.back()
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/ .q-layout__section--marginal {
  background-color: none;
}
</style>
