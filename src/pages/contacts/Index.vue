<template>
  <q-page>
    <!-- 子路由页面访问 -->
    <router-view />
    <!-- 悬浮菜单按钮 -->
    <q-page-sticky
      position="bottom-right"
      :offset="[50, 50]"
      v-if="$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist"
    >
      <q-fab
        icon="add"
        glossy
        direction="up"
        color="primary"
      >
        <q-fab-action
          @click="showSyncWXDialog = true"
          color="positive"
          icon="transform"
          :label="$t('wexin.syncWxUserInfo')"
          v-if="extranet"
        />
        <q-fab-action
          @click="addPerson"
          color="primary"
          icon="person_add"
          label="添加人员"
        />
      </q-fab>
    </q-page-sticky>
    <!-- 企业微信账号同步弹框 -->
    <q-dialog
      v-model="showSyncWXDialog"
      persistent
    >
      <div style="width:98vw;max-width:700px;">
        <sync-wx-user-info @closeDialog="showSyncWXDialog=false" />
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
const config = require('app/app.config.js')
export default {
  name: 'ContactsIndex',
  data () {
    return {
      extranet: config.extranet,
      showSyncWXDialog: false
    }
  },
  mounted () { },
  methods: {
    // 添加用户
    addPerson () {
      // 打开维护用户信息弹框
      this.$router.push({
        name: 'personEdit',
        params: { id: 0 }
      })
    }
  },
  components: {
    SyncWxUserInfo: () => import('components/person/SyncWxUserInfo')
  }
}
</script>

<style scoped lang="scss">
.wexin-sync .q-notification__caption {
  max-height: 300px;
  overflow-y: auto;
}
</style>
