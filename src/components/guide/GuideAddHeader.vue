<template>
  <div>
    <p class="text-white text-center text-h6 text-weight-bold">{{currentContent.title}}</p>
    <p v-if="currentContent.subtitle" class="text-center text-white">{{currentContent.subtitle}}</p>
    <q-btn
      unelevated
      dense
      rounded
      :label="$t('guide.skip')"
      class="q-px-lg text-right no-guide-btn skip-btn"
      @click="selectSkip()"
    />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'GuideAddHeader',
  props: {
    guideModule: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState('guide', ['guideCategoryStep']),
    stepLength () {
      let categoryStep = _.filter(this.guideCategoryStep, item => _.includes(item.category, this.$route.params.category))
      // return this.guideCategoryStep.length
      return categoryStep.length
    },
    currentContent () {
      if (this.guideModule.step) {
        return this.guideCategoryStep[this.guideModule.step - 1].addContent
      } else {
        return this.guideCategoryStep[0].addContent
      }
    }
  },
  methods: {
    ...mapActions('guide', ['updateGuide', 'loadGuide']),
    selectSkip () {
      if (this.guideModule.step < this.stepLength) {
        // 跳转到下一步
        let query = {
          ObjectID: this.$route.params.objectID,
          ObjectType: this.$route.params.category,
          Step: this.guideModule.step + 1
        }
        this.updateGuide(query).then(res => {
          this.$router.push({ name: 'guideStep', params: { objectID: this.$route.params.objectID, category: this.$route.params.category, step: this.guideCategoryStep[res.step - 1].name } })
        })
      } else if (this.guideModule.step === this.stepLength) {
        let query = {
          ObjectID: this.$route.params.objectID,
          ObjectType: this.$route.params.category,
          Finished: 1
        }
        this.updateGuide(query).then(res => {
          this.$router.push({ name: `${res.objectType}Detail`, params: { id: `${res.objectID}` } })
        })
      }
    }
  },
  mounted () {
    if (!this.guideModule.step) {
      let query = [
        { Key: 'Owner', Value: LocalStorage.getItem('myself').id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.$route.params.objectID, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.$route.params.category, Oper: 'eq' }
      ]
      this.loadGuide(query)
    }
  }
}
</script>

<style scoped lang="scss">
.no-guide-btn {
  background-color: rgba($color: #000000, $alpha: 0.2);
}
.skip-btn {
  color: rgba(255, 255, 255, 0.8)
}
</style>
