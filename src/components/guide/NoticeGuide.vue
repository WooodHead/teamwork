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
      <doc-form
        :guide="true"
        :category="$route.params.category"
        :objectID="$route.params.objectID"
      ></doc-form>
    <!-- </q-card-section> -->
  </q-card>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { mapState } from 'vuex'
export default {
  name: 'NoticeGuide',
  components: {
    DocForm: () => import('components/document/doc/DocForm'),
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
/deep/ .save-draft {
  display: none;
}
/deep/ .save-draft + .q-btn {
  margin-left: 0;
}
</style>
