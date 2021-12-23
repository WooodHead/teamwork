<template>
  <q-input
    :value="value"
    type="email"
    :label="label || $t('auth.fields.email')"
    :hint="hint"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :stack-label="stackLabel"
    v-on="inputListeners"
    :rules="[$rules.email($t('rule.validEmailAddress')),
    required?$rules.required($t('rule.validEmailAddress')):true]"
    lazy-rules
  />
</template>

<script>
import inputListenters from '@/mixins/mixins-input-listeners'

export default {
  name: 'TwEmail',
  mixins: [inputListenters],
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    stackLabel: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
