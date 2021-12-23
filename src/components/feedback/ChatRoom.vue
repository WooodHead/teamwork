<template>
  <div :class="$q.platform.is.mobile?'m-message':'message'">
    <div class="message-top">
      <q-icon
        name="keyboard_backspace"
        class="back"
        @click="CloseRoom"
      ></q-icon>
      {{$t('feedback.chatroom')}}
      <q-btn
        :label="$t('feedback.endChat')"
        class="end-btn"
        color="transparent"
        text-color="white"
        outline
        @click="EndChat"
        v-if="endBtn"
        :title="$t('feedback.endChatTip')"
      ></q-btn>
    </div>

    <div class="text-primary text-white questions-title">
      {{$t('feedback.chatroomTitle')}}
    </div>
    <!-- 消息区 -->
    <div class="question-area">
      <q-card
        :flat="$q.screen.lt.sm"
        class="chat-area"
      >
        <!-- 消息区 -->
        <q-card-section
          class="chat-content"
          :class="[{'deskContent':$q.platform.is.desktop && extranet},{'shorter':feedbackState === 2}]"
        >
          <chat-message :messages="messageContent" />
        </q-card-section>

        <!-- 编辑条 -->
        <q-card-actions
          class="chat-input"
          :class="[{'deskInput':$q.platform.is.desktop && extranet},'bg-grey-1',$q.screen.gt.xs]"
          v-if="showEditor"
        >
          <chat-editor
            dense
            :autogrow="true"
            @send="send"
          />
        </q-card-actions>

        <!-- 录屏 -->
        <div
          class="luping"
          v-if="$q.platform.is.desktop && showEditor && extranet"
        >
          <p>{{$t('feedback.recordTitle')}}</p>
          <q-btn
            class="media-btn"
            outline
            @click="record()"
            :title="$t('feedback.recordTip')"
          >{{txt}}</q-btn>
        </div>

        <!-- 结束对话 -->
        <div
          class="end-chat"
          v-if="feedbackState === 2"
        >
          <p
            class="end-tip"
            v-if="showMeEnd"
          >{{$t('feedback.meEnd')}}</p>
          <p
            class="end-tip"
            v-if="showAdminEnd"
          >{{$t('feedback.adminEnd')}}</p>
          <div
            class="message-btn"
            @click="OpenMessage"
          >
            <q-icon
              class="history-icon"
              name="question_answer"
            />
            <p class="history-text">{{$t('feedback.historyMessage')}}</p>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>
<script>

import { date, LocalStorage } from 'quasar'
import { mapGetters, mapMutations, mapActions } from 'vuex'
const config = require('app/app.config.js'),
  { formatDate } = date
