<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      data-html2canvas-ignore
      class="print-hide"
    >
      <q-toolbar>
        <q-btn
          round
          icon="menu"
          flat
          dense
          class="q-btn-menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-btn
          flat
          dense
          no-caps
          stretch
          no-wrap
          :to="$route.path!='/'?'/':''"
          :title="$t('app.title')"
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
          <search-icon class="tour-focus-search" />
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
    <!-- 左侧面板 -->
    <q-drawer
      v-if="leftDrawerOpen"
      v-model="leftDrawerOpen"
      behavior="desktop"
      :breakpoint="767"
      :width="250"
      show-if-above
      bordered
      overlay
      content-class="bg-grey-1"
    >
      <q-scroll-area
        class="full-width full-height"
        :thumb-style="thumbStyle"
      >
        <navigation-menu v-if="leftDrawerOpen" />
      </q-scroll-area>
    </q-drawer>
    <!-- 右侧面板 -->
    <q-drawer
      side="right"
      v-if="rightDrawerOpen"
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
      <!-- <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        </router-view>
      </keep-alive>
      <router-view v-if=" !$route.meta.keepAlive" />
      <q-page-sticky
        v-if="!$q.platform.is.mobile"
        position="top-left"
        :offset="[4, 4]"
      >
        <q-btn
          flat
          dense
          title="后退"
          padding="none"
          icon="navigate_before"
          @click="goBack"
        />
        <q-btn
          flat
          dense
          title="前进"
          padding="none"
          icon="navigate_next"
          @click="goNext"
        />
      </q-page-sticky>
    </q-page-container>
    <!-- 在线反馈 -->
    <feedback-icon
      class="print-hide"
      data-html2canvas-ignore
      v-if="!$q.platform.is.mobile"
    />

    <q-dialog v-model="showHistoryCard">
      <history-list />
    </q-dialog>
  </q-layout>
</template>
<script>
import init from '@/utils/init'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Platform, LocalStorage } from 'quasar'
import im from '@/boot/im'
const config = require('app/app.config.js')
import htmlToImg from '@/utils/html-to-img'
export default {
  name: 'MainLayoutDesktop',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    NavigationMenu: () => import('components/navigation/NavigationMenu'),
    MessageIcon: () => import('components/message/MessageIcon.vue'),
    SearchIcon: () => import('components/search/SearchIcon.vue'),
    FeedbackIcon: () => import('components/feedback/FeedbackIcon.vue'),
    NotificationSettings: () => import('components/settings/NotificationSettings'),
    PersonalSettings: () => import('components/settings/PersonalSettings'),
    MessagePanel: () => import('components/message/MessagePanel.vue'),
    HistoryList: () => import('components/home/HistoryList')
  },
  data () {
    return {
      showHistoryCard: false,
      showScanResult: false,
      scanResult: {
        result: '',
        islink: false
      }
    }
  },
  computed: {
    ...mapState('layout', ['layout']),
    myInfo: () => {
      return LocalStorage.getItem('myself') || {}
    },
    leftDrawerOpen: {
      get () {
        return this.layout.leftDrawerOpen
      },
      set (value) {
        this.setLeftDrawerOpen(value)
      }
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
    ...mapActions('layout', ['setLeftDrawerOpen']),
    ...mapActions('materialCode', ['queryMaterialCode']),
    ...mapMutations('message', ['initMessagePanelFloat']),
    ...mapMutations('resource', ['setAllListStyle']),
    logout () {
      // 关闭websocket连接
      this.$socket.exit()
      // 清除人员状态定时器
      im.clearInterval()
      // 清空登陆信息
      this.logoutUser()
      if (!config.extranet ||
        !Platform.userAgent.toLowerCase().includes('micromessenger')) {
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
    },
    goHome () {
      this.$router.push('/')
    },
    goBack () {
      window.history.back()
    },
    goNext () {
      window.history.forward()
    },
    // 截图下载
    html2Img () {
      htmlToImg(this.$route.name)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
