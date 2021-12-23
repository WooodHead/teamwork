<template>
  <tw-form
    :title="$t('settings.changePassword')"
    @primary="savePassword"
  >
    <q-card class="no-border no-shadow">
      <q-card-section
        class="password-header"
        v-if="!$q.platform.is.mobile"
      >
        <div class="text-h6">{{$t('settings.changePassword')}}</div>
      </q-card-section>

      <!--新密码 -->
      <q-card-section class="q-pt-none">
        <q-input
          outlined
          v-model="newPassword"
          :label="$t('settings.passWord')"
          lazy-rules
          :rules="newPasswordRules"
        />
      </q-card-section>

      <!--确认密码 -->
      <q-card-section class="q-pt-none">
        <q-input
          outlined
          v-model="confirmPassWord"
          :label="$t('settings.confirmPassWord')"
          lazy-rules
          :rules="configPasswordRules"
        />
      </q-card-section>
    </q-card>
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  props: {
    id: {
      type: Number,
      default: 0,
      required: true
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm')
  },
  data () {
    return {
      confirmPassWord: '',
      newPassword: ''
    }
  },

  computed: {
    // 密码校验
    newPasswordRules: function () {
      return [
        val => {
          // 正则: 6~12位数字+字母组合
          const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,12}$/
          if (val === '' || val === null) {
            return '请输入密码'
          } else if (val.length < 6 || val.length > 12) {
            return '请输入6~12位密码'
          } else if (reg.test(val)) {
            return true
          } else {
            return '密码必须由数字和字母组成'
          }
        }
      ]
    },

    // 确认密码校验
    configPasswordRules: function () {
      return [
        val => (val !== null && val !== '') || '确认密码不能为空',
        val => {
          if (this.newPassword !== val) {
            return '密码和确认密码应相同'
          } else {
            return true
          }
        }
      ]
    }
  },

  methods: {
    ...mapActions('auth', ['updatePassword']),
    savePassword () {
      let user = {
        userId: this.id,
        password: this.newPassword
      }
      this.updatePassword(user).then(() => {
        showSuccessMessage('密码修改成功！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.password-header {
  display: flex;
  justify-content: center;
}
</style>
