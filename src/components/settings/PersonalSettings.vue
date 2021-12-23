<!-- 个人设置 -->
<template>
  <q-list dense>
    <tw-separator
      left
      class="q-px-md"
    >
      <div class="text-bold q-my-sm">
        {{ $t("settings.personalSetting") }}
      </div>
    </tw-separator>
    <q-item
      clickable
      v-ripple
      @click="toMyProfile"
    >
      <q-item-section> {{ $t("settings.personalProfile") }}</q-item-section>
    </q-item>

    <!-- 修改密码 -->
    <q-item
      clickable
      v-ripple
      @click="show = true"
    >
      <q-item-section> {{ $t('settings.changePassword') }}</q-item-section>
    </q-item>

    <q-dialog v-model="show">
      <change-password :id="$myinfo.userId" />
    </q-dialog>

    <q-item
      v-if="!$q.platform.is.mobile && !$myinfo.auth.role.isOutsource"
      clickable
      v-ripple
      @click="$router.push({ name: 'mySettings' })"
    >
      <q-item-section> {{ $t("settings.personalSettings",{
        productDev:$t('productDev.title'),
        project:$t('project.title'),
        team:$t('team.title')
        }) }}</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      @click="logout"
    >
      <q-item-section> {{ $t("auth.logout") }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'PersonalSettings',
  data () {
    return {
      show: false
    }
  },
  components: {
    ChangePassword: () => import('components/profile/ChangePassword'),
    TwSeparator: () => import('components/base/TwSeparator')
  },
  methods: {
    toMyProfile () {
      this.$router.push({
        name: 'myProfile'
      })
    },
    logout () {
      this.$emit('toLogout')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
