<template>
  <div v-if="control">
    <q-select
      :value="value"
      :option-value="optionValue"
      :option-label="optionLabel"
      @input="changeSelector"
      :multiple="control.config.contact.type==='multi'"
      :options="control.config.contact.options"
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
  name: 'TwApprovalContact',
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
    value () {
      return this.control.config.contact.mode === 'department'
        ? (this.control.config.contact.type === 'single' ? this.control.property.value.departments[0] : this.control.property.value.departments)
        : (this.control.config.contact.type === 'single' ? this.control.property.value.members[0] : this.control.property.value.members)
    },
    optionValue () {
      return item =>
        this.control.config.contact.mode === 'department'
          ? ((item && item.openapi_id) ? item.openapi_id : null)
          : ((item && item.userid) ? item.userid : null)
    },
    optionLabel () {
      return item => (item && item.name) ? item.name : null
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    changeSelector (options) {
      if (this.control.config.contact.type === 'single') {
        if (this.control.config.contact.mode === 'department') this.control.property.value.departments = [options]
        else this.control.property.value.members = [options]
      } else {
        if (this.control.config.contact.mode === 'department') this.control.property.value.departments = options
        else this.control.property.value.members = options
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
</style>
