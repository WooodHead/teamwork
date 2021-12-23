<template>
  <transition
    appear
    enter-active-class="animated slideInLeft"
  >
    <q-card class="row items-center justify-center guide-helper">
      <q-card-section class="row items-center justify-center">
        <p :class="['col-12', 'text-white', 'text-subtitle1', 'text-weight-bold', 'text-center', 'q-px-lg', 'q-my-none', {'q-pt-md': $q.screen.gt.xs}]">{{guideContent.title}}</p>
        <p
          v-if="guideContent.subtitle"
          class="col-12 text-white q-my-none text-subtitle2 text-center q-px-lg"
        >{{guideContent.subtitle}}</p>
        <q-btn
          v-for="(btn, index) in guideContent.label"
          :key="index"
          rounded
          unelevated
          :color="btn === 'no' ? '' : 'white'"
          :text-color="btn === 'no' ? 'white' : 'black'"
          :label="$t(`guide.helper.btns.${btn}`)"
          :class="['col-8', {'q-mb-sm': index === 0}, {'no-guide-btn': btn === 'no'}, {'q-mt-md': index === 0}]"
          @click="setGuideStatus(btn)"
        ></q-btn>
      </q-card-section>
    </q-card>
  </transition>
</template>

<script>
import { i18n } from '@/boot/i18n'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'GuideHelper',
  props: {
    model: { type: Object, required: true },
    category: { type: String, required: true },
    objectID: { type: [String, Number], required: true },
    categoryModel: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState('guide', ['guideCategoryStep']),
    guideContent () {
      // 按钮的四种状态 ['yes', 'no', 'ok', 'finish']
      if (this.model.needed && !this.model.finished && this.model.step === 0) {
        let categoryName
        switch (this.category) {
          case 'team':
            categoryName = '团队'
            break
          case 'project':
            categoryName = '项目'
            break
          case 'organize':
            categoryName = '机构'
            break
        }
        return {
          title: i18n.t(`guide.helper.title.start`, { category: categoryName }),
          subtitle: '',
          label: ['yes', 'no']
        }
      } else if (this.model.needed && !this.model.finished && this.model.step > 0) {
        return {
          title: i18n.t(`guide.helper.title.halfway`),
          subtitle: '',
          label: ['finish', 'no']
        }
      } else {
        return {
          title: i18n.t(`guide.helper.title.end`),
          subtitle: i18n.t(`guide.helper.subtitle.end`),
          label: ['ok']
        }
      }
    }
  },
  methods: {
    ...mapActions('guide', ['updateGuide']),
    setGuideStatus (btn) {
      if (btn === 'no') {
        // 不需要引导
        let query = {
          ObjectID: this.objectID,
          ObjectType: this.category,
          finished: 1
        }
        this.updateGuide(query)
      } else if (btn === 'yes') {
        // 开始设置，跳转至引导的第一步
        let query = {
          ObjectID: this.objectID,
          ObjectType: this.category,
          step: 1
        }
        this.updateGuide(query)
        this.$router.push(`${this.objectID}/guide/${this.guideCategoryStep[0].name}`)
      } else if (btn === 'finish') {
        // 跳转至上次设置的地方
        this.$router.push(`${this.objectID}/guide/${this.guideCategoryStep[+(this.model.step - 1)].name}`)
      } else if (btn === 'ok') {
        // 完成整个项目引导流程
        this.$emit('hiddenHelper')
        let query = {
          ObjectID: this.objectID,
          ObjectType: this.category,
          Needed: 0,
          finished: 1
        }
        this.updateGuide(query)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.guide-helper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  margin: 1.2rem;
  background-color: $friend;
}
.no-guide-btn {
  background-color: rgba($color: #000000, $alpha: 0.2);
}
@media (max-width: $breakpoint-xs-max) {
  .guide-helper {
    width: 100%;
    height: auto;
    margin: 0;
    border-radius: 0%;
  }
}
</style>
