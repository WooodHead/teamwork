<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <q-icon
      name="keyboard_backspace"
      class="adminBack"
      @click="CloseAdminRoom"
    ></q-icon>
    <!-- 标题 头区域-->
    <q-card-section
      class="q-mx-lg q-px-xl q-pt-md text-h5 feedback-title"
      :class="{bottomMore: chating}"
    >
      <p>{{$t('feedback.chatroom')}}</p>
      <div class="customer">
        <!-- 消息指派 -->
        <q-select
          v-if="chating"
          rounded
          outlined
          v-model="model"
          :options="personsObj"
          stack-label
          behavior="menu"
          class="assign-btn"
        >
          <template v-slot:selected>
            <q-chip
              v-if="model"
              dense
              color="transparent"
              class="q-my-none q-ml-xs q-mr-none"
            >
              <tw-avatar
                :id="model.id"
                :img="model.Icon"
                size="sm"
                font-size="0.6rem"
                :popupCard=false
                class="assign-select"
              />
              {{ model.name }}
            </q-chip>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <tw-avatar
                  :id="scope.opt.id"
                  :img="scope.opt.Icon"
                  size="md"
                  font-size="0.6rem"
                  :popupCard=false
                  style="cursor: default !important"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.name" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <tw-avatar
          :id="thisMessage.content[0]&&thisMessage.content[0].fromId"
          :name="thisMessage.content[0]&&thisMessage.content[0].fromName"
          size="md"
          font-size="0.6rem"
          class="customer-head"
          :popupCard=false
          :title="(thisMessage.content[0]&&selectPersons[thisMessage.content[0].fromId]) ? (thisMessage.content[0].fromName + ' ' + selectPersons[thisMessage.content[0].fromId].orgShortName + ' ' + selectPersons[thisMessage.content[0].fromId].dutyName) : ''"
        />
        <p class="customer-name text-weight-bold">{{thisMessage.content[0]&&thisMessage.content[0].fromName}}</p>
        <q-btn
          v-if="chating"
          class="end-btn q-mt-md text-primary"
          :label="$t('feedback.endChat')"
          rounded
          outline
          @click="EndChating"
        />
      </div>
    </q-card-section>

    <!-- 消息内容区域-->
    <q-card-section
      :style="heightStyle"
      :class="['q-py-none',$q.screen.gt.xs&&'q-px-xl']"
    >
      <chat-message :messages="thisMessage.content"
      :feedbackType="'adminfeedback'" />
    </q-card-section>

    <!-- 编辑消息区域-->
    <q-card-actions
      v-if="chating || moreReply"
      :style="'border-top: 1px solid rgba(0, 0, 0, 0.12);'"
      :class="['bg-grey-1',$q.screen.gt.xs&&'q-px-xl']"
    >
      <chat-editor
        dense
        :autogrow="true"
        @send="send"
        :person="person"
      />
    </q-card-actions>

    <!-- 追加消息区域-->
    <q-btn
      class="more-btn text-primary"
      outline
      rounded
      @click="MoreReply"
      :title="$t('feedback.moreTipAdmin')"
      v-if="thisMessage.state === 2 && !moreReply"
    >{{$t('feedback.moreBtnAdmin')}}</q-btn>
    <div
      class="end-chat"
      v-if="endChat && !moreReply"
    >
      <p v-if="thisEnd">{{$t('feedback.meEnd')}}</p>
      <p v-if="customerEnd">{{$t('feedback.customerEnd')}}</p>
      <p v-if="isEnd">{{$t('feedback.end')}}</p>
    </div>
  </q-card>
</template>

