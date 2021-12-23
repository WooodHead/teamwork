<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pa-none"
  >
    <q-card-section class="q-pa-lg text-right guide-header">
      <guide-add-header
        :guideModule="guideModule"
      ></guide-add-header>
    </q-card-section>
    <!-- <q-card-section class="q-py-lg text-left"> -->
      <member-index
        :guide="true"
        :category="$route.params.category"
        :objectID="$route.params.objectID"
        class="q-pb-xl q-pt-lg"
      ></member-index>
    <!-- </q-card-section> -->
  </q-card>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { mapState } from 'vuex'
export default {
  name: 'MemberGuide',
  components: {
    MemberIndex: () => import('components/member/MemberIndex'),
    GuideAddHeader: () => import('components/guide/GuideAddHeader')
  },
  computed: {
    ...mapState('guide', ['guideModule'])
  }
}
</script>

<style scoped lang="scss">
.guide-header {
  background-color: $friend;
}
</style>
