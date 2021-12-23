<template>
  <transition
    :name="transitionName"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      class="ball"
      v-if="ballFlag"
    ></div>
  </transition>
</template>

<script>
// 使用方法，指定当前元素和目标元素id，然后执行startAnimation方法就好
export default {
  name: 'TwAddToCartAnimation',
  components: {},
  props: {
    // 动画名称，默认是下抛，可选['parabola-up','parabola-down','linear']，对应相关动画类
    transitionName: {
      type: String,
      default: 'parabola-down',
      validator: val => ['parabola-up', 'parabola-down', 'linear'].includes(val)
    },
    // 起点元素id
    originId: { type: String, required: true, default: '' },
    // 目标元素id，一般不变，直接从父组件传入
    targetId: { type: String, required: true, default: '' },
    // 滚动区域上偏移量，默认是系统工具条的50px
    offsetTop: { type: Number, default: 50 },
    // 外层页面容器选择器
    outsidePage: { type: String, default: '.card-grow-in-page' },
    // 回调函数
    callBack: { type: Function, default: () => { } }
  },
  data () {
    return {
      ballFlag: false,
      originX: 0,
      originY: 0,
      targetX: 0,
      targetY: 0,
      // 页面容器内部左偏移量
      offsetLeft: (document.querySelector(this.outsidePage) &&
        document.querySelector(this.outsidePage).offsetLeft) || 0,
      // 左侧菜单挤压页面宽度，浮于页面上方时宽度为0
      leftDrawerPushWidth: 0
    }
  },
  watch: {
    leftDrawerOpen (newVal, oldVal) {
      // 刷新相关坐标及偏移量
      this.refreshOriginTarget()
      this.offsetLeft = document.querySelector(this.outsidePage).offsetLeft || 0
      // 进度条响应抽屉挤压页面容器变化（断点767以下抽屉浮于页面上方，不会挤压容器）
      if (newVal && document.documentElement.offsetWidth > 767) {
        this.leftDrawerPushWidth = 250
      } else {
        this.leftDrawerPushWidth = 0
      }
    }
  },
  computed: {
    leftDrawerOpen () {
      return this.$store.state.layout.layout.leftDrawerOpen
    }
  },
  methods: {
    startAnimation () {
      this.ballFlag = true
    },
    // 动画钩子函数
    // 进入前状态
    beforeEnter (el) {
      this.refreshOriginTarget()
      // 当前滚动top
      let scrollTop = document.documentElement.scrollTop
      // 设定小球位置
      el.style.top = `${scrollTop + this.originY - this.offsetTop}px`
      el.style.left = `${this.originX - this.offsetLeft - this.leftDrawerPushWidth}px`
    },
    // 进入中
    enter (el, done) {
      // 当前滚动top
      let scrollTop = document.documentElement.scrollTop
      // 设定小球位置
      el.style.top = `${scrollTop + this.targetY - this.offsetTop}px`
      el.style.left = `${this.targetX - this.offsetLeft - this.leftDrawerPushWidth}px`
      done()
    },
    // 进入后
    afterEnter () {
      this.ballFlag = !this.ballFlag
    },
    // 离开后
    afterLeave: function (el) {
      this.callBack()
    },
    // 刷新源与目标位置
    refreshOriginTarget () {
      if (this.originId && this.targetId) {
        // 源位置
        let originEle = document.querySelector(`#${this.originId}`)
        this.originX = originEle.getBoundingClientRect().left
        this.originY = originEle.getBoundingClientRect().bottom

        // 目标位置
        let targetEle = document.querySelector(`#${this.targetId}`)
        this.targetX = targetEle.getBoundingClientRect().right
        this.targetY = targetEle.getBoundingClientRect().bottom
      }
    },
    // 响应浏览器视口宽度变化
    resizeOffsetLeft () {
      this.offsetLeft = document.querySelector(this.outsidePage).offsetLeft || 0
    }
  },
  mounted () {
    window.addEventListener('resize', this.resizeOffsetLeft)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeOffsetLeft)
  }
}
</script>

<style lang='scss' scoped>
.ball {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 17px;
  height: 17px;
  background-color: red;
  border-radius: 50%;
  z-index: 1002;
}

// 上抛
.parabola-up-leave-active {
  transition: top 0.3s ease-out, left 0.3s ease;
}

// 下抛
.parabola-down-leave-active {
  transition: top 0.5s cubic-bezier(0, -0.75, 0.75, 0), left 0.5s linear;
}

// 直线
.linear-leave-active {
  transition: 0.3s all cubic-bezier(0.75, 0.25, 0.75, 0.25);
}
</style>
