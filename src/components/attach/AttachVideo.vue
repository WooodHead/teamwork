<template>
  <div
    v-if="!snapshotOnly||showVideo||directShow"
    :class="['relative-position','full-height',{'mobile-class':$q.platform.is.mobile}]"
    ref="videoDiv"
  >
    <div
      class="absolute q-pa-sm"
      style="z-index:100;right:0;"
    >
      <q-btn
        v-show="showSnapshotCut"
        round
        icon="crop"
        color="grey"
        size="sm"
        @click="onSnapshot"
      >
        <q-tooltip>{{$t('file.screenshot')}}</q-tooltip>
      </q-btn>
      <q-dialog v-model="showFacePicDialog">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">{{$t('file.screenshot')}}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-img :src="snapshotBase64" />
          </q-card-section>

          <q-card-actions
            align="right"
            class="bg-white text-teal"
          >
            <q-btn
              flat
              v-close-popup
              :label="$t('file.setFacePic')"
              @click="setFacePic"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <video
      controls
      controlsList="nodownload"
      crossorigin="Anonymous"
      :poster="snapshotUrl"
      webkit-playsinline="true"
      x5-playsinline=""
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      playsinline="true"
      :preload="preload"
      x-webkit-airplay="allow"
      x5-video-orientation="portrait"
      style="width:100%;max-height:100%;"
      ref="video"
    >
      <source
        :src="url"
        type="video/mp4"
      >
      {{$t('file.yourbrowserdoesnotsupportthevideotag')}}
    </video>
  </div>

  <div v-else>
    <q-img
      contain
      :src="snapshotUrl"
      @click="showVideo=true"
      class="cursor-pointer"
      style="max-height:60vh;"
    >
      <div class="full-width full-height row items-center justify-center transparent">
        <q-icon
          name="play_circle_outline"
          size="xl"
          color="white"
        />
      </div>
    </q-img>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getUrl, upload } from '@/boot/file'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
export default {
  name: 'AttachVideo',
  components: {},
  props: {
    id: { type: Number, desc: '视频id' },
    path: { type: String, default: '', desc: '视频地址' },
    snapshotPath: { type: String, default: '', desc: '视频封面地址' },
    snapshotOnly: { type: Boolean, default: true, desc: '仅展示快照' },
    showSnapshotCut: { type: Boolean, default: false, desc: '是否展示截图设置封面按钮' },
    directShow: { type: Boolean, default: false, desc: '是否直接播放视频' }
  },
  data () {
    return {
      url: '',
      snapshotUrl: '',
      showVideo: false,
      showFacePicDialog: false,
      snapshotBase64: '',
      preload: false,
      config: require('app/app.config.js')
    }
  },
  methods: {
    ...mapActions('document', ['updateDocumentField']),
    onSnapshot () {
      // 显示截图窗口
      this.showFacePicDialog = true
      const video = this.$refs.video
      // canvas绘图
      let canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      // 生成base64图
      this.snapshotBase64 = canvas.toDataURL('image/png')
    },
    setFacePic () {
      this.showFacePicDialog = false
      // base64转file
      let arr = this.snapshotBase64.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let picFile = new File([u8arr], `facepic_${new Date().getTime()}.png`, { type: mime })
      // file写入后台
      let docId = this.id || this.$route.params.id
      if (docId && +docId > 0) {
        let that = this
        upload('document', [picFile], () => { },
          res => {
            let fields = {
              DocID: +docId,
              SnapshotPath: res[0].PathName
            }
            // 更新视频封面
            that.updateDocumentField(fields)
              .then(() => {
                showSuccessMessage(that.$t('file.successSetFacePic'))
              })
          })
      } else {
        showWarningMessage(this.$t('file.failSetFacePic'))
      }
    }
  },
  created () {
    if (this.config.extranet && this.config.oss && this.config.oss.enable) {
      this.preload = 'none'
      this.url = getUrl(this.path)
      // 重新加载视频，解决外网不请求视频源的问题
      this.$refs.video && this.$refs.video.load()
      // 未设置封面使用oss提供的视频截帧，否则使用设置的图片
      if (!this.snapshotPath) {
        this.snapshotUrl = getUrl(this.path, 'video/snapshot,t_0,f_jpg,w_0,h_0,m_fast,ar_auto')
      } else {
        this.snapshotUrl = getUrl(this.snapshotPath)
      }
    } else {
      this.preload = 'auto'
      this.url = getUrl(this.path)
      // 上传视频时的后台截图，历史视频可能没有，2021/2/3之后的都有截图
      let snapshotCalc = this.path.slice(0, this.path.lastIndexOf('.')) + '.jpg'
      this.snapshotUrl = this.snapshotPath
        ? getUrl(this.snapshotPath)
        : (new Date() > new Date('2021/2/3'))
          ? getUrl(snapshotCalc)
          : this.$logo['favicon-32x32.png']
    }
  }
}
</script>

<style lang='scss' scoped>
.mobile-class {
  display: flex;
  justify-content: center;
  background-color: black;
}
</style>
