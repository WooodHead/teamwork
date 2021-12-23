<template>
  <widget-layout
    :isEmpty="messages.length===0"
    :category="category"
    :id="objectID"
    widget="chat"
    :isSetting="false"
    :class="messages.length>0?'chat-widget':''"
  >
    <template
      slot="content"
      v-if="messages.length>0"
    >
      <div class="card-body">
        <div class="chat-body">
          <div class="chat-room">
            <q-list :class="{'emoji-font':$q.platform.is.win}">
              <q-item
                v-for="item in messages"
                :key="item.id"
              >
                <q-item-section
                  avatar
                  top
                  class="q-pr-none"
                >
                  <tw-avatar
                    :id="item.fromId"
                    :name="item.fromName"
                    :img="item.fromAvatar"
                    :popupCard="false"
                    size="md"
                  />
                </q-item-section>
                <q-item-section class="text-left bg-grey-2 q-pa-xs rounded-borders">
                  <q-item-label><span class="text-weight-bold">{{ item.fromName }}</span>
                    <span class="text-grey-6">{{item.stamp&&item.stamp.substring(10,16)}}</span>
                  </q-item-label>
                  <q-item-label
                    class="ellipsis"
                    lines="1"
                    v-for="(m, index) in item.text"
                    :key="index"
                  >
                    <template v-if="typeof m != 'object'">
                      {{m}}
                    </template>
                    <template v-else>
                      <template v-if="Array.isArray(m)">
                        <attach-card
                          v-for="(f,index) in m"
                          :key="index"
                          :attach="f"
                          :extranet="true"
                          :simple="true"
                          :isIcon="true"
                        ></attach-card>
                      </template>
                      <attach-card
                        style="height:1rem"
                        v-else
                        :attach="m"
                        :extranet="true"
                        :simple="true"
                        :isIcon="true"
                      ></attach-card>
                    </template>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </template>
  </widget-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'WidgetChat',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar'),
    AttachCard: () => import('components/attach/AttachCard.vue')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: true }
  },
  data () {
    return {
      messages: []
    }
  },
  mounted () {
    // 获取用户聊天记录
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    ...mapActions('chat', ['loadMessages']),
    ...mapMutations('chat', ['initPage']),
    init () {
      var _this = this
      _this.initPage()
      if (_this.category === 'person' && _this.objectID === _this.$myinfo.id) {
        _this.loadMessages({ msgToId: 0, roomType: '' })
          .then(res => {
            _this.messages = _.orderBy(res, ['stamp', ['asc']])
          })
      } else {
        _this.loadMessages({ msgToId: _this.objectID, roomType: _this.category })
          .then(res => {
            _this.messages = _.orderBy(res, ['stamp', ['asc']])
          })
      }
    }
  },
  watch: {
    objectID (val) {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.q-item__section--avatar {
  min-width: 38px;
}
.chat-widget /deep/.widget-card-section > div:first-child {
  position: absolute;
  z-index: 2;
  right: 0;
  left: 0;
  background: white;
}
.chat-widget /deep/.widget-card-section > div:nth-child(2) {
  top: 34px;
  z-index: 1;
}
.chat-widget .card-body {
  position: absolute;
  bottom: 5px;
  top: 40px;
  left: 0;
  right: 0;
}
.chat-widget .chat-body {
  width: 100%;
  height: 100%;
}
.chat-widget .chat-room {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
