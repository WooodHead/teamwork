<template>
  <q-input
    :value="value"
    v-on="inputListeners"
    :rules="[ val => val.length >= 6 || $t('rule.atleastNCharacters',{number:6})]"
    lazy-rules
    type="password"
    outlined
    :label="$t('auth.fields.password')"
    stack-label
  > <template v-slot:append>
      <q-btn
        to="/forgot-password"
        flat
        color="primary"
        :label="$t('auth.forgotPassword')"
      />
    </template>
  </q-input>
</template>

<script>
import inputListenters from '../../mixins/mixins-input-listeners'
export default {
  name: 'TwPassword',
  mixins: [inputListenters],
  props: {
    value: String
  }
}
</script>

<style>
</style>
