<template>
  <div>
    <tw-stepper
      :step="+model.status"
      :alternativeLabels="!$q.screen.gt.sm"
      :stepList="stepList"
    />
    <div
      class="flex justify-center q-pt-md q-gutter-x-md"
    >
      <q-btn
        outline
        rounded
        label="生产"
        color="indigo"
        @click="$router.push({name:allocations.length===0?'allocationAdd':'allocation',params:{category:'order',objectID:model.id}})"
      />
      <q-btn
        outline
        rounded
        label="发货"
        color="accent"
        @click="statusChange(202)"
      />
      <q-btn
        outline
        rounded
        label="结单"
        color="positive"
        @click="statusChange(602)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderStepper',
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    stepList: {
      get () {
        return this.$store.getters['order/statusFlow']({ arrStatusFlow: this.model.statusFlow, currStatus: this.model.status })
      }
    },
    allocations: {
      get () {
        return this.$store.getters['allocation/allocations']({ category: 'order', objectID: this.model.id, currentRouteName: 'allocation' })
      }
    }
  },
  mounted () {

  },
  methods: {
    statusChange (status) {
      this.$store.dispatch('order/updateStatus', { id: +this.model.id, status })
    }
  },
  watch: {
    step: {
      handler () {

      }
    }
  },
  components: {
    TwStepper: () => import('components/base/TwStepper')
  }
}
</script>

<style scoped lang="scss">
</style>
