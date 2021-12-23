<!-- 个人简介设置 -->
<template>
  <q-page>
    <tw-form
      @primary="saveMyChanges"
      :title="'个人资料'"
    >
      <!-- 头像 -->
      <div class="column items-center q-mb-lg">
        <avatar-crop
          size="8rem"
          :img-src.sync="model.img"
          @updateAvatar="updateAvatar"
        />
      </div>

      <!-- 姓名 -->
      <q-input
        filled
        v-model="model.name"
        :label="$t('auth.fields.userName')"
        lazy-rules
        :rules="[ val => val && val.trim().length > 0 || $t('rule.fieldIsRequired')]"
      />

      <q-input
        filled
        v-model="model.jobNumber"
        :label="$t('auth.fields.jobNumber')"
        disable
        lazy-rules
        :rules="['']"
      />

      <!-- 手机号 -->
      <q-input
        type="tel"
        v-model="model.phone"
        :rules="[
                $rules.minLength(11, $t('rule.pleaseEnterTheCorrectPhoneNumber')),
                $rules.maxLength(11, $t('rule.pleaseEnterTheCorrectPhoneNumber'))
                ]"
        lazy-rules
        filled
        :label="$t('auth.fields.telephone')"
        :hint="$t('auth.hint.telephone')"
      />

      <!-- 邮箱 -->
      <tw-email
        :filled="true"
        required
        v-model="model.email"
        :hint="$t('auth.hint.email')"
      ></tw-email>
    </tw-form>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import setMyinfo from '@/utils/local-storage-myinfo'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'MyProfile',
  inject: ['reload'],
  components: {
    TwEmail: () => import('components/auth/TwEmail.vue'),
    AvatarCrop: () => import('components/profile/AvatarCrop'),
    TwForm: () => import('components/base/TwForm')

  },
  data () {
    return {
      submitting: false,
      model: LocalStorage.getItem('myself'),
      show: false
    }
  },

  methods: {
    ...mapActions('person', ['loadPerson', 'updatePerson', 'updatePersonField']),
    ...mapActions('auth', ['updateUser']),
    updateAvatar (avatar) {
      this.updatePersonField({
        id: this.model.id,
        fieldName: 'img',
        value: avatar
      }).then(res => {
        setMyinfo(res)
        this.reload()
      })
    },

    saveMyChanges () {
      this.submitting = true
      // let that = this
      let user = {
        userName: this.model.name,
        email: this.model.email,
        tel: this.model.phone,
        userId: this.model.userId
      }
      this.updateUser(user).then(res => {
        if (res) {
          // 调用人员后台维护接口
          this.updatePerson(this.model).then(res => {
            this.submitting = false
            setMyinfo(this.model)
            showSuccessMessage(this.$t(`settings.settingSucceed`))
            this.$q.platform.is.mobile && window.history.back()
          })
        }
      })
    }
  }
}

</script>

<style lang='scss' scoped>
.profile-password {
  color: #1b6ac9;
}
.profile-password:hover {
  text-decoration: none;
  cursor: pointer;
}
</style>
