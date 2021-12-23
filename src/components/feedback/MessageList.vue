<template>
  <div
    class="message"
    :class="{'noscroll':messageScroll}"
  >
    <div class="message-top">
      <q-icon
        name="keyboard_backspace"
        class="back"
        @click="CloseMessage"
      ></q-icon>
      {{$t('feedback.historyMessage')}}
    </div>
    <div class="message-area">
      <p
        v-if="this.historyFeedbacks.length===0"
        class="no-message"
      >无</p>
      <q-card
        v-else
        class="message-card"
        :key="item.id"
        v-for="item in historyFeedbacks"
        @click="OpenChat(item)"
      >
        <div></div>
        <div
          class="message-title"
          v-if="typeof item.content[0].content !='object'"
        >{{item.content[0].content}}</div>
        <template v-else>
          <template v-if="Array.isArray(item.content[0].content[0])">
            <attach-card
              v-for="(f, index) in item.content[0].content[0]"
              :key="index"
              :attach="f"
              simple
              class="attachMess"
            />
          </template>
          <attach-card
            v-else
            :attach="item.content[0].content[0]"
            simple
            class="attachMess"
          />
        </template>
        <div class="message-date">{{item.content[0].sendTime}} </div>
      </q-card>
      <q-btn
        class="message-btn q-mt-md"
        :label="$t('feedback.messageBtn')"
        @click="OpenChatRoom"
      />
    </div>
    <!-- 聊天消息详情 -->
    <transition name="slide">
      <chat-detail
        v-if="newChat"
        @messScroll="MessageScroll($event)"
      />
    </transition>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  components: {
    'chat-detail': () => import('components/feedback/ChatDetail.vue'),
    AttachCard: () => import('components/attach/AttachCard.vue')
  },
  data () {
    return {
      messageScroll: false,
      noScroll: true,
      myinfo: LocalStorage.getItem('myself')
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters('feedback', ['historyFeedbacksList', 'newChat', 'loadFromBackground']),
    historyFeedbacks () {
      return this.historyFeedbacksList
    }
  },
  methods: {
    ...mapMutations('feedback', ['setRoom', 'setMessage', 'setNewChat', 'setShowMessage', 'setNewChatId']),
    ...mapActions('feedback', ['loadFeedbacks']),
    init () {
      if (!this.loadFromBackground) {
        let queryCondition = [
          { Key: 'Provider', Value: this.myinfo.id, Oper: 'eq' },
          'and',
          { Key: 'State', Value: 2, Oper: 'eq' }
        ]
        this.loadFeedbacks({
          query: queryCondition,
          byPage: false
        })
      }
    },
    CloseMessage () {
      this.noScroll = false
      this.$emit('scroll', this.noScroll)
      this.setMessage(false)
      this.setRoom(false)
    },
    OpenChatRoom () {
      this.setMessage(false)
      this.setRoom(true)
      this.noScroll = true
      this.$emit('scroll', this.noScroll)
    },
    OpenChat (item) {
      this.setNewChat(true)
      this.messageScroll = true
      this.setNewChatId(item.id)
    },
    MessageScroll (scrolldata) {
      this.messageScroll = scrolldata
    }
  }
}
</script>
<style lang='scss' scoped>
.message {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 8000;
  background-color: #f6f6f6;
  padding: 0;
  font-style: normal;
  transition: 0.2s;
  overflow-y: auto;
}
.noscroll {
  overflow-y: hidden;
}
.message-top {
  background-color: $friend;
  color: #ffffff;
  text-align: center;
  height: 50px;
  line-height: 48px;
  font-size: 16px;
  position: sticky;
  top: 0;
  z-index: 5;
}
.back {
  cursor: pointer;
  color: #ffffff;
  position: absolute;
  left: 8px;
  top: 8px;
  font-size: 28px;
}
.message-area {
  padding: 16px 16px 20px 16px;
}
.no-message {
  margin-bottom: 0;
  margin-left: 10px;
}
.message-card {
  margin-bottom: 5px;
  padding: 16px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(193, 203, 212, 0.7) 0px 0px 0px 1px inset,
    rgb(193, 203, 212) 0px -1px 0px 0px inset;
  cursor: pointer;
}
.message-title {
  color: $friend;
  word-break: break-all;
  -ms-word-break: break-all;
  text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  display: -moz-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
}
.message-date {
  color: #9e9e9e;
  font-size: 13px;
}
.message-btn {
  background-color: $friend;
  color: #ffffff;
  width: 100%;
}
.attachMess {
  max-height: 63px;
  overflow: hidden;
  margin-bottom: 5px;
}
/deep/ .attachMess .q-item-type {
  padding: 0;
}
@media (max-width: $breakpoint-xs-max) {
  .message-top {
    height: 42px;
    line-height: 41px;
    font-size: 14px;
  }
  .back {
    top: 7px;
    font-size: 24px;
  }
  .message-area {
    padding: 12px 10px 15px 10px;
  }
  .no-message {
    margin-bottom: 6px;
    margin-left: 6px;
  }
  .message-card {
    padding: 12px;
  }
  .message-title {
    font-size: 13px;
  }
  .message-date {
    font-size: 12px;
  }
  .message-btn {
    margin-top: 5px;
  }
  .attachMess {
    max-height: 59px;
  }
}
</style>
