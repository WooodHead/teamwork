<template>
  <div>
    <q-carousel
      v-model="slide"
      swipeable
      animated
      infinite
      control-color="primary"
      transition-next="slide-left"
      :autoplay="autoplay"
      :fullscreen.sync="fullscreen"
      :arrows="!$q.platform.is.mobile"
      :class="{'my-carousel':$q.screen.lt.sm}"
    >
      <template v-if="lstFile.length>0">
        <q-carousel-slide
          v-for="file in lstFile"
          :key="file.id"
          :name="file.id"
          class="cursor-pointer"
        >
          <!-- 图片展示 -->
          <q-img
            v-if="isImg(file.ext)"
            :src="getUrl(file.url)"
            @click="slideClick"
          />

          <!-- 视频展示 -->
          <div
            v-else
            @click="onVideoClick"
          >
            <attach-video
              :path="file.url"
              directShow
            />
          </div>

        </q-carousel-slide>
      </template>

      <template v-else>
        <q-carousel-slide name="default">
          <!-- 图片展示 -->
          <q-img
            basic
            src="/icons/default-image.webp"
          />
        </q-carousel-slide>
      </template>

      <template v-slot:control>
        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
        >
          <div class="q-gutter-sm">
            <q-btn
              v-if="fullscreen"
              round
              dense
              unelevated
              color="white"
              text-color="positive"
              icon="cloud_download"
              @click="download(findFileBySlide(slide).url)"
            />
            <q-btn
              v-if="fullscreen"
              round
              dense
              unelevated
              color="white"
              text-color="primary"
              icon="fullscreen_exit"
              @click="fullscreen = !fullscreen"
            />
            <q-btn
              v-if="showConfig"
              round
              dense
              unelevated
              color="white"
              text-color="primary"
              icon="settings"
              @click="carouselConfig"
            />
          </div>

        </q-carousel-control>
        <q-carousel-control
          position="bottom-left"
          :offset="[16, 16]"
        >
          <q-chip
            dense
            color="grey-5"
            text-color="white"
          >
            {{lstFile.map(i => i.id).indexOf(slide) + 1}}/{{lstFile.length}}
          </q-chip>
        </q-carousel-control>
      </template>
    </q-carousel>

    <!-- 轮播图片展示窗口 -->
    <viewer
      v-show="false"
      :images="lstImageSrcs"
      ref="viewer"
    >
      <img
        v-for="src in lstImageSrcs"
        :src="src"
        :key="src"
      >
    </viewer>

    <!-- 轮播配置窗口 -->
    <q-dialog
      v-model="showSetting"
      persistent
      :maximized="$q.platform.is.mobile"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card :class="{'dialog-width':!$q.platform.is.mobile}">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{$t('file.courselConfig')}}</div>
          <div class="q-px-sm text-caption text-grey-5">{{$t('file.draggableNotes')}}</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <q-uploader
            flat
            color="white"
            multiple
            accept="image/*,video/*"
            :factory="_factory"
            @added="_added"
            @uploaded="_uploaded"
            @factory-failed="_factoryFailed"
            @failed="_failed"
            ref="qUploader"
          >
            <template v-slot:list>
              <draggable
                v-model="lstFile"
                @start="onDragStart"
                :class="`row ${$q.screen.gt.xs?'q-col-gutter-md':'q-col-gutter-sm'}`"
              >
                <div
                  v-for="file in lstFile"
                  :key="file.id"
                  :class="`relative-position ${$q.screen.gt.xs?'col-4':'col-6'}`"
                >
                  <q-img
                    v-if="isImg(file.ext)"
                    :src="getUrl(file.url)"
                    spinner-color="white"
                    class="setting-card-border"
                  >
                    <q-btn
                      dense
                      size="sm"
                      :color="isCover(file)?'red':'secondary'"
                      :label="isCover(file)?$t('product.cancelCover'):$t('product.setCover')"
                      @click="setCover(file)"
                    />
                  </q-img>

                  <attach-video
                    v-else
                    :path="file.url"
                    directShow
                  />

                  <q-btn
                    flat
                    dense
                    text-color="grey-5"
                    icon="close"
                    class="absolute-top-right q-mt-md"
                    @click="removeImg(file)"
                  />
                </div>

                <div
                  slot="footer"
                  :class="`${$q.screen.gt.xs?'col-4':'col-6'}`"
                >
                  <q-btn
                    type="a"
                    color="grey-5"
                    icon="add"
                    size="xl"
                    flat
                    class="setting-card-border my-add"
                  >
                    <q-uploader-add-trigger />
                  </q-btn>
                </div>
              </draggable>
            </template>
          </q-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import { computedOrder } from '@/utils/computed-order'
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { download, getUrl } from '@/boot/file'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'ProductCarousel',
  components: {
    draggable,
    AttachVideo: () => import('components/attach/AttachVideo'),
    Viewer: () => import('v-viewer/src/component.vue')
  },
  mixins: [mixinxquasarupload],
  props: {
    objectType: { type: String, required: true },
    objectId: { type: Number, default: 0 },
    showConfig: { type: Boolean, default: false },
    coverUrl: { type: String, default: '' }
  },
  data () {
    return {
      slide: 'default',
      autoplay: true,
      fullscreen: false,
      showSetting: false,
      folder: this.objectType,
      dragFile: {}
    }
  },
  watch: {
    lstFile (newVal, oldVal) {
      if ((this.slide === 'default' || !_.some(newVal, { id: this.slide })) && newVal.length > 0) {
        this.slide = this.lstFile[0].id
      } else if (this.lstFile.length === 0) {
        this.slide = 'default'
      }
    },
    '$route.path' (newVal, oldVal) {
      this.init()
    }
  },
  computed: {
    ...mapState('file', ['imgExts', 'videoExts']),
    ...mapGetters('file', ['files']),
    lstFile: {
      get () {
        return _.filter(this.files, f =>
          f.objectType === this.objectType &&
          f.objectId === this.objectId &&
          f.usedBy === 'carousel')
      },
      set (newValue) {
        let index = _.findIndex(newValue, value => value.id === this.dragFile.id)
        let prev = newValue[index - 1]
        let next = newValue[index + 1]
        let order1 = prev ? prev.orderNumber : 0
        let order2 = next ? next.orderNumber : 0
        let orderNumber = computedOrder(order1, order2)
        this.dragFile.orderNumber = orderNumber
        this.updateFile(this.dragFile)
      }
    },
    lstImageSrcs () {
      let that = this
      return _.map(
        _.filter(that.lstFile, f => that.imgExts.includes(f.ext)),
        ff => getUrl(ff.url))
    }
  },
  methods: {
    ...mapActions('file', ['loadFiles', 'deleteFile', 'updateFile']),
    ...mapActions('product', ['updateProductField']),
    download,
    getUrl,
    isImg (ext) {
      return this.imgExts.includes(ext.toLowerCase())
    },
    // isVideo (ext) {
    //   return this.videoExts.includes(ext.toLowerCase())
    // },
    isCover (file) {
      return file.url === this.coverUrl
    },
    carouselConfig () {
      this.showSetting = true
    },
    removeImg (file) {
      this.deleteFile(file.id)
      // 如果删除的是封面图，更新产品封面
      file.url === this.coverUrl &&
        this.objectType === 'product' &&
        this.updateProductField({
          Id: this.objectId,
          ImgUrl: ''
        })
    },
    findFileBySlide (curSlide) {
      return _.find(this.lstFile, { id: curSlide })
    },
    setCover (file) {
      // 更新imgUrl
      this.objectType === 'product' &&
        this.updateProductField({
          Id: this.objectId,
          ImgUrl: this.isCover(file) ? '' : file.url
        })
    },
    init () {
      // 初始化slide
      this.slide = 'default'
      let query = [
        { Key: 'ObjectType', Value: this.objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectId, Oper: 'eq' },
        'and',
        { Key: 'UsedBy', Value: 'carousel', Oper: 'eq' }
      ]
      this.loadFiles({ query })
    },
    onDragStart (event) {
      this.dragFile = event.from.__vue__.context.element
    },
    uploaded (files) {
      this.$emit('uploaded', files)
    },
    // 添加文件后进度条的加载
    addedCallback (files) {
      const dialog = this.$q.dialog({
        message: '加载0%',
        progress: true, // we enable default settings
        persistent: false, // we want the user to not be able to close it
        ok: true // we want the user to not be able to close it
      })
      const interval = setInterval(() => {
        dialog.update({
          message: `加载${files[0].__progressLabel}`
        })
        if (files[0].__progress === 1) {
          clearInterval(interval)
          setTimeout(() => {
            dialog.hide()
          }, 350)
        }
      }, 500)
    },
    slideClick () {
      this.$refs.viewer.$viewer.show()
    },
    onVideoClick () {
      this.autoplay = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
/deep/.my-carousel.q-carousel {
  height: 300px;
}

.dialog-width {
  width: 700px;
  min-height: 500px;
  max-width: 80vw;
}

.setting-card-border {
  border-radius: 0.3rem;
  border: 1px solid $grey-4;
}

.my-add {
  width: 100%;
  width: -webkit-fill-available;
  height: 100%;
}

/deep/.q-uploader {
  width: unset;
  max-height: 500px;
}

/deep/.q-uploader__header {
  display: none;
}

/deep/.q-uploader__list {
  padding: 0;
}

/deep/.q-img__image {
  background-size: contain !important;
}
/deep/.q-img {
  height: 100%;
}

// 解决拖动排序时出现虚线框的问题
/deep/.q-uploader__dnd {
  display: none;
}
</style>
