<template>
  <q-infinite-scroll
    ref="qInfiniteScroll"
    @load="onLoad"
    reverse
    id="scroll"
    class="scroll fit"
  >
    <template slot="loading">
      <div class="row justify-center q-my-md">
        <q-spinner
          color="primary"
          name="dots"
          size="2rem"
        />
      </div>
    </template>
    <template v-for="(list,key) in messagesContent">
      <!-- 时间分割 -->
      <tw-group-header
        :key="key"
        :title="key"
      ></tw-group-header>

      <!-- 聊天内容 -->
      <q-chat-message
        class="q-py-sm q-px-sm"
        :class="{ 'emoji-font':$q.platform.is.win}"
        v-for="(item,index) in list"
        :key="key+index"
        :name="item.sent?'<span class=text-grey-6>'+(item.stamp&&item.stamp.substring(10,16)||(item.sendTime && item.sendTime.substring(10,16)))+'</span> <font class=text-weight-bold>'+item.fromName+'</font>':'<font class=text-weight-bold>'+item.fromName+'</font> <span class=text-grey-6>'+(item.stamp&&item.stamp.substring(10,16)||(item.sendTime && item.sendTime.substring(10,16)))+'</span>'"
        :sent="item.sent"
        :size="(typeof item.text==='object'&&(item.text.type==='jingdiaojun'||item.text[0].type==='jingdiaojun'))?(feedbackType==='adminfeedback'?'2':'4'):'self'"
        :text-color="item.textColor"
        :bg-color="typeof item.text==='object' && (item.text.type==='jingdiaojun'||item.text[0].type==='jingdiaojun') ? 'transparent' :item.bgColor"
      >
        <template v-slot:avatar>
          <tw-avatar
            :id="item.fromId"
            :name="item.fromName"
            :img="category==='feedback'?'':item.fromAvatar"
            :popupCard="category==='feedback'?false:true"
            :title="category==='feedback'?(selectPersons[item.fromId] && selectPersons[item.fromId].orgShortName ? (item.fromName + ' ' + selectPersons[item.fromId].orgShortName + ' ' + selectPersons[item.fromId].dutyName) : ''):''"
          />
        </template>

        <template v-slot:default>
          <div
            class="chat-message-text"
            v-for="(m, index) in item.text"
            :key="index"
          >
            <!--消息是其他-->
            <template v-if="typeof m==='object'&& m.type===undefined">
              <template v-if="Array.isArray(m)">
                <attach-card
                  v-for="(f,index) in m"
                  :key="index"
                  :attach="f"
                  simple
                />
              </template>
              <attach-card
                v-else
                :attach="m"
                simple
              />
            </template>

            <!--消息是精雕君-->
            <template v-else-if="typeof m==='object'&& m.type==='jingdiaojun'">
              <img
                class="message-image"
                :src=m.url
              />
            </template>

            <!--消息是字符串-->
            <template v-else>
              <div v-html="m" />
            </template>

          </div>
        </template>
      </q-chat-message>

    </template>
  </q-infinite-scroll>
</template>
<script>
import { date, LocalStorage } from 'quasar'
const { formatDate } = date,
  groupFormat = 'MM月DD日,dddd'
import { mapState } from 'vuex'
export default {
  name: 'ChatMessage',
  data () {
    return {
      myinfo: LocalStorage.getItem('myself')
    }
  },
  props: {
    // 消息接受者ID(单聊时为接收者id；群聊时为群组id)
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
    },
    // 会话类型(person：单聊，project、product、team、organize：群聊(项目、产品、群组...))
    category: {
      type: String,
      required: false,
      default: 'feedback'
    },
    feedbackType: {
      type: String,
      required: false,
      default: 'feedback'
    },
    messages: {
      type: [String, Number, Array, Object],
      required: false,
      default: () => []
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    AttachCard: () => import('components/attach/AttachCard.vue'),
    TwGroupHeader: () => import('components/base/TwGroupHeader')
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    messagesContent () {
      if (this.category === 'feedback') {
        _.forEach(this.messages, item => {
          if (item.fromId === this.myinfo.id) {
            item.sent = true
            item.bgColor = 'cyan-1'
            item.textColor = 'black'
          } else {
            item.sent = false
            item.bgColor = 'grey-1'
            item.textColor = 'black'
          }
        })
        let newArr = _.map(this.messages, item => {
          item.time = formatDate(item.sendTime.replace(/-/g, '/'), groupFormat)
          return item
        })
        return _.groupBy(newArr, 'time')
      } else {
        return this.$store.getters[`chat/messagesResource`](this.objectID, this.category)
      }
    },
    objectIDAndCategory () {
      const { objectID, category } = this
      return {
        objectID,
        category
      }
    }
  },
  methods: {
    onLoad (index, done) {
      if (this.category === 'feedback') {
        done(true)
      } else {
        this.$store.dispatch(`chat/loadMessages`, { msgToId: this.objectID, roomType: this.category })
          .then(res => {
            setTimeout(() => {
              if (this.$store.state.chat.page.nextPageToken === -1) {
                done(true)
              } else {
                done()
              }
            }, 200)
          })
      }
    }
  },
  updated () {
    // 聊天定位到底部
    if (this.$store.state.chat.isScrollBottom) {
      let ele = document.getElementById('scroll')
      ele.scrollTop = ele.scrollHeight - ele.clientHeight
    }
  },
  watch: {
    objectIDAndCategory () {
      this.$refs.qInfiniteScroll.reset()
      this.$refs.qInfiniteScroll.resume()
      this.$refs.qInfiniteScroll.trigger()
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll {
  padding-top: 8px;
}
/deep/.q-message-text {
  padding: 0;
}
/deep/.col-self {
  max-width: 80%;
}
.chat-message-text {
  padding: 8px;
  border-radius: 4px 4px 4px 4px;
}
.q-message-sent .chat-message-text {
  text-align: left;
}
.q-message-sent .chat-message-stamp {
  text-align: left;
}
.message-image {
  max-width: 100%;
}
</style>
