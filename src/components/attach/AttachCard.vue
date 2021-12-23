<template>
  <div class="text-center">
    <div v-if="simple">
      <attach-item
        :name="attach.title"
        :extension="attach.extension"
        :path="attach.filePath||attach.path"
        :size="Number(attach.size)*1000 | formatSize"
        class="text-left"
      />
    </div>
    <div v-else>
      <slot>
        <attach-icon
          :id="attach.id"
          :path="attach.filePath || attach.path"
          :extension="attach.extension===''?'doc':attach.extension"
          :snapshotPath="attach.snapshotPath"
          @attachIconClick="$emit('attachIconClick')"
          :tooltip="tooltip"
          show3DRotateStatus
          limit3DHeight
          :snapshotOnly="false"
          showSnapshotCut
        />
      </slot>
      <div
        class="text-h5 text-grey-10 text-weight-bold"
        :class="{'q-mt-md':$q.platform.is.desktop}"
      >
        {{ attach.title }}
      </div>
      <div class="text-caption text-grey-9 ">
        <slot name="postedByBefore">
        </slot>
        {{$t("document.modify.postedBy",{modifyBy:attach.createBy})}}
        •
        {{timeAgo({ dateTime :attach.modifyTime})}}
        •
        {{Number(attach.size)*1024 | formatSize}}
      </div>
      <div class="q-mt-md">
        <template v-if="canPreview">
          <a
            href="javascript:void(0);"
            @click="previewFile"
            class="cursor-pointer"
            title="预览文件"
          > 在线预览</a>
          <span v-if="showDownload||showEdit">&nbsp;•&nbsp;</span>
        </template>
        <template v-if="showDownload">
          <a
            href="javascript:void(0);"
            @click="download(attach.filePath||attach.path)"
            class="cursor-pointer"
            title="下载文件时您的ip会被记录，请安全阅读~"
          > 点击下载</a>
          <span v-if="showEdit">&nbsp;•&nbsp;</span>
        </template>
        <template v-if="showEdit">
          <a
            clickable
            href="#"
            @click.prevent="$emit('reupdate')"
            title="如果这个不是您想要的文件，可以重新上传哦~"
          >重新上传</a>
          <span v-if="showVersion">&nbsp;•&nbsp;</span>
        </template>
        <a
          v-if="showVersion"
          clickable
          href="#"
          @click.prevent="$emit('version')"
          :title="$t('document.versionTitle')"
        >{{$t('document.version')}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { download } from '@/boot/file'
import { format } from 'quasar'
const { humanStorageSize } = format
import { mapState } from 'vuex'
import timeAgo from '@/utils/time-ago'
export default {
  name: 'AttachCard',
  data () {
    return {
      edit: false,
      download
    }
  },
  props: {
    attach: {
      type: Object,
      required: false,
      description: '文件对象，包含的属性有：path,modifyTime,modifyBy,title,extension,size'
    },
    simple: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否为简化模式'
    },
    tooltip: {
      type: String,
      required: false,
      default: '',
      description: '如果鼠标放到图像上面展示提示框信息，则此处为提示框信息内容'
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showDownload: {
      type: Boolean,
      default: true
    },
    showVersion: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState('file', ['pdfExts', 'officePreviewExts']),
    canPreview () {
      return this.attach.extension &&
        [...this.pdfExts, ...this.officePreviewExts].includes(this.attach.extension.toLowerCase())
    }
  },
  filters: {
    /**
     * 格式化文件大小
     */
    formatSize (size) {
      return humanStorageSize(size)
    }
  },
  components: {
    'attach-icon': () => import('components/attach/AttachIcon'),
    'attach-item': () => import('components/attach/AttachItem')
  },
  methods: {
    timeAgo,
    previewFile () {
      this.canPreview && previewFile(
        this.attach.filePath,
        this.attach.title,
        this.attach.extension,
        this
      )
    }
  }
}
</script>

<style>
</style>
