<template>
  <q-page :class="{'q-pa-sm column items-center':$q.screen.gt.xs}">
    <!-- 内容区域 -->
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <tw-header-card :title="title" />
      <div :class="$q.screen.gt.xs?'q-px-xl chatCenter-body flex':''">
        <div
          class="chatCenter-list scroll"
          v-if="chatList.length>0"
        >
          <q-list
            separator
            :style="$q.screen.gt.xs?'width: 200px':'min-width: 200px'"
          >
            <div
              v-for="chat in chatList"
              :key="chat.id+chat.type"
            >
              <q-item
                v-ripple
                clickable
                :active="$q.screen.gt.xs&&active==chat.id"
                @click.stop="tochat(chat)"
              >
                <q-item-section
                  top
                  avatar
                >
                  <tw-avatar
                    v-if="chat.type==='person'"
                    :id="chat.id"
                  />
                  <tw-avatar
                    v-else
                    :id="chat.id"
                    :name="chat.name"
                  />
                </q-item-section>
                <q-item-section class="ellipsis">
                  <q-item-label class="ellipsis">
                    {{chat.name}}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>
        <div
          class="chatCenter-cont"
          v-if="!$q.screen.lt.sm"
        >
          <q-card-section class="scroll chatCenter-scroll">
            <chat-message
              :objectID="objectID"
              :category="category"
            />
          </q-card-section>
          <q-card-actions class="chatCenter-action">
            <chat-editor
              dense
              :autogrow="true"
              @send="send"
            />
          </q-card-actions>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import chatsend from '@/mixins/mixins-chat-send'
import { LocalStorage, format } from 'quasar'
import { getUrl } from '@/boot/file'
const { capitalize } = format // 字符串首字母大写
import { mapActions } from 'vuex'
export default {
  name: 'ChatCenter',
  mixins: [chatsend],
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ChatEditor: () => import('components/chat/ChatEditor'),
    ChatMessage: () => import('components/chat/ChatMessage')
  },
  data () {
    return {
      active: 0,
      title: '聊天列表',
      chatList: []
    }
  },
  methods: {
    ...mapActions('chat', ['loadMessages']),
    init () {
      var _this = this
      return _this.loadMessages({ msgToId: 0, roomType: '' }).then(async messages => {
        // 设置聊天列表
        for (const m of messages) {
          var reqId = 0
          if (m.type === 'person') {
            reqId = m.sent ? Number(m.toId) : Number(m.fromId)
          } else {
            reqId = Number(m.toId)
          }
          await _this.$store.dispatch(`${m.type}/load${capitalize(m.type)}`, reqId).then(res => {
            if (res.id) {
              _this.chatList.push(..._.differenceBy([{
                id: reqId,
                name: res.name || res.title || res.Title,
                avatar: getUrl(res.img || res.Img),
                type: m.type
              }], _this.chatList, 'id'))
            }
          })
        }
        // 获取当前登录人所有的聊天人或者群组列表
        if (!_.map(_this.chatList, 'id').includes(Number(_this.objectID)) && LocalStorage.getItem('myself').id !== Number(_this.objectID)) {
          await _this.$store.dispatch(`${_this.category}/load${capitalize(_this.category)}`, Number(_this.objectID)).then(res => {
            _this.chatList.push(..._.differenceBy([{
              id: Number(_this.objectID),
              name: res.name || res.title || res.Title,
              type: _this.category,
              avatar: getUrl(res.img || res.Img)
            }], _this.chatList, 'id'))
          })
        }
        return _this.chatList
      })
    },
    tochat (chat) {
      // 改变，重新获取聊天内容
      this.objectID = chat.id
      this.category = chat.type
      // 移动端聊天窗口的激活和打开
      if (!this.$q.screen.gt.xs) {
        // 打开聊天窗口
        this.$router.push({
          name: 'chat',
          params: { category: chat.type, objectID: chat.id }
        })
      } else {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chatCenter-list {
  flex: 0 0 auto;
  height: 75vh;
  border: 1px solid #f2f2f2;
}
.chatCenter-cont {
  position: relative;
  flex: 1 1 auto;
  height: 75vh;
  border: 1px solid #f2f2f2;
}
.chatCenter-scroll {
  position: absolute;
  right: 0;
  left: 0;
  top: 8px;
  bottom: 60px;
  padding: 0 5px;
}
.chatCenter-action {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
}
.chat-editor {
  border: 2px solid #d9d9d9;
  border-radius: 0.4rem;
  transition: all 30ms ease-out;
}
/deep/.card-grow-in-page > div > .q-card__section {
  margin: 0;
  padding: 0 48px;
}
</style>
