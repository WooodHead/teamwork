<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          no-caps
          stretch
          no-wrap
          :to="$route.name!=='myManufacturerDetail'?{name:'myManufacturerDetail'}:''"
        >
          <img
            v-if="$custom.logoInToobarWithName"
            :src="$logo['favicon-with-name-white.svg']"
            style="height: 42px; width: 172px;"
          />
          <template v-else>
          <q-icon
            class="no-pointer-events"
            :name="`img:${$logo['favicon-in-toolbar.png']}`"
          />
          <q-toolbar-title class="mobile-hide">{{$t('app.logo')}}</q-toolbar-title>
          </template>
        </q-btn>
        <q-space />
        <div class="q-gutter-md row items-center">
          <message-icon />
          <q-btn
            dense
            flat
            round
          >
            <tw-avatar
              size="md"
              :id="myInfo.id"
              :name="myInfo.name"
              :img="myInfo.img"
              :popupCard="false"
            />
            <!-- 个人设置 -->
            <q-menu>
              <q-list>
                <q-item>
                  <q-item-section>
                    <notification-settings style="max-width: 21rem;" />
                  </q-item-section>
                </q-item>
              </q-list>
              <personal-settings v-on:toLogout="logout" />
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <!-- 右侧面板 -->
    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      :breakpoint="767"
      :width="450"
      bordered
      no-swipe-open
      content-class="bg-white"
    >
      <q-scroll-area
        class="full-width full-height"
        :thumb-style="thumbStyle"
      >
        <message-panel />
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </q-page-container>

    <!-- 在线反馈 -->
    <feedback-icon v-if="!$q.platform.is.mobile" />
  </q-layout>
</template>

<script>
import init from '@/utils/init'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Platform, LocalStorage } from 'quasar'
import Vue from 'vue'
import im from '@/boot/im'
const config = require('app/app.config.js')
export default {
  name: 'OutsourceLayout',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    MessageIcon: () => import('components/message/MessageIcon.vue'),
    FeedbackIcon: () => import('components/feedback/FeedbackIcon.vue'),
    NotificationSettings: () => import('components/settings/NotificationSettings'),
    PersonalSettings: () => import('components/settings/PersonalSettings'),
    MessagePanel: () => import('components/message/MessagePanel.vue')
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('layout', ['layout']),
    myInfo: () => {
      var myinfo = LocalStorage.getItem('myself') || {}
      Vue.prototype.$myinfo = myinfo
      return myinfo
    },
    rightDrawerOpen () {
      return this.layout.rightDrawerOpen
    },
    // 左侧菜单右边滑动滚动条的样式修改
    thumbStyle () {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#cccccc',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  created () {
    init.call(this)
  },
  mounted () {
    this.initResourceListStyle()
    // 消息面板浮动或停靠
    this.initMessagePanelFloat()
    // 显示最近历史访问列表
    this.keyCodeForEvent()
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('message', ['initMessagePanelFloat']),
    ...mapMutations('resource', ['setAllListStyle']),
    goHome () {
      this.$router.push('/outsource/mine')
    },
    logout () {
      // 关闭websocket连接
      this.$socket.exit()
      // 清除人员状态定时器
      im.clearInterval()
      // 清空登陆信息
      this.logoutUser()
      if (!config.extranet || Platform.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
        // 回到登陆页面
        this.$router.push('/login')
      } else {
        // 关闭微信浏览器窗口
        wx.closeWindow()
      }
    },
    // ctrl + j 显示历史访问列表
    keyCodeForEvent () {
      let _this = this
      let codeCtrl = 0
      let codeJ = 0
      document.onkeydown = function (e) {
        let evn = e || event
        let key = evn.keyCode || evn.which || evn.charCode
        if (key === 17) {
          codeCtrl = 1
        }
        if (key === 74) {
          codeJ = 1
        }
        if (codeCtrl === 1 && codeJ === 1) {
          e.preventDefault()
          _this.showHistoryCard = true
          codeCtrl = 0
          codeJ = 0
        }
      }
      document.onkeyup = function (e) {
        if (e.keyCode === 17) {
          codeCtrl = 0
        }
        if (e.keyCode === 74) {
          codeJ = 0
        }
      }
    },
    // 初始化资源偏好视图，如果是表格视图，在移动端强制显示为卡片视图
    initResourceListStyle () {
      let localSettings = this.$q.localStorage.getItem('mysettings')
      let myLocalSettings = localSettings && localSettings[this.$q.localStorage.getItem('myself').id]

      // 如果做了偏好设置，则统一修改资源视图，如果未做偏好设置，则不做任何操作
      if (myLocalSettings && myLocalSettings.listStyle) {
        let myLocalListStyle = myLocalSettings.listStyle === 'showtable' && this.$q.platform.is.mobile
          ? 'showcards'
          : myLocalSettings.listStyle
        this.setAllListStyle(myLocalListStyle)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
