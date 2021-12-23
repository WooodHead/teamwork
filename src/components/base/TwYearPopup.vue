<template>
  <q-popup-proxy
    ref="qDateProxy"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-date
      v-model="date"
      default-view="Years"
      minimal
      @click="setYear"
    />
  </q-popup-proxy>

</template>

<script>
export default {
  name: 'TwYearPopup',
  props: {
    year: { type: String, required: true }
  },
  computed: {
    date () {
      return `${this.year}/01/01`
    }
  },
  methods: {
    setYear (event) {
      const yearClicked = event.target.closest('.q-date__years-item') !== null
      if (yearClicked) {
        this.$emit('update:year', event.target.innerText)
        this.$refs.qDateProxy.hide()
      }
    }
  },
  mounted () {
    if (!this.year) {
      this.$emit('update:year', new Date().getFullYear().toString())
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
