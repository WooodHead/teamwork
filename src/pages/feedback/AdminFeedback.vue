<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page q-px-xxl"
    >
      <!-- 头部logo -->
      <q-card-section class="text-center">
        <!-- 顶部头像 -->
        <tw-avatar
          class="q-mb-sm"
          :id="person.id"
          :name="person.name"
          :img="person.img"
          :popupCard=false
          style="cursor: default !important"
        />
        <div class="text-h5 q-pt-sm">{{$t('feedback.feedbackTitle')}}</div>
      </q-card-section>
      <q-card-section class="message-bar">
        <q-btn-toggle
          v-model="model"
          class="my-custom-toggle"
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="feedbackType"
        >
          <template v-slot:unassignedFeedback>
            <div
              @click="ToggleBtn('unassignedFeedback')"
              class="type-btn"
            >
              {{$t('feedback.unAssign')}}
            </div>
          </template>
          <template v-slot:myFeedback>
            <div
              @click="ToggleBtn('myFeedback')"
              class="type-btn"
            >
              {{$t('feedback.mineAssign')}}
            </div>
          </template>
          <template v-slot:myAssignedFeedback>
            <div
              @click="ToggleBtn('myAssignedFeedback')"
              class="type-btn"
            >
              {{$t('feedback.myAssign')}}
            </div>
          </template>
          <template v-slot:allFeedback>
            <div
              @click="ToggleBtn('allFeedback')"
              class="type-btn"
            >
              {{$t('feedback.allAssign')}}
            </div>
          </template>
        </q-btn-toggle>
      </q-card-section>
      <!-- 无消息显示 -->
      <q-card-section v-if="feedbacks.length===0">
        <tw-banner-no-result
          class="q-mt-sm"
          icon="warning"
          color="warning"
          :info="$t('feedback.noAlarm')"
        />
      </q-card-section>
      <q-card-section class="q-mx-lg q-px-xl q-pt-sm message-list">
        <q-infinite-scroll
          @load="onLoad"
          :offset="250"
          ref="qInfiniteScroll"
        >
          <q-list class="chat-list">
            <q-item
              v-ripple
              class="chat-item"
              v-for="item in feedbacks"
              :key="item.id"
            >
              <div
                class="history-item"
                @click="GoToChat(item.id)"
              >
                <q-item-section
                  class="chat-head"
                  avatar
                >
                  <div class="person-head">
                    <tw-avatar
                      :id="item|newCustomerFeedback('fromId')"
                      :name="item|newCustomerFeedback('fromName')"
                      size="md"
                      font-size="0.6rem"
                      :popupCard=false
                      style="cursor: default !important"
                    />
                  </div>
                </q-item-section>
                <q-item-section :class="item.state===2 ? '':(item.state===0?'chat':'chating')">
                  <q-item-label class="chat-person">
                    <p class="chat-name text-weight-bold">{{item|newCustomerFeedback('fromName')}}</p>
                    <div class="chat-time">
                      <p>{{item.modifyTime}}</p>
                    </div>
                  </q-item-label>
                  <template v-if="$options.filters.typeNewCustomerFeedback(item,'content')">
                    <attach-card
                      v-for="(f, index) in $options.filters.newCustomerFeedback(item,'content')"
                      :key="index"
                      :attach="f"
                      simple
                      class="attachMess"
                    />
                  </template>
                  <q-item-label
                    class="chat-text"
                    v-else
                  >{{item.content[0].content}}</q-item-label>
                </q-item-section>
              </div>
            </q-item>
          </q-list>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template>
        </q-infinite-scroll>
      </q-card-section>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>
