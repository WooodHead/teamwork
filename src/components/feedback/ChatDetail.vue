<template>
  <div class="chat-detail">
    <q-icon
      name="close"
      @click="CloseChat"
      class="close-detail"
    />
    <div class="detail-content">
      <div class="message-top">
        {{$t('feedback.historyMessage')}}
      </div>
      <div class="question-area">
        <q-card
          :flat="$q.screen.lt.sm"
          class="chat-area"
        >
          <q-card-section
            class="chat-content"
            :class="[{'deskContent':$q.platform.is.desktop && extranet && showInput}]"
          >
            <chat-message
              :messages="message.content"
            />
            <div
              v-if="!showInput"
              class="more-ask"
            >
              <p>{{$t('feedback.moreAsk')}}</p>
              <q-btn
                class="media-btn"
                outline
                @click="MoreAsk"
                :title="$t('feedback.moreTip')"
              >{{$t('feedback.moreBtn')}}</q-btn>
            </div>
          </q-card-section>
          <q-card-actions
            class="chat-input"
            :class="[{'deskInput':$q.platform.is.desktop && extranet},'bg-grey-1',$q.screen.gt.xs]"
            v-if="showInput"
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
            v-if="$q.platform.is.desktop && showInput && extranet"
          >
            <p>{{$t('feedback.recordTitle')}}</p>
            <q-btn
              class="media-btn"
              outline
              @click="record()"
              :title="$t('feedback.recordTip')"
            >{{txt}}</q-btn>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import { date, LocalStorage } from 'quasar'
import { mapGetters, mapActions, mapMutations } from 'vuex'
const config = require('app/app.config.js')
const { formatDate } = date
export default {
  data () {
    return {
      messageScroll: true,
      myinfo: LocalStorage.getItem('myself'),
      showInput: false,
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
      extranet: config.extranet
    }
  },
  components: {
    ChatEditor: () => import('components/chat/ChatEditor'),
    ChatMessage: () => import('components/chat/ChatMessage')
  },
  computed: {
    ...mapGetters('feedback', ['feedback', 'feedbackId', 'newChatId']),
    message () {
      return this.feedback(this.newChatId)
    }
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
    ...mapActions('feedback', ['updateFeedbackField', 'loadFeedback']),
    ...mapMutations('feedback', ['setNewChat', 'setNewChatId']),
    CloseChat () {
      this.messageScroll = false
      this.$emit('messScroll', this.messageScroll)
      this.setNewChat(false)
      this.setNewChatId(0)
    },
    MoreAsk () {
      this.showInput = true
    },
    // 发送消息到后台
    send (val) { // 重新组装content
      var ms = null // 定义发送文本数组
      if (_.isObject(val)) {
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
      } else if (val.trim() !== '') {
        ms = val
      } else {
        _this.$q.notify({ message: this.$t('feedback.noEmpty'), icon: 'warning', color: 'purple' })
        return false
      }
      const myinfo = LocalStorage.getItem('myself')
      // 重新组装content
      let mlen = this.message.content.length
      const currentTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      let chatObj = { chatId: ++mlen, fromId: myinfo.id, fromName: myinfo.name, sendTime: currentTime, content: ms, sent: true }
      let messageObj = {
        id: this.message.id,
        content: JSON.stringify(chatObj)
      }
      this.updateFeedbackField(messageObj)
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
    }
  }

}
</script>
<style lang='scss' scoped>
.chat-detail {
  position: fixed;
  width: 330px;
  margin: 10px 28px 75px 10px;
  bottom: 0;
  height: calc(62vh - 20px);
  border-radius: 5px;
  background: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(193, 203, 212, 0.7) 0px 0px 0px 1px inset,
    #c1cbd4 0px -1px 0px 0px inset;
  z-index: 2040;
  transition: 0.2s;
  padding: 0;
  transform: translate3d(0, 0, 0);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
.close-detail {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  font-size: 24px;
  z-index: 10;
  cursor: pointer;
  color: #b0b0b0;
  transition: 0.4s;
}
.close-detail:hover {
  color: #333333;
}
.detail-content {
  min-height: 0px;
  height: 100%;
  position: relative;
  width: 100%;
  will-change: scroll-position;
  overflow: hidden;
}
.more-ask {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.more-ask p {
  margin: 0;
  padding: 0;
  color: $friend;
  margin-right: 5px;
  line-height: 39px;
}
@media (max-width: $breakpoint-xs-max) {
  .chat-detail {
    width: calc(100% - 20px);
    margin: 10px;
    height: calc(100% - 95px);
  }
  .close-detail {
    top: 0;
    right: 0;
    font-size: 22px;
  }
}
.message-top {
  color: $friend;
  text-align: center;
  font-size: 16px;
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  line-height: 1;
}
.questions-title {
  width: 100%;
  height: 80px;
  color: $friend;
  text-align: center;
  font-size: 16px;
  line-height: 75px;
  padding-top: 3px;
}
.question-area {
  padding: 0;
  position: relative;
  height: calc(100% - 46px);
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
}
.chat-content {
  background: #f6f6f6;
  padding: 0;
  height: calc(100% - 42px);
}
.deskContent {
  height: calc(100% - 83px);
}
.chat-input {
  padding: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
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
@media (max-width: $breakpoint-xs-max) {
  .message {
    height: 100%;
  }
  .message-top {
    font-size: 14px;
  }
  .message-area {
    padding: 12px 10px 15px 10px;
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
</style>
