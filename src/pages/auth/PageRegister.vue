<template>
  <div>
    <q-card-section>
      <q-banner
        inline-actions
        class="bg-grey-3"
      >
        <span class="text-h6">
          {{$t('auth.banner.register')}}
        </span>
        <template v-slot:action>
          <q-btn
            flat
            color="primary"
            :label="$t('auth.havingTrouble')"
            icon-right="help"
            @click='goToSupport()'
          />
        </template>
      </q-banner>
    </q-card-section>
    <q-card-section>
      <q-form
        v-if="!success"
        @submit="register"
      >
        <q-stepper
          v-model="step"
          header-nav
          flat
          ref="stepper"
          color="primary"
          animated
          :contracted="$q.screen.lt.sm"
        >
          <q-step
            :name="1"
            :title="$t('auth.createAccount')"
            icon="account_circle"
            :done="step > 1"
          >
            <div class="q-gutter-md">
              <q-input
                v-model="fields.userName"
                :rules="[ val => (val.length >=2&&val.length<=16) || $t('rule.userNamelength')]"
                lazy-rules
                :hint="$t('auth.hint.userName')"
                outlined
                :label="$t('auth.fields.userName')"
                stack-label
              />
              <q-input
                v-model="fields.password"
                :rules="[ val => val.length >= 6 || $t('rule.atleastNCharacters',{number:6})]"
                lazy-rules
                :type="isPwd ? 'password' : 'text'"
                outlined
                :label="$t('auth.fields.password')"
                stack-label
              > <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </q-step>

          <q-step
            :name="2"
            :title="$t('auth.contactInformation')"
            icon="settings_phone"
            :done="step > 2"
          >
            <div class="q-gutter-md">
              <!-- <q-input
                type="tel"
                v-model="fields.tel"
                :rules="[
                $rules.required($t('rule.fieldIsRequired')),
                $rules.minLength(11, $t('rule.pleaseEnterTheCorrectPhoneNumber')),
                $rules.maxLength(11, $t('rule.pleaseEnterTheCorrectPhoneNumber'))
                ]"
                lazy-rules
                outlined
                :label="$t('auth.fields.telephone')"
                :hint="$t('auth.hint.telephone')"
                stack-label
              /> -->
              <q-input
                type="tel"
                v-model="fields.tel"
                :rules="mobilePhoneRules()"
                lazy-rules
                outlined
                :label="$t('auth.fields.telephone')"
                :hint="$t('auth.hint.telephone')"
                stack-label
              />
              <tw-email
                v-model="fields.email"
                type="email"
                required
                :hint="$t('auth.hint.email')"
              ></tw-email>
            </div>
          </q-step>

          <q-step
            :name="3"
            :title="$t('auth.moreInfomation')"
            icon="assignment"
          >
            <div class="q-gutter-md">
              <q-input
                v-model="fields.jobNumber"
                outlined
                :rules="jobNumberRules"
                lazy-rules
                :label="$t('auth.fields.jobNumber')"
                :hint="$t('auth.hint.jobNumber')"
                stack-label
              />
              <q-input
                v-model="fields.organize"
                outlined
                :label="$t('auth.fields.organize')"
                :hint="$t('auth.hint.organize')"
                stack-label
              />
              <q-input
                v-model="fields.duty"
                outlined
                :label="$t('auth.fields.duty')"
                :hint="$t('auth.hint.duty')"
                stack-label
              />
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                class="full-width"
                color="primary"
                :outline="step !== 3"
                :label="step === 3 ? $t('auth.register') : $t('action.continue')"
                type="submit"
                size="lg"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
      <q-banner
        v-else
        class="bg-white text-negative"
      >
        <template v-slot:avatar>
          <q-icon
            name="free_breakfast"
            color="negative"
          />
        </template>
        {{$t('auth.success.registerSuccessfully')}}
      </q-banner>
    </q-card-section>
  </div>
</template>

<script>
import { mobilePhoneRules, jobNumberRules } from '@/utils/form-rules'
import { mapActions } from 'vuex'
export default {
  name: 'Register',
  components: {
    TwEmail: () => import('components/auth/TwEmail.vue')
  },
  data () {
    return {
      fields: {
        userName: '',
        password: '',
        telephone: '',
        email: '',
        jobNumber: '',
        organize: '',
        duty: ''
      },
      isPwd: true,
      step: 1,
      success: false
    }
  },
  methods: {
    ...mapActions('auth', ['registerUser']),
    mobilePhoneRules,
    jobNumberRules,
    register () {
      if (this.step < 3) {
        this.$refs.stepper.next()
      } else {
        this.registerUser(this.fields).then((success) => {
          this.success = success
        })
      }
    },
    goToSupport () {
      // this.$router.push('/support')
      window.open('/support')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
