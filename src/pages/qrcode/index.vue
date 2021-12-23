<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- header -->
      <tw-header-card :title="$t('qrcode.module')" />
      <q-card-section class="qrcode-container q-px-xxl">
        <!-- 报错信息 -->
        <p>
          <b class="error">{{ error }}</b>
        </p>
        <!-- 摄像头扫描 -->
        <div
          class="q-mb-md"
          v-if="this.$q.platform.is.mobile && error === null"
        >
          <qrcode-stream
            class="qrcode-stream"
            :camera="camera"
            @init="onInit"
            @decode="processResult"
          >
            <div class="line"></div>
            <div class="angle"></div>
          </qrcode-stream>
        </div>
        <!-- 拖拽图片 -->
        <qrcode-drop-zone
          @detect="onInit"
          @dragover="onDragOver"
          @init="logErrors"
        >
          <div
            class="drop-area q-py-xl"
            :class="{ 'dragover': dragover }"
          >
            <span class="q-pt-md">
              {{$t('qrcode.dragOrSelect')}}
            </span>
            <br>
            <span class="q-pt-sm">
              <qrcode-capture @detect="onInit" />
            </span>
          </div>
        </qrcode-drop-zone>
        <!-- 扫描结果 -->
        <p class="decode-result">
          {{$t('qrcode.result')}}
        </p>
        <p v-if="isOutsideUrl">
          <a
            :href="result"
            target="_blank"
            rel="noopener noreferrer"
            style="word-break: break-all;"
          >
            {{result}}
          </a>
        </p>
        <p v-else>
          <b>
            {{ result }}
          </b>
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import { openURL } from 'quasar'
import { mapActions } from 'vuex'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

export default {
  name: 'Qrcode',
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },

  data () {
    return {
      result: '',
      error: null,
      // 摄像头
      camera: 'rear',
      // 拖拽
      dragover: false,
      isOutsideUrl: false,
      inputCode: ''
    }
  },

  methods: {
    ...mapActions('materialCode', ['queryMaterialCode']),
    async onInit (promise) {
      try {
        const { content } = await promise
        if (content === null) {
          this.result = this.$t('qrcode.qrCodeNotDetected')
          return
        }
        this.processResult(content)
        this.error = null
      } catch (error) {
        // 处理 error
        if (this.$q.lang.getLocale().includes('zh')) {
          if (error.name === 'NotAllowedError') {
            this.error = 'ERROR: 未授予相机访问权限，请使用以下解决方案：'
          } else if (error.name === 'NotFoundError') {
            this.error = 'ERROR: 未检测到摄像头，请使用以下解决方案：'
          } else if (error.name === 'NotSupportedError' || error.name === 'InsecureContextError') {
            this.error = 'ERROR: 调用摄像头需要安全的上下文环境(HTTPS，localhost)，请使用以下解决方案：'
          } else if (error.name === 'NotReadableError') {
            this.error = 'ERROR: 相机被占用，请使用以下解决方案：'
          } else if (error.name === 'OverconstrainedError') {
            this.error = 'ERROR: 功能异常，请使用以下解决方案：'
          } else if (error.name === 'StreamApiNotSupportedError') {
            this.error = 'ERROR: 扫一扫功能与当前浏览器不兼容，请使用以下解决方案：'
          } else if (error.name === 'DropImageFetchError') {
            this.error = 'ERROR: 无法解析跨域图片'
          } else if (error.name === 'DropImageDecodeError') {
            this.error = 'ERROR: 仅支持图片格式文件'
          } else {
            this.error = error
          }
        } else {
          this.error = error
        }
      }
    },
    logErrors (promise) {
      promise.catch(console.error)
    },
    onDragOver (isDraggingOver) {
      this.dragover = isDraggingOver
    },
    processResult (result) {
      this.isOutsideUrl = false
      // let urlregex = new RegExp('([hH][tT]{2}[pP]://|[hH][tT]{2}[pP][sS]://|[wW]{3}.|[wW][aA][pP].|[fF][tT][pP].|[fF][iI][lL][eE].)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
      let urlregex = new RegExp('^((http|https):\\/\\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\\.)+([A-Za-z]+)[/\\?\\:]?.*$')
      // 是否为网址
      if (urlregex.test(result)) {
        // 内部网址
        if (_.includes(result, window.location.host)) {
          let path = _.drop(result.split('/'), 3).join('/')
          this.$router.push({
            path: path
          })
        } else {
          this.result = result
          this.isOutsideUrl = true
          // 外部网址
          openURL(result)
        }
      } else {
        if (_.isEmpty(result)) {
          this.result = this.$t('qrcode.cannotFindCode')
        } else {
          this.queryMaterialCode(result)
            .then(res => {
              // 处理查询结果
              if (res) {
                this.$router.push(res.route)
              } else {
                this.result = result
              }
            })
        }
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}

.qrcode-container .qrcode-stream {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
}

.qrcode-container .line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}

@keyframes scanLine {
  from {
    top: 2px;
  }
  to {
    top: 144px;
  }
}

.qrcode-container .qrcode-stream:after,
.qrcode-container .qrcode-stream:before,
.qrcode-container .angle:after,
.qrcode-container .angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 48px;
  height: 48px;

  border: 3px solid transparent;
}

.qrcode-container .qrcode-stream:after,
.qrcode-container .qrcode-stream:before {
  top: 0;
  border-top-color: #00ff33;
}

.qrcode-container .angle:after,
.qrcode-container .angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.qrcode-container .qrcode-stream:before,
.qrcode-container .angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.qrcode-container .qrcode-stream:after,
.qrcode-container .angle:after {
  right: 0;
  border-right-color: #00ff33;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}
/* 拖拽 */
.drop-area {
  color: #fff;
  text-align: center;
  font-weight: bold;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);
}

.dragover {
  background-color: rgba(0, 0, 0, 0.8);
}

.drop-error {
  color: red;
  font-weight: bold;
}
</style>
