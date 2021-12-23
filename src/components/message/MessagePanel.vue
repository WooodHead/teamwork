<template>
  <div>
    <div
      v-if="$q.screen.gt.xs &&!addHeader"
      class="row q-pr-xs"
    >
      <q-space />
      <q-btn
        flat
        dense
        :icon-right="messagePanelFloat?'crop_portrait':'crop_landscape'"
        color="accent"
        :label="messagePanelFloat?$t('message.right'):$t('message.float')"
        @click="toRightOrFloat()"
      />
      <q-space v-if="!messagePanelFloat" />
    </div>

    <!-- 筛选 -->
    <div
      class="row q-pt-sm q-gutter-sm mess-search"
      style="font-size:14px"
    >
      <!-- 类型 -->
      <q-select
        class="mess-search-btn"
        v-model="models"
        :options="options"
        @input="filterReaded"
        outlined
        rounded
        options-dense
        dense
      >
        <!-- <template v-slot:append>
          <q-icon
            v-if="models !== $t('message.allModules')"
            name="close"
            @click.stop="models = $t('message.allModules')"
            class="cursor-pointer"
          />
        </template> -->
      </q-select>
      <!-- 发送人 -->
      <tw-select-person
        class="mess-search-btn"
        v-model="person"
        @reset="ResetPerson"
        @input="filterReaded"
        mode="download"
        outlined
        rounded
        dense
        :placeholder="$t('message.anyone')"
      >
      </tw-select-person>
    </div>
    <q-list>
      <q-item-label
        v-if="!messagesNoRead.length&&!(addHeader&&messagesReaded.length)"
        class="text-subtitle1 text-center"
        header
      >{{$t('message.noNewMessage')}}
      </q-item-label>
      <template v-if="messagesNoRead.length">
        <div class="row">
          <q-item-label
            class="text-subtitle2 text-weight-bold text-pink"
            header
          >{{$t('message.unreadMessage')}}
          </q-item-label>
          <q-space />
          <q-item-label
            class="row items-center"
            style="padding-right: 16px;"
          >
            <q-btn
              flat
              dense
              class="text-grey-6"
              :label="$t('message.markAllRead')"
              @click="markAllRead"
            />
          </q-item-label>
        </div>
      </template>
      <message-item-new
        v-for="message in messagesNoRead"
        :key="message.id"
        :message='message'
        @click.native="open(message.type,message.route,message.id,true)"
      />
      <q-separator v-if="!addHeader&&messagesReaded.length" />
      <q-item-label
        v-if="messagesReaded.length"
        class="text-subtitle2 text-weight-bold"
        header
      >{{$t('message.readedMessage')}}</q-item-label>

      <message-item-previous
        v-for="message in messagesReaded"
        :key="message.id"
        :message='message'
        @click.native="open(message.type,message.route,message.id)"
      />
      <q-item-label
        class="text-subtitle2 text-center"
        header
        v-if="messagesReaded.length>0"
      >
        <q-btn
          flat
          color="primary"
          v-if="this.readPage.nextPageToken>=0"
          :label="$t('message.moreReadedMessage')"
          @click="showMoreReaded"
        />
      </q-item-label>
    </q-list>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'MessagePanel',
  props: {
    addHeader: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself'),
      // 筛选
      models: this.$t('message.allModules'),
      options: [
        this.$t('message.allModules'), this.$t('message.approval'), this.$t('message.notice'), this.$t('message.task'), this.$t('message.doc'), this.$t('message.chat'), this.$t('message.schedule'), this.$t('message.answer'), this.$t('message.discuss')
      ],
      query: []
    }
  },
  components: {
    'message-item-new': () => import('components/message/MessageItemNew'),
    'message-item-previous': () => import('components/message/MessageItemPrevious'),
    'tw-select-person': () => import('components/base/TwSelectPerson')
  },
  computed: {
    ...mapGetters('message', ['messagesUnread', 'messagesReaded']),
    ...mapState('message', ['readPage', 'messagePanelFloat']),
    ...mapState('layout', ['layout']),
    rightDrawerOpen: {
      get () {
        return this.layout.rightDrawerOpen
      },
      set (value) {
        this.setRightDrawerOpen(value)
      }
    },
    // 筛选未读
    messagesNoRead () {
      let noReadResult = []
      switch (this.models) {
        case this.$t('message.allModules'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID) : this.messagesUnread
          break
        case this.$t('message.approval'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && (item.type.indexOf('Done') >= 0 || item.type.indexOf('Approval') >= 0)) : _.filter(this.messagesUnread, item => (item.type.indexOf('Done') >= 0 || item.type.indexOf('Approval') >= 0))
          break
        case this.$t('message.notice'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && item.type === 'notice') : _.filter(this.messagesUnread, item => item.type === 'notice')
          break
        case this.$t('message.task'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && item.type.indexOf('task') >= 0) : _.filter(this.messagesUnread, item => item.type.indexOf('task') >= 0)
          break
        case this.$t('message.doc'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && item.type === 'doc') : _.filter(this.messagesUnread, item => item.type === 'doc')
          break
        case this.$t('message.chat'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && item.type === 'chat') : _.filter(this.messagesUnread, item => item.type === 'chat')
          break
        case this.$t('message.schedule'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && item.type === 'schedule') : _.filter(this.messagesUnread, item => item.type === 'schedule')
          break
        case this.$t('message.answer'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && (item.type === 'answer' || item.type === 'question')) : _.filter(this.messagesUnread, item => (item.type === 'answer' || item.type === 'question'))
          break
        case this.$t('message.discuss'):
          noReadResult = this.person.id ? _.filter(this.messagesUnread, item => this.person.id === item.senderID && item.type === 'discuss') : _.filter(this.messagesUnread, item => item.type === 'discuss')
          break
      }
      return noReadResult
    },
    // 搜索人员
    person: {
      get () {
        return this.$store.state.message.person || {
          id: null,
          name: '',
          type: 'all'
        }
      },
      set (value) {
        this.setPerson(value)
      }
    }
  },
  mounted () {
    if (!this.messagesReaded.length) {
      this.loadMessagesUnread()
      this.loadMessagesReadedMore()
      // 筛选人员
      this.person = {
        id: null,
        name: '',
        type: 'all'
      }
    }
  },
  methods: {
    ...mapActions('message', ['loadMessagesUnread', 'loadMessagesReadedMore', 'readMessage', 'markAllRead']),
    ...mapActions('feedback', ['loadFeedback']),
    ...mapActions('layout', ['setRightDrawerOpen']),
    ...mapMutations('message', ['toggleMessagePanelFloat', 'setPerson', 'setReadPage', 'setEmptyMessages']),
    ...mapMutations('feedback', ['setIsVisible', 'setNewChat', 'setNewChatId', 'setRoom', 'setMessage', 'setFeedbacks']),
    ResetPerson () {
      let person = {
        id: null,
        name: '',
        type: 'all'
      }
      this.setPerson(person)
      this.query = []
      var type = ''
      switch (this.models) {
        case this.$t('message.approval'):
          type = 'approval'
          break
        case this.$t('message.notice'):
          type = 'notice'
          break
        case this.$t('message.task'):
          type = 'task'
          break
        case this.$t('message.doc'):
          type = 'doc'
          break
        case this.$t('message.chat'):
          type = 'chat'
          break
        case this.$t('message.schedule'):
          type = 'schedule'
          break
        case this.$t('message.answer'):
          type = 'answer'
          break
        case this.$t('message.discuss'):
          type = 'discuss'
          break
      }
      if (this.models === this.$t('message.allModules')) {
      } else if (this.models === this.$t('message.approval')) {
        this.query.push('and', [{ Key: 'Type', Value: `${type}%`, Oper: 'like' }, 'or', { Key: 'Type', Value: '%Approval%', Oper: 'like' }, 'or', { Key: 'Type', Value: '%Done%', Oper: 'like' }])
      } else if (this.models === this.$t('message.task')) {
        this.query.push('and', { Key: 'Type', Value: `${type}%`, Oper: 'like' })
      } else if (this.models === this.$t('message.answer')) {
        this.query.push('and', [{ Key: 'Type', Value: _.toString(type), Oper: 'eq' }, 'or', { Key: 'Type', Value: _.toString('question'), Oper: 'eq' }])
      } else {
        this.query.push('and', { Key: 'Type', Value: _.toString(type), Oper: 'eq' })
      }
      this.setEmptyMessages()
      this.setReadPage({ offset: 0, nextPageToken: 0 })
      this.loadMessagesReadedMore({ query: this.query })
      this.loadMessagesUnread()
    },
    showMoreReaded () {
      if (this.$route.name !== 'message') {
        this.$router.push({ name: 'message' })
      } else {
        this.query = []
        var type = ''
        switch (this.models) {
          case this.$t('message.approval'):
            type = 'approval'
            break
          case this.$t('message.notice'):
            type = 'notice'
            break
          case this.$t('message.task'):
            type = 'task'
            break
          case this.$t('message.doc'):
            type = 'doc'
            break
          case this.$t('message.chat'):
            type = 'chat'
            break
          case this.$t('message.schedule'):
            type = 'schedule'
            break
          case this.$t('message.answer'):
            type = 'answer'
            break
          case this.$t('message.discuss'):
            type = 'discuss'
            break
        }
        if (this.models === this.$t('message.allModules')) {
        } else if (this.models === this.$t('message.approval')) {
          this.query.push('and', [{ Key: 'Type', Value: `${type}%`, Oper: 'like' }, 'or', { Key: 'Type', Value: '%Approval%', Oper: 'like' }, 'or', { Key: 'Type', Value: '%Done%', Oper: 'like' }])
        } else if (this.models === this.$t('message.task')) {
          this.query.push('and', { Key: 'Type', Value: `${type}%`, Oper: 'like' })
        } else if (this.models === this.$t('message.answer')) {
          this.query.push('and', [{ Key: 'Type', Value: _.toString(type), Oper: 'eq' }, 'or', { Key: 'Type', Value: _.toString('question'), Oper: 'eq' }])
        } else {
          this.query.push('and', { Key: 'Type', Value: _.toString(type), Oper: 'eq' })
        }
        if (this.person.id) {
          this.query.push('and', { Key: 'SenderID', Value: this.person.id, Oper: 'eq' })
        }
        this.loadMessagesReadedMore({ query: this.query })
      }
    },
    open (type, route, id, unread) {
      // 未读的消息变更消息为已读
      if (unread) {
        this.readMessage(id)
      }
      if (type === 'feedback' && !this.myinfo.auth.role.isSupporter) {
        this.loadFeedback(route.params.id).then(res => {
          this.setFeedbacks([res])
          if (res.state === 2) {
            this.setIsVisible(true)
            this.setRoom(false)
            this.setMessage(true)
            this.setNewChat(true)
            this.setNewChatId(route.params.id)
          } else {
            this.setIsVisible(true)
            this.setRoom(true)
            this.setMessage(false)
            this.setNewChat(false)
          }
        })
        this.setIsVisible(true)
        this.setRoom(true)
        this.setMessage(false)
      } else {
        if (route && route.name) {
          this.$router.push({
            name: route.name,
            params: route.params
          })
        }
      }
    },
    toRightOrFloat () {
      this.toggleMessagePanelFloat()
      const msgInRightDrawer = LocalStorage.getItem('msgInRightDrawer') || []
      if (this.messagePanelFloat) {
        msgInRightDrawer.splice(msgInRightDrawer.findIndex(n => n === this.myinfo.id), 1)
        LocalStorage.set('msgInRightDrawer', msgInRightDrawer)
        this.rightDrawerOpen = false
        this.$root.$emit('popupMessagePanel')
      } else {
        msgInRightDrawer.push(this.myinfo.id)
        LocalStorage.set('msgInRightDrawer', msgInRightDrawer)
        this.rightDrawerOpen = true
      }
    },
    filterReaded () {
      this.query = []
      var type = ''
      switch (this.models) {
        case this.$t('message.approval'):
          type = 'approval'
          break
        case this.$t('message.notice'):
          type = 'notice'
          break
        case this.$t('message.task'):
          type = 'task'
          break
        case this.$t('message.doc'):
          type = 'doc'
          break
        case this.$t('message.chat'):
          type = 'chat'
          break
        case this.$t('message.schedule'):
          type = 'schedule'
          break
        case this.$t('message.answer'):
          type = 'answer'
          break
        case this.$t('message.discuss'):
          type = 'discuss'
          break
      }
      if (this.models === this.$t('message.allModules')) {
      } else if (this.models === this.$t('message.approval')) {
        this.query.push('and', [{ Key: 'Type', Value: `${type}%`, Oper: 'like' }, 'or', { Key: 'Type', Value: '%Approval%', Oper: 'like' }, 'or', { Key: 'Type', Value: '%Done%', Oper: 'like' }])
      } else if (this.models === this.$t('message.task')) {
        this.query.push('and', { Key: 'Type', Value: `${type}%`, Oper: 'like' })
      } else if (this.models === this.$t('message.answer')) {
        this.query.push('and', [{ Key: 'Type', Value: _.toString(type), Oper: 'eq' }, 'or', { Key: 'Type', Value: _.toString('question'), Oper: 'eq' }])
      } else {
        this.query.push('and', { Key: 'Type', Value: _.toString(type), Oper: 'eq' })
      }
      if (this.person.id) {
        this.query.push('and', { Key: 'SenderID', Value: this.person.id, Oper: 'eq' })
      }
      this.setEmptyMessages()
      this.setReadPage({ offset: 0, nextPageToken: 0 })
      this.loadMessagesReadedMore({ query: this.query })
      this.loadMessagesUnread()
    }
  }
}
</script>
<style lang='scss' scoped>
  .mess-search {
    margin-left: 0;
  }
  .mess-search-btn {
    width: 150px;
  }
  @media (max-width: $breakpoint-xs-max) {
    .mess-search-btn {
      width: 130px;
    }
  }
</style>
