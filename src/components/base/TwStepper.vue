<template>
  <q-stepper
    v-if="stepList.length"
    :alternative-labels="alternativeLabels"
    v-model="step"
    :class="{'mobile-stepper-padding':$q.screen.gt.sm}"
    color="primary"
    flat
  >
    <q-step
      v-for="item in stepList"
      :key="item.name"
      :name="item.name"
      :title="item.title"
      :icon="item.icon||orderStep['inactive'].icon"
      :caption="item.caption||''"
      :done="item.done||step>item.name"
      :active-color="item.activeColor||orderStep['active'].color"
      :active-icon="item.activeIcon||orderStep['active'].icon"
      :done-icon="item.doneIcon||orderStep['done'].icon"
      :done-color="item.doneColor||orderStep['done'].color"
    ></q-step>
  </q-stepper>
</template>
<script>
export default {
  name: 'TwStepper',
  props: {
    step: {
      type: Number,
      required: true,
      default: 0
    },
    stepList: {
      type: Array,
      required: true,
      default: () => []
    },
    alternativeLabels: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      orderStep: {
        inactive: {
          icon: 'assignment'
        },
        active: {
          icon: 'edit',
          title: this.$t('index.stepper.doing'), // 进行中
          color: 'primary'
        },
        done: {
          icon: 'done',
          title: this.$t('index.stepper.done'), // 已完成
          color: 'primary'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.mobile-stepper-padding.q-stepper__header--alternative-labels
  .q-stepper__tab,
/deep/.q-stepper__tab {
  min-height: 0;
  padding: 0;
}
.stepper-nocontent /deep/.q-stepper__content {
  display: none;
}
</style>
