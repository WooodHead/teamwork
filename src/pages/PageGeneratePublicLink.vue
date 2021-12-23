<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <q-card
      class="card-grow-in-page"
      :flat="$q.screen.lt.sm"
    >
      <tw-header-card :title="$t('publicLink.publicLink')">
      </tw-header-card>
      <q-card-section class="q-px-xxl">
        <div class="row q-gutter-lg">
          <!-- 左侧卡片显示区域 -->
          <div
            v-if="$q.screen.gt.sm"
            class="col-shrink q-pt-md"
          >
            <!-- 文档卡片 -->
            <div
              class="row justify-center"
              v-if="['notice', 'document'].includes(category)"
            >
              <folder-card
                v-if="file.Classify==='folder'"
                :folder="file"
              />
              <file-card
                v-else
                :file="file"
              />
            </div>
            <!-- 其他类别卡片 -->
            <q-card
              :class="cardStyle+'-card'"
              v-else
            >
              <q-card-section>
                <component
                  :is="`${capitalize(category)}Intro`"
                  :param="paramObj"
                  :id="paramObj.id"
                />
              </q-card-section>
            </q-card>
          </div>
          <!-- 右侧操作区域 -->
          <div
            class="col-grow q-gutter-y-md"
            style="flex-basis:0"
          >
            <!-- 文档已公开 -->
            <div v-if="published">
              <q-input
                class="q-mb-xl"
                rounded
                outlined
                v-model="publicLink"
              >
                <template
                  v-slot:append
                  v-if="publicLink"
                >
                  <div>
                    <q-btn
                      flat
                      rounded
                      icon="app:tw-icon-qr-code"
                      @mouseenter="showQr = true"
                    >
                      <q-popup-proxy v-model="showQr">
                        <!-- 二维码区域 -->
                        <div
                          class="text-center q-pb-md bg-white"
                          :style="`margin:0 auto;width:300px;`"
                          @mouseleave="showQr = false"
                        >
                          <div
                            class="text-center text-h6"
                            :style="`padding:30px 20px;padding-bottom:0;`"
                          >
                            <vue-qr
                              :size="260"
                              qid="qrcode-to-show"
                              :margin="0"
                              :text="publicLink"
                              :logoSrc="logoSrc"
                              :callback="callbackImageUrl"
                            />
                            <div
                              class="q-py-md"
                              style="word-break:break-all;word-wrap:break-word;"
                            >
                              {{publicTitle}}
                            </div>
                          </div>
                          <q-btn
                            rounded
                            icon="download"
                            label="保存二维码"
                            class="bg-positive text-white cursor-pointer"
                            @click="downloadQrImage"
                            v-if="qrImageDataUrl !== null"
                          />
                        </div>
                      </q-popup-proxy>
                    </q-btn>
                    <q-btn
                      @click="copyLinkToClipboard"
                      icon="file_copy"
                      rounded
                      class="bg-positive text-white cursor-pointer"
                      :label="$t('publicLink.copyLinkToClipboard')"
                    />
                  </div>
                </template>
              </q-input>

              <!-- 二维码下载区域（隐藏） -->
              <div
                class="text-center q-pb-md"
                :style="`margin:0 auto;width:${qrImageWidth + 2 * qrImageMargin}px;position:fixed;left:0;bottom:0;opacity:0;`"
              >
                <div
                  id="qrImageDom"
                  class="text-center text-h6"
                  :style="`padding:${qrImageMargin}px;padding-bottom:0;width:${qrImageWidth + 2 * qrImageMargin}px;`"
                >
                  <vue-qr
                    :size="qrImageWidth"
                    qid="qrcode-to-download"
                    :margin="0"
                    :text="publicLink"
                    :logoSrc="logoSrc"
                    :callback="callbackImageUrl"
                  />
                  <div :style="`padding-top:${qrImageMargin * 0.2}px;padding-bottom:${qrImageMargin * 0.4}px;word-break:break-all;word-wrap:break-word;}`">
                    {{publicTitle}}
                  </div>
                </div>
              </div>

              <q-banner class="bg-grey-3">
                <template v-slot:avatar>
                  <q-icon
                    name="warning"
                    color="warning"
                  />
                </template>
                <span
                  v-html="$t('publicLink.publicLinkInfo2',{type:$t(`${category}.title`)})"
                  class="text-body1"
                ></span>
              </q-banner>
              <div class="row justify-center q-mt-xs q-gutter-lg">
                <q-btn
                  outline
                  color="positive"
                  :label="$t('publicLink.previewPublicLink')"
                  @click="onPreviewLink"
                />
                <q-btn
                  @click="onDisablePublicLink"
                  outline
                  color="negative"
                  :label="$t('publicLink.disablePublicLink')"
                />
              </div>
            </div>
            <!-- 文档未公开 -->
            <div v-else>
              <q-banner class="bg-grey-3">
                <template v-slot:avatar>
                  <q-icon
                    name="warning"
                    color="warning"
                  />
                </template>
                <span
                  v-html="$t('publicLink.publicLinkInfo1',{type:$t(`${category}.title`)})"
                  class="text-body1"
                ></span>
              </q-banner>
              <div class="row justify-center q-mt-xl">
                <q-btn
                  @click="onGetPublicLink"
                  flat
                  class="bg-positive text-white"
                  :label="$t('publicLink.loadPublicLink')"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import VueQr from 'vue-qr'
