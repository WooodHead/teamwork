<template>
  <q-card class="column feed-back-card">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-center">
        <span>问题反馈</span>
        <q-icon
          name="info"
          class="q-ml-sm"
          color="grey-8"
          @click="showTip=!showTip"
        >
        </q-icon>
        <q-tooltip v-model="showTip">
          你的反馈将会被提交给Goya<br />
          你也会在此看到Goya给你的回复
        </q-tooltip>
      </div>
      <q-separator class="q-mt-sm" />
    </q-card-section>
    <!-- 消息面板 -->
    <q-card-section class="q-px-md message-panel scroll">
      <chat-message :messages="messages" />
    </q-card-section>

    <q-separator />
    <!--发送消息-->
    <q-card-actions :class="['bg-grey-1', 'q-px-md']">
      <chat-editor
        dense
        :autogrow="true"
        @send="send"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
// import chatsend from '@/mixins/mixins-chat-send'
// const config = require('app/app.config.js')
import { date, LocalStorage } from 'quasar'
import confetti from 'canvas-confetti'
import { mapActions } from 'vuex'
const { formatDate } = date
export default {
  name: 'StaffFeedBack',
  // mixins: [chatsend],
  props: {
    model: {
      type: Object
    }
  },
  components: {
    ChatEditor: () => import('components/chat/ChatEditor'),
    ChatMessage: () => import('components/chat/ChatMessage')
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself'),
      showTip: false,
      messages: []
    }
  },
  computed: {
    // heightStyle () {
    //   let heightStyle = ''
    //   if (!this.$q.platform.is.mobile) {
    //     if (['service', 'consult'].includes(this.$route.query.type)) {
    //       // 66代表容器的外边距+header的高度，83代表twheader的高度，101代表底部editer的高度，40代表面包屑的高度
    //       heightStyle = document.documentElement.clientHeight - 66 - 83 - 101 - 40
    //     } else {
    //       heightStyle = document.documentElement.clientHeight - 66 - 83 - 61 - 40
    //     }
    //   } else {
    //     if (this.category === 'person' && this.callHeightStyle(this.person)) {
    //       heightStyle = document.documentElement.clientHeight - 66 - 48 - 101 - 41
    //     } else {
    //       heightStyle = document.documentElement.clientHeight - 66 - 48 - 61 - 41
    //     }
    //   }
    //   return `height:${heightStyle}px`
    // },
    // callHeightStyle: function () {
    //   return person => {
    //     if (person && person.dutyLevel && person.dutyLevel > 0) {
    //       if (config.dutyLevelProtection) {
    //         return person.dutyLevel >= config.dutyLevelProtection
    //       } else {
    //         return person.dutyLevel >= 6
    //       }
    //     } else {
    //       return false
    //     }
    //   }
    // }
  },
  methods: {
    ...mapActions('salary', ['addSalaryFeedBack', 'updateFeedbackField']),
    send (val) {
      // 表情动画
      // 庆祝
      const fire = function (particleRatio, opts) {
        var count = 200
        var defaults = {
          origin: { y: 0.7 },
          zIndex: 2030
        }
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }))
      }
      if (val === '🎉') {
        fire(0.25, {
          spread: 26,
          startVelocity: 55
        })
        fire(0.2, {
          spread: 60
        })
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        })
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        })
        fire(0.1, {
          spread: 120,
          startVelocity: 45
        })
      }
      // 彩球
      const randomInRange = function (min, max) {
        return Math.random() * (max - min) + min
      }
      if (val === '🎊') {
        var duration = 15 * 1000
        var animationEnd = Date.now() + duration
        var defaults = { startVelocity: 30, spread: 360, ticks: 60 }
        var interval = setInterval(function () {
          var timeLeft = animationEnd - Date.now()
          if (timeLeft <= 0) {
            return clearInterval(interval)
          }
          var particleCount = 50 * (timeLeft / duration)
          // since particles fall down, start a bit higher than random
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, zIndex: 2030 }))
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, zIndex: 2030 }))
        }, 250)
      }
      // 满分、得奖
      const frame = function () {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          zIndex: 2030
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          zIndex: 2030
        })
        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      if (val === '💯' || val === '🥇') {
        var end = Date.now() + (15 * 1000)
        // go Buckeyes!
        var colors = ['#bb0000', '#ffffff']
        frame()
      }
      var _this = this
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
        _this.$q.notify({ message: '发送内容不能为空', icon: 'warning', color: 'purple' })
      }
      this.updateFeedbackField({ id: this.model.id, content: val })
      let id = Math.random()
      this.messages.push({
        content: val,
        fromId: id < 0.5 ? this.myinfo.id : 319,
        fromName: id < 0.5 ? this.myinfo.name : '童伟娟',
        sendTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        text: _.isObject(val) ? val : [val]
      })
    }
  },
  mounted () {
    console.log(this.model)
  }
}
</script>

<style lang="scss" scoped>
.feed-back-card {
  width: 100%;
  max-width: 500px;
  height: 60vh;
  .message-panel {
    flex: 1;
  }
}
</style>
<style>
.fullscreen {
  z-index: 100;
}
</style>
