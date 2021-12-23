<template>
  <div>
    <!-- 锚点 -->
    <q-tabs
      v-model="anchorSelected"
      no-caps
      narrow-indicator
      :class="['bg-grey-3','anchor-tab',{'negative-margin':$q.screen.lt.sm}]"
      active-color="primary"
      indicator-color="primary"
      ref="anchorTab"
    >
      <q-tab
        v-for="anchor in anchors"
        :key="anchor.containerId"
        :name="anchor.containerId"
        :label="anchor.label"
        @click="scrollToView(anchor.containerId)"
      >
        <slot :name="anchor.containerId+'-tab-append'"></slot>
      </q-tab>
    </q-tabs>

    <!-- 锚点对应容器 -->
    <div
      v-for="containerId in anchorContainerIds"
      :key="containerId"
      :data-id="containerId"
      :ref="containerId"
      v-intersection="options"
    >
      <div class="relative-position row items-center text-subtitle1 q-pt-md">
        <q-separator class="col gradient-right-to-left" />
        <span class="q-px-md">{{ getLabelByContainerId(containerId) }}
          <slot :name="containerId+'-anchor-append'"></slot>
        </span>
        <q-separator class="col gradient-left-to-right" />
        <span class="absolute-right q-pt-md">
          <slot :name="containerId+'-anchor-right'"></slot>
        </span>
      </div>
      <slot :name="containerId"></slot>
    </div>
  </div>
</template>

<script>
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
export default {
  name: 'TwAnchorTab',
  props: {
    // 锚点列表数组，eg. [{label:'示例1',containerId:'example1'}]
    anchors: { type: Array, required: true },
    offsetHeight: { type: Number, default: 55 }
  },
  data () {
    return {
      anchorFromClick: false,
      anchorSelected: '',
      inView: [],
      options: {
        handler: this.onIntersection,
        cfg: {
          // toolBar height 与 anchorBar height 的和
          rootMargin: '-98px'
        }
      }
    }
  },
  computed: {
    anchorContainerIds () {
      return this.anchors.map(i => i.containerId)
    }
  },
  methods: {
    onIntersection (entry) {
      if (entry.isIntersecting === true) {
        this.add(entry.target.dataset.id)
      } else {
        this.remove(entry.target.dataset.id)
      }
      // 手动点击tab时，不使用交叉自动定位
      if (!this.anchorFromClick) this.anchorSelected = this.inView[0]
    },

    add (i) {
      this.remove(i)
      this.inView.push(i)
      this.inView.sort(this.sortAtoi)
    },

    remove (i) {
      let index
      while ((index = this.inView.indexOf(i)) > -1) {
        this.inView.splice(index, 1)
        this.inView.sort(this.sortAtoi)
      }
    },

    sortAtoi (a, b) {
      return this.anchorContainerIds.indexOf(a) - this.anchorContainerIds.indexOf(b)
    },

    scrollToView (containerId) {
      this.anchorFromClick = true
      let el = this.$refs[containerId][0]
      let target = getScrollTarget(el)
      let duration = 1000
      setScrollPosition(target, el.offsetTop, duration)
      // 滚动结束，变更anchorFromClick为false，设置定时器是因为有耗时的滚动动画
      setTimeout(() => { this.anchorFromClick = false }, duration + 100)
    },

    getLabelByContainerId (containerId) {
      return this.anchors.find(i => i.containerId === containerId)['label']
    }
  }
}
</script>

<style lang="scss" scoped>
.anchor-tab {
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  z-index: 999;
}

.negative-margin {
  margin: 0 -8px;
}
</style>
