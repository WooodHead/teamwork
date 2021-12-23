<template>
  <div class="text-center q-pa-xl">
    <div v-if="isLoginFail">
      <div class="text-left q-py-lg text-grey-7 text-bold">{{failMsg}}，{{$t('auth.YouCan')}}：</div>
      <div class="text-left q-my-md">1. {{$t('auth.TryRecontactingYourSystemAdministrator')}}</div>
      <div class="text-left q-my-md">2.
        <q-btn
          outline
          color="primary"
          :label="$t('auth.TryAgain')"
          @click="retryWxLogin"
        />
        {{$t('auth.or')}}
        <q-btn
          color="primary"
          :label="$t('auth.NormalLogin')"
          @click="normalLogin"
        />
      </div>
    </div>
    <div v-else>
      <q-spinner-facebook
        color="grey-4"
        size="6em"
      />
      <div class="q-py-lg text-grey-7 text-bold">企业微信认证登录中，请稍后...</div>
    </div>
  </div>
</template>

<script>
import { Platform } from 'quasar'
import { getPublicIp, getCity } from '@/utils/get-ip'
import { mapActions } from 'vuex'
import { wechatAuthUrl } from '@/utils/wechat.js'
export default {
  name: 'PageWxLogin',
  data () {
    return {
      isLoginFail: false, // 是否登录失败
      failMsg: '' // 登录失败原因
    }
  },
  mounted () {
    // 微信认证登录
    this.wxLoginAuth()
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        newVal.name === 'wxlogin' && this.wxLoginAuth()
      }
    }
  },
  methods: {
    ...mapActions('auth', ['loginUser']),
    // 重新尝试
    retryWxLogin () {
      window.location.href = wechatAuthUrl(this.$route.query.state)
    },
    // 普通登录
    normalLogin () {
      let that = this
      that.$router.push({
        path: '/login',
        query: { redirect: that.$route.query.state || '/' }
      })
    },
    // 微信认证登录
    wxLoginAuth () {
      let that = this
      let platform = {
        terminal: Platform.is.desktop ? 'desktop' : (Platform.is.iphone ? 'iphone' : (Platform.is.ipad ? 'ipad' : (Platform.is.mobile ? 'mobile' : ''))),
        os: Platform.is.platform,
        browser: Platform.is.name
      }
      that.loginUser({
        type: 'wx',
        wxcode: that.$route.query.code,
        platform: platform,
        address: { ip: getPublicIp(), city: getCity() }
      }).then(function (res) {
        if (res.isOK) {
          that.$router.push(that.$route.query.state || '/')
        } else {
          that.isLoginFail = true
          that.failMsg = res.message
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
