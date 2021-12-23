<template>
  <q-layout
    class="tw4 q-pb-lg"
    :style="tw4"
  >
    <div class="text-center text-h5 q-pb-md">{{$t('app.title')}}</div>
    <q-card :flat="$q.screen.lt.sm">
      <router-view></router-view>
    </q-card>
    <q-footer
      v-if="copyright"
      class="bg-white"
    >
      <tw-copyright />
    </q-footer>
  </q-layout>
</template>
<script >
const { copyright } = require('app/app.config.js')
export default {
  name: 'AuthLayout',
  data () {
    return {
      tw4: `background-image: url(${this.$logo['favicon-login.png']});`,
      copyright
    }
  },
  components: {
    TwCopyright: () => import('components/base/TwCopyright')
  }
}
</script>

<style lang="scss" scoped>
.tw4 {
  width: 100%;
  background: no-repeat center;
  background-position: center 48px;
  padding-top: 166px;
  background-color: $grey-1;
}
.q-card {
  margin: 0 auto;
  max-width: 567px;
}
@media (max-width: $breakpoint-xs-max) {
  .tw4 {
    background-color: #fff;
  }
}
</style>
