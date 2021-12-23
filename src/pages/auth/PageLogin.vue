<template>
  <div>
    <q-card-section>
      <q-banner
        inline-actions
        class="bg-grey-3"
      >
        <span class="text-h6">
          {{$t('auth.banner.login')}}
        </span>
        <template v-slot:action>
          <q-btn
            flat
            @click="changeLoginType()"
            color="primary"
            :label=" fields.type === 'pwd' ?
             $t('auth.useVerificationCode'):
             $t('auth.usePassword')"
            :icon-right="fields.type === 'pwd' ? 'email':'vpn_key'"
          />
        </template>
      </q-banner>
    </q-card-section>
    <q-card-section>
      <q-form
        autofocus
        @submit.enter="login"
        class="q-gutter-md"
      >
        <q-input
          v-model="fields.userName"
          :rules="fields.type==='sms'?mobilePhoneRules():[val => !!val || $t('rule.fieldIsRequired')]"
          outlined
          :label="fields.type==='sms'?`${$t('auth.fields.telephone')}`:`${$t('auth.fields.userName')}/${$t('auth.fields.telephone')}/${$t('auth.fields.email')}`"
          stack-label
          ref="input"
        />

        <tw-password
          v-if="fields.type==='pwd'"
          v-model="fields.password"
        />

        <tw-verification-code
          v-else
          v-model="fields.password"
          @send="send"
        />
        <div class="column q-gutter-md">
          <q-btn
            class="full-width"
            :label="$t('auth.login')"
            type="submit"
            color="primary"
            size="lg"
            :loading="loading"
          />
          <q-btn
            to='/register'
            class="full-width"
            :label="$t('auth.register')"
            type="submit"
            outline
            color="primary"
            size="lg"
          />
        </div>
      </q-form>
    </q-card-section>
  </div>
</template>

<script>
import { mobilePhoneRules } from '@/utils/form-rules'
import { Platform } from 'quasar'
import { mapActions } from 'vuex'
import { getLocalIp, getPublicIp, getCity } from '@/utils/get-ip'
// const address = require('address')
// const localIpUrl = require('local-ip-url')
const config = require('app/app.config.js')
export default {
  name: 'PageLogin',
  components: {
    TwPassword: () => import('components/auth/TwPassword.vue'),
    TwVerificationCode: () => import('components/auth/TwVerificationCode.vue')
  },
  data () {
    return {
      fields: {
        userName: '',
        password: '',
        type: this.$route.query.useVerificationCode ? 'sms' : 'pwd'
      },
      platform: Platform,
      loading: false,
      ip: '',
      city: ''
    }
  },
  mounted () {
    if (config.extranet) {
      this.ip = getPublicIp()
      this.city = getCity()
    } else {
      getLocalIp((ip) => {
        this.ip = ip
      })
      this.city = getCity()
    }
  },
  methods: {
    ...mapActions('auth', ['loginUser', 'sendVerificationCode']),
    mobilePhoneRules,
    login () {
      this.loading = true
      // console.log(err, addrs.ip, addrs.ipv6, addrs.mac)
      // '192.168.0.2', 'fe80::7aca:39ff:feb0:e67d', '78:ca:39:b0:e6:7d'
      const platform = {
        terminal: Platform.is.desktop ? 'desktop' : (Platform.is.iphone ? 'iphone' : (Platform.is.ipad ? 'ipad' : (Platform.is.mobile ? 'mobile' : ''))),
        os: Platform.is.platform,
        browser: Platform.is.name
      }
      this.loginUser({
        platform: platform,
        address: { ip: this.ip, city: this.city },
        ...this.fields
      }).then(
        res => {
          this.loading = false
          res.isOK && this.$router.push(this.$route.query.redirect || '/')
        }
      )
    },
    send () {
      this.sendVerificationCode(this.fields.userName)
    },
    changeLoginType () {
      this.fields.type = this.fields.type === 'pwd' ? 'sms' : 'pwd'
      this.fields.userName = this.fields.password = ''
      this.$refs.input.focus()
      this.$refs.input.resetValidation()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
