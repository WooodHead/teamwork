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
    <q-card-section class="q-py-lg text-left">
      <project-apply-for
        :id="$route.params.objectID"
        :guide="true"
        :lastGuide='guideModule.step === stepLength'
      ></project-apply-for>
    </q-card-section>
  </q-card>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { mapState } from 'vuex'
export default {
  name: 'ApprovalGuide',
  components: {
    GuideAddHeader: () => import('components/guide/GuideAddHeader'),
    ProjectApplyFor: () => import('components/project/ProjectApplyFor')
  },
  computed: {
    ...mapState('guide', ['guideCategoryStep', 'guideModule']),
    stepLength () {
      let categoryStep = _.filter(this.guideCategoryStep, item => _.includes(item.category, this.$route.params.category))
      return categoryStep.length
    }
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
