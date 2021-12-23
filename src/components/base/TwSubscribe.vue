<template>
  <q-card
    flat
    class="print-hide"
  >
    <div
      class="row items-center"
      :class="textSize"
    >
      <span>{{$t('subscribe.subscribe')}}</span>
      <q-separator class="col q-ml-sm" />
    </div>
    <!-- 订阅显示与设置区域 -->
    <q-card-section class="q-px-none q-gutter-xs">
      <div class="q-pb-sm">
        {{$t('subscribe.subscriberCountNote',{number:subscriber.subscribers?subscriber.subscribers.length:0})}}</div>
      <div class="q-gutter-sm">
        <tw-avatar
          v-for="id in showedSubscribers"
          :key="id"
          :id="id"
          size="md"
        />
        <q-avatar
          v-if="moreSubscribers>0"
          text-color="grey-7"
          class="cursor-pointer"
          size="md"
          font-size="0.8rem"
          style="border:1px solid #757575;"
          @click="showedSubscriberNum+=20"
        ><span>+{{moreSubscribers}}</span></q-avatar>
        <q-btn
          outline
          rounded
          color="primary"
          :label="$t('subscribe.addOrRemovePerson')"
          @click="showSubscriberSelect=true"
        />
      </div>
    </q-card-section>
    <!-- 当前用户订阅或取消订阅区域 -->
    <q-card-section class="q-pa-none q-gutter-xs">
      <div class="text-h6">
        {{isSubscriber?$t('subscribe.subscribeMeTitle'):$t('subscribe.unsubscribeMeTitle')}}
      </div>
      <div class="q-pb-sm">
        {{isSubscriber?$t('subscribe.subscribeMeNote'):$t('subscribe.unsubscribeMeNote')}}
      </div>
      <div class="q-gutter-sm">
        <q-btn
          outline
          rounded
          color="primary"
          :label="isSubscriber?$t('subscribe.unsubscribeMe'):$t('subscribe.subscribeMe')"
          @click="subscriberOrNo"
        />
      </div>
    </q-card-section>
    <!-- 订阅者选择弹出框 -->
    <q-dialog
      v-model="showSubscriberSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        @multiSelect="closeSubscriberSelect"
        :isVirtualScroll="true"
        :multiple="true"
        :initSelectedPersonIDs="subscriber.subscribers"
        :quickSelected="quickSelected"
      >
      </person-select-panel>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'TwSubscribe',
  props: {
    objectType: {
      type: String,
      required: true,
      description: '资源类别'
    },
    objectID: {
      type: [Number, String],
      required: true,
      description: '资源ID'
    },
    quickSelected: {
      type: Object,
      required: false,
      default: null,
      description: '快捷选中指定人员 eg：{title:"项目成员",personIDs:[292,1,2]}'
    }
  },
  data () {
    return {
      showedSubscriberNum: 20,
      showSubscriberSelect: false,
      subscriber: {
        objectID: this.objectID,
        objectType: this.objectType,
        subscribers: [],
        subscriberModels: []
      },
      textSize: this.$q.platform.is.desktop ? 'text-h5' : 'text-h6'
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.init()
      }
    }
  },
  computed: {
    myInfo: () => LocalStorage.getItem('myself'),
    // 当前用户是否已订阅（假定当前用户ID为1）
    isSubscriber () {
      let that = this
      return _.includes(that.subscriber.subscribers, that.myInfo.id)
    },
    showedSubscribers () {
      return _.slice(this.subscriber.subscribers, 0, this.showedSubscriberNum)
    },
    moreSubscribers () {
      return this.subscriber.subscribers && (this.subscriber.subscribers.length - this.showedSubscriberNum)
    }
  },
  methods: {
    ...mapActions('subscribe', ['loadSubscribe', 'addOrUpdateSubscribe']),
    init () {
      // 获取订阅model信息
      this.loadSubscribe({
        objectID: this.objectID,
        objectType: this.objectType
      }).then(res => {
        if (res) {
          res.subscribers = _.uniq(res.subscribers)
          this.subscriber = res
        }
      })
    },
    // 关闭订阅设置弹框后处理
    closeSubscriberSelect (selectedPersons) {
      let that = this
      that.subscriber.subscribers = _.map(selectedPersons, 'id')
      that.addOrUpdateSubscribe(that.subscriber).then((res) => {
        if (res) {
          // 更新订阅model
          that.subscriber = res
        }
        // 关闭人员选择面板
        that.showSubscriberSelect = false
      })
    },
    // 当前用户订阅或取消订阅处理（假定当前用户ID为1）
    subscriberOrNo () {
      let that = this
      if (that.isSubscriber) {
        that.subscriber.subscribers = _.differenceBy(that.subscriber.subscribers, [that.myInfo.id])
        that.addOrUpdateSubscribe(that.subscriber).then((res) => {
          if (res) {
            // 更新订阅model
            that.subscriber = res
          }
        })
      } else {
        that.subscriber.subscribers = _.concat(that.subscriber.subscribers, that.myInfo.id)
        that.addOrUpdateSubscribe(that.subscriber).then((res) => {
          if (res) {
            // 更新订阅model
            that.subscriber = res
          }
        })
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  }
}
</script>

<style scoped>
.q-card {
  clear: both;
}
</style>
