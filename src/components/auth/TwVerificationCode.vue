<template>
  <q-input
    :value="value"
    v-on="inputListeners"
    ref="verificationCode"
    :rules="[ val => val.length === 6 || $t('rule.verificationCodeInYourLatestSms')]"
    lazy-rules
    outlined
    :label="$t('auth.fields.verificationCode')"
    stack-label
  > <template v-slot:append>
      <q-btn
        @click="getVerificationCode"
        flat
        color="primary"
        :loading="loading"
        :percentage="percentage"
      >
        {{$t('auth.getVerificationCode')}}
        <template v-slot:loading>
          {{$t('auth.gettingVerificationCode',{second:percentage})}}
        </template></q-btn>
    </template>
  </q-input>
</template>

<script>
import inputListenters from '@/mixins/mixins-input-listeners'

export default {
  name: 'TwVerificationCode',
  mixins: [inputListenters],
  data () {
    return {
      loading: false,
      percentage: 60
    }
  },
  props: {
    value: String
  },
  methods: {
    getVerificationCode () {
      this.loading = true
      this.percentage = 60
      this.interval = setInterval(() => {
        this.percentage -= 1
        if (this.percentage <= 0) {
          clearInterval(this.interval)
          this.loading = false
          this.percentage = 60
        }
      }, 1000)
      this.$emit('send')
      this.value = ''
      this.$refs.verificationCode.focus()
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style>
</style>