export default {
  name: 'ChatRoom',
  data () {
    return {
      noScroll: false,
      messageType: 'add',
      // 录屏
      recordedBlobs: [],
      txt: this.$t('feedback.recordStart'),
      fileName: '',
      status: false,
      stream: null,
      options: {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 4500000,
        mimeType: 'video/webm'
      },
      extranet: config.extranet,
      visible: false,
      date: '1000-01-01 00:00',
      myinfo: LocalStorage.getItem('myself'),
      message1Type: {
        type: String,
        default: '',
        description: '消息类型(add/update)'
      }
    }
  },

  components: {
    ChatEditor: () => import('components/chat/ChatEditor'),
    ChatMessage: () => import('components/chat/ChatMessage')
  },

  computed: {
    ...mapGetters('feedback', ['endChat', 'feedbackState', 'closeRoom', 'feedbackId', 'customerEndChat', 'messageContent', 'messageContentLen', 'firstUpdateMessage', 'whoEndChat', 'showEnd',
      'showMeEnd', 'showAdminEnd', 'endBtn', 'showEditor', 'newFeedbackByProvider']),
    endBtn () {
      return !(this.feedbackId === 0) && this.feedbackState !== 2
    },

    showEditor () {
      return this.feedbackState !== 2
    },

    showMeEnd () {
      return this.feedbackState === 2 && this.customerEndChat === 'customer'
    },

    showAdminEnd () {
      return this.feedbackState === 2 && this.customerEndChat === 'admin'
    },

    messageContent () {
      let mess = []
      mess = this.newFeedbackByProvider
      if (mess !== undefined && mess.content !== undefined) {
        if (mess.state !== 2) {
          this.setFeedbackState(0)
          this.setFirstUpdateMessage(false)
          this.setFeedbackId(mess.id)
          return mess.content
        } else if (mess.state === 2 && this.feedbackId !== 0) {
          this.setFeedbackState(mess.state)
          this.setFirstUpdateMessage(true)
          return mess.content
        } else if (mess.state === 2 && this.feedbackId === 0) {
          this.setFeedbackState(0)
          this.setFirstUpdateMessage(true)
          this.setEndChat(false)
          this.setCloseRoom(false)
          return []
        } else {
          return []
        }
      } else {
        return []
      }
    }
  },

  mounted () {
    this.initChatRoom()
    this.initChatMessage()
  },
  // 录屏
  watch: {
    status (a) {
      if (a) {
        this.txt = this.$t('feedback.recordEnd')
      } else {
        this.txt = this.$t('feedback.recordStart')
      }
    }
  },

  methods: {
    ...mapActions('feedback', ['loadFeedbacks', 'addFeedback', 'updateFeedbackField', 'endFeedback']),
    ...mapMutations('feedback', ['setFeedbackState', 'setFeedbackId', 'setCustomerEndChat', 'setAdminEndChat',
      'setCloseRoom', 'setFirstUpdateMessage', 'setEndChat', 'setShowMessage', 'setMessageContent', 'setRoom', 'setMessage']),
    // 初始化聊天室是否关闭状态
    initChatRoom () {
      // 设置客户端聊天
      this.setCustomerEndChat('admin')
    },
    CloseRoom () {
      this.setCloseRoom(true)
      if (this.feedbackState === 2) {
        this.setFeedbackId(0)
        this.setFeedbackState(0)
      }
      this.setMessage(false)
      this.setRoom(false)
    },
    EndChat () {
      this.setCustomerEndChat('customer')
      this.setFeedbackState(2)
      this.setEndChat(true)
      // 更新消息状态state
      let messageObj = {
        id: this.feedbackId,
        state: this.feedbackState
      }
      this.endFeedback(messageObj).then(res => {
        this.setEndChat(true)
      })
    },
    OpenMessage () {
      this.setMessage(true)
      this.setRoom(false)
      this.noScroll = true
      this.$emit('scroll', this.noScroll)
    },
    // 发送消息到后台
    send (val) { // 重新组装content
      var ms = null // 定义发送文本数组
      if (_.isObject(val) && (_.isEmpty(val.type) || val.type !== 'jingdiaojun')) {
        ms = []
        if (_.isArray(val)) {
          _.forEach(val, f => {
            ms.push({
              title: f.Title,
              path: f.PathName,
              extension: f.Extension,
              size: f.Size + ''
            })
          })
        } else {
          ms.push({
            title: val.Title,
            path: val.PathName,
            extension: val.Extension,
            size: f.Size + ''
          })
        }
      } else if (_.isObject(val) && val.type === 'jingdiaojun') {
        ms = val
      } else if (!_.isObject(val) && val.trim() !== '') {
        ms = val
      } else {
        _this.$q.notify({ message: this.$t('feedback.noEmpty'), icon: 'warning', color: 'purple' })
        return false
      }
      let closeRoom = this.closeRoom
      let endChat = this.endChat
      this.messageType = this.firstUpdateMessage && !closeRoom && !endChat ? 'add' : 'update'
      if (this.messageType === 'add') {
        const currentTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        let chatObj = [{ chatId: 1, fromId: this.myinfo.id, fromName: this.myinfo.name, sendTime: currentTime, content: ms, sent: true }]
        let messageObj = {
          provider: this.myinfo.id,
          email: this.myinfo.email,
          content: JSON.stringify(chatObj)
        }
        this.addFeedback(messageObj).then(res => {
          this.setFirstUpdateMessage(false)
        })
      } else {
        // 重新组装content
        let mlen = this.messageContentLen(this.feedbackId)
        const currentTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        let chatObj = { chatId: ++mlen, fromId: this.myinfo.id, fromName: this.myinfo.name, sendTime: currentTime, content: ms, sent: true }
        this.setMessageContent([chatObj])
        let messageObj = {
          id: this.feedbackId,
          content: JSON.stringify(chatObj)
        }
        this.updateFeedbackField(messageObj)
      }
    },
    // 录屏
    record () {
      if (this.status) {
        this.stopReset()
        this.status = false
      } else {
        this.startScreen()
      }
    },
    stopReset () {
      this.stream.getTracks().forEach((track) => track.stop())
      this.recordedBlobs = []
    },
    startScreen () {
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(
        (stream) => {
          this.status = !this.status
          this.stream = stream
          const mediaRecorder = new MediaRecorder(stream, this.options)
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.status = false
              this.recordedBlobs.push(event.data)
              this.download()
              this.stopReset()
            }
          }
          mediaRecorder.start()
        },
        (error) => console.log(error)
      )
    },
    download () {
      const blob = new Blob(this.recordedBlobs, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style.display = 'none'
      a.href = url
      if (this.fileName) {
        a.download = this.fileName + '.webm'
      } else {
        a.download = formatDate(new Date(), 'YYYY-MM-DD HH:mm') + '.webm'
      }
      a.click()
      window.URL.revokeObjectURL(url)
    },
    // 初始化聊天室消息
    initChatMessage () {
      const currentTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      this.date = (this.messageContent.length > 0) ? this.messageContent[0].sendTime : currentTime
      if (_.isEmpty(this.newFeedbackByProvider)) {
        let queryCondition = [
          { Key: 'Provider', Value: this.myinfo.id, Oper: 'eq' },
          'and',
          { Key: 'State', Value: 2, Oper: 'ne' }
        ]
        this.loadFeedbacks({
          query: queryCondition,
          byPage: false
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.message {
  position: absolute;
  width: 100%;
  height: 62vh;
  top: 0;
  left: 0;
  z-index: 2030;
  background-color: #f6f6f6;
  padding: 0;
  font-style: normal;
  transition: 0.2s;
  overflow-y: hidden;
}
.m-message {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9000;
  background-color: #f6f6f6;
  padding: 0;
  font-style: normal;
  transition: 0.2s;
  overflow-y: hidden;
}
.noscroll {
  overflow-y: hidden;
}
.message-top {
  background-color: $friend;
  color: #ffffff;
  text-align: center;
  font-size: 16px;
  padding-top: 15px;
  line-height: 1;
}
.back {
  cursor: pointer;
  color: #ffffff;
  position: absolute;
  left: 8px;
  top: 8px;
  font-size: 28px;
}
.end-btn {
  position: absolute;
  right: 8px;
  top: 11px;
  padding: 0 7px;
  height: 27px;
  line-height: 25px;
  box-sizing: border-box;
}
/deep/ .end-btn .q-btn__wrapper {
  padding: 0;
  min-height: 0;
}
/deep/ .end-btn .q-btn__wrapper span.block {
  font-size: 13px;
}
.questions-title {
  width: 100%;
  height: 80px;
  background-color: $friend;
  text-align: center;
  font-size: 16px;
  line-height: 75px;
  padding-top: 3px;
}
.question-area {
  padding: 0;
  position: relative;
  height: calc(100% - 111px);
}

// 聊天室
.chat-area {
  box-shadow: none;
  border-radius: none;
  background: transparent;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.chat-content {
  padding: 0;
  height: calc(100% - 44px);
}
.deskContent {
  height: calc(100% - 83px);
}
.shorter {
  height: calc(100% - 69px);
}
.chat-input {
  padding: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 44px;
}
.deskInput {
  bottom: 40px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  width: 95%;
  left: 0;
  right: 0;
  margin: auto;
}
.chat-editor {
  border: 2px solid #d9d9d9;
  border-radius: 0.4rem;
  transition: all 30ms ease-out;
}
.end-chat {
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #f6f6f6;
  z-index: 10;
  position: relative;
}
.end-tip {
  text-align: center;
  color: #9e9e9e;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 19px;
}
.message-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  height: 21px;
  cursor: pointer;
}
.history-icon {
  color: $friend;
  font-size: 20px;
  margin-right: 10px;
}
.history-text {
  color: $friend;
  margin: 0;
}
@media (max-width: $breakpoint-xs-max) {
  .message {
    height: 100%;
  }
  .message-top {
    font-size: 14px;
  }
  .back {
    top: 7px;
    font-size: 24px;
  }
  .message-area {
    padding: 12px 10px 15px 10px;
  }
  .end-btn {
    height: 24px;
    line-height: 22px;
  }
  /deep/ .end-btn .q-btn__wrapper span.block {
    font-size: 12px;
  }
  .questions-title {
    font-size: 15px;
  }
}
// 录屏
.luping {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: baseline;
  position: absolute;
  bottom: 10px;
  right: 2.5%;
}
.luping p {
  margin-bottom: 0;
  margin-right: 5px;
  font-size: 13px;
  color: $friend;
}
.media-btn {
  padding: 0 7px;
  height: 24px;
  box-sizing: border-box;
  font-size: 13px;
  color: $friend;
}
/deep/ .media-btn .q-btn__wrapper {
  padding: 0;
  min-height: 0;
}
/deep/ .media-btn .q-btn__wrapper .q-btn__content {
  font-size: 13px;
  line-height: 22px;
}
.scroll {
  padding: 10px 20px 15px 20px;
}
/deep/ .date-break .q-message-label,
/deep/ .date-break:first-child .q-message-label {
  margin-top: 15px;
  margin-bottom: 0;
}
.message-image {
  max-width: 100%;
}
@media (max-width: $breakpoint-xs-max) {
  /deep/.q-message:first-child .q-message-label {
    margin-bottom: 5px;
  }
}
</style>
