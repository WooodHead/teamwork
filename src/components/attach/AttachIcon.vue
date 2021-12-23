<template>
  <!-- 图片展示 -->
  <viewer
    v-if="isimgExts()"
    class="viewer"
    style="display: contents;"
  >
    <template>
      <img
        style="width:100%;"
        title="点击可预览图片"
        :src="url"
      />
    </template>
  </viewer>
  <!-- pdf文件预览-->
  <q-pdfviewer
    v-else-if="directShow&&isPdfExts()"
    value
    type="pdfjs"
    :src="url"
    content-class="absolute"
    inner-content-class="fit"
  />
  <div
    id="container"
    class="fit"
    v-else-if="config.extranet&&directShow&&isOfficePreviewExts()"
  ></div>
  <!-- 视频格式文件 -->
  <div
    v-else-if="isVideoExts()"
    class="fit"
  >
    <attach-video
      :id="id"
      :path="path"
      :snapshotPath="snapshotPath"
      :snapshotOnly="snapshotOnly"
      :showSnapshotCut="showSnapshotCut"
      :directShow="directShow"
    />
  </div>

  <!-- 音频格式文件 -->
  <audio
    v-else-if="isAudioExts()"
    style="max-width: 220px;align-self: center;"
    controls
    :src="url"
    class="full-width"
  >{{$t('file.yourbrowserdoesnotsupporttheaudiotag')}}
  </audio>

  <!-- 3d文件展示 -->
  <div
    v-else-if="directShow&&isThreeDExts()"
    class="fit"
  >
    <attach-three-d
      :id="id"
      :path="path"
      :snapshotPath="snapshotPath"
      :extension="extension"
      :directShow="directShow"
      :show3DControls="show3DControls"
      :show3DRotateStatus="show3DRotateStatus"
      :limit3DHeight="limit3DHeight"
    />
  </div>

  <!-- 除了上述文件格式，其余文件格式的默认展示方式 -->
  <q-img
    v-else
    :src="defaultImg(extension)"
    @click="$emit('attachIconClick')"
    :class="['rounded-borders fit',{'cursor-pointer':tooltip}]"
    style="max-width: 5.7rem;max-height: 7rem;"
    :style="$q.platform.is.mobile?'font-size: 14px;transform: scale(0.6);margin-top:-20px':''"
  >
    <div
      class="text-white text-center text-h6 absolute-center"
      style="background:none !important;top: 63%;"
    >
      {{extension?extension.replaceAll('.','').toUpperCase():'DOC'}}
    </div>
    <q-tooltip v-if="tooltip.length>0">
      {{tooltip}}
    </q-tooltip>
  </q-img>
</template>

<script>
import { Platform } from 'quasar'
import { getUrl } from '@/boot/file'
import imm from '@/boot/imm'
import 'viewerjs/dist/viewer.css'
const config = require('app/app.config.js')
import fileState from '@/store/file/state.js'
import { defaultImg } from '@/components/attach/public-default-card-showImg.js'
export default {
  name: 'AttachIcon',
  components: {
    AttachThreeD: () => import('components/attach/AttachThreeD'),
    AttachVideo: () => import('components/attach/AttachVideo'),
    Viewer: () => import('v-viewer/src/component.vue')
  },
  props: {
    id: {
      type: Number,
      description: '文件id'
    },
    path: {
      type: String,
      required: false,
      default: '',
      description: '文件路径'
    },
    snapshotPath: {
      type: String,
      default: '',
      description: '快照路径'
    },
    snapshotOnly: {
      type: Boolean,
      default: true,
      description: '仅展示快照'
    },
    showSnapshotCut: {
      type: Boolean,
      default: false,
      description: '是否展示截图设置封面按钮'
    },
    extension: {
      type: String,
      description: 'Use "searchField" design for the search field'
    },
    tooltip: {
      type: String,
      required: false,
      default: '',
      description: '提示框信息'
    },
    directShow: {
      type: Boolean,
      default: false,
      description: '是否直接展示'
    },
    show3DControls: {
      type: Boolean,
      default: true,
      description: '是否直接展示3d文件控制按钮'
    },
    show3DRotateStatus: {
      type: Boolean,
      default: false,
      description: '是否直接展示3d文件并且旋转'
    },
    limit3DHeight: {
      type: Boolean,
      default: false,
      description: '限制3d文件高度'
    }
  },
  data () {
    return {
      config,
      url: '',
      platform: Platform
    }
  },
  created () {
    this.init()
  },
  watch: {
    path () {
      this.init()
    }
  },
  computed: {
  },
  methods: {
    defaultImg,
    getUrl,
    async previewOffice () {
      var previewInfo = await imm.getOfficePrviewURL(this.path)
      if (previewInfo && aliyun) {
        let object = aliyun.config({
          mount: document.querySelector('#container'),
          url: previewInfo.PreviewURL
        })
        object.setToken({ token: previewInfo.AccessToken })
      }
    },
    init () {
      if (this.directShow && config.extranet && config.oss && config.oss.enable && this.isOfficePreviewExts()) {
        this.previewOffice()
      } else {
        this.url = getUrl(this.path)
      }
    },
    isimgExts () {
      return this.extension && fileState.imgExts.includes(this.extension.toLowerCase())
    },
    isPdfExts () {
      let isPdf = this.extension && fileState.pdfExts.includes(this.extension.toLowerCase())
      return isPdf
    },
    isOfficePreviewExts () {
      let isOffice = this.extension && fileState.officePreviewExts.includes(this.extension.toLowerCase())
      return isOffice
    },
    isThreeDExts () {
      let isThreeD = this.extension && fileState.threeDExts.includes(this.extension.toLowerCase())
      return isThreeD
    },
    isVideoExts () {
      let isVideo = this.extension && fileState.videoExts.includes(this.extension.toLowerCase())
      return isVideo
    },
    isAudioExts () {
      let isAudio = this.extension && fileState.audioExts.includes(this.extension.toLowerCase())
      return isAudio
    }
  }
}
</script>

<style lang="scss" scoped>
  .document-fileCard .video {
    max-height: 12vh !important;
  }
  /deep/.q-zoom__content {
    display: flex;
  }
</style>
