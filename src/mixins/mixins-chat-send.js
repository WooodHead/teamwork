import { mapActions } from 'vuex'
import confetti from 'canvas-confetti'
export default {
  props: {
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
    },
    category: {
      type: String,
      required: false,
      default: 'person'
    }
  },
  methods: {
    ...mapActions('chat', ['sendMessage']),
    // 发送消息
    send (m) {
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
      if (m === '🎉') {
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
      if (m === '🎊') {
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
      if (m === '💯' || m === '🥇') {
        var end = Date.now() + (15 * 1000)
        // go Buckeyes!
        var colors = ['#bb0000', '#ffffff']
        frame()
      }
      var _this = this
      var ms = null // 定义发送文本数组
      if (_.isObject(m) && (_.isEmpty(m.type) || m.type !== 'jingdiaojun')) {
        ms = []
        if (_.isArray(m)) {
          _.forEach(m, f => {
            ms.push({
              title: f.Title,
              path: f.PathName,
              extension: f.Extension,
              size: f.Size + ''
            })
          })
        } else {
          ms.push({
            title: m.Title,
            path: m.PathName,
            extension: m.Extension,
            size: f.Size + ''
          })
        }
      } else if (_.isObject(m) && m.type === 'jingdiaojun') {
        ms = m
      } else if (!_.isObject(m) && m.trim() !== '') {
        ms = m
      } else {
        _this.$q.notify({ message: '发送内容不能为空', icon: 'warning', color: 'purple' })
      }
      // 聊天记录到chat
      ms && _this.sendMessage({
        type: _this.category,
        toId: Number(_this.objectID),
        text: ms
      })
    }
  }
}