import { uid, format } from 'quasar'
import copyToClipboard from '@/utils/clipboard'
import { mapActions } from 'vuex'
import html2canvas from 'html2canvas'
const { capitalize } = format
export default {
  name: 'PageGeneratePublicLink',
  props: {
    // 分享模块用，如：task、event、question等
    // 区别于其他模块的 category，如：projects等
    category: {
      type: String,
      required: true,
      default: ''
    },
    param: {
      type: [Object, String],
      required: true,
      default: function () {
        return {
          id: 0,
          objectID: 0,
          objectType: ''
        }
      }
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    cardStyle: {
      type: String,
      default: 'whole', // torn whole
      required: false,
      description: '撕边/完整卡片'
    }
  },
  data () {
    return {
      published: false,
      logoSrc: this.$logo['favicon.ico'],
      link: {
        category: this.category,
        param: typeof this.param === 'object' ? this.param : JSON.parse(decodeURIComponent(this.param)),
        code: '',
        isPublic: 0
      },
      file: {},
      showQr: false,
      qrImageDataUrl: null,
      qrImageWidth: 300,
      qrImageMargin: 60
    }
  },
  components: {
    VueQr,
    html2canvas,
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ScheduleIntro: () => import('components/calendar/ScheduleIntro'),
    EventIntro: () => import('components/calendar/EventIntro'),
    TaskIntro: () => import('components/task/TaskIntro'),
    AnswerIntro: () => import('components/checkins/AnswerIntro'),
    QuestionIntro: () => import('components/checkins/QuestionIntro'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    FileCard: () => import('components/document/DocumentCard'),
    ProductIntro: () => import('components/product/ProductIntro')
  },
  computed: {
    publicLink () {
      return `${window.location.protocol}//${window.location.host}/public/${this.link.code}`
    },
    paramObj () {
      return typeof this.param === 'object' ? this.param : JSON.parse(decodeURIComponent(this.param))
    },
    // 资源名称：二维码下载时使用
    publicTitle () {
      return this.title || this.publicLink
    }
  },
  methods: {
    capitalize,
    ...mapActions('publicLink', ['loadPublicLink', 'addOrUpdatePublicLink']),
    // 复制到剪切板
    copyLinkToClipboard () {
      copyToClipboard(this.publicLink)
        .then(() => {
          // 成功!
          this.$q.notify({
            message: '复制成功',
            color: 'accent',
            position: 'center',
            timeout: '500'
          })
        })
        .catch((res) => {
          // 失败
          this.$q.notify({
            message: '您的浏览器不支持此功能，请手动复制！',
            color: 'warning',
            timeout: '500'
          })
        })
    },
    // 生成公开文档链接
    onGetPublicLink () {
      let that = this
      that.link.code = uid()
      that.link.isPublic = 1
      that.addOrUpdatePublicLink(that.link).then((link) => {
        if (link) {
          that.link = link
          that.published = true
        }
      })
    },
    // 禁用公开文档链接
    onDisablePublicLink () {
      let that = this
      that.link.isPublic = 0
      that.addOrUpdatePublicLink(that.link).then((link) => {
        if (link) {
          that.link = link
          that.published = false
        }
      })
    },
    onPreviewLink () {
      // 新建页打开（正式版）
      let { href } = this.$router.resolve({
        name: 'publicLink',
        params: {
          code: this.link.code
        }
      })
      window.open(href, '_blank')
      // 当前页打开（测试版）
      // this.$router.push({
      //   name: 'publicLink',
      //   params: {
      //     code: this.link.code
      //   }
      // })
    },
    // 文本转换为 dataUrl
    callbackImageUrl (dataUrl, id) {
      this.qrImageDataUrl = dataUrl
    },
    // 保存二维码图片
    downloadQrImage () {
      const targetDom = document.getElementById('qrImageDom')
      setTimeout(() => {
        html2canvas(targetDom, {
          width: this.qrImageWidth + 2 * this.qrImageMargin,
          height: targetDom.scrollHeight,
          useCORS: true,
          dpi: window.devicePixelRatio * 3
        }).then((canvas) => {
          var url = canvas.toDataURL('image/jpeg', 1)
          let link = document.createElement('a')
          link.href = url
          link.download = `${this.publicTitle}.jpg`
          link.click()
        })
      }, 200)
    }
  },
  mounted () {
    this.loadPublicLink({
      category: this.category,
      param: this.paramObj
    }).then(link => {
      if (link) {
        this.link = link
        this.published = link.isPublic === 1
      }
    })
    // 获取文档或公告model
    if (['notice', 'document'].includes(this.category)) {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.paramObj.id).then((model) => {
        this.file = model
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
