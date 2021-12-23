<template>
  <div>
    <!-- 拖拽 -->
    <q-page-sticky
      v-if="!$q.platform.is.mobile"
      position="bottom-right"
      :offset="fabPos"
      class="feedback-btn"
      @click="ToggleIcon"
    >
      <q-fab
        :icon="isVisible?'highlight_off':'help_outline'"
        class="fixed-bottom-right feedback-icon tour-focus-feedback"
        size="45px"
        v-touch-pan.prevent.mouse="moveFab"
        :disable="draggingFab"
      >
      </q-fab>
    </q-page-sticky>

    <div
      v-show="isVisible"
      class="fixed-bottom-right"
      :class="{'noscroll':newScroll,'question-content':!$q.platform.is.mobile,'m-question-content':$q.platform.is.mobile}"
    >
      <div :class="$q.platform.is.mobile?'m-feedback-home':'feedback-home'">
        <q-tabs
          v-model="tab"
          inline-label
          indicator-color="transparent"
          class="text-white question-tab"
        >
          <q-tab
            name="questions"
            icon="help"
            :label="$t('feedback.question')"
            class="q-mr-sm"
          />
          <q-tab
            name="ask"
            icon="chat_bubble"
            :label="$t('feedback.ask')"
          />
          <q-icon
            class="close-feedback"
            :class="{'m-close-feedback':$q.platform.is.mobile}"
            name="close"
            @click="CloseIcon"
          />
        </q-tabs>
        <!-- 常见问题和提问 -->
        <q-tab-panels
          v-model="tab"
          animated
          class="my-tab-panels"
        >
          <!-- 常见问题 -->
          <q-tab-panel name="questions">
            <question-panel />
          </q-tab-panel>
          <!-- 提问 -->
          <q-tab-panel name="ask">
            <ask-panel @scroll="Scroll($event)" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <!-- 历史消息 -->
      <transition name="slide">
        <message-list
          v-if="messageState"
          @scroll="Scroll($event)"
        />
      </transition>
      <!-- 聊天室 -->
      <transition name="slide">
        <chat-room
          v-if="roomState"
          @scroll="Scroll($event)"
        />
      </transition>
    </div>

    <div
      v-if="isVisible && $q.screen.lt.sm"
      class="fullscreen"
      @click="CloseIcon"
      style="background-color: rgba(0, 0, 0, 0.4); z-index: 2005;"
    >
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'FeedbackIcon',
  components: {
    'question-panel': () => import('components/feedback/QuestionPanel.vue'),
    'ask-panel': () => import('components/feedback/AskPanel.vue'),
    'message-list': () => import('components/feedback/MessageList.vue'),
    'chat-room': () => import('components/feedback/ChatRoom.vue')
  },
  data () {
    return {
      tab: 'questions',
      newScroll: false,
      // 拖拽
      fabPos: [18, 18],
      draggingFab: false
    }
  },
  computed: {
    ...mapState('file', ['imgExts', 'pdfExts', 'threeDExts', 'videoExts', 'audioExts']),
    ...mapState('layout', ['layout']),
    ...mapGetters('feedback', ['isVisible', 'roomState', 'messageState']),
    footerOpen: {
      get () {
        return this.layout.footerOpen
      },
      set (value) {
        this.setFooterOpen(value)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations('layout', ['setFooterVisible']),
    ...mapActions('feedback', ['loadFeedbacks']),
    ...mapActions('layout', ['setFooterOpen']),
    ...mapMutations('feedback', ['setFirstUpdateMessage', 'setIsVisible', 'setRoom', 'setMessage']),
    init () {
      if (document.body.clientWidth < 600) {
        this.fabPos = [5, 50]
      } else {
        this.fabPos = [18, 18]
      }
    },
    ToggleIcon () {
      this.setIsVisible(!this.isVisible)
      this.footerOpen = !this.footerOpen
    },
    CloseIcon () {
      this.setIsVisible(false)
      this.setFooterVisible(true)
    },
    Scroll (scrolldata) {
      this.newScroll = scrolldata
    },
    // 拖拽
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true
      let h1 = document.documentElement.clientHeight || document.body.clientHeight
      let w1 = document.documentElement.clientWidth || document.body.clientWidth
      let x1 = 0
      let y1 = 0
      if ((this.fabPos[0] - ev.delta.x) < 0) {
        x1 = 0
      } else if ((this.fabPos[0] - ev.delta.x) > (w1 - 56)) {
        x1 = w1 - 56
      } else {
        x1 = this.fabPos[0] - ev.delta.x
      }
      if ((this.fabPos[1] - ev.delta.y) < 0) {
        y1 = 0
      } else if ((this.fabPos[1] - ev.delta.y) > (h1 - 56)) {
        y1 = h1 - 56
      } else {
        y1 = this.fabPos[1] - ev.delta.y
      }
      if (ev.isFinal) {
        this.fabPos = [
          18,
          y1
        ]
      } else {
        this.fabPos = [
          x1,
          y1
        ]
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.feedback-btn {
  z-index: 2020;
}
.feedback-icon {
  color: $friend;
  cursor: pointer;
}
/deep/ .feedback-icon .q-icon {
  font-size: 46px;
  padding: 0;
}
/deep/ .feedback-btn .q-btn__wrapper {
  padding: 0;
  min-width: 0;
  min-height: 0;
}
/deep/ .feedback-btn .q-btn__wrapper::before {
  box-shadow: none;
}
/deep/ .feedback-btn .q-btn__wrapper .q-fab__icon-holder {
  font-size: 24px;
  height: 46px;
  width: 46px;
}
/deep/ .feedback-btn .q-btn__wrapper .q-fab__icon-holder .q-icon:first-child {
  opacity: 1 !important;
  transform: none !important;
}
/deep/ .feedback-btn .q-btn__wrapper .q-fab__icon-holder .q-icon:nth-child(2) {
  display: none !important;
}
.question-content {
  margin-right: 18px;
  margin-bottom: 65px;
  width: 350px;
  height: 62vh;
  overflow-y: auto;
  border-radius: 5px;
  background: #f6f6f6;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.15) 0px 5px 30px 0px, rgba(0, 0, 0, 0.05) 0px 3px 3px 0px;
  z-index: 2010;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  position: fixed;
  bottom: 0;
  right: 0;
}
.feedback-home {
  // overflow-y: auto;
  position: fixed;
  // bottom: 0;
  // right: 0;
  margin-bottom: 65px;
  margin-right: 18px;
  width: 350px;
  height: 62vh;
  border-radius: 5px;
  z-index: 2010;
}
.noscroll {
  overflow-y: hidden;
}
.question-tab {
  background-color: $friend;
  border-top-left-radius: 5px;
  padding: 20px 60px 10px 60px;
  position: sticky;
  top: 0;
  z-index: 3;
}
.question-tab .q-tab {
  flex: unset;
  border-radius: 20px;
  min-height: 20px;
  padding: 0;
}
/deep/ .question-tab .q-tab--active ::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
}
/deep/ .question-tab .q-tab__content {
  display: inline-block;
  padding: 7px 16px;
}
/deep/ .q-tab__indicator {
  display: none;
}
/deep/ .question-tab .q-tab__icon {
  width: 20px;
  height: 20px;
  font-size: 20px;
  padding: 0;
}
/deep/ .question-tab .q-tab__label {
  font-size: 14px;
  line-height: 20px;
  display: inline-block;
}
.question-content .q-tab-panels {
  background-color: transparent;
}
.question-content .q-tab-panel {
  padding: 0;
}
.close-feedback {
  font-size: 24px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px 10px 15px 15px;
  opacity: 0.5;
  transition: all 0.4s;
  -moz-transition: all 0.4s;
  -webkit-transition: all 0.4s;
  cursor: pointer;
}
.m-close-feedback {
  left: 0;
  right: inherit;
}
.close-feedback:hover {
  opacity: 1;
}
.question-bottom {
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 20px;
  background-color: #f6f6f6;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(-100%, 0, 0);
}
.m-question-content {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5900;
  border-radius: 0;
}

.m-feedback-home {
  overflow-y: auto;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 0;
  margin-right: 0;
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 0;
  z-index: 5900;
}
.my-tab-panels {
  height: calc(100% - 58px);
}
@media (max-width: $breakpoint-xs-max) {
  .question-tab {
    padding: 15px 58px 10px 58px;
  }
  /deep/ .question-tab .q-tab__content {
    display: inline-block;
    padding: 6px 15px;
  }
  /deep/ .question-tab .q-tab__icon {
    width: 15px;
    height: 15px;
    font-size: 15px;
  }
  /deep/ .question-tab .q-tab__label {
    font-size: 12px;
    line-height: 20px;
    padding-left: 5px;
  }
  .question-bottom {
    height: 13px;
  }
  .question-content {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    height: calc(100% - 75px);
    top: 75px;
    border-radius: 0;
  }
  .feedback-home {
    margin-bottom: 0;
    margin-right: 0;
    width: 100%;
    height: calc(100% - 75px);
    // top: 75px;
    border-radius: 0;
  }
  .question-tab {
    padding: 15px 0 10px 0;
    border-top-left-radius: 0;
  }
  /deep/ .question-tab .q-tabs__content {
    justify-content: center;
  }
}
</style>
