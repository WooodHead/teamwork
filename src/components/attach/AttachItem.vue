<template>
  <q-item>

    <!-- 无法直接预览的文件 -->
    <template v-if="!imgExts.includes(extension.toLowerCase())&&!videoExts.includes(extension.toLowerCase())&&!audioExts.includes(extension.toLowerCase())">
      <q-item-section
        top
        avatar
      >
        <q-avatar
          rounded
          size="48px"
        >
          <q-badge
            v-if="img.includes('file.png')"
            class="absolute-center"
            floating
            style="left: 37%;top: 60%;background: none;"
          >{{extension?extension.replaceAll('.','').toUpperCase():'DOC'}} </q-badge>
          <img :src="img" />
        </q-avatar>
        <!-- <attach-default-img
          class="upload-file"
          extension="doc"
        ></attach-default-img> -->
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{name}}{{extension}}
        </q-item-label>
        <q-item-label caption>
          <span class="text-weight-light text-body2">{{size}} • </span>
          <a
            v-if="canPreview"
            :href="`javascript:previewFile('${path}','${name}','${extension}')`"
            class="text-body2"
          >
            点击预览
          </a>
          <span v-if="canPreview"> • </span>
          <a
            :href="`javascript:download('${path}')`"
            class="text-body2"
            title="下载文件时您的ip会被记录，请安全阅读~"
          >点击下载</a>
        </q-item-label>
      </q-item-section>
    </template>

    <template v-else>
      <!-- 图片、音视频文件自带下载功能 -->
      <q-item-section
        v-if="imgExts.includes(extension.toLowerCase())||videoExts.includes(extension.toLowerCase())||audioExts.includes(extension.toLowerCase())"
        class="fit text-center"
      >
        <attach-icon
          :path="path"
          :extension="extension"
          :snapshotOnly="false"
          directShow
        />
        <q-item-label
          class="text-center"
          v-if="!$q.screen.lt.sm"
        >
          <span class="text-weight-light text-body2">{{name}}{{extension}} • {{size}} • </span>
          <a
            :href="`javascript:download('${path}')`"
            class="text-body2"
          >点击下载</a>
        </q-item-label>
      </q-item-section>
      <!-- 3D文件直接预览，未自带下载功能 -->
      <q-item-section
        v-if="threeDExts.includes(extension.toLowerCase())"
        class="fit text-center"
      >
        <attach-icon
          :path="path"
          :extension="extension"
          show3DControls
          show3DRotateStatus
        />
        <q-item-label>
          {{name}}{{extension}}
        </q-item-label>
        <q-item-label caption>
          <span class="text-weight-light text-body2">{{size}} • </span>
          <a
            :href="`javascript:download('${path}')`"
            class="text-body2"
            title="下载文件时您的ip会被记录，请安全阅读~"
          >点击下载</a>
        </q-item-label>
      </q-item-section>
    </template>
  </q-item>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    name: {
      type: String,
      required: false,
      default: '',
      description: 'Use "searchField" design for the search field'
    },
    path: {
      type: String,
      required: false,
      default: '',
      description: 'Use "searchField" design for the search field'
    },
    size: {
      type: String,
      required: false,
      default: '',
      description: 'Use "searchField" design for the search field'
    },
    extension: {
      type: String,
      required: false,
      default: '',
      description: 'Use "searchField" design for the search field'
    }
  },
  computed: {
    ...mapState('file', ['imgExts', 'pdfExts', 'threeDExts', 'videoExts', 'audioExts', 'officePreviewExts']),
    ...mapGetters('file', ['canPreviewExts']),
    canPreview () {
      return this.extension &&
        this.canPreviewExts.includes(this.extension.toLowerCase())
    },
    img () {
      let URL = '/icons/file/file.png'
      if (this.pdfExts.includes(this.extension.toLowerCase())) {
        URL = '/icons/file/icon-pdf.png'
      } else if (['.doc', '.docx', '.wps'].includes(this.extension.toLowerCase())) {
        URL = '/icons/file/icon-word.png'
      } else if (this.extension.toLowerCase() === '.txt') {
        URL = '/icons/file/icon-txt.png'
      } else if (['.xls', '.xlt', '.xlsx', '.xltx', '.csv'].includes(this.extension.toLowerCase())) {
        URL = '/icons/file/icon-excel.png'
      } else if (['.pptx', '.ppt'].includes(this.extension.toLowerCase())) {
        URL = '/icons/file/icon-ppt.png'
      }
      return URL
    }
  },
  methods: {
    JSONStringify () {
      return JSON.stringify(this.$store.state.file)
    }
  },
  components: {
    AttachIcon: () => import('components/attach/AttachIcon')
    // AttachDefaultImg: () => import('components/attach/AttachDefaultImg')
  }
}
</script>

<style>
</style>
