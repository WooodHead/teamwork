<template>
  <div class="bg-grey-3 my-height q-gutter-y-sm">
    <!-- 个人信息 -->
    <q-card
      @click="$router.push({ name: 'myProfile' })"
      class="no-shadow no-border bg-white"
    >
      <q-card-section horizontal>
        <q-card-section
          class="col-4 flex justify-start items-start"
          style="width:106px"
        >
          <tw-avatar
            size="90px"
            :id="person.id"
            :name="person.name"
            :img="person.img"
          />
        </q-card-section>

        <q-card-section class="col q-pt-md">
          <div class="text-subtitle">{{person.orgShortName}}</div>
          <div class="text-h5 q-py-sm">{{person.name}}</div>
          <div class="text-caption text-grey">{{person.jobNumber}}</div>
          <div class="text-caption text-grey">{{person.dutyName}}</div>
        </q-card-section>
        <q-card-section class="col-1 flex justify-end items-center">
          <q-icon
            size="sm"
            dense
            name="chevron_right"
            color="grey"
          />
        </q-card-section>
      </q-card-section>
    </q-card>
    <!-- 设置 -->
    <q-list
      no-border
      class="bg-white"
    >
      <q-item
        clickable
        v-ripple
        @click="$router.push({ name: 'myNotificationSettings' })"
      >
        <q-item-section avatar>
          <q-icon
            name="notifications_none"
            color="primary"
          />
        </q-item-section>
        <q-item-section>通知设置</q-item-section>
        <q-item-section side>
          <q-icon
            dense
            name="chevron_right"
            color="grey"
          />
        </q-item-section>
      </q-item>
      <q-separator
        inset="item"
        class="my-q-separator"
      />
      <q-item
        clickable
        v-ripple
        @click="$router.push({ name: 'mySettings' })"
      >
        <q-item-section avatar>
          <q-icon
            name="favorite_border"
            color="primary"
          />
        </q-item-section>
        <q-item-section>偏好设置</q-item-section>
        <q-item-section side>
          <q-icon
            dense
            name="chevron_right"
            color="grey"
          />
        </q-item-section>
      </q-item>
      <q-separator
        inset="item"
        class="my-q-separator"
      />

      <q-item
        clickable
        v-ripple
        @click="$router.push({ name: 'changePassword' })"
      >
        <q-item-section avatar>
          <q-icon
            name="lock_outline"
            color="primary"
          />
        </q-item-section>
        <q-item-section>修改密码</q-item-section>
        <q-item-section side>
          <q-icon
            dense
            name="chevron_right"
            color="grey"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 其他 -->
    <q-list
      no-border
      class="bg-white"
    >
      <q-item
        clickable
        v-ripple
        @click="openURL(helpURL)"
      >
        <q-item-section avatar>
          <q-icon
            name="help_outline"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>用户手册</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon
            dense
            name="chevron_right"
            color="grey"
          />
        </q-item-section>
      </q-item>
      <q-separator
        inset="item"
        class="my-q-separator"
      />

      <q-item
        clickable
        v-ripple
        @click="feedback"
      >
        <q-item-section avatar>
          <q-icon
            name="chat_bubble_outline"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>在线反馈</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon
            dense
            name="chevron_right"
            color="grey"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <!-- 系统设置 -->
    <q-list
      no-border
      class="bg-white"
      v-if="$myinfo.auth.role.isSystemAdministrator"
    >
      <q-item
        clickable
        v-ripple
        @click="$router.push({ name: 'settings' })"
      >
        <q-item-section avatar>
          <q-icon
            name="settings"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>系统设置</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon
            dense
            name="chevron_right"
            color="grey"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <!-- 退出登录 -->
    <div>
      <q-btn
        class="full-width bg-white q-py-sm"
        flat
        label="退出登录"
        @click="logout"
      />
    </div>
    <!-- 在线反馈 -->
    <feedback-icon data-html2canvas-ignore />
  </div>
</template>

<script>
import { Platform, LocalStorage, openURL } from 'quasar'
import { mapActions, mapMutations } from 'vuex'
import im from '@/boot/im'
const config = require('app/app.config.js')
export default {
  name: 'PageMe',
  data () {
    return {
      person: LocalStorage.getItem('myself'),
      helpURL: config.thirdpartyApp.help
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    FeedbackIcon: () => import('components/feedback/FeedbackIcon.vue')
  },
  methods: {
    openURL: openURL,
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('feedback', ['setIsVisible']),
    ...mapMutations('layout', ['setFooterVisible']),
    logout () {
      // 关闭websocket连接
      this.$socket.exit()
      // 清除人员状态定时器
      im.clearInterval()
      // 清空登陆信息
      this.logoutUser()
      // 清空缓存中的tab激活项
      LocalStorage.set('nowActivateTab', 'home')
      if (!config.extranet ||
        !Platform.userAgent.toLowerCase().includes('micromessenger')) {
        // 回到登陆页面
        this.$router.push('/login')
      } else {
        // 关闭微信浏览器窗口
        wx.closeWindow()
      }
    },
    feedback () {
      this.setFooterVisible(false)
      this.setIsVisible(true)
    }
  }
}
</script>

<style scoped>
.q-item__section--side {
  min-width: auto;
}
.my-height {
  height: calc(100vh - 56.0167px);
}
.my-q-separator {
  margin-left: 55px;
  margin-right: 0;
}
</style>