<script>
import { date, LocalStorage } from 'quasar'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
const { formatDate } = date
export default {
  name: 'ChatRoom',
  data () {
    return {
      myinfo: LocalStorage.getItem('myself'),
      showRoom: true,
      person: null,
      message: [],
      chatId: 0,
      num: '0',
      moreReply: false
    }
  },
  props: {
    id: {
      type: Number,
      required: true,
      default: 0
    }
  },
  components: {
    ChatEditor: () => import('components/chat/ChatEditor'),
    ChatMessage: () => import('components/chat/ChatMessage'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  computed: {
    ...mapGetters('feedback', ['adminEndChat', 'adminMessageId', 'feedback', 'assignId', 'adminFeedbackId']),
    ...mapState('person', ['selectPersons']),
    thisMessage () {
      let mess = this.feedback(Number(this.id))
      if (!_.isEmpty(mess.content)) {
        return mess
      } else {
        return { content: [], state: 0 }
      }
    },

    chating () {
      return this.thisMessage.state !== 2
    },
    endChat () {
      return this.thisMessage.state === 2
    },
    // 结束聊天的角色
    customerEnd () {
      return this.endChat && this.adminEndChat === 'customer'
    },
    thisEnd () {
      return this.endChat && this.adminEndChat === 'admin'
    },
    isEnd () {
      return this.endChat && !this.customerEnd && !this.thisEnd
    },
    heightStyle () {
      let heightSize = ''
      heightSize = this.$q.screen.gt.xs ? 'height:calc(100% - 175px)' : 'height:calc(100% - 170px)'
      return heightSize
    },
    // 指派
    model: {
      get () {
        // 1.默认指派人（没指派时是自己，指派了是指派人）；2.指派后默认为指派人
        if (this.thisMessage.assignedTo > 0 && this.assignId === 0) {
          return this.$store.state.person.selectPersons[this.thisMessage.assignedTo]
        } else if (this.assignId > 0) {
          return this.$store.state.person.selectPersons[this.assignId]
        } else {
          return LocalStorage.getItem('myself')
        }
      },
      set (val) {
        let payload = {
          id: this.id,
          assigner: this.myinfo.id,
          assignedTo: val.id
        }
        this.assignFeedback(payload)
        showSuccessMessage(this.$t('feedback.assignTo') + val.name)
      }
    },
    personsObj () {
      return this.$store.getters['person/selectPersonsOfRoleCode']('Supporter')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('feedback', ['updateFeedbackField', 'assignFeedback', 'endFeedback', 'loadFeedbacks']),
    ...mapMutations('feedback', ['setAdminEndChat', 'setAdminMessageId',
      'setAssignId']),
    // 消息指派
    init () {
      this.setAssignId(0)
      this.setAdminEndChat('')
      if (_.isEmpty(this.feedback(Number(this.id)))) {
        let queryCondition = [
          { Key: 'Id', Value: this.id, Oper: 'eq' }
        ]
        this.loadFeedbacks({
          query: queryCondition,
          byPage: false
        })
      }
    },
    CloseAdminRoom () {
      this.$router.push({
        path: '/feedback'
      })
    },
    EndChating () {
      this.setAdminEndChat('admin')
      // 更新消息状态state
      this.thisMessage.state = 2
      let messageObj = {
        id: this.thisMessage.id,
        state: this.thisMessage.state
      }
      this.endFeedback(messageObj)
    },
    MoreReply () {
      this.moreReply = true
    },
    // 发送消息到后台
    send (val) {
      // 重新组装content
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
            size: val.Size + ''
          })
        }
      } else if (_.isObject(val) && val.type === 'jingdiaojun') {
        ms = val
      } else if (!_.isObject(val) && val.trim() !== '') {
        ms = val
      } else {
        _this.$q.notify({ message: '发送内容不能为空', icon: 'warning', color: 'purple' })
        return false
      }

      let messageContent = this.thisMessage.content
      let chatLength = messageContent.length
      const currentTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      let m = _.find(messageContent, item => item.fromId === this.myinfo.id)
      let chatObj = { chatId: ++chatLength, fromId: this.myinfo.id, fromName: this.myinfo.name, sendTime: currentTime, content: ms, sent: false }

      let newChat = chatObj
      if (_.isArray(chatObj.content)) {
        newChat.text = chatObj.content
      } else {
        newChat.text = [chatObj.content]
      }
      messageContent.push(newChat)

      let messageObj = {}
      if (_.isEmpty(m) && this.thisMessage.assignedTo === 0) {
        if (this.thisMessage.state === 2) {
          messageObj = {
            id: this.thisMessage.id,
            assignedTo: this.myinfo.id,
            state: 2,
            content: JSON.stringify(chatObj)
          }
        } else {
          messageObj = {
            id: this.thisMessage.id,
            assignedTo: this.myinfo.id,
            state: 1,
            content: JSON.stringify(chatObj)
          }
        }
      } else {
        if (this.thisMessage.state === 2) {
          messageObj = {
            id: this.thisMessage.id,
            state: 2,
            content: JSON.stringify(chatObj)
          }
        } else {
          messageObj = {
            id: this.thisMessage.id,
            state: 1,
            content: JSON.stringify(chatObj)
          }
        }
      }
      this.updateFeedbackField(messageObj)
      this.setAdminMessageId(this.thisMessage.id)
    }
  },
  watch: {
    messageContent: {
      deep: true, // 深度监听设置为true
      handler: function (newV, oldV) {
        setTimeout(() => {
          document.getElementById('scroll').scrollTop = document.getElementById('scroll').scrollHeight + 999999999
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-grow-in-page {
  position: absolute;
  bottom: 8px;
  top: 8px;
}
.adminBack {
  cursor: pointer;
  position: absolute;
  left: 30px;
  top: 18px;
  font-size: 36px;
  color: var(--q-color-primary);
  padding-top: 0;
  z-index: 5;
}
.feedback-title {
  border-bottom: 3px solid var(--q-color-dark);
  text-align: center;
}
.customer {
  display: flex;
  justify-content: center;
}
.assign-btn {
  position: absolute;
  left: 10px;
  width: 130px;
  bottom: 12px;
}
/deep/ .customer .q-field--outlined .q-field__control::before {
  border: 1px solid $primary;
}
/deep/ .customer .q-field--outlined .q-field__control {
  padding: 0 10px;
  min-height: 0;
}
/deep/ .customer .q-field--auto-height .q-field__native {
  min-height: 0;
  padding: 8px 0;
}
/deep/ .customer .q-field__append.q-field__marginal {
  height: 36px;
}
.assign-select {
  cursor: default !important;
  margin-right: 10px;
}
/deep/ .customer .q-field__label {
  color: $primary;
}
.customer-head {
  margin-right: 10px;
}
.customer-name {
  font-size: 16px;
  margin: 0;
  margin-right: 10px;
}
.customer-time {
  font-size: 14px;
  margin: 0;
  color: #595757;
}
.end-btn {
  margin-top: 0;
  position: absolute;
  right: 10px;
  width: 90px;
}
.end-chat {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #fafafa;
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.end-chat p {
  background: #fafafa;
  margin: 0;
  height: 61px;
  line-height: 61px;
  padding: 0;
  text-align: center;
  color: #9e9e9e;
  font-size: 14px;
}
.more-btn {
  position: absolute;
  bottom: 12px;
  right: 24px;
  z-index: 5;
}
@media (max-width: $breakpoint-xs-max) {
  .assign-btn {
    left: 10px;
    width: 110px;
    bottom: 8px;
  }
  /deep/ .customer .q-field--outlined .q-field__control {
    padding: 0 8px;
  }
  /deep/ .customer .q-field__append.q-field__marginal {
    height: 29.9px;
  }
  /deep/ .customer .q-field--auto-height .q-field__native {
    padding: 3px 0;
  }
  .assign-select {
    margin-right: 6px;
  }
  /deep/ .customer .q-chip {
    font-size: 13px;
  }
  /deep/ .q-field--auto-height.q-field--labeled .q-field__control-container {
    padding-top: 19px;
  }
  /deep/ .q-field--auto-height.q-field--labeled .q-field__native {
    padding-bottom: 0;
    height: 25px;
  }
  /deep/ .q-field__label {
    top: 14px;
  }
  /deep/ .q-field__append {
    height: 40px;
    padding-left: 0;
  }
  /deep/ .q-field__append .q-icon {
    padding-top: 4px;
    width: 16px;
  }
  .bottomMore {
    padding-bottom: 50px;
  }
  .feedback-title p:first-child {
    margin-bottom: 12px;
  }
  .customer-head {
    margin-right: 6px;
    font-size: 28px !important;
  }
  .customer-name {
    font-size: 14px;
    margin-right: 6px;
  }
  .customer-time {
    font-size: 12px;
  }
  .end-btn {
    bottom: 8px;
    margin: auto;
    font-size: 13px;
    width: 78px;
    right: 10px;
    margin: 0;
  }
  /deep/ .end-btn .q-btn__wrapper {
    padding: 0px 12px;
    min-height: 2.3em;
  }
}
</style>
