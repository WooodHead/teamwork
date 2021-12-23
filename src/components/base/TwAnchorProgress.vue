<template>
  <div>
    <!-- anchor list -->
    <div
      class="anchor-list bg-grey-3"
      :style="{margin: `0 -${paddingLeft}` }"
    >
      <!-- anchor list pc -->
      <div v-if="$q.screen.gt.xs">
        <div
          class="absolute bg-grey-4"
          :style="{height:`${anchorHeight}px`}"
          ref="anchorLabelProgress"
        ></div>
        <div
          class="row text-center relative-position"
          :style="{height:`${anchorHeight}px`,lineHeight:`${anchorHeight}px`}"
          ref="labelEles"
        >
          <div
            v-for="label in anchorLabels"
            :key="label"
            class="col-grow cursor-pointer anchor-label"
            @click="scrollToView(label)"
          >
            {{ label }}</div>
        </div>
      </div>
      <!-- anchor list mobile -->
      <div v-else>
        <q-btn-dropdown
          class="full-width"
          dense
          flat
          :label="anchorSelected"
          :style="{height:`${anchorHeight}px`}"
        >
          <q-list>
            <q-item
              v-for="label in anchorLabels"
              :key="label"
              clickable
              v-close-popup
              @click="scrollToView(label)"
            >
              <q-item-section>
                <q-item-label>{{ label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- anchor container -->
    <div ref="containerEles">
      <div
        v-for="containerId in anchorContainerIds"
        :key="containerId"
      >
        <div class="row items-center text-h6 q-pt-md">
          <q-separator />
          <span class="q-px-md">{{ getLabelByContainerId(containerId) }}</span>
          <q-separator />
        </div>
        <slot :name="containerId"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'quasar'
export default {
  name: 'TwAnchorProgress',
  components: {},
  props: {
    // 锚点列表数组，eg. [{label:'示例1',containerId:'example1'}]
    anchors: { type: Array, required: true },
    // 锚点列表高度
    anchorHeight: { type: Number, default: 40 },
    // 移动端placeholder
    placeHolder: { type: String, default: '下拉列表' }
  },
  data () {
    return {
      anchorSelected: this.placeHolder,
      anchorFromClick: false,
      clientWidth: document.querySelector('main').offsetWidth,
      paddingLeft: getComputedStyle(document.querySelector('main'))['paddingLeft'],
      paddingBottom: getComputedStyle(document.querySelector('main'))['paddingBottom']
    }
  },
  watch: {
    clientWidth (newVal, oldVal) {
      // main容器padding响应浏览器视口宽度变化
      this.paddingLeft = getComputedStyle(document.querySelector('main'))['paddingLeft']
      this.paddingBottom = getComputedStyle(document.querySelector('main'))['paddingBottom']
      // 进度条响应浏览器视口宽度变化
      this.scrollWatch()
    },
    leftDrawerOpen (newVal, oldVal) {
      // 进度条响应抽屉挤压页面容器变化（断点767以下抽屉浮于页面上方，不会挤压容器）
      document.documentElement.offsetWidth > 767 && this.scrollWatch()
    }
  },
  computed: {
    anchorLabels () {
      return this.anchors.map(i => i.label)
    },
    anchorContainerIds () {
      return this.anchors.map(i => i.containerId)
    },
    leftDrawerOpen () {
      return this.$store.state.layout.layout.leftDrawerOpen
    }
  },
  methods: {
    scrollToView (label) {
      this.anchorFromClick = true
      this.anchorSelected = label
      let containerEle = this.getContainerEleByContainerId(this.getContainerIdByLabel(label)),
        containerEleOffsetTop = containerEle.offsetTop - this.anchorHeight
      document.documentElement.scrollTop = containerEleOffsetTop
    },
    // 监听滚动条，更新anchor进度
    scrollWatch () {
      if (this.anchorFromClick) {
        this.anchorFromClick = false
        if (this.$q.screen.gt.xs) {
          let curLabelEle = this.$refs.labelEles.children[this.anchorLabels.indexOf(this.anchorSelected)]
          this.$refs.anchorLabelProgress.style.width = `${curLabelEle.offsetLeft + curLabelEle.offsetWidth}px`
        }
      } else {
        let scrollTop = document.documentElement.scrollTop
        let firstContainerEle = this.getContainerEleByContainerId(this.anchorContainerIds[0])
        for (let containerId of this.anchorContainerIds) {
          let curContainerEle = this.getContainerEleByContainerId(containerId)
          // 如果某个容器被可视区域顶端隔开，则该容器为活动容器
          if (scrollTop >= firstContainerEle.offsetTop - this.anchorHeight &&
            scrollTop < curContainerEle.offsetTop + curContainerEle.offsetHeight - this.anchorHeight) {
            if (!this.$q.screen.gt.xs) {
              this.anchorSelected = this.getLabelByContainerId(containerId)
            } else {
              // 当前容器是否是最后一个容器
              let isLastContainer =
                containerId === this.anchorContainerIds[this.anchorContainerIds.length - 1]
              if (isLastContainer) {
                this.$refs.anchorLabelProgress.style.width = '100%'
              } else {
                let proportion = 0
                // 当前容器的下一个容器
                let nextContainerId = this.anchorContainerIds[this.anchorContainerIds.indexOf(containerId) + 1],
                  nextContainerEle = this.getContainerEleByContainerId(nextContainerId)
                // 下一个容器是否是最后一个容器
                let isNextLastContainer =
                  nextContainerId === this.anchorContainerIds[this.anchorContainerIds.length - 1]
                // 最后一个容器占比单独计算
                if (isNextLastContainer &&
                  nextContainerEle.offsetHeight <= document.documentElement.clientHeight - 50 - this.anchorHeight) {
                  proportion = (scrollTop + this.anchorHeight - curContainerEle.offsetTop) / (curContainerEle.offsetHeight +
                    nextContainerEle.offsetHeight + 50 + this.anchorHeight +
                    (+this.paddingBottom.replace(/px/i, '')) - document.documentElement.clientHeight)
                  // 矫正父级容器padding引起的误差
                  proportion = proportion > 1 ? 1 : proportion
                } else {
                  proportion = (scrollTop + this.anchorHeight - curContainerEle.offsetTop) / curContainerEle.offsetHeight
                }
                // 设置anchor进度
                let nextLabelEle = this.getLabelEleByContainerId(nextContainerId)
                this.$refs.anchorLabelProgress.style.width = `${nextLabelEle.offsetLeft +
                  nextLabelEle.offsetWidth * proportion.toFixed(2)}px`
              }
            }
            break
          } else {
            this.$q.screen.gt.xs
              ? (this.$refs.anchorLabelProgress.style.width = '0')
              : (this.anchorSelected = this.placeHolder)
          }
        }
      }
    },
    getContainerIdByLabel (label) {
      return this.anchors.find(i => i.label === label)['containerId']
    },
    getLabelByContainerId (containerId) {
      return this.anchors.find(i => i.containerId === containerId)['label']
    },
    getContainerEleByContainerId (containerId) {
      return this.$refs.containerEles.children[this.anchorContainerIds.indexOf(containerId)]
    },
    getLabelEleByContainerId (containerId) {
      return this.$refs.labelEles.children[this.anchorContainerIds.indexOf(containerId)]
    },
    resizeWidth () {
      this.clientWidth = document.querySelector('main').offsetWidth
    }
  },
  created () {
    this.scrollWatch = debounce(this.scrollWatch, 50)
  },
  mounted () {
    window.addEventListener('scroll', this.scrollWatch)
    window.addEventListener('resize', this.resizeWidth)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollWatch)
    window.removeEventListener('resize', this.resizeWidth)
  }
}
</script>

<style lang="scss" scoped>
.anchor-list {
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  z-index: 999;
}
.anchor-label:hover {
  background: $grey-5;
}
</style>