<script>
import { LocalStorage } from 'quasar'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'AdminFeedback',
  data () {
    return {
      person: LocalStorage.getItem('myself'),
      offset: 0,
      query: [
        { Key: 'AssignedTo', Value: 0, Oper: 'eq' }
      ],
      feedbackType: [
        { value: 'unassignedFeedback', slot: 'unassignedFeedback' },
        { value: 'myFeedback', slot: 'myFeedback' },
        { value: 'myAssignedFeedback', slot: 'myAssignedFeedback' },
        { value: 'allFeedback', slot: 'allFeedback' }
      ]
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    AttachCard: () => import('components/attach/AttachCard.vue')
  },
  computed: {
    ...mapGetters('feedback', ['filterFeedbacks', 'unassignedFeedbackIndex',
      'myFeedbackIndex', 'myAssignedFeedbackIndex', 'allFeedbackIndex', 'adminChoose']),
    feedbacks () {
      return this.filterFeedbacks(this.adminChoose)
    },
    model () {
      return this.adminChoose
    }
  },
  mounted () {
    this.setAdminMessageId(0)
    this.setUnassignedFeedbackIndex(0)
    this.setMyAssignedFeedbackIndex(0)
    this.setMyFeedbackIndex(0)
    this.setAllFeedbackIndex(0)
  },
  methods: {
    ...mapActions('feedback', ['loadFeedbacks']),
    ...mapMutations('feedback', ['setAdminMessageId',
      'setUnassignedFeedbackIndex', 'setMyAssignedFeedbackIndex', 'setMyFeedbackIndex',
      'setAllFeedbackIndex', 'setAdminChoose']),

    initQInfiniteScroll () {
      this.$refs.qInfiniteScroll && this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
      this.$refs.qInfiniteScroll && this.$refs.qInfiniteScroll.resume() // 重新开启加载
      this.$refs.qInfiniteScroll && this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
    },

    ToggleBtn (e) {
      // 未指派的消息
      if (e === 'unassignedFeedback') {
        this.setAdminChoose('unassignedFeedback')
        this.query = [
          { Key: 'AssignedTo', Value: 0, Oper: 'eq' }
        ]
      }
      // 我的消息
      if (e === 'myFeedback') {
        this.setAdminChoose('myFeedback')
        this.query = [
          { Key: 'AssignedTo', Value: this.person.id, Oper: 'eq' }
        ]
      }
      // 我指派的消息
      if (e === 'myAssignedFeedback') {
        this.setAdminChoose('myAssignedFeedback')
        this.query = [
          { Key: 'Assigner', Value: this.person.id, Oper: 'eq' }
        ]
      }
      // 所有消息
      if (e === 'allFeedback') {
        this.setAdminChoose('allFeedback')
        this.query = null
      }
      this.initQInfiniteScroll()
    },
    // PC端滚动加载调用方法
    onLoad (index, done) {
      // 记录当前的页码数，再次进入时判断页码数和index的大小，
      // 如果小于，则从后台获取，反之，从前台缓存中获取
      switch (this.adminChoose) {
        case 'unassignedFeedback':
          if (this.unassignedFeedbackIndex < index) {
            this.loadFeedbacks({
              query: this.query,
              byPage: true,
              pageIndex: index
            }).then(() => {
              this.setUnassignedFeedbackIndex(index)
              let pagePayload = this.$store.state.feedback.page
              if (pagePayload.nextPageToken === -1) {
                done(true)
              } else {
                done()
              }
            })
          } else {
            done(true)
          }
          break
        case 'myFeedback':
          if (this.myFeedbackIndex < index) {
            this.loadFeedbacks({
              query: this.query,
              byPage: true,
              pageIndex: index
            }).then(() => {
              this.setMyFeedbackIndex(index)
              let pagePayload = this.$store.state.feedback.page
              if (pagePayload.nextPageToken === -1) {
                done(true)
              } else {
                done()
              }
            })
          } else {
            done(true)
          }
          break
        case 'myAssignedFeedback':
          if (this.myAssignedFeedbackIndex < index) {
            this.loadFeedbacks({
              query: this.query,
              byPage: true,
              pageIndex: index
            }).then(() => {
              this.setMyAssignedFeedbackIndex(index)
              let pagePayload = this.$store.state.feedback.page
              if (pagePayload.nextPageToken === -1) {
                done(true)
              } else {
                done()
              }
            })
          } else {
            done(true)
          }
          break
        case 'allFeedback':
          if (this.allFeedbackIndex < index) {
            this.loadFeedbacks({
              query: this.query,
              byPage: true,
              pageIndex: index
            }).then(() => {
              this.setAllFeedbackIndex(index)
              let pagePayload = this.$store.state.feedback.page
              if (pagePayload.nextPageToken === -1) {
                done(true)
              } else {
                done()
              }
            })
          } else {
            done(true)
          }
          break
      }
    },

    GoToChat (e) {
      this.$router.push({
        path: '/feedback/chat-room/' + `${e}`
      })
    }

  },
  filters: {
    typeNewCustomerFeedback (val1, val2) {
      if (!_.isEmpty(val1)) {
        let a = _.filter(val1.content, item => val1.provider === item.fromId)
        if (!_.isEmpty(a[a.length - 1]) && Array.isArray(a[a.length - 1][val2])) {
          return true
        } else {
          return false
        }
      }
    },
    newCustomerFeedback (val1, val2) {
      if (!_.isEmpty(val1)) {
        let a = _.filter(val1.content, item => val1.provider === item.fromId)
        if (!_.isEmpty(a[a.length - 1])) { return a[a.length - 1][val2] }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.message-bar {
  display: flex;
  justify-content: center;
}
/deep/ .q-btn-group > .q-btn-item {
  border-radius: 28px;
  border-top-right-radius: 28px;
  border-bottom-right-radius: 28px;
  margin-right: 20px;
  border: 1px solid $primary;
}
/deep/ .q-btn-group > .q-btn-item.bg-primary {
  border: none;
}
/deep/ .q-btn-group > .q-btn-item:last-child {
  margin-right: 0;
}
/deep/ .my-custom-toggle .q-btn__wrapper {
  padding: 0;
  min-height: 0;
}
.type-btn {
  padding: 0 16px;
  line-height: 36px;
}
.chat-item {
  min-height: 0;
  padding: 0;
}
.history-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 15px 5px;
  width: 100%;
  display: flex;
  cursor: pointer;
}
.chat-head {
  justify-content: flex-start;
  min-width: 35px;
  padding: 0;
  margin-right: 16px;
}
.chat-person {
  display: flex;
  justify-content: space-between;
}
.chat-name {
  margin: 0;
}
.chat-time {
  margin: 0;
}
.chat-time p {
  font-size: 13px;
  color: #9e9e9e;
  margin: 0;
}
.chat-text {
  margin-top: 6px;
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
.chating .chat-name,
.chating .chat-text,
.chating .chat-time p {
  color: $friend;
}
.chat .chat-name,
.chat .chat-text,
.chat .chat-time p {
  color: $primary;
}
.attachMess {
  max-height: 51px;
  overflow: hidden;
  margin-top: 6px;
}
/deep/ .attachMess .q-item-type {
  padding: 0;
}
@media (max-width: 830px) {
  /deep/ .card-grow-in-page {
    padding-left: 60px;
    padding-right: 60px;
  }
  /deep/ .card-grow-in-page .q-px-xl {
    padding-left: 35px;
    padding-right: 35px;
  }
}
@media (max-width: 720px) {
  /deep/ .card-grow-in-page {
    padding-left: 35px;
    padding-right: 35px;
  }
  /deep/ .card-grow-in-page .q-px-xl {
    padding-left: 0;
    padding-right: 0;
  }
}
@media (max-width: $breakpoint-xs-max) {
  .q-px-xxl {
    padding-left: 0;
    padding-right: 0;
  }
  /deep/ .q-btn-group > .q-btn-item {
    margin-right: 10px;
    height: 32px;
  }
  /deep/ .q-btn-group > .q-btn-item:nth-child(2),
  /deep/ .q-btn-group > .q-btn-item:last-child {
    margin-right: 0;
  }
  .type-btn {
    padding: 0 10px;
    line-height: 30px;
    font-size: 13px;
  }
  .chat-head {
    margin-right: 12px;
    width: 35px;
    height: 35px;
  }
  .chat-name {
    font-size: 13px;
  }
  .chat-time p {
    font-size: 12px;
  }
  .chat-text {
    margin-top: 5px;
    font-size: 13px;
  }
  .attachMess {
    max-height: 47px;
  }
}
@media (max-width: 500px) {
  /deep/ .message-bar .q-btn-group {
    display: block;
    width: 195px;
  }
  /deep/ .q-btn-group > .q-btn-item:nth-child(1),
  /deep/ .q-btn-group > .q-btn-item:nth-child(2) {
    margin-bottom: 10px;
  }
  /deep/ .message-bar {
    padding-bottom: 0;
    padding-top: 0;
  }
}
</style>
