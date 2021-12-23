<template>
  <div v-if="control">
    <q-select
      :value="control.config.selector.type==='single'?control.property.value.selector.options[0]:control.property.value.selector.options"
      :option-value="item=>(item&&item.key)?item.key:null"
      :option-label="item=>(item&&item.value&&item.value.length)?item.value[0].text:null"
      @input="changeSelector"
      :multiple="control.config.selector.type==='multi'"
      :options="control.config.selector.options"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
      :label="control.property.title[0].text"
      :lazy-rules="!!control.property.require"
      :rules="!!control.property.require?[ val => val && String(val).length > 0 || control.property.placeholder[0].text]:[]"
    />
  </div>
</template>

<script>
export default {
  name: 'TwApprovalSelector',
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
    return {}
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
    changeSelector (options) {
      if (this.control.config.selector.type === 'single') {
        this.control.property.value.selector.options = [options]
      } else {
        this.control.property.value.selector.options = options
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
</style>
