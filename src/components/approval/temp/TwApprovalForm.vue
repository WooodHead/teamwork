<template>
  <div v-if="property&&property.formFields">
    <component
      v-for="control in property.formFields.template_content.controls"
      :key="control.id"
      :is="allApprovalTemps[`TwApproval${control.property.control}`]"
      :control.sync="control"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
    />
  </div>
</template>

<script>
import allApprovalTemps from './index'
export default {
  name: 'TwApprovalForm',
  props: {
    property: {
      type: Object,
      require: true,
      default: () => { }
    },
    filled: {
      type: Boolean,
      require: false,
      default: false
    },
    outlined: {
      type: Boolean,
      require: false,
      default: false
    },
    borderless: {
      type: Boolean,
      require: false,
      default: false
    },
    clearable: {
      type: Boolean,
      require: false,
      default: false
    },
    hideBottomSpace: {
      type: Boolean,
      require: false,
      default: false
    },
    rounded: {
      type: Boolean,
      require: false,
      default: false
    },
    square: {
      type: Boolean,
      require: false,
      default: false
    },
    dense: {
      type: Boolean,
      require: false,
      default: false
    },
    itemAligned: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data () {
    return {
      allApprovalTemps
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {},
  components: {}
}
</script>

<style scoped lang="scss">
</style>
