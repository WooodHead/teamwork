<template>
  <div>
    <q-card-section>
      <q-banner
        inline-actions
        class="bg-grey-3"
      >
        <span class="text-h6">
          {{$t('auth.resetYourPassword')}}
        </span>
      </q-banner>
    </q-card-section>
    <q-card-section>
      <q-form
        autofocus
        @submit.enter="submit"
        class="q-gutter-md"
      >
        <q-input
          v-model="fields.newPassword"
          :rules="[
          $rules.required($t('auth.youNeedToChooseAPassword')),
          $rules.minLength(6, $t('auth.yourPasswordMustBeAtLeastEightCharactersLong')),
          $rules.alphaNum($t('auth.yourPasswordMustBeAtLeastEightCharactersLong')),
          ]"
          lazy-rules
          :hint="$t('auth.atLeastEightCharactersWithAlphabetCharacterNumber')"
          outlined
          :label="$t('auth.enterANewPassword')"
          stack-label
          type="password"
        />
        <q-input
          v-model="fields.confirmPassword"
          :rules="[val => val===fields.newPassword|| $t('auth.thisDoesntMatchYourPassword')]"
          lazy-rules
          outlined
          :label="$t('auth.confirmYourPassword')"
          stack-label
          type="password"
        />
        <div>
          <q-btn
            class="full-width"
            :label="$t('auth.saveMyPassword')"
            type="submit"
            color="primary"
            size="lg"
          />
        </div>
      </q-form>
    </q-card-section>
  </div>

</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PageResetPassword',
  data () {
    return {
      fields: {
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    submit () {
      this.resetPassword({
        password: this.fields.newPassword,
        token: this.$route.query.token
      }).then(res => {
        res && this.$router.push('/')
      })
    }
  }
}
</script>

<style>
</style>
