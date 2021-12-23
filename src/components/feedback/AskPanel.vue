
<template>
  <div>
    <div class="text-primary text-weight-bold text-white ask-top">
      <div class="manage-person">
        <div
          class="ask-person"
          v-for="item in teamSupporters"
          :key="item.id"
        >
          <tw-avatar
            :id="item.id"
            :img="item.Icon"
            :name="item.name"
            size="lg"
            :popupCard=false
            style="margin-left:-2px"
            :title="item.name + ' ' + selectPersons[item.id].orgShortName + ' ' + selectPersons[item.id].dutyName"
          />
        </div>
      </div>
      <p class="ask-title">{{$t('feedback.askTitle')}}</p>
    </div>
    <div class="ask-area">
      <q-card
        class="ask-card"
        @click="OpenRoom"
      >
        <q-icon
          v-if="!noAssign && !isChating"
          name="sms"
          class="ask-card-left"
          size="30px"
        ></q-icon>
        <q-spinner-comment
          v-if="noAssign"
          class="ask-card-left"
          size="30px"
        />
        <tw-avatar
          v-if="isChating"
          :id="chatImageId"
          size="md"
          :popupCard=false
          style="margin-right: 15px;border-radius: 50% !important;"
          :title="selectPersons[chatImageId] ? (selectPersons[chatImageId].name + ' ' + selectPersons[chatImageId].orgShortName + ' ' + selectPersons[chatImageId].dutyName) : ''"
        />
        <div class="ask-card-right">
          <p class="chat-title q-mb-sm">{{chatTitle}}</p>
          <template v-if="typeof chatDesc==='object'&& chatDesc.type===undefined">
            <attach-card
              v-for="(f, index) in chatDesc"
              :key="index"
              :attach="f"
              simple
              class="attachMess"
            />
          </template>
          <template v-else-if="typeof chatDesc==='object'&& chatDesc.type==='jingdiaojun'">
             <p class="chat-desc q-mt-sm">{{chatDesc.url}}</p>
          </template>
          <p class="chat-desc q-mt-sm" v-else>{{chatDesc}}</p>
        </div>
      </q-card>
      <div
        class="message-btn"
        @click="OpenMessage"
      >
        <p class="history-text">{{$t('feedback.historyMessage')}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'
export default {
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    AttachCard: () => import('components/attach/AttachCard.vue')
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself'),
      noScroll: false,
      assignId: 0
    }
  },
  computed: {
    ...mapState('person', ['persons', 'selectPersons']),
    ...mapGetters('person', ['selectPersonsOfRoleCode']),
    // 动态显示
    ...mapGetters('feedback', ['newFeedbackByProvider', 'feedbackStateByProvider', 'chatImageId']),
    isChating () {
      let newState = this.feedbackStateByProvider
      if (newState === 1) {
        return true
      } else {
        return false
      }
    },
    noAssign () {
      let newState = this.feedbackStateByProvider
      if (newState === 0) {
        return true
      } else {
        return false
      }
    },
    chatTitle () {
      let mess = this.newFeedbackByProvider
      if (_.isEmpty(mess)) {
        return this.$t('feedback.chatTitle')
      } else {
        let newState = mess.state
        if (newState === 0) {
          return this.$t('feedback.chatTitleNo')
        } else if (newState === 1) {
          let mess = this.newFeedbackByProvider
          let otherFrom = _.filter(mess.content, item => item.fromId !== this.myinfo.id).pop()
          this.setChatImage(otherFrom.fromId)
          return otherFrom.fromName
        } else {
          return this.$t('feedback.chatTitle')
        }
      }
    },
    chatDesc () {
      let mess = this.newFeedbackByProvider
      if (_.isEmpty(mess)) {
        return this.$t('feedback.chatDesc')
      } else {
        let newState = mess.state
        if (newState === 0) {
          return this.$t('feedback.chatDescNo')
        } else if (newState === 1) {
          let otherFrom = _.filter(mess.content, item => item.fromId !== this.myinfo.id).pop()
          // if (typeof (otherFrom.content) !== 'object') {
          //   return otherFrom.content
          // } else {
          //   return otherFrom.content[0].title + otherFrom.content[0].extension
          // }
          return otherFrom.content
        } else {
          return this.$t('feedback.chatDesc')
        }
      }
    },
    teamSupporters () {
      return this.selectPersonsOfRoleCode('Supporter')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('feedback', ['loadFeedbacks']),
    ...mapMutations('feedback', ['setChatImage', 'setRoom', 'setMessage']),
    OpenMessage () {
      this.setMessage(true)
      this.noScroll = true
      this.$emit('scroll', this.noScroll)
    },
    OpenRoom () {
      this.setRoom(true)
      this.noScroll = true
      this.$emit('scroll', this.noScroll)
    },
    init () {
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
.ask-top {
  width: 100%;
  height: 135px;
  background-color: $friend;
  text-align: center;
  padding-top: 12px;
}
.manage-person {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
}
.ask-person {
  cursor: default;
}
.ask-title {
  font-size: 16px;
  line-height: 1;
  margin-top: 22px;
}
.ask-desc {
  font-size: 14px;
  line-height: 1;
  margin-top: 12px;
}
.ask-area {
  padding: 0 15px 20px 15px;
  margin-top: -30px;
}
.ask-card {
  margin-bottom: 5px;
  padding: 16px 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(193, 203, 212, 0.7) 0px 0px 0px 1px inset,
    rgb(193, 203, 212) 0px -1px 0px 0px inset;
  cursor: pointer;
  display: flex;
  display: -webkit-flex;
}
.ask-card-left {
  color: $friend;
  margin-right: 15px;
}
.chat-title {
  color: $friend;
  line-height: 1;
}
.chat-desc {
  font-size: 13px;
}
.message-btn {
  margin-top: 15px;
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
  padding-left: 5px;
}
.attachMess {
  max-height: 51px;
  overflow: hidden;
  margin-top: 6px;
}
/deep/ .attachMess .q-item-type {
  padding: 0;
}
@media (max-width: $breakpoint-xs-max) {
  .ask-top {
    height: 117px;
    padding-top: 8px;
  }
  .ask-title {
    font-size: 15px;
    margin-top: 21px;
  }
  .ask-desc {
    font-size: 13px;
    margin-top: 10px;
  }
  .ask-area {
    padding: 0 10px 15px 10px;
    margin-top: -20px;
  }
  .ask-card {
    padding: 12px 15px;
  }
  .ask-card-left {
    margin-right: 10px;
  }
  .chat-title {
    font-size: 13px;
    margin-bottom: 6px;
  }
  .chat-desc {
    font-size: 12px;
    margin-top: 6px;
  }
  .message-btn {
    margin-top: 15px;
  }
  .history-icon {
    font-size: 16px;
    margin-right: 8px;
  }
  .history-text {
    font-size: 12px;
  }
  .attachMess {
    max-height: 47px;
  }
}
</style>
