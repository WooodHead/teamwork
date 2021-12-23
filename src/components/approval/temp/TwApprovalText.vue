<template>
  <div v-if="control">
    <q-input
      :value="control.property.value.text"
      @input="changeValue"
      :label="control.property.title[0].text"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
      :lazy-rules="!!control.property.require"
      :rules="!!control.property.require?[ val => val && String(val).length > 0 || control.property.placeholder[0].text ]:null"
    />
  </div>
</template>

<script>
export default {
  name: 'TwApprovalText',
  props: {
    control: {
      type: Object,
      require: true,
      default: null
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

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    changeValue (val) {
      this.control.property.value.text = val
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
</style>
