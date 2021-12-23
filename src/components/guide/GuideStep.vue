<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-py-lg q-px-xxl"
  >
    <q-card-section class="q-px-md q-py-lg text-center guide-step">
      <p style="color: rgba(255, 255, 255, 0.8)">{{$t(`guide.step.index`, {index: currentStepNum, total: stepLength})}}</p>
      <p
        v-if="currentContent.content"
        class="text-white text-h6 text-weight-bold"
      >{{currentContent.content}}</p>
      <q-list
        v-if="currentContent.desc.length"
        class="q-mb-md text-white list-none"
        style="display: inline-block"
      >
        <q-item
          v-for="item in currentContent.desc"
          :key="item"
          class="q-pa-xs"
          style="min-height: auto"
        >
          <p>{{item}}</p>
        </q-item>
      </q-list><br />
      <q-btn
        unelevated
        rounded
        color="white"
        text-color="grey-8"
        :label="$t('guide.step.btns.yes')"
        class="q-mr-md step-btn"
        @click="selectYes(currentContent.name)"
      />
      <q-btn
        unelevated
        rounded
        text-color="white"
        :label="$t('guide.step.btns.no')"
        class="no-guide-btn step-btn"
        @click="selectNo()"
      />
    </q-card-section>
  </q-card>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'GuideStep',
  computed: {
    ...mapState('guide', ['guideCategoryStep', 'guideModule']),
    stepLength () {
      let categoryStep = _.filter(this.guideCategoryStep, item => _.includes(item.category, this.$route.params.category))
      // return this.guideCategoryStep.length
      return categoryStep.length
    },
    currentStepNum () {
      if (!this.guideModule.step) {
        this.reloadGuide()
      }
      return this.guideModule.step > 0 ? this.guideModule.step : 1
    },
    currentContent () {
      return this.guideCategoryStep[+this.currentStepNum - 1]
    }
  },
  methods: {
    ...mapActions('guide', ['updateGuide', 'loadGuide']),
    selectYes (name) {
      this.$router.push(`${name}/add`)
    },
    selectNo () {
      // 判断现在进行到第几步，并与总步数进行比较
      if (this.currentStepNum < this.stepLength) {
        // 跳转到下一步
        let query = {
          ObjectID: this.$route.params.objectID,
          ObjectType: this.$route.params.category,
          Step: this.currentStepNum + 1
        }
        this.updateGuide(query).then(res => {
          this.$router.push(`${this.guideCategoryStep[res.step - 1].name}`)
        })
      } else if (this.currentStepNum === this.stepLength) {
        // finished = true
        let query = {
          ObjectID: this.$route.params.objectID,
          ObjectType: this.$route.params.category,
          Finished: 1
        }
        this.updateGuide(query).then(res => {
          this.$router.push({ name: `${res.objectType}Detail`, params: { id: `${res.objectID}` } })
        })
      }
    },
    reloadGuide () {
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
.step-btn {
  min-width: 10rem;
}
.guide-step {
  background-color: $friend;
}
@media (max-width: $breakpoint-xs-max) {
  .step-btn {
    min-width: 8rem;
  }
}
</style>
