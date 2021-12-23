<!-- 思维导图 -->
<template>
  <q-carousel
    swipeable
    animated
    v-model="currentSlide"
    :fullscreen.sync="fullscreen"
    style="height: 100%;"
  >
    <q-carousel-slide :name="1">
      <div class="mind-map column">
        <!-- 按钮组 -->
        <q-btn-group
          outline
          v-if="controls"
          class="row justify-end"
        >
          <!-- 下载 -->
          <q-btn
            v-if="btns&&btns.includes('download')"
            dense
            icon="get_app"
          >
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="downloadHTML"
                >
                  <q-item-section>
                    <q-item-label>下载HTML</q-item-label>
                    <q-item-label caption>需要联网访问，浏览器打开，支持缩放</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  @click="downloadSVG"
                >
                  <q-item-section>
                    <q-item-label>下载SVG</q-item-label>
                    <q-item-label caption>无需联网访问，不支持缩放</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <!-- 适配大小 -->
          <q-btn
            v-if="btns&&btns.includes('fit')"
            dense
            icon="center_focus_strong"
            :title="$t('document.fitsize')"
            @click="fitMarkMap"
          />
          <!-- 全屏 -->
          <q-btn
            v-if="btns&&btns.includes('full')"
            dense
            :title="fullscreen ? $t('document.fullscreen_exit') : $t('document.fullscreen')"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullMarkMap"
          />
        </q-btn-group>
        <!-- 展示思维导图的svg -->
        <svg
          :id="identity"
          class="full-width col-grow"
        />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { uid } from 'quasar'
// markmap
import * as markmap from 'markmap-lib/dist/view'
import { Markmap, loadCSS, loadJS } from 'markmap-lib/dist/view'
import { transform, getAssets } from 'markmap-lib/dist/transform'
// 思维导图下载
import svgCrowbar from './svg-crowbar'
export default {
  name: 'Mindmap',
  props: {
    // markdown内容
    code: {
      type: String,
      default: null
    },
    // 是否需要按钮
    controls: {
      type: Boolean,
      default: true
    },
    btns: {
      type: Array,
      required: false,
      default: () => {
        return ['download', 'fit', 'full']
      }
    },
    title: {
      type: String,
      default: 'TeamWork'
    }
  },
  data () {
    return {
      markmapObj: null,
      // 是否处于全屏
      fullscreen: false,
      currentSlide: 1,
      identity: 'markmap' + uid()
    }
  },
  computed: {
    markdownData () {
      const { root } = transform(this.code)
      return root
    }
  },
  mounted () {
    this.iniMarkMap()
  },
  methods: {
    iniMarkMap () {
      // Render
      const { features } = transform(this.code)
      const { styles, scripts } = getAssets(_.keys(features))
      if (styles) loadCSS(styles)
      if (scripts) loadJS(scripts, { getMarkmap: () => markmap })
      // create
      this.markmapObj = Markmap.create('#' + this.identity, null, this.markdownData)
    },
    fitMarkMap () {
      this.$nextTick(function () {
        this.markmapObj.fit()
      })
    },
    fullMarkMap () {
      this.fullscreen = !this.fullscreen
      this.fitMarkMap()
    },
    downloadHTML () {
      let data = `<!DOCTYPE html>
                  <html>
                  <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta http-equiv="X-UA-Compatible" content="ie=edge">
                  <title>` + this.title + `</title>`
      data += `<style>
                  * {
                    margin: 0;
                    padding: 0;
                  }
                  #mindmap {
                    display: block;
                    width: 100vw;
                    height: 100vh;
                  }
                  </style>`
      /* eslint-disable no-useless-escape */
      data += `</head><body><svg id="mindmap"></svg><script src="https://cdn.jsdelivr.net/npm/d3@6.3.0"><\/script><script src="https://cdn.jsdelivr.net/npm/markmap-view@0.2.0"><\/script><script>((e,t)=>{const{Markmap:r}=e();window.mm=r.create("svg#mindmap",null,t)})(()=>window.markmap,`
      data += JSON.stringify(this.markdownData)
      data += `)<\/script></body></html>`
      var eleLink = document.createElement('a')
      eleLink.download = this.title + '.html'
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      var blob = new Blob([data])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    },
    downloadSVG () {
      svgCrowbar(this.title)
    }
  },
  watch: {
    code (val) {
      this.markmapObj.setData(this.markdownData)
      this.fitMarkMap()
    }
  }
}

</script>

<style lang='scss' scoped>
.mind-map {
  background-color: white;
  height: inherit;
}
.q-carousel__slide,
.q-carousel .q-carousel--padding {
  padding-bottom: 0;
}
</style>
