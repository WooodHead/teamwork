<template>
  <div>
    <q-card-section>
      <q-banner
        inline-actions
        class="bg-grey-3"
      >
        <span class="text-h6">
          {{$t('auth.banner.forgotPassword')}}
        </span>
        <template v-slot:action>
          <q-btn
            flat
            color="primary"
            :label="$t('auth.useVerificationCode')"
            icon-right="arrow_forward"
            :to="{name:'login', query: { useVerificationCode: true }}"
          />
        </template>
      </q-banner>
    </q-card-section>
    <q-card-section>
      <div
        v-if="error"
        class="text-body1 text-negative"
      >
        {{error}}
      </div>
      <q-form
        autofocus
        @submit.enter="submit"
        class="q-gutter-md"
      >
        <tw-email
          v-model="fields.email"
          type="email"
          required
          :hint="$t('auth.enterYourEmailAddress')"
        ></tw-email>
        <div>
          <q-btn
            class="full-width"
            :label="$t('auth.emailMeResetInstructions')"
            type="submit"
            color="primary"
            size="lg"
            :loading="loading"
          />
        </div>
        <q-separator />
        <div class="text-body1">
          <span class="text-weight-medium">{{$t('auth.ifYouDontSeeYourResetEmail')}}
          </span>{{$t('auth.beSureToCheckYourSpamFilter',{email:senderEmail})}}
        </div>
      </q-form>
    </q-card-section>
  </div>

</template>

<script>
import { mapActions } from 'vuex'
const { email } = require('app/app.config.js')
export default {
  name: 'ForgotPassword',
  components: {
    TwEmail: () => import('components/auth/TwEmail.vue')
  },
  data () {
    return {
      fields: {
        email: ''
      },
      error: undefined,
      loading: false,
      senderEmail: email
    }
  },
  methods: {
    ...mapActions('auth', ['sendResetPasswordEmail']),
    submit () {
      this.loading = true
      const that = this
      this.sendResetPasswordEmail(this.fields.email).then(error => {
        this.loading = false
        if (error.code) {
          that.error = that.$t(`auth.error.${error.userMessage}`)
        }
      })
    }
  }
}
</script>

<style></style>
